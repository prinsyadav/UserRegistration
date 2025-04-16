package com.driveMetaData.backend.controller;

import com.driveMetaData.backend.dto.RegistrationRequest;
import com.driveMetaData.backend.service.RateLimiterService;
import com.driveMetaData.backend.service.RegistrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
public class RegistrationController {

    private final RegistrationService registrationService;
    private final RateLimiterService rateLimiterService;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(
            @RequestHeader("Client_id") String clientId,
            @Valid @RequestBody RegistrationRequest request) {

        log.info("Received registration request from Client_id: {}", clientId);

        // Apply rate limiting
        if (!rateLimiterService.allowRequest("client_" + clientId)) {
            log.warn("Rate limit exceeded for Client_id: {}", clientId);
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Rate limit exceeded");
        }

        // Process registration if rate limit allows
        try {
            registrationService.processRegistration(clientId, request);
            return ResponseEntity.status(HttpStatus.ACCEPTED).body("Registration request received and queued.");
        } catch (IllegalStateException e) {
            log.warn("Registration blocked for Client_id {}: {}", clientId, e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            log.error("Error processing registration for Client_id {}: {}", clientId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An internal error occurred.");
        }
    }

    // Endpoint to retrieve registered users for the frontend table
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        // Security is already handled by JWT filter
        return ResponseEntity.ok(registrationService.getAllRegisteredUsers());
    }
}