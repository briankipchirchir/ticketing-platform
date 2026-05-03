package com.ticketing.ticketservice.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class EventResponse {
    private Long id;
    private String title;
    private String venue;
    private LocalDateTime eventDate;
    private Integer totalTickets;
    private Integer availableTickets;
    private BigDecimal ticketPrice;
    private String status;
}
