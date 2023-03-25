package com.benrevo.broker.service;

import static com.benrevo.be.modules.presentation.service.RfpQuoteService.RENEWAL_OPTION_NAME;
import static org.assertj.core.api.Assertions.assertThat;

import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.broker.service.email.BrokerRfpEmailService;
import com.benrevo.common.dto.MailDto;
import com.benrevo.common.dto.RfpSubmissionDto;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.OptionType;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpQuoteOption;
import com.benrevo.data.persistence.entities.RfpSubmission;
import com.benrevo.data.persistence.repository.RfpQuoteOptionRepository;
import java.util.ArrayList;
import java.util.List;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

public class BrokerRfpQuoteServiceTest extends AbstractControllerTest {

	@Autowired
	private BrokerRfpQuoteService brokerRfpQuoteService;

    @Autowired
    private RfpQuoteOptionRepository rfpQuoteOptionRepository;

	@Test
	public void testQuoteOptionNumber() throws Exception {
        Broker broker = testEntityHelper.createTestBroker("Broker-app test broker");
        Client client = testEntityHelper.createTestClient("Broker-app test client", broker);

        RfpSubmission rfpSubmission = testEntityHelper.createTestRfpSubmission(client);
        String category = rfpSubmission.getRfpCarrier().getCategory();
        RfpQuote rfpQuote = testEntityHelper.createTestRfpQuote(rfpSubmission, QuoteType.STANDARD);
        List<RfpQuoteOption> renewalOptions = brokerRfpQuoteService.findAllCarrierQuoteOptions(client.getClientId(), category);
        int lastOptionNumber = brokerRfpQuoteService.findLastOptionNumber(renewalOptions, OptionType.OPTION);
        assertThat(brokerRfpQuoteService.getQuoteOptionName(renewalOptions.size(), lastOptionNumber)).isEqualTo(RENEWAL_OPTION_NAME );

        // create new option
        RfpQuoteOption rfpQuoteOption = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "Renewal");

        renewalOptions = brokerRfpQuoteService.findAllCarrierQuoteOptions(client.getClientId(), category);
        lastOptionNumber = brokerRfpQuoteService.findLastOptionNumber(renewalOptions, brokerRfpQuoteService.getOptionType(rfpQuoteOption.getName()));
        assertThat(brokerRfpQuoteService.getQuoteOptionName(renewalOptions.size(), lastOptionNumber)).isEqualTo(RENEWAL_OPTION_NAME + " 2");

	}

}
