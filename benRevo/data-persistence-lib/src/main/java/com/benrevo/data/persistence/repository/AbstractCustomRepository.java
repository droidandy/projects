package com.benrevo.data.persistence.repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

import static com.benrevo.common.util.StreamUtils.mapToMap;
import static com.benrevo.data.persistence.helper.JpaUtils.setQueryParameters;

public abstract class AbstractCustomRepository implements CustomRepository {
    @PersistenceContext
    private EntityManager entityManager;

    protected <K, V> Map<K, V> resultAsMap(String query, Map<String, Object> params) {
        return resultAsMap(entityManager.createQuery(query), params);
    }

    protected <K, V> Map<K, V> resultAsMap(Query query, Map<String, Object> params) {
        setQueryParameters(query, params);
        return resultAsMap(query);
    }

    protected <K, V> Map<K, V> resultAsMap(Query query) {
        return resultAsMap(query, x -> (K) x[0], x -> (V) x[1]);
    }

    protected <K, V> Map<K, V> resultAsMap(Query query, Function<Object[], ? extends K> keyMapper,
                                           Function<Object[], ? extends V> valueMapper) {
        List<Object[]> result = query.getResultList();

        return result != null && result.isEmpty() ? Collections.EMPTY_MAP : mapToMap(result, keyMapper, valueMapper);
    }

    @Override
    public EntityManager getEntityManager() {
        return entityManager;
    }
}