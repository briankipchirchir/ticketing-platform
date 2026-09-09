package com.ticketing.ticketservice.service;

import com.ticketing.ticketservice.dto.BookingRequest;
import com.ticketing.ticketservice.dto.EventResponse;
import com.ticketing.ticketservice.dto.TicketResponse;
import com.ticketing.ticketservice.event.TicketBookedEvent;
import com.ticketing.ticketservice.model.Ticket;
import com.ticketing.ticketservice.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

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
    private final WebClient.Builder webClientBuilder;

    private static final String EVENT_SERVICE_URL = "http://event-service/api/events";

    @Transactional
    public List<TicketResponse> bookTickets(BookingRequest request, String userEmail, String authHeader) {

        //event service
        WebClient webClient = webClientBuilder.baseUrl(EVENT_SERVICE_URL).build();

        // Step 1 — Fetch event details from event-service (resolved via Eureka)
        // retrieve() throws WebClientResponseException by default on 4xx/5xx,
        // so a 404 from event-service surfaces here rather than as a null body.
        EventResponse event;
        try {
            event = webClient.get()
                    .uri("/{id}", request.getEventId())
                    .header(HttpHeaders.AUTHORIZATION, authHeader)
                    .retrieve()
                    .bodyToMono(EventResponse.class)
                    .block();
        } catch (WebClientResponseException.NotFound ex) {
            throw new RuntimeException("Event not found: " + request.getEventId());
        }

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
        // event-service now throws (409/404) on failure instead of returning false,
        // so we catch that here and translate it into our own clean error rather than
        // relying on a Boolean that will always be true when this call succeeds at all.
        try {
            webClient.post()
                    .uri("/{id}/reserve?quantity={quantity}", request.getEventId(), request.getQuantity())
                    .header(HttpHeaders.AUTHORIZATION, authHeader)
                    .retrieve()
                    .bodyToMono(Boolean.class)
                    .block();
        } catch (WebClientResponseException.Conflict ex) {
            throw new RuntimeException("Failed to reserve tickets — they may have just sold out");
        } catch (WebClientResponseException.NotFound ex) {
            throw new RuntimeException("Event not found: " + request.getEventId());
        } catch (WebClientResponseException.Unauthorized | WebClientResponseException.Forbidden ex) {
            throw new RuntimeException("Not authorized to reserve tickets for this event");
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