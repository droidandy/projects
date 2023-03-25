package com.benrevo.be.modules.shared.configuration;

import io.lettuce.core.RedisClient;
import io.lettuce.core.RedisURI;
import io.lettuce.core.api.StatefulRedisConnection;
import io.lettuce.core.resource.ClientResources;
import io.lettuce.core.resource.DefaultClientResources;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Created by ebrandell on 1/3/18 at 2:16 PM.
 */
@Configuration
@ConditionalOnProperty(prefix = "redis", name = "enabled", havingValue = "true")
public class RedisConfig {

    @Value("${redis.master.node}")
    String masterNode;

    @Value("${redis.ssl.enabled}")
    boolean sslEnabled;

    @Value("${redis.ssl.verify}")
    boolean sslVerify;

    @Value("${redis.port}")
    int port;

    @Value("${redis.password}")
    String password;

    @Bean(destroyMethod = "shutdown")
    ClientResources clientResources() {
        return DefaultClientResources.create();
    }

    @Bean(destroyMethod = "shutdown")
    RedisClient redisClient(ClientResources clientResources) {
        return RedisClient.create(clientResources);
    }

    @Bean(destroyMethod = "close")
    StatefulRedisConnection<String, String> connection(RedisClient redisClient) {
        return redisClient.connect(
            RedisURI.Builder
                .redis(masterNode)
                .withPort(port)
                .withPassword(password)
                .withSsl(sslEnabled)
                .withVerifyPeer(sslVerify)
                .build()
        );
    }
}
