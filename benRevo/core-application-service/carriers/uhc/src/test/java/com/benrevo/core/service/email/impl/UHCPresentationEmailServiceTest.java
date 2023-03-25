package com.benrevo.core.service.email.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Matchers.anyObject;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.benrevo.be.modules.presentation.email.PresentationEmailService;
import com.benrevo.be.modules.presentation.service.PresentationVelocityService;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.common.dto.MailDto;
import com.benrevo.common.enums.AttributeName;
import com.benrevo.common.enums.PersonType;
import com.benrevo.common.security.AuthenticatedUser;
import com.benrevo.common.util.DateHelper;
import com.benrevo.core.UHCCoreServiceApplication;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.Person;
import org.junit.After;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;


@SpringBootTest(classes = UHCCoreServiceApplication.class)
public class UHCPresentationEmailServiceTest  extends AbstractControllerTest {

    @Override
    public void init() throws Exception {
    }

    @Autowired
    private PresentationEmailService emailService;

    @MockBean
    private PresentationVelocityService velocityService;

    @After
    public void cleanUp() {
        SecurityContextHolder.clearContext();
    }

    @Test
    public void sendNewSaleNotification_BrokerSalesRenewal() throws Exception {    
        Client client = testEntityHelper.createTestClient();
 
        Broker broker = client.getBroker();
        Person presales = broker.getPresales().get(0);
        Person sales = broker.getSales().get(0);
        Person salesRenewal = testEntityHelper.createTestPerson(PersonType.SALES_RENEWAL, 
                "ren salesFirstName", "ren salesLastName", "testSalesRenewal@benrevo.com", appCarrier[0]);
        broker.addPerson(salesRenewal, PersonType.SALES_RENEWAL);
        
        assertThat(broker.getPersons()).extracting(bpr -> bpr.getPerson().getType())
            .containsExactlyInAnyOrder(PersonType.SALES, PersonType.PRESALES, PersonType.SALES_RENEWAL);

        when(velocityService.getNewSaleNotificationTemplate(anyString(), anyObject(), anyObject(), anyObject(), anyObject()))
            .thenReturn("");
        
        AuthenticatedUser authentication = new AuthenticatedUser.Builder()
            .withBrokerageId(1L).build();

        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);

        // 1: new business client, email should send to SALES person
        emailService.sendNewSaleNotification(client.getClientId());

        ArgumentCaptor<MailDto> mailCaptor = ArgumentCaptor.forClass(MailDto.class);
        Mockito.verify(smtpMailer, Mockito.times(1)).send(mailCaptor.capture());
        MailDto mailDto = mailCaptor.getValue();

        assertThat(mailDto.getRecipients()).containsExactly(presales.getEmail(), sales.getEmail());
        assertThat(mailDto.getSubject()).isEqualTo("Case Name: testClientName, Eff Date: " 
                + DateHelper.fromDateToString(client.getEffectiveDate()));
        
        Mockito.reset(smtpMailer);
        
        // 2: renewal client, email should send to SALES_RENEWAL person
        
        client.getAttributes().add(testEntityHelper.createTestClientAttribute(client, AttributeName.RENEWAL));
        
        emailService.sendNewSaleNotification(client.getClientId());
        
        Mockito.verify(smtpMailer, Mockito.times(1)).send(mailCaptor.capture());
        mailDto = mailCaptor.getValue();
        
        // check for RENEWAL sales email
        assertThat(mailDto.getRecipients()).containsExactly(presales.getEmail(), salesRenewal.getEmail());
    }
}
