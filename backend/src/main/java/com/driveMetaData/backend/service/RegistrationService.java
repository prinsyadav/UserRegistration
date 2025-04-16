package com.driveMetaData.backend.service;

import com.driveMetaData.backend.dto.RegistrationRequest;
import com.driveMetaData.backend.entity.User; // Assuming you add a DTO mapping later
import com.driveMetaData.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // For DB operations

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class RegistrationService {

    private final RedisService redisService;
    private final KafkaProducerService kafkaProducerService;
    private final UserRepository userRepository; // Inject repository for fetching users

    public void processRegistration(String clientId, RegistrationRequest request) {
        String clientStatus = redisService.getClientStatus(clientId)
                .orElse("inactive"); // Default to inactive if not found or error

        log.info("Client status for Client_id {}: {}", clientId, clientStatus);

        if ("active".equalsIgnoreCase(clientStatus)) {
            // Status is active, queue to Kafka
            kafkaProducerService.sendMessage(request);
            log.info("Queued registration request for Client_id {}", clientId);
        } else {
            // Status is not active, reject the request
            log.warn("Registration rejected for Client_id {}. Status: {}", clientId, clientStatus);
            // Throw an exception to be caught by the controller
            throw new IllegalStateException("Client status is '" + clientStatus + "'. Registration not allowed.");
        }
    }

    // Method called by Kafka consumer to save to DB
    @Transactional // Ensure atomicity
    public void saveRegistration(RegistrationRequest request) {
        // Basic mapping - consider using MapStruct or manual mapper for complex objects
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setMobile(request.getMobile());
        user.setCity(request.getCity());

        try {
            userRepository.save(user);
            log.info("Successfully saved user registration to database: {}", user.getEmail());
        } catch (Exception e) {
            // Handle potential DB exceptions (e.g., unique constraint violation on email)
            log.error("Failed to save user registration {} to database: {}", request.getEmail(), e.getMessage());
            // Consider moving the message to a dead-letter queue (DLQ) or logging for manual intervention
        }
    }

    // Method to fetch users for the frontend
    public List<User> getAllRegisteredUsers() {
        return userRepository.findAll(); // Add pagination/sorting for large datasets
    }
}