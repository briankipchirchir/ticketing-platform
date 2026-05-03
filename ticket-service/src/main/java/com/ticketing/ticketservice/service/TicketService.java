package com.ticketing.ticketservice.service;

import com.ticketing.ticketservice.dto.BookingRequest;
import com.ticketing.ticketservice.dto.EventResponse;
import com.ticketing.ticketservice.dto.TicketResponse;
import com.ticketing.ticketservice.event.TicketBookedEvent;
import com.ticketing.ticketservice.model.Ticket;
import com.ticketing.ticketservice.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final RestTemplate restTemplate;

    private static final String EVENT_SERVICE_URL = "http://localhost:8082/api/events";

    @Transactional
    public List<TicketResponse> bookTickets(BookingRequest request, String userEmail) {

        // Step 1 — Fetch event details from event-service
        EventResponse event = restTemplate.getForObject(
                EVENT_SERVICE_URL + "/" + request.getEventId(),
                EventResponse.class
        );

        if (event == null) {
            throw new RuntimeException("Event not found: " + request.getEventId());
        }

        // Step 2 — Check event is still active
        if (!"ACTIVE".equals(event.getStatus())) {
            throw new RuntimeException("Event is not available for booking");
        }

        // Step 3 — Check enough tickets are available
        if (event.getAvailableTickets() < request.getQuantity()) {
            throw new RuntimeException("Not enough tickets available. Remaining: " + event.getAvailableTickets());
        }

        // Step 4 — Reserve tickets in event-service
        Boolean reserved = restTemplate.postForObject(
                EVENT_SERVICE_URL + "/" + request.getEventId() + "/reserve?quantity=" + request.getQuantity(),
                null,
                Boolean.class
        );

        if (Boolean.FALSE.equals(reserved)) {
            throw new RuntimeException("Failed to reserve tickets — they may have just sold out");
        }

        // Step 5 — Create ticket records
        List<Ticket> tickets = new ArrayList<>();
        for (int i = 0; i < request.getQuantity(); i++) {
            tickets.add(Ticket.builder()
                    .eventId(request.getEventId())
                    .userEmail(userEmail)
                    .pricePaid(event.getTicketPrice())
                    .build());
        }
        List<Ticket> saved = ticketRepository.saveAll(tickets);

        // Step 6 — Publish Kafka event for notification-service
        BigDecimal totalAmount = event.getTicketPrice()
                .multiply(BigDecimal.valueOf(request.getQuantity()));

        TicketBookedEvent kafkaEvent = TicketBookedEvent.builder()
                .eventId(request.getEventId())
                .userEmail(userEmail)
                .ticketCodes(saved.stream().map(Ticket::getTicketCode).collect(Collectors.toList()))
                .totalAmount(totalAmount)
                .quantity(request.getQuantity())
                .build();

        kafkaTemplate.send("ticket.booked", kafkaEvent);
        log.info("Tickets booked for {} — event {}", userEmail, request.getEventId());

        return saved.stream().map(TicketResponse::from).collect(Collectors.toList());
    }

    public List<TicketResponse> getMyTickets(String userEmail) {
        return ticketRepository.findByUserEmail(userEmail)
                .stream()
                .map(TicketResponse::from)
                .collect(Collectors.toList());
    }

    public TicketResponse validateTicket(String ticketCode) {
        Ticket ticket = ticketRepository.findByTicketCode(ticketCode)
                .orElseThrow(() -> new RuntimeException("Invalid ticket code: " + ticketCode));

        if (ticket.getStatus() == Ticket.TicketStatus.USED) {
            throw new RuntimeException("Ticket already used");
        }

        if (ticket.getStatus() == Ticket.TicketStatus.CANCELLED) {
            throw new RuntimeException("Ticket has been cancelled");
        }

        // Mark ticket as used
        ticket.setStatus(Ticket.TicketStatus.USED);
        ticketRepository.save(ticket);
        log.info("Ticket {} validated and marked as USED", ticketCode);

        return TicketResponse.from(ticket);
    }
}
