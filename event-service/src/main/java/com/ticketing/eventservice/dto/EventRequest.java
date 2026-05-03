package com.ticketing.eventservice.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class EventRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotBlank(message = "Venue is required")
    private String venue;

    @NotNull(message = "Event date is required")
    @Future(message = "Event date must be in the future")
    private LocalDateTime eventDate;

    @NotNull(message = "Total tickets is required")
    @Min(value = 1, message = "Must have at least 1 ticket")
    private Integer totalTickets;

    @NotNull(message = "Ticket price is required")
    @DecimalMin(value = "0.0", message = "Price cannot be negative")
    private BigDecimal ticketPrice;
}
