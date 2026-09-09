package com.ticketing.notificationservice.service;

import com.ticketing.notificationservice.event.TicketBookedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    @Value("${resend.api-key}")
    private String apiKey;

    @Value("${resend.from-email}")
    private String fromEmail;

    private final RestTemplate restTemplate;

    public void sendTicketConfirmation(TicketBookedEvent event) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            Map<String, Object> body = Map.of(
                "from", fromEmail,
                "to", new String[]{event.getUserEmail()},
                "subject", "🎟️ Your Tickets are Confirmed!",
                "text", buildEmailBody(event)
            );

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                "https://api.resend.com/emails",
                request,
                String.class
            );

            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("Confirmation email sent to {}", event.getUserEmail());
            } else {
                log.error("Failed to send email: {}", response.getBody());
            }

        } catch (Exception e) {
            log.error("Error sending email to {}: {}", event.getUserEmail(), e.getMessage());
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
