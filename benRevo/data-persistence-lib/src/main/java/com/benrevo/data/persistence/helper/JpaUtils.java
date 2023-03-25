package com.benrevo.data.persistence.helper;

import javax.persistence.Query;
import java.util.Map;

public final class JpaUtils {
    private JpaUtils() {
    }

    public static void setQueryParameters(Query query, Map<String, Object> params) {
        for (Map.Entry<String, Object> entry : params.entrySet()) {
            query.setParameter(entry.getKey(), entry.getValue());
        }
    }
}