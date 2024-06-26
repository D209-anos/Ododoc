package com.ssafy.ododoc.common.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;

@EnableRedisRepositories
@Configuration
public class RedisConfig {

    @Value("${spring.data.redis.host}")
    private String host;

    @Value("${spring.data.redis.port}")
    private int port;

    @Value("${spring.data.redis.password}")
    private String password;

    @Bean
    @DependsOn("redisInitializationService")
    public RedisConnectionFactory redisConnectionFactory() {
        RedisStandaloneConfiguration redisStandaloneConfiguration = new RedisStandaloneConfiguration(host, port);

        if(password != null && !password.isBlank()) {
            redisStandaloneConfiguration.setPassword(password);
        }

        return new LettuceConnectionFactory(redisStandaloneConfiguration);
    }
}
