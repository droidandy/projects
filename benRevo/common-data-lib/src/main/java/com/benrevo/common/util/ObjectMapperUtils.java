package com.benrevo.common.util;

import org.modelmapper.AbstractConverter;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.modelmapper.TypeMap;
import org.modelmapper.convention.MatchingStrategies;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

public final class ObjectMapperUtils {
    private static ModelMapper modelMapper = new ModelMapper();

    static {
        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);

        // convert from String to Date using default format
        modelMapper.addConverter(new AbstractConverter<String, Date>() {
            @Override
            protected Date convert(String source) {
                return (source == null) ? null : DateHelper.fromStringToDate(source);
            }
        });
        
        // convert from Date to String using default format
        modelMapper.addConverter(new AbstractConverter<Date, String>() {
            @Override
            protected String convert(Date source) {
                return (source == null) ? null : DateHelper.fromDateToString(source);
            }
        });
    }


    /**
     * Hide from public usage.
     */
    private ObjectMapperUtils() {
    }

    /**
     * <p>Note: outClass object must have default constructor with no arguments</p>
     *
     * @param <D>      type of result object.
     * @param <T>      type of source object to map from.
     * @param entity   entity that needs to be mapped.
     * @param outClass class of result object.
     * @return new object of <code>outClass</code> type.
     */
    public static <D, T> D map(T entity, Class<D> outClass) {
        if (entity == null) { return null; }
        return modelMapper.map(entity, outClass);
    }

    /**
     * <p>Note: outClass object must have default constructor with no arguments</p>
     *
     * @param entityList list of entities that needs to be mapped
     * @param outCLass   class of result list element
     * @param <D>        type of objects in result list
     * @param <T>        type of entity in <code>entityList</code>
     * @return list of mapped object with <code><D></code> type.
     */
    public static <D, T> List<D> mapAll(Iterable<T> entityList, Class<D> outCLass) {
        if (entityList == null) { return null; }
        return StreamSupport.stream(entityList.spliterator(), false).map(x -> map(x, outCLass)).collect(Collectors.toList());
    }

    /**
     * Maps {@code source} to {@code destination}.
     *
     * @param source      object to map from
     * @param destination object to map to
     */
    public static void map(Object source, Object destination) {
        modelMapper.map(source, destination);
    }


    /**
     * Adds {@code propertyMap} to list of mappers.
     *
     * @param propertyMap   custom property mapper to attach to model mapper
     */
    public static <S, D> void addMapping(PropertyMap<S, D> propertyMap) {
        modelMapper.addMappings(propertyMap);
    }

    /**
     * Creates {@code TypeMap} from source and destination types.
     *
     * @param sourceType 
     * @param destinationType
     * 
     * @return TypeMap<sourceType, destinationType>
     */
    public static <S, D> TypeMap<S, D> createTypeMap(Class<S> sourceType, Class<D> destinationType) {
        return modelMapper.createTypeMap(sourceType, destinationType);
    }

    /**
     * Returns {@code TypeMap} from source and destination types.
     *
     * @param sourceType 
     * @param destinationType
     * 
     * @return TypeMap<sourceType, destinationType>
     */
    public static <S, D> TypeMap<S, D> getTypeMap(Class<S> sourceType, Class<D> destinationType) {
        return modelMapper.getTypeMap(sourceType, destinationType);
    }
    
}
