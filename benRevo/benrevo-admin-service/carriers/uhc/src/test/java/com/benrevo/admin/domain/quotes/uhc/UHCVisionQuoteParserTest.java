package com.benrevo.admin.domain.quotes.uhc;

import static org.assertj.core.api.Assertions.assertThat;

import com.benrevo.be.modules.admin.controller.AdminAbstractControllerTest;
import com.benrevo.be.modules.admin.domain.quotes.parsers.uhc.UHCNetworkDetails;
import com.benrevo.be.modules.admin.domain.quotes.parsers.uhc.UHCVisionQuoteParser;
import com.benrevo.common.enums.QuotePlanAttributeName;
import com.benrevo.data.persistence.entities.QuotePlanAttribute;
import com.benrevo.data.persistence.repository.BenefitNameRepository;

import java.io.FileInputStream;
import java.nio.file.Paths;
import java.util.ArrayList;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;

public class UHCVisionQuoteParserTest extends AdminAbstractControllerTest {
	
    @Autowired
    private BenefitNameRepository benefitNameRepository;
    
    @Test
    public void testAttributeParsingInVisionQuote() throws Exception {
        UHCVisionQuoteParser parser = new UHCVisionQuoteParser();
        String quoteFile = Paths.get("").toAbsolutePath().toString()
                + "/data/quotes/UHC/Vision/V_DualOption.xlsm";
        ArrayList<UHCNetworkDetails> networks = parser.parseVisionQuotes(new FileInputStream(quoteFile),benefitNameRepository.findAll());
        
        assertThat(networks).hasSize(2);
        
        UHCNetworkDetails network1 = networks.get(0);
        assertThat(network1.getNetworkName()).isEqualTo("Full Network");
        assertThat(network1.isVoluntary()).isFalse();
        assertThat(network1.getAttributes()).hasSize(1);
        QuotePlanAttribute attr1 = network1.getAttributes().get(0);
        assertThat(attr1.getName()).isEqualTo(QuotePlanAttributeName.CONTRACT_LENGTH);
        assertThat(attr1.getValue()).isEqualTo("36 Months");
        
        UHCNetworkDetails network2 = networks.get(1);
        assertThat(network2.getNetworkName()).isEqualTo("Full Network");
        assertThat(network2.isVoluntary()).isTrue();
        assertThat(network2.getAttributes()).hasSize(1);
        QuotePlanAttribute attr2 = network2.getAttributes().get(0);
        assertThat(attr2.getName()).isEqualTo(QuotePlanAttributeName.CONTRACT_LENGTH);
        assertThat(attr2.getValue()).isEqualTo("24 Months");
        
    }



}
