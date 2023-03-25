package com.benrevo.be.modules.admin.service;

import com.benrevo.be.modules.admin.controller.AdminAbstractControllerTest;
import com.benrevo.be.modules.shared.test.TestEntityHelper;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.MailDto;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientAttribute;
import com.benrevo.data.persistence.entities.ClientTeam;
import com.benrevo.data.persistence.repository.AttributeRepository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.io.IOException;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import static com.benrevo.common.enums.AttributeName.DIRECT_TO_PRESENTATION;
import static com.benrevo.common.enums.ClientState.QUOTED;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class AnthemEmailServiceTest extends AdminAbstractControllerTest {

    @Autowired
    private BaseAdminEmailService emailService;
    
    @Autowired
    protected TestEntityHelper testEntityHelper;
    
    @Autowired
    protected AttributeRepository attributeRepository;  
    
    @PersistenceContext
    private EntityManager entityManager;

    protected void flushAndClear() {
        entityManager.flush();
        entityManager.clear();
    }

    @Before
    public void setUp(){
        Authentication authentication = mock(Authentication.class);
        // Mockito.whens() for your authorization object
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getDetails()).thenReturn(1L);
        SecurityContextHolder.setContext(securityContext);
    }

    
	@Test
	public void testApproveEmail() throws IOException {
	    
	    Client client = testEntityHelper.createTestClient();
	    ClientTeam ct = testEntityHelper.createClientTeam(client.getBroker(), client);
	    MailDto mailDto = emailService.prepareApproveMailDto(client.getClientId());
	    
	    Assert.assertTrue(mailDto.getSubject().contains(client.getClientName()));
	    Assert.assertTrue(mailDto.getBccRecipients().contains(client.getPresalesEmail()));
        Assert.assertTrue(mailDto.getContent().toLowerCase().contains("anthem"));
    }
	
	@Test
    public void testQuoteReadyEmail() throws Exception {
        Client client = testEntityHelper.createTestClient();
        client.getBroker().setBcc("testBcc@benrevo.com");
        Carrier carrier = testEntityHelper.createTestCarrier(Constants.ANTHEM_CARRIER, Constants.ANTHEM_CARRIER);
        ClientTeam clientTeam = testEntityHelper.createClientTeam(client.getBroker(),client);
        
        MailDto mailDto = emailService.prepareQuoteReadyNotificationMailDto(client.getClientId(), Constants.ANTHEM_CARRIER, null);

        assertThat(mailDto.getBccRecipients()).isEmpty();
        assertThat(mailDto.getCcRecipients()).isNotNull();
        assertThat(mailDto.getContent()).contains("proposal(s) for the below employer group are now available");
        assertThat(mailDto.getContent()).contains(client.getClientName());
        assertThat(mailDto.getRecipients()).contains(clientTeam.getEmail());

    }

    @Test
    public void testSendToBrokerDirectToPresentation() {
        Client client = testEntityHelper.createTestClient();
        client.getBroker().setBcc("testBcc@benrevo.com");
        ClientAttribute attr = testEntityHelper.createTestClientAttribute(client, DIRECT_TO_PRESENTATION);
        Carrier carrier = testEntityHelper.createTestCarrier(Constants.ANTHEM_CARRIER, Constants.ANTHEM_CARRIER);
        ClientTeam clientTeam = testEntityHelper.createClientTeam(client.getBroker(), client);

        attributeRepository.save(attr);
        flushAndClear();

        MailDto mailDto = emailService.prepareQuoteReadyNotificationMailDto(client.getClientId(), carrier.getName(), null);

        assertThat(mailDto.getContent()).contains("Your quote for " + client.getClientName() + " is ready for review!");
    }

    @Test
    public void testWelcomeEmail() throws Exception {
        MailDto mailDto = emailService.prepareWelcomeMailDto("salesFirstName salesLastName","email@benrevo.com", "agent_name", "ga_name");

        assertThat(mailDto.getRecipient()).contains("email@benrevo.com");
        assertThat(mailDto.getSubject()).contains("Introducing our new online platform");
        assertThat(mailDto.getContent()).contains("salesFirstName salesLastName");
        assertThat(mailDto.getContent()).contains("ga_name");
    }
	
}
