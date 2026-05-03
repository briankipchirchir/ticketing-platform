package com.ticketing.ticketservice.dto;

import com.ticketing.ticketservice.model.Ticket;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class TicketResponse {
    private Long id;
    private String ticketCode;
    private Long eventId;
    private String userEmail;
    private BigDecimal pricePaid;
    private String status;
    private LocalDateTime purchasedAt;

    public static TicketResponse from(Ticket ticket) {
        return TicketResponse.builder()
                .id(ticket.getId())
                .ticketCode(ticket.getTicketCode())
                .eventId(ticket.getEventId())
                .userEmail(ticket.getUserEmail())
                .pricePaid(ticket.getPricePaid())
                .status(ticket.getStatus().name())
                .purchasedAt(ticket.getPurchasedAt())
                .build();
    }
}
