package com.ticketing.eventservice.controller;

import com.ticketing.eventservice.dto.EventRequest;
import com.ticketing.eventservice.dto.EventResponse;
import com.ticketing.eventservice.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @PostMapping
    public ResponseEntity<EventResponse> createEvent(
            @Valid @RequestBody EventRequest request,
            Authentication authentication) {
        // Get the email of the logged-in organizer from the JWT
        String organizerEmail = authentication.getName();
        return ResponseEntity.ok(eventService.createEvent(request, organizerEmail));
    }

    @GetMapping
    public ResponseEntity<List<EventResponse>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllActiveEvents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventResponse> getEvent(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }

    @GetMapping("/my-events")
    public ResponseEntity<List<EventResponse>> getMyEvents(Authentication authentication) {
        String organizerEmail = authentication.getName();
        return ResponseEntity.ok(eventService.getMyEvents(organizerEmail));
    }

    @PostMapping("/{id}/reserve")
    public ResponseEntity<Boolean> reserveTickets(
            @PathVariable Long id,
            @RequestParam int quantity) {
        return ResponseEntity.ok(eventService.reserveTickets(id, quantity));
    }
}
