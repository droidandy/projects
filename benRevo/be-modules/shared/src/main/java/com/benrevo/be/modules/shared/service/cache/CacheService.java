package com.benrevo.be.modules.shared.service.cache;

import com.benrevo.common.logging.CustomLogger;
import com.benrevo.common.util.JsonUtils;
import io.lettuce.core.RedisClient;
import io.lettuce.core.RedisException;
import io.lettuce.core.api.StatefulRedisConnection;
import io.vavr.control.Try;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Map.Entry;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import static java.util.stream.Collectors.toMap;
import static org.apache.commons.lang3.StringUtils.isNotBlank;

/**
 * Created by ebrandell on 1/8/18 at 1:10 PM.
 *
 * Adapter for Redis interaction. Abstracts away some of the low-level logic required to persist
 * and retrieve data.
 */
@Component
@Transactional
public class CacheService implements InitializingBean {

    @Value("${redis.enabled}")
    boolean enabled;

    @Autowired
    CustomLogger logger;

    @Autowired
    JsonUtils jsonUtils;

    @Autowired(required = false)
    RedisClient client;

    @Autowired(required = false)
    StatefulRedisConnection<String, String> connection;

    @Override
    public void afterPropertiesSet() {
        if(enabled) {
            connection.setAutoFlushCommands(true);
        }
    }

    /**
     * Redis hSet command.
     *
     * @param key
     * @param field
     * @param value
     * @param <T>
     * @return Boolean
     */
    public <T> Boolean hSet(String key, String field, T value) {
        return execute(
            connection -> connection.sync().hset(key, field, jsonUtils.toJson(value)),
            false
        );
    }

    /**
     * Redis hSetNx command (set if non-existent).
     *
     * @param key
     * @param field
     * @param value
     * @param <T>
     * @return Boolean
     */
    public <T> Boolean hSetNx(String key, String field, T value) {
        return execute(
            connection -> connection.sync().hsetnx(key, field, jsonUtils.toJson(value)),
            false
        );
    }

    /**
     * Redis hmSet command.
     *
     * @param key
     * @param values
     * @param <T>
     * @return Boolean
     */
    public <T> Boolean hmSet(String key, Map<String, T> values) {
        return execute(
            connection -> {
                connection.sync().hmset(
                    key,
                    values.entrySet()
                        .parallelStream()
                        .collect(toMap(Entry::getKey, e -> jsonUtils.toJson(e.getValue())))
                );

                return true;
            },
            false
        );
    }

    /**
     * Redis hGet command.
     *
     * @param key
     * @param field
     * @param c
     * @param <T>
     * @return T
     */
    public <T> T hGet(String key, String field, Class<T> c) {
        return execute(
            connection -> {
                String json = connection.sync().hget(key, field);

                if(isNotBlank(json)) {
                    return jsonUtils.fromJson(json, c);
                }

                return null;
            },
            null
        );
    }

    /**
     * Redis hGetAll command.
     *
     * @param key
     * @param c
     * @param <T>
     * @return Map<String, T>
     */
    public <T> Map<String, T> hGetAll(String key, Class<T> c) {
        return execute(
            connection -> {
                Map<String, String> m = connection.sync().hgetall(key);

                if(m != null) {
                    Map<String, T> result = new LinkedHashMap<>();

                    m.entrySet()
                        .stream()
                        .filter(e -> isNotBlank(e.getValue()))
                        .forEach(e -> result.put(e.getKey(), jsonUtils.fromJson(e.getValue(), c)));

                    return result;
                }

                return null;
            },
            null
        );
    }

    /**
     * Redis del command (one or more keys).
     *
     * @param keys
     * @return Boolean
     */
    public Boolean del(String ... keys) {
        return execute(
            connection -> {
                long r = connection.sync().del(keys);
                return r >= 0;
            },
            false
        );
    }
    
    /**
     * Redis hdel command (one or more fields for specified key).
     *
     * @param key
     * @param fields
     * @return Boolean
     */
    public Boolean hdel(String key, String... fields) {
        return execute(
            connection -> {
                long r = connection.sync().hdel(key, fields);
                return r >= 0;
            },
            false
        );
    }

    <R> R execute(RedisLogic<R> logic, R defaultValue) throws RedisException {
        if(!enabled) {
            logger.warnLog("Redis is not currently enabled. Bypassing and returning null.");
            return null;
        }

        return Try.of(() -> logic.exec(connection))
            .onFailure(t -> logger.errorLog(t.getMessage(), t))
            .recover(Exception.class, defaultValue)
            .getOrNull();
    }

    @FunctionalInterface
    interface RedisLogic<R> {
        R exec(StatefulRedisConnection<String, String> c) throws Exception;
    }
}
