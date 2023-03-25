package com.benrevo.be.modules.shared.service.cache;

// is Spring @Component required?
public class CacheKeyBuilder {

    // see "Redis keys" section on https://redis.io/topics/data-types-intro
    private static final String SIMPLE_KEY_FORMAT = "%s:%s"; // // type:id
    private static final String WITH_FIELD_KEY_FORMAT = "%s:%s:%s"; // type:id:field
    private static final char KEY_SEPARATOR_CHAR = ':'; 
    
    private CacheKeyBuilder() {}
    
    public static String build(CacheKeyType keyType, Object id) {
        return build(keyType, id, null);
    }
    public static String build(CacheKeyType keyType, Object id, String field) {
        if(id == null) {
            throw new IllegalArgumentException("Cache key cannot have nullable id");
        }
        // using StringBuilder for so simple key format more effective
        StringBuilder key = new StringBuilder();
        key.append(keyType.getKeyPrefix());
        key.append(KEY_SEPARATOR_CHAR).append(id.toString());
        if(field != null) {
            key.append(KEY_SEPARATOR_CHAR).append(field.toString());
        }
        switch(keyType) {
            case RFP_QUOTE_OPTION:
                // any special logic?
                break;
        }
        return key.toString();
    }
}
