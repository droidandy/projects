package com.benrevo.be.modules.presentation.service;

import static org.assertj.core.api.Assertions.assertThat;

import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.ClientDto;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.QuotePlanAttributeName;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpQuoteNetwork;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkPlan;
import com.benrevo.data.persistence.entities.RfpQuoteOption;
import com.benrevo.data.persistence.entities.RfpQuoteOptionNetwork;
import com.benrevo.data.persistence.entities.Rider;
import com.benrevo.data.persistence.mapper.ClientMapper;
import com.benrevo.data.persistence.repository.RfpQuoteOptionNetworkRepository;
import com.benrevo.data.persistence.repository.RfpQuoteOptionRepository;
import com.google.common.collect.Sets;
import java.util.Arrays;
import org.apache.commons.lang3.StringUtils;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import uk.co.jemos.podam.api.AbstractClassInfoStrategy;
import uk.co.jemos.podam.api.PodamFactory;
import uk.co.jemos.podam.api.PodamFactoryImpl;

public class PresentationVelocityServiceTest extends AbstractControllerTest {

    @Autowired
    private PresentationVelocityService velocityService;
    
    @Autowired
    private RfpQuoteOptionNetworkRepository rfpQuoteOptionNetworkRepository;
    
    @Autowired
    private RfpQuoteOptionRepository rfpQuoteOptionRepository;
    
    private PodamFactory podamFactory = new PodamFactoryImpl();
    private Client testClient;
    private ClientDto testClientDto;
    private Broker testBroker;

    @Override
    public void init() {
    }

    @Before
    public void setUp() {
        AbstractClassInfoStrategy classInfoStrategy = new AbstractClassInfoStrategy() {};
		classInfoStrategy
                .addExcludedField(Broker.class, "clients")
                .addExcludedField(RfpQuoteOption.class, "rfpQuote")
                .addExcludedField(RfpQuoteOption.class, "rfpQuoteOptionId")
                .addExcludedField(RfpQuoteOption.class, "rfpQuoteVersion")
                .addExcludedField(RfpQuoteOption.class, "selectedRiders")
                .addExcludedField(RfpQuoteOptionNetwork.class, "rfpQuoteOption")
                .addExcludedField(RfpQuoteOptionNetwork.class, "clientPlan")
                .addExcludedField(RfpQuoteOptionNetwork.class, "rfpQuoteNetwork")
                .addExcludedField(RfpQuoteOptionNetwork.class, "selectedRfpQuoteNetworkPlan")
                .addExcludedField(RfpQuoteOptionNetwork.class, "selectedRfpQuoteNetworkRxPlan")
                .addExcludedField(RfpQuoteOptionNetwork.class, "selectedSecondRfpQuoteNetworkPlan")
                .addExcludedField(RfpQuoteOptionNetwork.class, "selectedSecondRfpQuoteNetworkRxPlan")
                .addExcludedField(RfpQuoteOptionNetwork.class, "erContributionFormat")
                .addExcludedField(RfpQuoteOptionNetwork.class, "rfpQuoteOptionNetworkId")
                .addExcludedField(RfpQuoteOptionNetwork.class, "administrativeFee")
                .addExcludedField(RfpQuoteOptionNetwork.class, "selectedRiders")
                ;
		podamFactory.setClassStrategy(classInfoStrategy);
		podamFactory.getStrategy().setDefaultNumberOfCollectionElements(3);
        testBroker = testEntityHelper.createTestBroker();
        testClient = testEntityHelper.createTestClient("testClient", testBroker);
        testClientDto = ClientMapper.clientToDTO(testClient);
    }

    @Test
    public void getNewSaleNotificationTemplate() throws Exception{

        RfpQuote medicalQuote = testEntityHelper.createTestRfpQuote(testClient,  appCarrier[0], Constants.MEDICAL);
        medicalQuote.setRatingTiers(2);
        RfpQuoteNetwork hmoNetwork = testEntityHelper.createTestQuoteNetwork(medicalQuote, "HMO");
        RfpQuoteNetworkPlan hmoPlan1 =  testEntityHelper.createTestRfpQuoteNetworkPlan("Test plan1", hmoNetwork, 11f, 12f, 13f, 14f); 
        RfpQuoteNetworkPlan hmoPlan2 =  testEntityHelper.createTestRfpQuoteNetworkPlan("Test plan2", hmoNetwork, 10f, 11f, 12f, 13f); 
        RfpQuoteNetworkPlan rxHmoPlan =  testEntityHelper.createTestRfpQuoteNetworkRxPlan("Hmo RX plan", hmoNetwork, 1f, 0.9f, 12f, 13f); 

        Rider rider1 = testEntityHelper.createTestRider("test rider 1", 1f, 2f, 3f, 4f);
        Rider rider2 = testEntityHelper.createTestRider("test rider 2", 1.1f, 2.1f, 3.1f, 4.1f);
        Rider notSelectableRider = testEntityHelper.createTestRider("not selectable Rider", 1.2f, 2.2f, 3.2f, 4.2f);
        notSelectableRider.getRiderMeta().setSelectable(false);
        
        hmoNetwork.getRiders().add(rider1);
        hmoNetwork.getRiders().add(rider2);
        hmoNetwork.getRiders().add(notSelectableRider);

        RfpQuoteNetwork ppoNetwork = testEntityHelper.createTestQuoteNetwork(medicalQuote, "PPO");
        RfpQuoteNetworkPlan ppoPlan1 =  testEntityHelper.createTestRfpQuoteNetworkPlan("Ppo plan 1", ppoNetwork, 11f, 12f, 13f, 14f); 
        RfpQuoteNetworkPlan rxPpoPlan =  testEntityHelper.createTestRfpQuoteNetworkRxPlan("Ppo RX plan", ppoNetwork, 1.3f, 0.7f, 12f, 13f); 

        
        RfpQuoteOption medicalRfpQuoteOption = podamFactory.manufacturePojo(RfpQuoteOption.class);
        medicalRfpQuoteOption.setRfpQuote(medicalQuote);
        medicalRfpQuoteOption.setFinalSelection(true);
        medicalRfpQuoteOption.setRfpQuoteVersion(medicalQuote.getRfpQuoteVersion());
        rfpQuoteOptionRepository.save(medicalRfpQuoteOption);

        RfpQuoteOptionNetwork rqon1 = medicalRfpQuoteOption.getRfpQuoteOptionNetworks().get(0);
        rqon1.setErContributionFormat(Constants.ER_CONTRIBUTION_FORMAT_DOLLAR);
        rqon1.setRfpQuoteVersion(medicalRfpQuoteOption.getRfpQuoteVersion());
        rqon1.setRfpQuoteOption(medicalRfpQuoteOption);
        rqon1.setRfpQuoteNetwork(hmoNetwork);
        rqon1.setSelectedRfpQuoteNetworkPlan(hmoPlan1);
        rqon1.setSelectedRfpQuoteNetworkRxPlan(rxHmoPlan);
        rqon1.setSelectedRiders(Sets.newHashSet(rider1));
        rfpQuoteOptionNetworkRepository.save(rqon1);  

        RfpQuoteOptionNetwork rqon2 = medicalRfpQuoteOption.getRfpQuoteOptionNetworks().get(1);
        rqon2.setErContributionFormat(Constants.ER_CONTRIBUTION_FORMAT_DOLLAR);
        rqon2.setRfpQuoteVersion(medicalRfpQuoteOption.getRfpQuoteVersion());
        rqon2.setRfpQuoteOption(medicalRfpQuoteOption);
        rqon2.setRfpQuoteNetwork(hmoNetwork);
        rqon2.setSelectedRfpQuoteNetworkPlan(hmoPlan2);
        rqon2.setSelectedRfpQuoteNetworkRxPlan(rxHmoPlan);
        rqon2.setSelectedRiders(Sets.newHashSet(rider2));
        rfpQuoteOptionNetworkRepository.save(rqon2);  

        RfpQuoteOptionNetwork rqon3 = medicalRfpQuoteOption.getRfpQuoteOptionNetworks().get(2);
        rqon3.setErContributionFormat(Constants.ER_CONTRIBUTION_FORMAT_DOLLAR);
        rqon3.setRfpQuoteVersion(medicalRfpQuoteOption.getRfpQuoteVersion());
        rqon3.setRfpQuoteOption(medicalRfpQuoteOption);
        rqon3.setRfpQuoteNetwork(ppoNetwork);
        rqon3.setSelectedRfpQuoteNetworkPlan(ppoPlan1);
        rqon3.setSelectedRfpQuoteNetworkRxPlan(rxPpoPlan);
        rfpQuoteOptionNetworkRepository.save(rqon3);  
        
        RfpQuote dentalQuote = testEntityHelper.createTestRfpQuote(testClient,  appCarrier[0], Constants.DENTAL);
        dentalQuote.setRatingTiers(3);
        RfpQuoteNetwork dentalNetwork = testEntityHelper.createTestQuoteNetwork(dentalQuote, "DHMO");
        RfpQuoteNetworkPlan plan3 =  testEntityHelper.createTestRfpQuoteNetworkPlan("name", dentalNetwork, 10f, 11f, 12f, 13f); 

        RfpQuoteOption dentalRfpQuoteOption = podamFactory.manufacturePojo(RfpQuoteOption.class);
        dentalRfpQuoteOption.setRfpQuote(dentalQuote);
        dentalRfpQuoteOption.setFinalSelection(true);
        dentalRfpQuoteOption.setRfpQuoteVersion(dentalQuote.getRfpQuoteVersion());
        rfpQuoteOptionRepository.save(dentalRfpQuoteOption);
        dentalRfpQuoteOption.getRfpQuoteOptionNetworks().forEach(rqon -> {
            rqon.setErContributionFormat(Constants.ER_CONTRIBUTION_FORMAT_DOLLAR);
            rqon.setRfpQuoteVersion(dentalRfpQuoteOption.getRfpQuoteVersion());
            rqon.setRfpQuoteOption(dentalRfpQuoteOption);
            rqon.setRfpQuoteNetwork(dentalNetwork);
            rqon.setSelectedRfpQuoteNetworkPlan(plan3);
            rfpQuoteOptionNetworkRepository.save(rqon);  
        });
        rfpQuoteOptionRepository.save(dentalRfpQuoteOption);

        RfpQuote visionQuote = testEntityHelper.createTestRfpQuote(testClient,  appCarrier[0], Constants.VISION);
        visionQuote.setRatingTiers(4);
        RfpQuoteNetwork visionNetwork = testEntityHelper.createTestQuoteNetwork(visionQuote, "VPPO");
        RfpQuoteNetworkPlan plan4 =  testEntityHelper.createTestRfpQuoteNetworkPlan("name", visionNetwork, 10f, 11f, 12f, 13f); 

        RfpQuoteOption visionRfpQuoteOption = podamFactory.manufacturePojo(RfpQuoteOption.class);
        visionRfpQuoteOption.setRfpQuote(visionQuote);
        visionRfpQuoteOption.setFinalSelection(true);
        visionRfpQuoteOption.setRfpQuoteVersion(visionQuote.getRfpQuoteVersion());
        rfpQuoteOptionRepository.save(visionRfpQuoteOption);
        visionRfpQuoteOption.getRfpQuoteOptionNetworks().forEach(rqon -> {
            rqon.setErContributionFormat(Constants.ER_CONTRIBUTION_FORMAT_DOLLAR);
            rqon.setRfpQuoteVersion(visionRfpQuoteOption.getRfpQuoteVersion());
            rqon.setRfpQuoteOption(visionRfpQuoteOption);
            rqon.setRfpQuoteNetwork(visionNetwork);
            rqon.setSelectedRfpQuoteNetworkPlan(plan4);
            rfpQuoteOptionNetworkRepository.save(rqon);  
        });
        rfpQuoteOptionRepository.save(visionRfpQuoteOption);

        flushAndClear();
        
        for (String carrier : Arrays.asList("uhc", "anthem")) {
            String template = velocityService.getNewSaleNotificationTemplate(
                    String.format("/templates/%s/email/new-sale-notification.vm", carrier), testBroker, testClient.getBroker(), testClient, null);

            assertThat(StringUtils.countMatches(template, "Employee Only")).isEqualTo(3);
            assertThat(StringUtils.countMatches(template, "Employee + Family")).isEqualTo(2);
            assertThat(StringUtils.countMatches(template, "Employee + 1")).isEqualTo(1);
            assertThat(StringUtils.countMatches(template, "Employee + 2 or more")).isEqualTo(1);
            assertThat(StringUtils.countMatches(template, "Employee + Spouse")).isEqualTo(1);
            assertThat(StringUtils.countMatches(template, "Employee + Child(ren)")).isEqualTo(1);
            assertThat(StringUtils.countMatches(template, "RIDER_" + hmoNetwork.getNetwork().getType())).isEqualTo(2);
            assertThat(StringUtils.countMatches(template, "test rider 1 (" + hmoPlan1.getPnn().getName() + ")")).isEqualTo(1);
            assertThat(StringUtils.countMatches(template, "test rider 2 (" + hmoPlan2.getPnn().getName() + ")")).isEqualTo(1);
            // same RX HMO to both plans
            assertThat(StringUtils.countMatches(template, "Hmo RX plan")).isEqualTo(2);
            assertThat(StringUtils.countMatches(template, "Ppo RX plan")).isEqualTo(1);
            if(carrier.equals("uhc")) {
                // same RX HMO to both plans
                assertThat(StringUtils.countMatches(template, "1x")).isEqualTo(2);
                assertThat(StringUtils.countMatches(template, "0.9x")).isEqualTo(2);
                // RX PPO
                assertThat(StringUtils.countMatches(template, "1.3x")).isEqualTo(1);
                assertThat(StringUtils.countMatches(template, "0.7x")).isEqualTo(1);
            }
            
            //java.io.File html = new java.io.File(carrier + "-new-sale-notification_template2.html");
            //org.apache.commons.io.FileUtils.writeByteArrayToFile(html, template.getBytes());

        }
    }

    @Test
    public void getNewSaleNotificationWithDollarRxPlanTemplate() throws Exception{

        RfpQuote medicalQuote = testEntityHelper.createTestRfpQuote(testClient,  appCarrier[0], Constants.MEDICAL);
        medicalQuote.setRatingTiers(4);
        RfpQuoteNetwork medicalNetwork = testEntityHelper.createTestQuoteNetwork(medicalQuote, "HMO");
        RfpQuoteNetworkPlan plan =  testEntityHelper.createTestRfpQuoteNetworkPlan("Test plan", medicalNetwork, 10f, 11f, 12f, 13f); 
        RfpQuoteNetworkPlan rxPlan =  testEntityHelper.createTestRfpQuoteNetworkRxPlan("Test RX plan Dollar", medicalNetwork, 21f, 22f, 23f, 24f); 
        rxPlan.getAttributes().add(testEntityHelper.createTestQuotePlanAttribute(rxPlan, QuotePlanAttributeName.DOLLAR_RX_RATE, null));

        RfpQuoteOption medicalRfpQuoteOption = podamFactory.manufacturePojo(RfpQuoteOption.class);
        medicalRfpQuoteOption.setRfpQuote(medicalQuote);
        medicalRfpQuoteOption.setFinalSelection(true);
        medicalRfpQuoteOption.setRfpQuoteVersion(medicalQuote.getRfpQuoteVersion());
        rfpQuoteOptionRepository.save(medicalRfpQuoteOption);
        medicalRfpQuoteOption.getRfpQuoteOptionNetworks().forEach(rqon -> {  
            rqon.setErContributionFormat(Constants.ER_CONTRIBUTION_FORMAT_DOLLAR);
            rqon.setRfpQuoteVersion(medicalRfpQuoteOption.getRfpQuoteVersion());
            rqon.setRfpQuoteOption(medicalRfpQuoteOption);
            rqon.setRfpQuoteNetwork(medicalNetwork);
            rqon.setSelectedRfpQuoteNetworkPlan(plan);
            rqon.setSelectedRfpQuoteNetworkRxPlan(rxPlan);
            rfpQuoteOptionNetworkRepository.save(rqon);  
            });

        for (String carrier : Arrays.asList("uhc", "anthem")) {
            String template = velocityService.getNewSaleNotificationTemplate(
                    String.format("/templates/%s/email/new-sale-notification.vm", carrier), testBroker, testClient.getBroker(), testClient, null);
            
            assertThat(StringUtils.countMatches(template, "Employee Only")).isEqualTo(1);
            assertThat(StringUtils.countMatches(template, "Employee + Family")).isEqualTo(1);
            assertThat(StringUtils.countMatches(template, "Employee + Spouse")).isEqualTo(1);
            assertThat(StringUtils.countMatches(template, "Employee + Child(ren)")).isEqualTo(1);
            assertThat(StringUtils.countMatches(template, "Test RX plan")).isEqualTo(1);
            if(appCarrier[0].equalsIgnoreCase(CarrierType.UHC.name()) && carrier.equals("uhc")) {
                assertThat(template).containsOnlyOnce("$21.00");
                assertThat(template).containsOnlyOnce("$22.00");
                assertThat(template).containsOnlyOnce("$23.00");
                assertThat(template).containsOnlyOnce("$24.00");
            }
            
            //java.io.File html = new java.io.File(carrier + "-new-sale-notification_template.html");
            //org.apache.commons.io.FileUtils.writeByteArrayToFile(html, template.getBytes());

        }
    }
    
    @Test
    public void getNewSaleNotificationTemplate_OnlyCarrierPlans() throws Exception{

        RfpQuote medicalQuote = testEntityHelper.createTestRfpQuote(testClient,  appCarrier[0], Constants.MEDICAL);
        medicalQuote.setRatingTiers(2);
        RfpQuoteNetwork medicalNetwork = testEntityHelper.createTestQuoteNetwork(medicalQuote, "HMO");
        RfpQuoteNetworkPlan plan2 =  testEntityHelper.createTestRfpQuoteNetworkPlan("Test Medical plan", medicalNetwork, 10f, 11f, 12f, 13f); 
        RfpQuoteOption medicalRfpQuoteOption = podamFactory.manufacturePojo(RfpQuoteOption.class);
        medicalRfpQuoteOption.setRfpQuote(medicalQuote);
        medicalRfpQuoteOption.setFinalSelection(true);
        medicalRfpQuoteOption.setRfpQuoteVersion(medicalQuote.getRfpQuoteVersion());
        rfpQuoteOptionRepository.save(medicalRfpQuoteOption);
        medicalRfpQuoteOption.getRfpQuoteOptionNetworks().forEach(rqon -> {  
            rqon.setErContributionFormat(Constants.ER_CONTRIBUTION_FORMAT_DOLLAR);
            rqon.setRfpQuoteVersion(medicalRfpQuoteOption.getRfpQuoteVersion());
            rqon.setRfpQuoteOption(medicalRfpQuoteOption);
            rqon.setRfpQuoteNetwork(medicalNetwork);
            rqon.setSelectedRfpQuoteNetworkPlan(plan2);
            rfpQuoteOptionNetworkRepository.save(rqon);  
            });

        // TODO/FIXME: modify this to set the carrier to anything but the current appCarrier
        RfpQuote dentalQuote = testEntityHelper.createTestRfpQuote(testClient, CarrierType.OTHER.name(), Constants.DENTAL);
        dentalQuote.setRatingTiers(3);
        RfpQuoteNetwork dentalNetwork = testEntityHelper.createTestQuoteNetwork(dentalQuote, "DHMO");
        RfpQuoteNetworkPlan plan3 =  testEntityHelper.createTestRfpQuoteNetworkPlan("Test Dental Plan", dentalNetwork, 10f, 11f, 12f, 13f); 

        RfpQuoteOption dentalRfpQuoteOption = podamFactory.manufacturePojo(RfpQuoteOption.class);
        dentalRfpQuoteOption.setRfpQuote(dentalQuote);
        dentalRfpQuoteOption.setFinalSelection(true);
        dentalRfpQuoteOption.setRfpQuoteVersion(dentalQuote.getRfpQuoteVersion());
        dentalRfpQuoteOption.getRfpQuoteOptionNetworks().forEach(rqon -> {
            rqon.setErContributionFormat(Constants.ER_CONTRIBUTION_FORMAT_DOLLAR);
            rqon.setRfpQuoteOption(dentalRfpQuoteOption);
            rqon.setRfpQuoteNetwork(dentalNetwork);
            rqon.setSelectedRfpQuoteNetworkPlan(plan3);
        });
        rfpQuoteOptionRepository.save(dentalRfpQuoteOption);

        // TODO/FIXME: modify this to set the carrier to anything but the current appCarrier
        RfpQuote visionQuote = testEntityHelper.createTestRfpQuote(testClient, CarrierType.OTHER.name(), Constants.VISION);
        visionQuote.setRatingTiers(4);
        RfpQuoteNetwork visionNetwork = testEntityHelper.createTestQuoteNetwork(visionQuote, "VPPO");
        RfpQuoteNetworkPlan plan4 =  testEntityHelper.createTestRfpQuoteNetworkPlan("Test Vision Plan", visionNetwork, 10f, 11f, 12f, 13f); 

        RfpQuoteOption visionRfpQuoteOption = podamFactory.manufacturePojo(RfpQuoteOption.class);
        visionRfpQuoteOption.setRfpQuote(visionQuote);
        visionRfpQuoteOption.setFinalSelection(true);
        visionRfpQuoteOption.setRfpQuoteVersion(visionQuote.getRfpQuoteVersion());
        visionRfpQuoteOption.getRfpQuoteOptionNetworks().forEach(rqon -> {
            rqon.setErContributionFormat(Constants.ER_CONTRIBUTION_FORMAT_DOLLAR);
            rqon.setRfpQuoteOption(visionRfpQuoteOption);
            rqon.setRfpQuoteNetwork(visionNetwork);
            rqon.setSelectedRfpQuoteNetworkPlan(plan4);
        });
        rfpQuoteOptionRepository.save(visionRfpQuoteOption);

        for (String carrier : Arrays.asList("uhc", "anthem")) {
            String template = velocityService.getNewSaleNotificationTemplate(
                String.format("/templates/%s/email/new-sale-notification.vm", carrier), testBroker, testClient.getBroker(), testClient, null);
            // only one table for Medical with Tier 2 columns
            assertThat(StringUtils.countMatches(template, "Employee Only")).isEqualTo(1);
            assertThat(StringUtils.countMatches(template, "Employee + Family")).isEqualTo(1);
            assertThat(StringUtils.countMatches(template, plan2.getPnn().getName())).isEqualTo(1);
            // missing tables for Dental and Vision
            assertThat(StringUtils.countMatches(template, "Employee + 1")).isEqualTo(0);
            assertThat(StringUtils.countMatches(template, "Employee + 2 or more")).isEqualTo(0);
            assertThat(StringUtils.countMatches(template, "Employee + Spouse")).isEqualTo(0);
            assertThat(StringUtils.countMatches(template, "Employee + Child(ren)")).isEqualTo(0);
            assertThat(StringUtils.countMatches(template, plan3.getPnn().getName())).isEqualTo(0);
            assertThat(StringUtils.countMatches(template, plan4.getPnn().getName())).isEqualTo(0);
        }
    }

    @Test
    public void getQuoteViewedNotificationTemplate() throws Exception{

        for (String carrier : Arrays.asList("uhc", "anthem")) {
            String template = velocityService.getQuoteViewedNotificationTemplate(
                String.format("/templates/%s/email/quote_viewed.vm", carrier), testBroker, testClient.getBroker(), testClientDto, "Test User Name");

            assertThat(StringUtils.countMatches(template, "testClient")).isEqualTo(1);
            assertThat(StringUtils.countMatches(template, "testBroker")).isGreaterThanOrEqualTo(1);
            assertThat(StringUtils.countMatches(template, "Test User Name")).isEqualTo(1);
        }
    }

}
