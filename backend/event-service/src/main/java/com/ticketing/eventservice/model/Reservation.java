package com.ticketing.eventservice.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "reservations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long eventId;

    @Column(nullable = false)
    private String userEmail;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false, updatable = false)
    private LocalDateTime reservedAt;

    @PrePersist
    public void prePersist() {
        reservedAt = LocalDateTime.now();
    }
}
