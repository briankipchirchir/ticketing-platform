package com.ticketing.notificationservice.consumer;

import com.ticketing.notificationservice.event.TicketBookedEvent;
import com.ticketing.notificationservice.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class TicketEventConsumer {

    private final EmailService emailService;

    @KafkaListener(topics = "ticket.booked", groupId = "notification-group")
    public void handleTicketBooked(TicketBookedEvent event) {
        log.info("Received ticket.booked event for: {}", event.getUserEmail());
        emailService.sendTicketConfirmation(event);
    }
}
