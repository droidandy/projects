package com.benrevo.core.service;

import static org.assertj.core.api.Assertions.assertThat;

import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import java.util.UUID;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

public class VelocityServiceTest extends AbstractControllerTest {
    
    @Autowired
    private VelocityService velocityService;
    
    @Value("${app.carrier}")
    String[] appCarrier;
    
    @Override
    public void init() {
    }

    @Test
    public void getVerificationEmailTemplate() {
        String verificationCode = UUID.randomUUID().toString();
        String template = velocityService.getVerificationEmailTemplate("/templates/anthem/email/verification-email.html", "agentZero", verificationCode);
        assertThat(template).contains(verificationCode);
    }
    
}
