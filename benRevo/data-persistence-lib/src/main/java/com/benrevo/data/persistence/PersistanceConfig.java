package com.benrevo.data.persistence;

import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.jasypt.encryption.pbe.PooledPBEStringEncryptor;
import org.jasypt.encryption.pbe.config.EnvironmentPBEConfig;
import org.jasypt.salt.ZeroSaltGenerator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

import java.security.Security;

import static java.lang.System.getProperty;
import static java.lang.System.getenv;
import static org.apache.commons.lang3.StringUtils.defaultString;
import static org.apache.commons.lang3.StringUtils.isNotBlank;

/**
 * Created by sombra-7 on 06.03.17.
 */
@Configuration
@ComponentScan("com.benrevo.data")
public class PersistanceConfig {

    public static final String ENC_ENABLED;
    private static final String ENC_PASSWORD;

    static {
        // Initialize ENC_ENABLED
        ENC_ENABLED = defaultString(
            defaultString(
                getProperty("DB_DATA_ENCRYPTION_ENABLED"),
                getenv("DB_DATA_ENCRYPTION_ENABLED")
            ),
            "false"
        );

        // Initialize ENC_PASSWORD
        ENC_PASSWORD = defaultString(
            defaultString(
                getProperty("DB_DATA_ENCRYPTION_PASSWORD"),
                getenv("DB_DATA_ENCRYPTION_PASSWORD")
            ),
            "test"
        );
    }

    @Bean
    public PooledPBEStringEncryptor encryptor() {
        BouncyCastleProvider bc = new BouncyCastleProvider();
        PooledPBEStringEncryptor encryptor = new PooledPBEStringEncryptor();
        EnvironmentPBEConfig config = new EnvironmentPBEConfig();

        // Add provider
        Security.addProvider(bc);

        // Set the provider on the config
        config.setProvider(bc);

        // Defaults
        config.setAlgorithm("PBEWITHSHA256AND256BITAES-CBC-BC");
        config.setSaltGenerator(new ZeroSaltGenerator());
        config.setKeyObtentionIterations(100);
        config.setPoolSize(2);

        // Password comes from an environment variable
        // If not set, disable encryption
        if(isNotBlank(ENC_PASSWORD)) {
            config.setPasswordCharArray(ENC_PASSWORD.toCharArray());
        }

        // Set the config on each encryptor
        encryptor.setConfig(config);

        // Initialize to prevent further changes
        if(!encryptor.isInitialized()) {
            encryptor.initialize();
        }

        return encryptor;
    }
}
