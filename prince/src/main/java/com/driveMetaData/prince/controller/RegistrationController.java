package com.driveMetaData.prince.controller;

import com.driveMetaData.prince.dto.RegistrationRequest;
import com.driveMetaData.prince.service.RateLimiterService; // Assuming Redis based
import com.driveMetaData.prince.service.RegistrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1") // Add a base path
@RequiredArgsConstructor
@Slf4j
// Add CORS config if frontend is on a different origin
@CrossOrigin(origins = "http://localhost:3000") // Adjust for your frontend URL
public class RegistrationController {

    private final RegistrationService registrationService;
    private final RateLimiterService rateLimiterService; // Inject rate limiter

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(
            @RequestHeader("Client_id") String clientId, // Read header
            @Valid @RequestBody RegistrationRequest request) { // Validate body

        log.info("Received registration request from Client_id: {}", clientId);

        // --- Rate Limiting ---
        // Use clientId or authenticated user ID from JWT if implemented
        if (!rateLimiterService.allowRequest("client_" + clientId)) { // Use a suitable identifier
            log.warn("Rate limit exceeded for Client_id: {}", clientId);
            // Consider using HttpStatus.TOO_MANY_REQUESTS (429)
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Rate limit exceeded");
        }

        // --- Client Status Check & Processing ---
        try {
            registrationService.processRegistration(clientId, request);
            return ResponseEntity.status(HttpStatus.ACCEPTED).body("Registration request received and queued.");
            // Use 202 Accepted because processing is asynchronous via Kafka
        } catch (IllegalStateException e) {
            log.warn("Registration blocked for Client_id {}: {}", clientId, e.getMessage());
            // Return specific error based on status check (e.g., 403 Forbidden or 400 Bad Request)
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            log.error("Error processing registration for Client_id {}: {}", clientId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An internal error occurred.");
        }
    }

    // Endpoint to retrieve registered users for the frontend table
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        // Add security check here if needed (e.g., only admin role)
        return ResponseEntity.ok(registrationService.getAllRegisteredUsers());
    }

    // You might need an endpoint for login/authentication to get the JWT
    // @PostMapping("/authenticate") -> Returns JWT token
}