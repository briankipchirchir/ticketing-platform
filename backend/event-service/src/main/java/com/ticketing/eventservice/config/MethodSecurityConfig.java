
package com.ticketing.eventservice.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

// Enables @PreAuthorize / @PostAuthorize on controller and service methods,
// e.g. @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')") on EventController.createEvent
@Configuration
@EnableMethodSecurity
public class MethodSecurityConfig {
}