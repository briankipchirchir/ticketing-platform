package com.ticketing.authservice.dto;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "Full Name is required")
    private String fullName;


    @Email(message = "must be a valid email")
    @NotBlank(message = "Email is required")
    private String email;


    @NotBlank(message = "password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;


}
