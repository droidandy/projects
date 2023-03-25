package com.benrevo.be.modules.shared.configuration;

import com.benrevo.common.dto.ClientDto;
import com.benrevo.common.security.AuthenticatedUser;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.PropertySource;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.oxm.jaxb.Jaxb2Marshaller;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;

import static org.springframework.security.web.context.HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY;

@Configuration
@Import(SharedConfiguration.class)
@PropertySource("classpath:application.properties")
public class SharedTestConfiguration {

    @Bean
    public Jaxb2Marshaller getJaxb2Marshaller() {
        Jaxb2Marshaller marshaller = new Jaxb2Marshaller();
        marshaller.setClassesToBeBound(ClientDto.class);

        return marshaller;
    }

    @Bean
    public MockSession getMockSession() {
        return new MockSession();
    }

    public class MockSession extends MockHttpSession {

        public MockSession() {
            super();

            setAttribute(
                SPRING_SECURITY_CONTEXT_KEY,
                new MockSecurityContext(
                    new AuthenticatedUser.Builder()
                        .withAuthenticated(true)
                        .build()
                )
            );
        }
    }

    public static class MockSecurityContext implements SecurityContext {

        private Authentication authentication;

        public MockSecurityContext(Authentication authentication) {
            this.authentication = authentication;
        }

        @Override
        public Authentication getAuthentication() {
            return this.authentication;
        }

        @Override
        public void setAuthentication(Authentication authentication) {
            this.authentication = authentication;
        }
    }
}
