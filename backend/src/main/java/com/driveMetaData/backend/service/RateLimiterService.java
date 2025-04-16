package com.driveMetaData.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;

@Service
@RequiredArgsConstructor
@Slf4j
public class RateLimiterService {

    private final StringRedisTemplate redisTemplate;

    @Value("${app.ratelimit.capacity}")
    private int capacity;

    @Value("${app.ratelimit.refill-rate}")
    private int refillRate;

    @Value("${app.ratelimit.refill-period-seconds}")
    private int refillPeriodSeconds;

    private static final String RATE_LIMIT_KEY_PREFIX = "rate_limit:";
    private static final String LAST_REFILL_TIME_SUFFIX = ":last_refill";
    private static final String TOKENS_SUFFIX = ":tokens";

    /**
     * Checks if a request from a client should be allowed based on rate limiting rules
     *
     * @param clientId The client identifier
     * @return true if the request is allowed, false otherwise
     */
    public boolean allowRequest(String clientId) {
        String tokenKey = RATE_LIMIT_KEY_PREFIX + clientId + TOKENS_SUFFIX;
        String lastRefillKey = RATE_LIMIT_KEY_PREFIX + clientId + LAST_REFILL_TIME_SUFFIX;

        Integer currentTokens = getCurrentTokenCount(tokenKey);
        
        // Get last refill time or initialize if not exists
        Long lastRefillTime = getLastRefillTime(lastRefillKey);
        
        // Calculate time since last refill
        long currentTimeMillis = Instant.now().toEpochMilli();
        long elapsedTime = currentTimeMillis - lastRefillTime;
        
        // Refill tokens based on elapsed time
        int tokensToAdd = calculateTokensToAdd(elapsedTime);
        currentTokens = Math.min(capacity, currentTokens + tokensToAdd);
        
        // If tokens were added, update last refill time
        if (tokensToAdd > 0) {
            redisTemplate.opsForValue().set(lastRefillKey, String.valueOf(currentTimeMillis));
        }
        
        // Check if request can be allowed
        if (currentTokens > 0) {
            // Consume a token
            redisTemplate.opsForValue().set(tokenKey, String.valueOf(currentTokens - 1));
            return true;
        } else {
            log.warn("Rate limit exceeded for client: {}", clientId);
            return false;
        }
    }

    private Integer getCurrentTokenCount(String tokenKey) {
        String tokenStr = redisTemplate.opsForValue().get(tokenKey);
        if (tokenStr == null) {
            // Initialize with full capacity if not exists
            redisTemplate.opsForValue().set(tokenKey, String.valueOf(capacity));
            return capacity;
        }
        return Integer.parseInt(tokenStr);
    }

    private Long getLastRefillTime(String lastRefillKey) {
        String lastRefillTimeStr = redisTemplate.opsForValue().get(lastRefillKey);
        if (lastRefillTimeStr == null) {
            // Initialize with current time if not exists
            long currentTimeMillis = Instant.now().toEpochMilli();
            redisTemplate.opsForValue().set(lastRefillKey, String.valueOf(currentTimeMillis));
            return currentTimeMillis;
        }
        return Long.parseLong(lastRefillTimeStr);
    }

    private int calculateTokensToAdd(long elapsedTimeMillis) {
        // Convert elapsed time to seconds
        long elapsedTimeSeconds = elapsedTimeMillis / 1000;
        
        // Calculate number of periods elapsed
        long periodsElapsed = elapsedTimeSeconds / refillPeriodSeconds;
        
        // Calculate tokens to add based on refill rate and periods elapsed
        return (int) (periodsElapsed * refillRate);
    }
    
    /**
     * Reset the rate limit for a client (for testing or admin purposes)
     *
     * @param clientId The client identifier
     */
    public void resetRateLimit(String clientId) {
        String tokenKey = RATE_LIMIT_KEY_PREFIX + clientId + TOKENS_SUFFIX;
        String lastRefillKey = RATE_LIMIT_KEY_PREFIX + clientId + LAST_REFILL_TIME_SUFFIX;
        
        redisTemplate.opsForValue().set(tokenKey, String.valueOf(capacity));
        redisTemplate.opsForValue().set(lastRefillKey, String.valueOf(Instant.now().toEpochMilli()));
        
        log.info("Reset rate limit for client: {}", clientId);
    }
    
    /**
     * Set the time-to-live (TTL) for rate limit keys to ensure cleanup
     *
     * @param clientId The client identifier
     * @param ttlSeconds Time-to-live in seconds
     */
    public void setRateLimitTTL(String clientId, long ttlSeconds) {
        String tokenKey = RATE_LIMIT_KEY_PREFIX + clientId + TOKENS_SUFFIX;
        String lastRefillKey = RATE_LIMIT_KEY_PREFIX + clientId + LAST_REFILL_TIME_SUFFIX;
        
        redisTemplate.expire(tokenKey, Duration.ofSeconds(ttlSeconds));
        redisTemplate.expire(lastRefillKey, Duration.ofSeconds(ttlSeconds));
    }
}
