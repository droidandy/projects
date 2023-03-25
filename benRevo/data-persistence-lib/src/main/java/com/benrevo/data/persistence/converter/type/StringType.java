package com.benrevo.data.persistence.converter.type;

import com.benrevo.data.persistence.converter.CryptoConverter;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

/**
 * For {@link String}/{@link String} encryption.
 * autoApply = false
 */
@Converter
public class StringType extends CryptoConverter implements AttributeConverter<String, String> {

    @Override
    public String convertToDatabaseColumn(String toDb) {
        return convertTo(
            () -> PREFIX_ENC + encryptor.encrypt(toDb),
            () -> toDb,
            String.class,
            false
        );
    }

    @Override
    public String convertToEntityAttribute(String fromDb) {
        return convertTo(
            () -> isEncrypted(fromDb) ? encryptor.decrypt(getEncrypted(fromDb)) : fromDb,
            String.class,
            false
        );
    }
}