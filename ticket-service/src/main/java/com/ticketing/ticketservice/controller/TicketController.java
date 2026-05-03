package com.ticketing.ticketservice.controller;

import com.ticketing.ticketservice.dto.BookingRequest;
import com.ticketing.ticketservice.dto.TicketResponse;
import com.ticketing.ticketservice.service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    // Book tickets for an event
    @PostMapping("/book")
    public ResponseEntity<List<TicketResponse>> bookTickets(
            @Valid @RequestBody BookingRequest request,
            Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(ticketService.bookTickets(request, userEmail));
    }

    // Get all tickets for the logged-in user
    @GetMapping("/my-tickets")
    public ResponseEntity<List<TicketResponse>> getMyTickets(Authentication authentication) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(ticketService.getMyTickets(userEmail));
    }

    // Validate a ticket at the gate
    @PostMapping("/validate/{ticketCode}")
    public ResponseEntity<TicketResponse> validateTicket(@PathVariable String ticketCode) {
        return ResponseEntity.ok(ticketService.validateTicket(ticketCode));
    }
}
