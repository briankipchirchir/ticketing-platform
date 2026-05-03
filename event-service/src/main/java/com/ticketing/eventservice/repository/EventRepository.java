package com.ticketing.eventservice.repository;

import com.ticketing.eventservice.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    // Get all active events
    List<Event> findByStatus(Event.EventStatus status);

    // Get all events by organizer
    List<Event> findByOrganizerEmail(String organizerEmail);

    // Decrement available tickets safely — only if enough tickets remain
    @Modifying
    @Query("UPDATE Event e SET e.availableTickets = e.availableTickets - :quantity WHERE e.id = :id AND e.availableTickets >= :quantity")
    int decrementAvailableTickets(Long id, int quantity);
}
