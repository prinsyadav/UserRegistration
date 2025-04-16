package com.driveMetaData.backend.service;

import com.driveMetaData.backend.dto.RegistrationRequest;
import com.driveMetaData.backend.entity.User;
import com.driveMetaData.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class RegistrationService {

    private final RedisService redisService;
    private final KafkaProducerService kafkaProducerService;
    private final UserRepository userRepository;

    public void processRegistration(String clientId, RegistrationRequest request) {
        String clientStatus = redisService.getClientStatus(clientId)
                .orElse("inactive");

        log.info("Client status for Client_id {}: {}", clientId, clientStatus);

        if ("active".equalsIgnoreCase(clientStatus)) {
            kafkaProducerService.sendMessage(request);
            log.info("Queued registration request for Client_id {}", clientId);
        } else {
            log.warn("Registration rejected for Client_id {}. Status: {}", clientId, clientStatus);
            throw new IllegalStateException("Client status is '" + clientStatus + "'. Registration not allowed.");
        }
    }

    // Method called by Kafka consumer to save to DB
    @Transactional
    public void saveRegistration(RegistrationRequest request) {
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setMobile(request.getMobile());
        user.setCity(request.getCity());

        try {
            userRepository.save(user);
            log.info("Successfully saved user registration to database: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to save user registration {} to database: {}", request.getEmail(), e.getMessage());
        }
    }

    // Method to fetch users
    public List<User> getAllRegisteredUsers() {
        return userRepository.findAll();
    }
}