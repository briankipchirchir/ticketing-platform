package com.ticketing.ticketservice.repository;

import com.ticketing.ticketservice.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    // Get all tickets for a specific user
    List<Ticket> findByUserEmail(String userEmail);

    // Get all tickets for a specific event
    List<Ticket> findByEventId(Long eventId);

    // Find ticket by its unique code — used for validation at the gate
    Optional<Ticket> findByTicketCode(String ticketCode);

    // Count how many tickets a user has for a specific event
    int countByUserEmailAndEventId(String userEmail, Long eventId);
}
