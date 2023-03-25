package com.benrevo.be.modules.admin.controller;


import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import java.util.List;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import com.benrevo.be.modules.admin.util.helper.QuoteHelper;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.QuoteNetworkDto;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.QuotePlanAttributeName;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientPlan;
import com.benrevo.data.persistence.entities.QuotePlanAttribute;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpQuoteNetwork;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkPlan;
import com.benrevo.data.persistence.entities.RfpQuoteOption;
import com.benrevo.data.persistence.entities.RfpQuoteOptionNetwork;
import com.benrevo.data.persistence.entities.Rider;
import com.benrevo.data.persistence.repository.AttributeRepository;
import com.benrevo.data.persistence.repository.RfpQuoteOptionRepository;
import com.benrevo.data.persistence.repository.RfpQuoteRepository;
import com.benrevo.data.persistence.repository.RiderRepository;
import com.google.common.collect.Sets;


public class AdminRFPQuoteControllerTest extends AdminAbstractControllerTest {
    
    @Autowired
    private AttributeRepository attributeRepository;
    
    @Autowired
    private RiderRepository riderRepository;
    
    @Autowired
    private QuoteHelper quoteHelper;
    
    @Autowired
    private RfpQuoteRepository rfpQuoteRepository;
    
    @Autowired
    private RfpQuoteOptionRepository rfpQuoteOptionRepository;

    @Test
    public void getQuoteNetworks() throws Exception {

        RfpQuote quote = testEntityHelper.createTestRfpQuote();

        RfpQuoteNetwork hmoNetwork = testEntityHelper.createTestQuoteNetwork(quote, "HMO option", "HMO");
        RfpQuoteNetwork ppoNetwork = testEntityHelper.createTestQuoteNetwork(quote, "PPO option", "PPO");

        flushAndClear();

        MvcResult result = performGetAndAssertResult(null, "/admin/quoteNetworks?rfpQuoteId={rfpQuoteId}", quote.getRfpQuoteId());

        QuoteNetworkDto[] rfpQuoteDtoList = jsonUtils.fromJson(result.getResponse().getContentAsString(), QuoteNetworkDto[].class);

        assertThat(rfpQuoteDtoList).hasSize(2);

    }

    @Test
    public void deleteRfpQuoteByClientIdAndProduct() throws Exception {

        Client client = testEntityHelper.createTestClient();

        token = createToken(client.getBroker().getBrokerToken());
        
        ClientPlan clientPlan1 = testEntityHelper.createTestClientPlan("hmo client plan", client, "BLUE_SHIELD", "HMO");
        
        Rider rider = testEntityHelper.createTestRider("test rider code", 1F, 1F, 1F, 1F);
        
        RfpQuote rfpQuote = testEntityHelper.createTestRfpQuote(client, CarrierType.OTHER.name(), Constants.MEDICAL);
        rfpQuote.setS3Key("s3TestKey");
        
        RfpQuoteNetwork rqn1 = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HMO option", "HMO");
        rqn1.setRiders(Sets.newHashSet(rider));
        
        RfpQuoteNetwork rqn2 = testEntityHelper.createTestQuoteNetwork(rfpQuote, "PPO option", "PPO");
        
        RfpQuoteNetworkPlan rqnp = testEntityHelper.createTestRfpQuoteNetworkPlan("test quote plan", rqn1, 1F, 1F, 1F, 1F);
        QuotePlanAttribute attribute = attributeRepository.save(
                new QuotePlanAttribute(rqnp, QuotePlanAttributeName.CONTRACT_LENGTH, "Test"));

        RfpQuoteOption rqo = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "optionName");
        
        RfpQuoteOptionNetwork rqon = testEntityHelper.createTestRfpQuoteOptionNetwork(rqo, rqn1, rqnp, clientPlan1, 
                10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);

        flushAndClear();

        mockMvc.perform(MockMvcRequestBuilders.delete("/admin/quotes/delete/{id}/{category}", client.getClientId(), Constants.MEDICAL)
                .header("Authorization", "Bearer " + token)
                .header("Content-Type", "application/json")
                .accept(MediaType.parseMediaType("application/json;charset=UTF-8")))
                .andExpect(status().isOk())
                .andReturn();

        flushAndClear();
        
        ArgumentCaptor<String> s3KeyCaptor = ArgumentCaptor.forClass(String.class);
        Mockito.verify(s3FileManager, Mockito.times(1)).delete(s3KeyCaptor.capture(), Mockito.anyObject());
        
        assertThat(s3KeyCaptor.getValue()).isEqualTo(rfpQuote.getS3Key());
        
        assertThat(riderRepository.findOne(rider.getRiderId())).isNull();
        assertThat(attributeRepository.findOne(attribute.getAttributeId())).isNull();

        List<RfpQuote> rfpQuotes = rfpQuoteRepository.findByClientIdAndCategory(client.getClientId(), Constants.MEDICAL);
        assertThat(rfpQuotes).hasSize(0);
        
        List<RfpQuoteOption> options = rfpQuoteOptionRepository.findByClientId(client.getClientId());
        assertThat(options).hasSize(0);

    }


    @Test
    public void deleteRfpQuoteWithoutOption1() throws Exception {

        Client client = testEntityHelper.createTestClient();

        token = createToken(client.getBroker().getBrokerToken());
        
        ClientPlan clientPlan1 = testEntityHelper.createTestClientPlan("hmo client plan", client, "BLUE_SHIELD", "HMO");
        
        RfpQuote rfpQuote = testEntityHelper.createTestRfpQuote(client, CarrierType.OTHER.name(), Constants.MEDICAL);
        RfpQuoteNetwork rqn = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HMO");
        RfpQuoteNetworkPlan rqnp = testEntityHelper.createTestRfpQuoteNetworkPlan("test quote plan", rqn, 1F, 1F, 1F, 1F);

        flushAndClear();

        mockMvc.perform(MockMvcRequestBuilders.delete("/admin/quotes/delete/{id}/{category}", client.getClientId(), Constants.MEDICAL)
                .header("Authorization", "Bearer " + token)
                .header("Content-Type", "application/json")
                .accept(MediaType.parseMediaType("application/json;charset=UTF-8")))
                .andExpect(status().isOk())
                .andReturn();

        flushAndClear();
        
        List<RfpQuote> rfpQuotes = rfpQuoteRepository.findByClientIdAndCategory(client.getClientId(), Constants.MEDICAL);
        assertThat(rfpQuotes).hasSize(0);
        
        List<RfpQuoteOption> options = rfpQuoteOptionRepository.findByClientId(client.getClientId());
        assertThat(options).hasSize(0);

    }

    
    @Test
    public void deleteRfpQuoteWithSeveralOptions() throws Exception {

        Client client = testEntityHelper.createTestClient();

        token = createToken(client.getBroker().getBrokerToken());
        
        ClientPlan clientPlan1 = testEntityHelper.createTestClientPlan("hmo client plan", client, "BLUE_SHIELD", "HMO");
        
        RfpQuote rfpQuote = testEntityHelper.createTestRfpQuote(client, CarrierType.OTHER.name(), Constants.MEDICAL);
        RfpQuoteNetwork rqn = testEntityHelper.createTestQuoteNetwork(rfpQuote, "HMO");
        RfpQuoteNetworkPlan rqnp = testEntityHelper.createTestRfpQuoteNetworkPlan("test quote plan", rqn, 1F, 1F, 1F, 1F);

        RfpQuoteOption rqo1 = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "Option 1");
        RfpQuoteOptionNetwork rqon1 = testEntityHelper.createTestRfpQuoteOptionNetwork(rqo1, rqn, rqnp, clientPlan1, 
                10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);

        RfpQuoteOption rqo2 = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "Option 2");
        RfpQuoteOptionNetwork rqon2 = testEntityHelper.createTestRfpQuoteOptionNetwork(rqo2, rqn, rqnp, clientPlan1, 
                10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);

        RfpQuoteOption rqo3 = testEntityHelper.createTestRfpQuoteOption(rfpQuote, "Option 3");
        RfpQuoteOptionNetwork rqon3 = testEntityHelper.createTestRfpQuoteOptionNetwork(rqo3, rqn, rqnp, clientPlan1, 
                10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);

        flushAndClear();

        mockMvc.perform(MockMvcRequestBuilders.delete("/admin/quotes/delete/{id}/{category}", client.getClientId(), Constants.MEDICAL)
                .header("Authorization", "Bearer " + token)
                .header("Content-Type", "application/json")
                .accept(MediaType.parseMediaType("application/json;charset=UTF-8")))
                .andExpect(status().isOk())
                .andReturn();

        flushAndClear();
        
        List<RfpQuote> rfpQuotes = rfpQuoteRepository.findByClientIdAndCategory(client.getClientId(), Constants.MEDICAL);
        assertThat(rfpQuotes).hasSize(0);
        
        List<RfpQuoteOption> options = rfpQuoteOptionRepository.findByClientId(client.getClientId());
        assertThat(options).hasSize(0);

    }

    
    @Test
    public void deleteUpdatedRfpQuote() throws Exception {

        Client client = testEntityHelper.createTestClient();

        token = createToken(client.getBroker().getBrokerToken());
        
        ClientPlan clientPlan1 = testEntityHelper.createTestClientPlan("hmo client plan", client, "BLUE_SHIELD", "HMO");
        
        RfpQuote rfpQuoteOld = testEntityHelper.createTestRfpQuote(client, CarrierType.CIGNA.name(), Constants.MEDICAL);
        
        RfpQuoteNetwork rqnOld = testEntityHelper.createTestQuoteNetwork(rfpQuoteOld, "HMO");
        
        RfpQuoteNetworkPlan rqnpOld = testEntityHelper.createTestRfpQuoteNetworkPlan("test quote plan", rqnOld, 1F, 1F, 1F, 1F);
        
        RfpQuote rfpQuoteNew = testEntityHelper.createTestRfpQuote(client, CarrierType.CIGNA.name(), Constants.MEDICAL);
        
        rfpQuoteNew.setLatest(false);
        RfpQuoteNetwork rqnNew = testEntityHelper.createTestQuoteNetwork(rfpQuoteNew, "HMO");
        
        RfpQuoteNetworkPlan rqnpNew = testEntityHelper.createTestRfpQuoteNetworkPlan("test quote plan", rqnNew, 1F, 1F, 1F, 1F);
        
        RfpQuoteOption rqo1 = testEntityHelper.createTestRfpQuoteOption(rfpQuoteOld, "Option 1");
        rqo1.setFinalSelection(false);
        RfpQuoteOptionNetwork rqon1 = testEntityHelper.createTestRfpQuoteOptionNetwork(rqo1, rqnOld, rqnpOld, clientPlan1, 
                10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);

        RfpQuoteOption rqo2 = testEntityHelper.createTestRfpQuoteOption(rfpQuoteOld, "Option 2");
        
        RfpQuoteOptionNetwork rqon2 = testEntityHelper.createTestRfpQuoteOptionNetwork(rqo2, rqnOld, rqnpOld, clientPlan1, 
                10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);
        
        RfpQuoteOption rqo3 = testEntityHelper.createTestRfpQuoteOption(rfpQuoteOld, "Option 3");
        rqo3.setFinalSelection(false);
        
        RfpQuoteOptionNetwork rqon3 = testEntityHelper.createTestRfpQuoteOptionNetwork(rqo3, rqnOld, rqnpOld, clientPlan1, 
                10L, 15L, 20L, 25L, "PERCENT", 90f, 90f, 90f, 90f);
        
        flushAndClear();
        
        rfpQuoteOld = rfpQuoteRepository.findOne(rfpQuoteOld.getRfpQuoteId());
        rfpQuoteNew = rfpQuoteRepository.findOne(rfpQuoteNew.getRfpQuoteId());
        
        quoteHelper.updateQuote(rfpQuoteOld, rfpQuoteNew, null, true);
        
        rfpQuoteNew.setLatest(true);

        List<RfpQuoteOption> options = rfpQuoteOptionRepository.findByClientId(client.getClientId());
        assertThat(options).hasSize(3);

        mockMvc.perform(MockMvcRequestBuilders.delete("/admin/quotes/delete/{id}/{category}", client.getClientId(), Constants.MEDICAL)
                .header("Authorization", "Bearer " + token)
                .header("Content-Type", "application/json")
                .accept(MediaType.parseMediaType("application/json;charset=UTF-8")))
                .andExpect(status().isOk())
                .andReturn();

        flushAndClear();
        
        List<RfpQuote> rfpQuotes = rfpQuoteRepository.findByClientIdAndCategory(client.getClientId(), Constants.MEDICAL);
        assertThat(rfpQuotes).hasSize(0);

        options = rfpQuoteOptionRepository.findByClientId(client.getClientId());
        assertThat(options).hasSize(0);
    }
    
    @Test
    public void deleteRfpQuoteWithQuoteType() throws Exception {

        Client client = testEntityHelper.createTestClient();

        token = createToken(client.getBroker().getBrokerToken());
        
        ClientPlan clientPlan1 = testEntityHelper.createTestClientPlan("hmo client plan", client, "BLUE_SHIELD", "HMO");
        
        RfpQuote rfpQuoteStandard = testEntityHelper.createTestRfpQuote(client, CarrierType.OTHER.name(), Constants.DENTAL, QuoteType.STANDARD);
        RfpQuoteNetwork rqnStandard = testEntityHelper.createTestQuoteNetwork(rfpQuoteStandard, "HMO");
        RfpQuoteNetworkPlan rqnpStandard = testEntityHelper.createTestRfpQuoteNetworkPlan("test quote plan", rqnStandard, 1F, 1F, 1F, 1F);

        RfpQuote rfpQuoteKaiser = testEntityHelper.createTestRfpQuote(client, CarrierType.KAISER.name(), Constants.DENTAL, QuoteType.KAISER);
        RfpQuoteNetwork rqnKaiser = testEntityHelper.createTestQuoteNetwork(rfpQuoteKaiser, "HMO");
        RfpQuoteNetworkPlan rqnpKaiser = testEntityHelper.createTestRfpQuoteNetworkPlan("test quote plan", rqnKaiser, 1F, 1F, 1F, 1F);
        
        List<RfpQuote> rfpQuotes = rfpQuoteRepository.findByClientIdAndCategory(client.getClientId(), Constants.DENTAL);
        assertThat(rfpQuotes).hasSize(2);
        assertThat(rfpQuotes).extracting("quoteType").containsExactlyInAnyOrder(QuoteType.STANDARD, QuoteType.KAISER);
        
        flushAndClear();
        
        mockMvc.perform(MockMvcRequestBuilders.delete("/admin/quotes/delete/{id}/{category}", client.getClientId(), Constants.DENTAL)
                .header("Authorization", "Bearer " + token)
                .header("Content-Type", "application/json")
                .param("quoteType", QuoteType.KAISER.name())
                .accept(MediaType.parseMediaType("application/json;charset=UTF-8")))
                .andExpect(status().isOk())
                .andReturn();

        flushAndClear();
        
        rfpQuotes = rfpQuoteRepository.findByClientIdAndCategory(client.getClientId(), Constants.DENTAL);
        assertThat(rfpQuotes).hasSize(1);
        assertThat(rfpQuotes.get(0).getQuoteType()).isEqualTo(QuoteType.STANDARD);
        
    }

}
