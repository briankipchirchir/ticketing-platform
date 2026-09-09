package com.ticketing.ticketservice.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TicketBookedEvent {
    private Long eventId;
    private String userEmail;
    private List<String> ticketCodes;
    private BigDecimal totalAmount;
    private int quantity;
}
