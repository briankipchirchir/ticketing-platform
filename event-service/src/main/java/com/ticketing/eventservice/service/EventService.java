package com.ticketing.eventservice.service;

import com.ticketing.eventservice.dto.EventRequest;
import com.ticketing.eventservice.dto.EventResponse;
import com.ticketing.eventservice.model.Event;
import com.ticketing.eventservice.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;

    public EventResponse createEvent(EventRequest request, String organizerEmail) {
        Event event = Event.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .venue(request.getVenue())
                .eventDate(request.getEventDate())
                .totalTickets(request.getTotalTickets())
                .availableTickets(request.getTotalTickets())
                .ticketPrice(request.getTicketPrice())
                .organizerEmail(organizerEmail)
                .build();

        Event saved = eventRepository.save(event);
        log.info("Event created: {} by {}", saved.getTitle(), organizerEmail);
        return EventResponse.from(saved);
    }

    public List<EventResponse> getAllActiveEvents() {
        return eventRepository.findByStatus(Event.EventStatus.ACTIVE)
                .stream()
                .map(EventResponse::from)
                .collect(Collectors.toList());
    }

    public EventResponse getEventById(Long id) {
        return eventRepository.findById(id)
                .map(EventResponse::from)
                .orElseThrow(() -> new RuntimeException("Event not found: " + id));
    }

    public List<EventResponse> getMyEvents(String organizerEmail) {
        return eventRepository.findByOrganizerEmail(organizerEmail)
                .stream()
                .map(EventResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public boolean reserveTickets(Long eventId, int quantity) {
        int updated = eventRepository.decrementAvailableTickets(eventId, quantity);
        if (updated == 0) {
            log.warn("Failed to reserve {} tickets for event {}", quantity, eventId);
            return false;
        }
        log.info("Reserved {} tickets for event {}", quantity, eventId);
        return true;
    }
}
