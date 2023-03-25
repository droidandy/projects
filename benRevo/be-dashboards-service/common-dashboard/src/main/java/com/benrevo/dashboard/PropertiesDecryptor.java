package com.benrevo.dashboard;

import static com.amazonaws.regions.Regions.US_EAST_1;
import static com.amazonaws.regions.Regions.US_WEST_2;
import static com.benrevo.dashboard.PropertiesDecryptor.PropertyResource.Key.auth0;
import static com.benrevo.dashboard.PropertiesDecryptor.PropertyResource.Key.aws;
import static com.benrevo.dashboard.PropertiesDecryptor.PropertyResource.Key.salesforce;
import static com.benrevo.common.enums.CarrierType.fromString;
import static java.lang.String.format;
import static java.lang.System.getProperty;
import static java.lang.System.getenv;
import static java.nio.ByteBuffer.wrap;
import static java.nio.charset.Charset.forName;
import static java.util.Arrays.stream;
import static org.apache.commons.io.IOUtils.toByteArray;
import static org.apache.commons.io.IOUtils.toInputStream;
import static org.apache.commons.lang3.StringUtils.defaultString;
import static org.apache.commons.lang3.StringUtils.equalsIgnoreCase;
import static org.springframework.core.env.CommandLinePropertySource.COMMAND_LINE_PROPERTY_SOURCE_NAME;
import static org.springframework.test.context.support.TestPropertySourceUtils.INLINED_PROPERTIES_PROPERTY_SOURCE_NAME;

import com.amazonaws.regions.Regions;
import com.amazonaws.services.kms.AWSKMS;
import com.amazonaws.services.kms.AWSKMSClient;
import com.amazonaws.services.kms.model.DecryptRequest;
import com.benrevo.dashboard.PropertiesDecryptor.PropertyResource.Key;
import com.benrevo.common.enums.CarrierType;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.context.config.ConfigFileApplicationListener;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.boot.logging.DeferredLog;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.Ordered;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.Environment;
import org.springframework.core.env.MutablePropertySources;
import org.springframework.core.env.PropertiesPropertySource;
import org.springframework.core.io.DefaultResourceLoader;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

/**
 * Created by elliott on 7/5/17.
 *
 * Allows for customization of the application's {@link Environment} prior to the
 * application context being refreshed.
 */
@Component
public class PropertiesDecryptor implements EnvironmentPostProcessor, Ordered {

    public static final String APP_ENV;
    public static final CarrierType APP_CARRIER;

    static {
        // Initialize APP_ENV
        APP_ENV = defaultString(
            defaultString(
                getProperty("APP_ENV"),
                getenv("APP_ENV")
            ),
            "preprod"
        );

        // Initialize APP_CARRIER
        APP_CARRIER = fromString(
            defaultString(
                getProperty("APP_CARRIER"),
                getenv("APP_CARRIER")
            )
        );
    }

    static final String FILE_FORMAT = "classpath:sensitive/%s/%s.%s";
    static final String EXT_ENCRYPTED = "encrypted.properties";
    static final String EXT_PLAINTEXT = "properties";
    static final String DIR = "%s/%s";

    // Property resources defined in order of precedence
    enum PropertyResource {

        // Auth0
        auth0_override(auth0, US_EAST_1, false, false),
        auth0_preprod(auth0, US_EAST_1, false, true),
        auth0_prod(auth0, US_WEST_2, true, true),

        // AWS
        aws_override(aws, US_EAST_1, false, false),
        aws_preprod(aws, US_EAST_1, false, true),
        aws_prod(aws, US_WEST_2, true, true),

        // Salesforce
        sf_override(salesforce, US_EAST_1, false, false),
        sf_preprod(salesforce, US_EAST_1, false, true),
        sf_prod(salesforce, US_WEST_2, true, true);

        final Key key;
        final Regions region;
        final boolean prod;
        final boolean encrypted;
        final String path;

        PropertyResource(Key key, Regions region, boolean prod, boolean encrypted) {
            this.key = key;
            this.region = region;
            this.encrypted = encrypted;
            this.prod = prod;
            this.path = format(
                FILE_FORMAT,
                format(
                    DIR,
                    prod ? "prod" : "preprod",
                    APP_CARRIER.abbreviation
                ),
                key.name(),
                encrypted ? EXT_ENCRYPTED : EXT_PLAINTEXT
            );
        }

        enum Key {
            auth0,
            aws,
            salesforce
        }
    }

    static DeferredLog LOGGER = new DeferredLog();

    ResourceLoader resourcesLoader = new DefaultResourceLoader();
    AWSKMS kms = null;

    /**
     * Decrypts the encrypted auth0 secrets file and exposes them in-memory. As a workaround, if the
     * original 'auth0.properties' file is on the classpath in an unencrypted format, it will take
     * precedence over the encrypted one.
     *
     * @param env
     *     {@link ConfigurableEnvironment}
     * @param app
     *     {@link SpringApplication}
     */
    @Override
    public void postProcessEnvironment(ConfigurableEnvironment env, SpringApplication app) {
        MutablePropertySources ps = env.getPropertySources();

        // Get current region
        Regions region = getRegion(env);

        // Initialize kms
        if(kms == null) {
            kms = AWSKMSClient.builder().withRegion(region).build();
        }

        // Attempt to load each property source
        for(PropertyResource pr : PropertyResource.values()) {
            if(!ps.contains(pr.key.name()) && region.equals(pr.region)) {
                loadProperties(pr, ps, loadResource(pr));
            }
        }

        // If any of the files failed to load, throw an exception
        if(stream(Key.values()).anyMatch(k -> !ps.contains(k.name()))) {
            throw new IllegalStateException("Unable to load startup properties");
        }
    }

    void loadProperties(PropertyResource pr, MutablePropertySources ps, InputStream res) {
        try {
            // Init new properties holder
            Properties properties = new Properties();

            // Fail fast if InputStream is null
            if(res == null) {
                return;
            }

            if(pr.encrypted) {
                // Convert to byte array
                byte[] bb = toByteArray(res);

                // Send a DecryptRequest and convert to String
                DecryptRequest req = new DecryptRequest().withCiphertextBlob(wrap(bb));

                String r = new String(
                    kms.decrypt(req).getPlaintext().array(),
                    forName("UTF-8")
                );

                // Load the properties
                properties.load(toInputStream(r, forName("UTF-8")));
            } else {
                // Load the plaintext properties
                properties.load(res);
            }

            // Add to property sources
            if(ps.contains(COMMAND_LINE_PROPERTY_SOURCE_NAME)) {
                ps.addAfter(
                    COMMAND_LINE_PROPERTY_SOURCE_NAME,
                    new PropertiesPropertySource(pr.key.name(), properties)
                );
            } else if(ps.contains(INLINED_PROPERTIES_PROPERTY_SOURCE_NAME)) {
                ps.addAfter(
                    INLINED_PROPERTIES_PROPERTY_SOURCE_NAME,
                    new PropertiesPropertySource(pr.key.name(), properties)
                );
            } else {
                ps.addFirst(
                    new PropertiesPropertySource(pr.key.name(), properties)
                );
            }
        } catch(IOException e) {
            LOGGER.error(e.getMessage(), e);
        }
    }

    /**
     * Load the requested resource
     *
     * @param res
     *     {@link PropertyResource}
     * @return
     *     {@link InputStream} or null
     */
    InputStream loadResource(PropertyResource res) {
        InputStream propertiesFile = null;

        try {
            if(resourcesLoader.getResource(res.path).exists()) {
                propertiesFile = resourcesLoader
                    .getResource(res.path)
                    .getInputStream();
            }
        } catch(Exception e) {
            LOGGER.error(e.getMessage(), e);
        }

        return propertiesFile;
    }

    /**
     * Set the order to execute before {@link ConfigFileApplicationListener}, so it can make use of
     * the properties read here.
     *
     * @return
     *     int representing the order
     */
    @Override
    public int getOrder() {
        return ConfigFileApplicationListener.DEFAULT_ORDER - 1;
    }

    /**
     * Listens for the {@link ContextRefreshedEvent} and if and error has occurred during the
     * postProcess logic above, will exit.
     *
     * @param event
     *     {@link ContextRefreshedEvent}
     */
    @EventListener(classes = ContextRefreshedEvent.class)
    private void replayLogsAndExit(ContextRefreshedEvent event) {
        LOGGER.replayTo(PropertiesDecryptor.class);
    }

    /**
     * Helper for retrieving AWS region based on 'APP_ENV' value.
     *
     * @param env
     *     {@link ConfigurableEnvironment}
     * @return
     *     AWS region
     */
    Regions getRegion(ConfigurableEnvironment env) {
        return equalsIgnoreCase(APP_ENV, "prod") ? US_WEST_2 : US_EAST_1;
    }
}
