package com.benrevo.common.util;

/**
 * Created by elliott on 6/23/17.
 */

import org.apache.commons.lang3.tuple.MutablePair;
import org.apache.commons.lang3.tuple.Pair;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import static java.util.Arrays.stream;

public final class MapBuilder {

    public enum Type {ORDERED, UNORDERED}

    /**
     * Helper for creating new entry
     *
     * @param key
     *     key
     * @param value
     *     value
     * @param <K>
     *     key type
     * @param <V>
     *     value type
     *
     * @return new Entry
     */
    public static <K, V> Pair<K, V> entry(final K key, final V value) {
        return new MutablePair<>(key, value);
    }

    /**
     * Alias for above.
     */
    public static <K, V> Pair<K, V> field(final K key, final V value) {
        return new MutablePair<>(key, value);
    }

    /**
     * Main builder
     *
     * @param t
     *     type {ORDERED,UNORDERED}
     * @param entries
     *     entries to add
     * @param <K>
     *     key type
     * @param <V>
     *     value type
     *
     * @return new Map
     */
    @SafeVarargs
    public static <K, V> Map<K, V> build(final Type t, final Pair<K, V>... entries) {
        Map<K, V> map = null;

        if(t == null) {
            map = populate(new HashMap<>(), entries);
        } else {
            switch(t) {
                case ORDERED:
                    map = populate(new HashMap<>(), entries);
                    break;
                case UNORDERED:
                    map = populate(new LinkedHashMap<>(), entries);
                    break;
            }
        }

        return map;
    }

    /**
     * Internal helper for populating a map
     *
     * @param map
     *     map to add to
     * @param entries
     *     entries to add
     * @param <K>
     *     key type
     * @param <V>
     *     value type
     *
     * @return new Map
     */
    @SafeVarargs
    private static <K, V> Map<K, V> populate(Map<K, V> map, final Pair<K, V>... entries) {
        stream(entries).forEach(e -> map.put(e.getKey(), e.getValue()));

        return map;
    }

    /**
     * {@see MapBuilder.build(Type t, Mutability m, Entry ... entries) }
     */
    @SafeVarargs
    public static <K, V> Map<K, V> build(final Pair<K, V>... entries) {
        return build(null, entries);
    }
}
