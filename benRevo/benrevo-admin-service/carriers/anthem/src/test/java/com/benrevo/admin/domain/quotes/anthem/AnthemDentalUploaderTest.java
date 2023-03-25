package com.benrevo.admin.domain.quotes.anthem;

import com.benrevo.be.modules.admin.controller.AdminAbstractControllerTest;
import com.benrevo.be.modules.admin.domain.quotes.TestValidator;
import com.benrevo.be.modules.admin.domain.quotes.UploaderTestCase;
import com.benrevo.be.modules.admin.domain.quotes.parsers.anthem.AnthemQuoteUploader;
import com.benrevo.common.Constants;
import com.benrevo.common.annotation.AppCarrier;
import com.benrevo.common.enums.QuotePlanAttributeName;
import com.benrevo.data.persistence.entities.QuotePlanAttribute;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpQuoteNetwork;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkPlan;
import com.benrevo.data.persistence.repository.AttributeRepository;

import java.nio.file.Paths;
import java.util.List;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;

import static com.benrevo.common.enums.CarrierType.ANTHEM_BLUE_CROSS;
import static org.assertj.core.api.Assertions.assertThat;
import static org.apache.commons.lang3.StringUtils.containsIgnoreCase;

@AppCarrier(ANTHEM_BLUE_CROSS)
public class AnthemDentalUploaderTest extends AdminAbstractControllerTest {

    private static final Logger logger = LoggerFactory.getLogger(AnthemDentalUploaderTest.class);
    private final Long BROKERAGE_ID = 1L;
    private final Long CARRIER_ANTHEM_ID = 3L;

    private String currDir;

    @Autowired
    @Lazy
    private AnthemQuoteUploader loader;

    @Autowired
    private TestValidator validator;
    
    @Autowired
    private AttributeRepository attributeRepository;

    @Before
    public void setup() {
        logger.info("setup()");
        currDir = Paths.get("").toAbsolutePath().toString();

        validator.setBrokerId(BROKERAGE_ID);
        validator.setCarrierId(CARRIER_ANTHEM_ID);
        validator.setLoader(loader);
    }

    @Test
    public void testAnthem() throws Exception {

        UploaderTestCase testCase = new UploaderTestCase();
        testCase.setCategory(Constants.DENTAL);
        testCase.setQuoteFilename(currDir + "/data/quotes/Anthem/Dental/Pacific Shores Medical Group, Inc_P_01-18_12Mon_DentalNet.xls");
        RfpQuote quote = validator.uploadAndGetQuote(testCase);

        assertThat(quote.getRfpQuoteNetworks()).hasSize(1);
        
        RfpQuoteNetwork dhmo = quote.getRfpQuoteNetworks().get(0);

        assertThat(dhmo.getRfpQuoteOptionName()).isEqualTo("DHMO Network");
        assertThat(dhmo.getRfpQuoteNetworkPlans()).hasSize(6);
        
        for (RfpQuoteNetworkPlan plan : dhmo.getRfpQuoteNetworkPlans()) {
            if (containsIgnoreCase(plan.getPnn().getName(),"voluntary")) {
                assertThat(plan.isVoluntary()).isTrue();
            } else {
                assertThat(plan.isVoluntary()).isFalse();
            }    
            List<QuotePlanAttribute> attrs = attributeRepository.findQuotePlanAttributeByRqnpId(plan.getRfpQuoteNetworkPlanId());
            assertThat(attrs).hasSize(1);
            QuotePlanAttribute attr = attrs.get(0);
            assertThat(attr.getName()).isEqualTo(QuotePlanAttributeName.CONTRACT_LENGTH);
            assertThat(attr.getValue()).isEqualTo("12 MONTH");
            
        };
        	
    }
    
}
