package com.benrevo.core;

import com.amazonaws.services.kms.AWSKMS;
import com.amazonaws.services.kms.model.AWSKMSException;
import com.amazonaws.services.kms.model.DecryptRequest;
import com.amazonaws.services.kms.model.DecryptResult;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.springframework.boot.SpringApplication;
import org.springframework.core.env.MutablePropertySources;
import org.springframework.core.env.StandardEnvironment;
import org.springframework.core.io.DefaultResourceLoader;

import static java.nio.ByteBuffer.wrap;
import static java.nio.charset.Charset.forName;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.Answers.RETURNS_DEEP_STUBS;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.when;

/**
 * Created by elliott on 7/10/17.
 *
 * TODO: fix this at some point
 */
public class PropertiesDecryptorTest  extends AbstractControllerTest {

    @Spy
    StandardEnvironment environment;

    @Mock
    SpringApplication application;

    @Mock(answer = RETURNS_DEEP_STUBS)
    DefaultResourceLoader resourceLoader;

    @Mock(answer = RETURNS_DEEP_STUBS)
    AWSKMS kms;

    @InjectMocks
    PropertiesDecryptor propertiesDecryptor = new PropertiesDecryptor();

    @Override
    public void init(){
    }
    
    @Before
    public void setup() throws Exception {
        when(resourceLoader.getResource(eq("classpath:auth0.properties"))).thenThrow(new Exception());
        when(environment.getPropertySources()).thenReturn(new MutablePropertySources());
    }

    @Ignore
    @Test
    public void decryptSuccess() {
        DecryptResult dr = new DecryptResult()
            .withPlaintext(
                wrap("auth0.domain=cryptyk.auth0.com".getBytes(forName("UTF-8")))
            );

        when(kms.decrypt(any(DecryptRequest.class))).thenReturn(dr);
        doReturn("dev").when(environment).getProperty("app_env");

        propertiesDecryptor.postProcessEnvironment(environment, application);

        assertNotNull(environment.getPropertySources().get("auth0"));
        assertEquals(true, environment.getPropertySources().contains("auth0"));
        assertEquals("cryptyk.auth0.com", environment.getPropertySources().get("auth0").getProperty("auth0.domain"));
    }

    @Ignore
    @Test(expected = Exception.class)
    public void decryptFailure() {
        when(kms.decrypt(any(DecryptRequest.class))).thenThrow(new AWSKMSException("error"));
        doReturn("hmm").when(environment).getProperty("app_env");

        propertiesDecryptor.postProcessEnvironment(environment, application);
    }
}
