package com.ticketing.eventservice.dto;

import com.ticketing.eventservice.model.Event;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class EventResponse {
    private Long id;
    private String title;
    private String description;
    private String venue;
    private LocalDateTime eventDate;
    private Integer totalTickets;
    private Integer availableTickets;
    private BigDecimal ticketPrice;
    private String organizerEmail;
    private String status;
    private LocalDateTime createdAt;

    public static EventResponse from(Event event) {
        return EventResponse.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .venue(event.getVenue())
                .eventDate(event.getEventDate())
                .totalTickets(event.getTotalTickets())
                .availableTickets(event.getAvailableTickets())
                .ticketPrice(event.getTicketPrice())
                .organizerEmail(event.getOrganizerEmail())
                .status(event.getStatus().name())
                .createdAt(event.getCreatedAt())
                .build();
    }
}
