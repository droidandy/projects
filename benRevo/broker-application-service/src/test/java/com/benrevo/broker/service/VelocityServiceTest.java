package com.benrevo.broker.service;

import static org.assertj.core.api.Assertions.assertThat;

import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.common.dto.ClientDto;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientTeam;
import com.benrevo.data.persistence.entities.RFP;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.apache.commons.lang3.StringUtils;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

public class VelocityServiceTest extends AbstractControllerTest {
    @Autowired
    private VelocityService velocityService;

    @Override
    public void init() {}


    @Test
    public void getBrokerRfpSubmission() throws Exception {

        Client client = testEntityHelper.createTestClient();
        ClientDto clientDto = client.toClientDto();

        Map<Carrier, List<RFP>> allRfpsByCarrier = new HashMap<>();
        
        Carrier anthem = testEntityHelper.createTestCarrier(CarrierType.ANTHEM_BLUE_CROSS.name(), CarrierType.ANTHEM_BLUE_CROSS.displayName);
        List<RFP> anthemRFPs = Arrays.asList(new RFP(), new RFP(), new RFP());
        anthemRFPs.get(0).setProduct("MEDICAL");
        anthemRFPs.get(1).setProduct("DENTAL");
        anthemRFPs.get(2).setProduct("VISION");
        allRfpsByCarrier.put(anthem, anthemRFPs);
        
        Carrier aetna = testEntityHelper.createTestCarrier(CarrierType.AETNA.name(), CarrierType.AETNA.displayName);
        List<RFP> aetnaRFPs = Arrays.asList(new RFP(), new RFP());
        aetnaRFPs.get(0).setProduct("MEDICAL");
        aetnaRFPs.get(1).setProduct("DENTAL");
        allRfpsByCarrier.put(aetna, aetnaRFPs);
        
        Carrier cigna = testEntityHelper.createTestCarrier(CarrierType.CIGNA.name(), CarrierType.CIGNA.displayName);
        List<RFP> cignaRFPs = Arrays.asList(new RFP());
        cignaRFPs.get(0).setProduct("VISION");
        allRfpsByCarrier.put(cigna, cignaRFPs);
        
        String brokerageLogo = "https://s3-us-west-2.amazonaws.com/benrevo-prod-global-static/brokerage/mma/mma.png";
        String template = velocityService.getBrokerRfpSubmissionTemplate("/templates/broker-rfp-submission.vm",
            clientDto, "testUserFirstName", allRfpsByCarrier, brokerageLogo);

        assertThat(StringUtils.countMatches(template, client.getClientName())).isEqualTo(1);
        assertThat(StringUtils.countMatches(template, "MEDICAL")).isEqualTo(1);
        assertThat(StringUtils.countMatches(template, "DENTAL")).isEqualTo(1);
        assertThat(StringUtils.countMatches(template, "VISION")).isEqualTo(1);
        assertThat(StringUtils.countMatches(template, "Aetna, Anthem Blue Cross")).isEqualTo(2); // MEDICAL, DENTAL
        assertThat(StringUtils.countMatches(template, "Anthem Blue Cross, Cigna")).isEqualTo(1); // VISION
    }

    @Test
    public void getCarrierRfpSubmission() throws Exception {

        Client client = testEntityHelper.createTestClient();
        ClientTeam ct = testEntityHelper.createClientTeam(client.getBroker(), client);
        ClientDto clientDto = client.toClientDto();

        String template = velocityService.getCarrierRfpSubmissionTemplate("/templates/carrier-rfp-submission.vm",
            clientDto, client.getBroker(),"Medical, Dental, Vision");

        assertThat(StringUtils.countMatches(template, client.getClientName())).isEqualTo(1);
        assertThat(StringUtils.countMatches(template, "Medical")).isEqualTo(1);
        assertThat(StringUtils.countMatches(template, "Dental")).isEqualTo(1);
        assertThat(StringUtils.countMatches(template, "Vision")).isEqualTo(1);
        assertThat(StringUtils.countMatches(template, ct.getName())).isEqualTo(1);
    }

        
}
