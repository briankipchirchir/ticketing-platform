package com.ticketing.ticketservice.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tickets")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String ticketCode;   // unique QR-scannable code e.g TKT-A1B2C3

    @Column(nullable = false)
    private Long eventId;

    @Column(nullable = false)
    private String userEmail;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePaid;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketStatus status;

    @Column(nullable = false, updatable = false)
    private LocalDateTime purchasedAt;

    @PrePersist
    public void prePersist() {
        purchasedAt = LocalDateTime.now();
        if (status == null) status = TicketStatus.CONFIRMED;
        if (ticketCode == null) {
            // Generate a short readable ticket code
            String uuid = UUID.randomUUID().toString().replace("-", "").toUpperCase();
            ticketCode = "TKT-" + uuid.substring(0, 8);
        }
    }

    public enum TicketStatus {
        CONFIRMED,   // ticket booked and paid
        USED,        // scanned at the gate
        CANCELLED,   // cancelled by user
        REFUNDED     // refunded
    }
}
