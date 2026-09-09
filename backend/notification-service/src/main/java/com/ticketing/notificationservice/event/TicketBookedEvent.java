package com.ticketing.notificationservice.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TicketBookedEvent {
    private Long eventId;
    private String userEmail;
    private List<String> ticketCodes;
    private BigDecimal totalAmount;
    private int quantity;
}
