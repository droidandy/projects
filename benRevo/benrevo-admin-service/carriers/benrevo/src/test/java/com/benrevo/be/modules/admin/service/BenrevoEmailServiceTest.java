package com.benrevo.be.modules.admin.service;

import static org.assertj.core.api.Assertions.assertThat;

import com.benrevo.admin.service.BenrevoAdminEmailService;
import com.benrevo.be.modules.admin.controller.AdminAbstractControllerTest;
import com.benrevo.common.dto.MailDto;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientTeam;
import java.io.IOException;
import org.junit.Ignore;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

public class BenrevoEmailServiceTest extends AdminAbstractControllerTest {

    @Autowired
    private BenrevoAdminEmailService emailService;

    @Ignore // ApproveEmail not implemented yet for BenrevoEmailService
	@Test
	public void testApproveEmail() throws IOException {
	    Client client = testEntityHelper.createTestClient();
	    assertThat(client.getSalesEmail()).isNotEmpty();
	    assertThat(client.getPresalesEmail()).isNotEmpty();
	    ClientTeam ct = testEntityHelper.createClientTeam(client.getBroker(), client);
	    
	    MailDto mailDto = emailService.prepareApproveMailDto(client.getClientId());
	    assertThat(mailDto.getRecipients()).contains(ct.getEmail());
	    assertThat(mailDto.getRecipients()).doesNotContain(client.getSalesEmail(), client.getPresalesEmail());
	    assertThat(mailDto.getBccRecipients()).isEmpty();
    }

}
