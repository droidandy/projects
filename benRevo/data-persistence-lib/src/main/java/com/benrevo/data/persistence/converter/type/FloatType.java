package com.benrevo.data.persistence.converter.type;

import com.benrevo.data.persistence.converter.CryptoConverter;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

import static org.apache.commons.lang3.StringUtils.equalsIgnoreCase;
import static org.apache.commons.lang3.StringUtils.isNotBlank;

/**
 * For {@link Float}/{@link String} encryption.
 * autoApply = false
 */
@Converter
public class FloatType extends CryptoConverter implements AttributeConverter<Float, String> {

    @Override
    public String convertToDatabaseColumn(Float toDb) {
        return convertTo(
            () -> PREFIX_ENC + encryptor.encrypt(String.valueOf(toDb)),
            () -> String.valueOf(toDb),
            String.class,
            false
        );
    }

    @Override
    public Float convertToEntityAttribute(String fromDb) {
        return convertTo(
            () -> {
                String result = null;

                if(isEncrypted(fromDb)) {
                    result = encryptor.decrypt(getEncrypted(fromDb));
                } else if(isNotBlank(fromDb) && !equalsIgnoreCase(fromDb, "null")) {
                    result = fromDb;
                }

                return result;
            },
            Float.class,
            false
        );
    }
}