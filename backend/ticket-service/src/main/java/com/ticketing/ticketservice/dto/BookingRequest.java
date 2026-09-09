package com.ticketing.ticketservice.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BookingRequest {

    @NotNull(message = "Event ID is required")
    private Long eventId;

    @Min(value = 1, message = "Must book at least 1 ticket")
    private int quantity;
}
