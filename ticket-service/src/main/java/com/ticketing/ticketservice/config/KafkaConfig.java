package com.ticketing.ticketservice.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaConfig {

    // Auto-create the ticket.booked topic when the service starts
    @Bean
    public NewTopic ticketBookedTopic() {
        return TopicBuilder.name("ticket.booked")
                .partitions(1)
                .replicas(1)
                .build();
    }
}
