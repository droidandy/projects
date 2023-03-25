package com.benrevo.broker.service.email;

import static org.assertj.core.api.Assertions.assertThat;

import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.common.dto.MailDto;
import com.benrevo.common.dto.RfpSubmissionDto;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Client;
import java.util.ArrayList;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

public class BrokerRfpEmailServiceTest extends AbstractControllerTest {

	@Autowired
	private BrokerRfpEmailService brokerRfpEmailService;

	@Test
	public void setRecipients() throws Exception {
		Broker broker = testEntityHelper.createTestBroker("Recipients test broker");
		broker.setBcc("bcc@domain.com");
		Client client = testEntityHelper.createTestClient("submitRFPs_BBT_Client", broker);
		assertThat(client.getSalesEmail()).isNotEmpty();
		assertThat(client.getPresalesEmail()).isNotEmpty();
		assertThat(broker.getBcc()).isNotEmpty();
		
		RfpSubmissionDto rfpSubmissionDto = new RfpSubmissionDto();
		rfpSubmissionDto.setEmails(new ArrayList<>());
		rfpSubmissionDto.getEmails().add("email_1@domain.com");
		rfpSubmissionDto.getEmails().add("email_1@domain.com"); // duplicate
		rfpSubmissionDto.getEmails().add("email_2@domain.com"); 
		Carrier connectedCarrier = testEntityHelper.createTestCarrier(CarrierType.UHC.name(), CarrierType.UHC.displayName);
		MailDto mailDto = brokerRfpEmailService.setRecipients(
				connectedCarrier, rfpSubmissionDto, broker, client.getClientId());
		// check for Recipients contains only rfpSubmissionDto.Emails, NOT sales/presale
		assertThat(mailDto.getRecipients()).containsExactlyInAnyOrder("email_1@domain.com", "email_2@domain.com");
		assertThat(mailDto.getBccRecipients()).isEmpty();
		assertThat(mailDto.getCcRecipients()).isEmpty();
	}

}
