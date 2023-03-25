package com.benrevo.common.util;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;

import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toSet;

public class StreamUtils {

    /**
     * Hide constructor from public usage.
     */
    private StreamUtils() {
    }

    /**
     * Returns a list consisting of the results of applying the given
     * function to the elements of this list.
     *
     * @param list   the original elements
     * @param mapper function to apply to each element
     * @param <T>    The element type of the old list
     * @param <R>    The element type of the new list
     * @return a list consisting of the results of applying the given
     * function to the elements of this list.
     */
    public static <T, R> List<R> mapToList(Collection<T> list, Function<? super T, ? extends R> mapper) {
        return list.stream().map(mapper).collect(toList());
    }

    /**
     * Returns a set consisting of the results of applying the given
     * function to the elements of this list.
     *
     * @param list   the original elements
     * @param mapper function to apply to each element
     * @param <T>    The element type of the old list
     * @param <R>    The element type of the new set
     * @return a list consisting of the results of applying the given
     * function to the elements of this list.
     */
    public static <T, R> Set<R> mapToSet(Collection<T> list, Function<? super T, ? extends R> mapper) {
        return list.stream().map(mapper).collect(toSet());
    }

    /**
     * This is wrapper upon Stream.collect(Collectors.toMap) function.
     *
     * @param src         collection to transform
     * @param <T>         the type of the input elements
     * @param <K>         the output type of the key mapping function
     * @param <U>         the output type of the value mapping function
     * @param keyMapper   a mapping function to produce keys
     * @param valueMapper a mapping function to produce values
     * @return a map that will be constructed by {@code keyMapper} and {@code valueMapper}.
     */
    public static <T, K, U> Map<K, U> mapToMap(Collection<T> src,
                                               Function<? super T, ? extends K> keyMapper,
                                               Function<? super T, ? extends U> valueMapper) {
        return src.stream()
                .collect(HashMap::new, (m, v) -> m.put(keyMapper.apply(v), valueMapper.apply(v)), HashMap::putAll);
    }
}