package com.benrevo.data.persistence.converter;

import com.benrevo.common.exception.BaseException;
import org.apache.logging.log4j.Logger;
import org.jasypt.encryption.pbe.PooledPBEStringEncryptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.TypeDescriptor;
import org.springframework.core.convert.support.DefaultConversionService;
import org.springframework.stereotype.Component;

import static com.benrevo.data.persistence.PersistanceConfig.ENC_ENABLED;
import static org.apache.commons.lang3.BooleanUtils.toBoolean;
import static org.apache.commons.lang3.StringUtils.*;
import static org.apache.logging.log4j.LogManager.getLogger;

/**
 * Created by elliott on 6/13/17.
 */
@Component
public class CryptoConverter {

    protected static PooledPBEStringEncryptor encryptor;

    // Prefix for encrypted database values
    protected static final String PREFIX_ENC = "ENC|";

    static DefaultConversionService converter = new DefaultConversionService();

    static Logger logger = getLogger(CryptoConverter.class);

    /**
     * Autowires the encryptor.
     *
     * @param encryptor
     *     Encryptor
     */
    @Autowired
    public void setEncryptor(PooledPBEStringEncryptor encryptor) {
        CryptoConverter.encryptor = encryptor;
    }

    /**
     * Helper to check if encryption is enabled based on environment variable.
     *
     * @return true if explicitly enabled, false otherwise
     */
    static boolean encryptionEnabled() {
        return isNotBlank(ENC_ENABLED) && toBoolean(ENC_ENABLED);
    }

    /**
     * Helper method to remove PREFIX_ENC and return encrypted String
     *
     * @param input
     *     String input
     *
     * @return encrypted String without the prefix or null
     */
    protected static String getEncrypted(String input) {
        return isEncrypted(input) ? removeStart(input, PREFIX_ENC) : null;
    }

    /**
     * Helper method to determine if a field is encrypted before attempting to decrypt.
     *
     * @param input
     *     String input
     *
     * @return true if encrypted, false otherwise
     */
    protected static boolean isEncrypted(String input) {
        return isNotBlank(input) && startsWith(input, PREFIX_ENC) && !endsWith(input, "null");
    }

    /**
     * Wrapper for method logic within the converters.
     *
     * @param logic
     *     the lambda logic
     * @param defaultLogic
     *     default logic
     * @param targetType
     *     targetType class to convert to
     * @param throwException
     *     if exception is caught, should we throw an exception?
     * @param <S>
     *     source type
     * @param <D>
     *     destination type
     *
     * @return instance of D or null if not possible
     */
    protected static <S, D> D convertTo(
        ConvertLogic<S> logic,
        DefaultLogic<S> defaultLogic,
        Class<D> targetType,
        boolean throwException
    ) {
        D result = null;

        try {
            S temp;

            if(encryptionEnabled()) {
                temp = logic.exec();
            } else if(defaultLogic != null) {
                temp = defaultLogic.exec();
            } else {
                temp = logic.exec();
            }

            if(temp != null) {
               if(converter.canBypassConvert(
                   TypeDescriptor.forObject(temp),
                   TypeDescriptor.forObject(targetType)
               )) {
                   result = (D) temp;
               } else if(converter.canConvert(temp.getClass(), targetType)){
                   result = converter.convert(temp, targetType);
               }
            }
        } catch(Exception e) {
            if(throwException) {
                throw new BaseException(e.getMessage(), e);
            }

            logger.warn(e.getMessage(), e);
        }

        return result;
    }

    /**
     * Wrapper for method logic within the converters (overloaded)
     *
     * @param logic
     *     the lambda logic
     * @param targetType
     *     targetType class to convert to
     * @param throwException
     *     if exception is caught, should we throw an exception?
     * @param <S>
     *     source type
     * @param <D>
     *     destination type
     *
     * @return instance of D or null if not possible
     */
    protected static <S, D> D convertTo(
        ConvertLogic<S> logic,
        Class<D> targetType,
        boolean throwException
    ) {
        return convertTo(logic, null, targetType, throwException);
    }

    /**
     * Functional interface for more concise method writing within the nested classes
     */
    @FunctionalInterface
    protected interface ConvertLogic<S> {
        S exec() throws Exception;
    }

    /**
     * Functional interface for returning the default value
     */
    @FunctionalInterface
    protected interface DefaultLogic<S> {
        S exec() throws Exception;
    }
}
