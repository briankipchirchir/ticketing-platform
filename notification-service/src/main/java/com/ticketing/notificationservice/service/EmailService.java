package com.ticketing.notificationservice.service;

import com.ticketing.notificationservice.event.TicketBookedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendTicketConfirmation(TicketBookedEvent event) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(event.getUserEmail());
            message.setSubject("🎟️ Your Tickets are Confirmed!");
            message.setText(buildEmailBody(event));
            mailSender.send(message);
            log.info("Confirmation email sent to {}", event.getUserEmail());
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", event.getUserEmail(), e.getMessage());
        }
    }

    private String buildEmailBody(TicketBookedEvent event) {
        StringBuilder sb = new StringBuilder();
        sb.append("Hi,\n\n");
        sb.append("Your ticket booking is confirmed!\n\n");
        sb.append("Event ID   : ").append(event.getEventId()).append("\n");
        sb.append("Tickets    : ").append(event.getQuantity()).append("\n");
        sb.append("Total Paid : KES ").append(event.getTotalAmount()).append("\n\n");
        sb.append("Your Ticket Codes:\n");
        event.getTicketCodes().forEach(code ->
            sb.append("  • ").append(code).append("\n")
        );
        sb.append("\nPresent these codes at the gate.\n");
        sb.append("Enjoy the event!\n\n");
        sb.append("— Ticketing Platform");
        return sb.toString();
    }
}
