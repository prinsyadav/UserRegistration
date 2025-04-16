package com.driveMetaData.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.driveMetaData.backend.dto.ClientStatusResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class RedisService {

    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    @Value("${app.redis.client-status-key-prefix}")
    private String clientStatusPrefix;

    public Optional<String> getClientStatus(String clientId) {
        String key = clientStatusPrefix + clientId;
        try {
            String jsonValue = redisTemplate.opsForValue().get(key);
            if (jsonValue != null) {
                ClientStatusResponse response = objectMapper.readValue(jsonValue, ClientStatusResponse.class);
                return Optional.ofNullable(response.getStatus());
            }
        } catch (Exception e) {
            log.error("Error fetching or parsing client status from Redis for key {}: {}", key, e.getMessage());
        }
        return Optional.empty();
    }

    // Method to set status
    public void setClientStatus(String clientId, String statusJson) {
        String key = clientStatusPrefix + clientId;
        redisTemplate.opsForValue().set(key, statusJson);
        log.info("Set Redis key '{}' with value '{}'", key, statusJson);
    }
}
