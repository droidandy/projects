package com.benrevo.dashboard;

import com.amazonaws.services.kms.AWSKMS;
import com.amazonaws.services.kms.model.AWSKMSException;
import com.amazonaws.services.kms.model.DecryptRequest;
import com.amazonaws.services.kms.model.DecryptResult;
import com.benrevo.dashboard.PropertiesDecryptor;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.env.MutablePropertySources;
import org.springframework.core.env.StandardEnvironment;
import org.springframework.test.context.junit4.SpringRunner;

import static java.nio.ByteBuffer.wrap;
import static java.nio.charset.Charset.forName;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.Answers.RETURNS_DEEP_STUBS;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.when;

/**
 * Created by elliott on 7/10/17.
 */
@RunWith(SpringRunner.class)
@SpringBootTest
public class PropertiesDecryptorTest {

    @Spy
    StandardEnvironment environment;

    @Mock
    SpringApplication application;

    @Mock(answer = RETURNS_DEEP_STUBS)
    AWSKMS kms;

    @InjectMocks
    PropertiesDecryptor propertiesDecryptor = new PropertiesDecryptor();

    @Before
    public void setup() {
        when(environment.getPropertySources()).thenReturn(new MutablePropertySources());
    }

    @Test
    @Ignore
    public void decryptSuccess() {
        DecryptResult dr = new DecryptResult()
            .withPlaintext(
                wrap("auth0.domain=test".getBytes(forName("UTF-8")))
            );

        when(kms.decrypt(any(DecryptRequest.class))).thenReturn(dr);
        doReturn("dev").when(environment).getProperty("app_env");

        propertiesDecryptor.postProcessEnvironment(environment, application);

        assertNotNull(environment.getPropertySources().get("auth0"));
        assertEquals(true, environment.getPropertySources().contains("auth0"));
        assertEquals("test", environment.getPropertySources().get("auth0").getProperty("auth0.domain"));
    }

    @Test(expected = RuntimeException.class)
    @Ignore
    public void decryptFailure() {
        when(kms.decrypt(any(DecryptRequest.class))).thenThrow(new AWSKMSException("error"));
        doReturn("hmm").when(environment).getProperty("app_env");

        propertiesDecryptor.postProcessEnvironment(environment, application);
    }
}
