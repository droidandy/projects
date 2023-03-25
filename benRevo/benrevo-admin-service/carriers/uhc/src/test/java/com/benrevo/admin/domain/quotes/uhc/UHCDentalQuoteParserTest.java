package com.benrevo.admin.domain.quotes.uhc;

import com.benrevo.be.modules.admin.controller.AdminAbstractControllerTest;
import com.benrevo.be.modules.admin.domain.quotes.parsers.uhc.UHCDentalQuoteParser;
import com.benrevo.be.modules.admin.domain.quotes.parsers.uhc.UHCNetworkDetails;
import com.benrevo.common.enums.QuotePlanAttributeName;
import com.benrevo.data.persistence.entities.QuotePlanAttribute;
import com.benrevo.data.persistence.repository.BenefitNameRepository;
import static org.assertj.core.api.Assertions.assertThat;
import java.io.FileInputStream;
import java.nio.file.Paths;
import java.util.ArrayList;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

public class UHCDentalQuoteParserTest extends AdminAbstractControllerTest {
	
    @Autowired
    private BenefitNameRepository benefitNameRepository;

    @Test
    public void testAttributeParsing() throws Exception {
        UHCDentalQuoteParser parser = new UHCDentalQuoteParser();
        String quoteFile = Paths.get("").toAbsolutePath().toString()
                + "/data/quotes/UHC/Dental/D_TrippleOption-DPPO-DPPO-DHMO-AlternativeDHMO.xlsm";
        ArrayList<UHCNetworkDetails> networks = parser.parseQuotes(new FileInputStream(quoteFile),benefitNameRepository.findAll());
        
        assertThat(networks).hasSize(3);
        
        UHCNetworkDetails network1 = networks.get(0);
        assertThat(network1.getNetworkName()).contains("PPO");
        assertThat(network1.getAttributes()).hasSize(1);
        assertThat(network1.isVoluntary()).isTrue();
        QuotePlanAttribute attr1 = network1.getAttributes().get(0);
        assertThat(attr1.getName()).isEqualTo(QuotePlanAttributeName.CONTRACT_LENGTH);
        assertThat(attr1.getValue()).isEqualTo("10 Months");
        
        UHCNetworkDetails network2 = networks.get(1);
        assertThat(network2.getNetworkName()).contains("PPO");
        assertThat(network2.isVoluntary()).isFalse();
        assertThat(network2.getAttributes()).hasSize(1);
        QuotePlanAttribute attr2 = network2.getAttributes().get(0);
        assertThat(attr2.getName()).isEqualTo(QuotePlanAttributeName.CONTRACT_LENGTH);
        assertThat(attr2.getValue()).isEqualTo("11 Months");
        
        UHCNetworkDetails network3 = networks.get(2);
        assertThat(network3.getNetworkName()).isEqualTo("Full Network");
        assertThat(network3.isVoluntary()).isTrue();
        assertThat(network3.getAttributes()).hasSize(1);
        QuotePlanAttribute attr3 = network3.getAttributes().get(0);
        assertThat(attr3.getName()).isEqualTo(QuotePlanAttributeName.CONTRACT_LENGTH);
        assertThat(attr3.getValue()).isEqualTo("12 Months");
        
        assertThat(network3.getAlternatives()).hasSize(1);
        UHCNetworkDetails alternative = network3.getAlternatives().get(0);
        assertThat(alternative.getNetworkName()).isEqualTo("Full Network");
        assertThat(alternative.isVoluntary()).isFalse();
        assertThat(alternative.getAttributes()).hasSize(1);
        QuotePlanAttribute attr4 = alternative.getAttributes().get(0);
        assertThat(attr4.getName()).isEqualTo(QuotePlanAttributeName.CONTRACT_LENGTH);
        assertThat(attr4.getValue()).isEqualTo("13 Months");
        
    }
}
