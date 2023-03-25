package com.benrevo.be.modules.shared.controller;

import static com.benrevo.be.modules.shared.controller.BaseControllerTest.EMPTY;
import static org.assertj.core.api.Assertions.assertThat;
import static com.benrevo.common.util.MapBuilder.build;
import static com.benrevo.common.util.MapBuilder.entry;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.when;

import com.benrevo.common.dto.BrokerDto;
import com.benrevo.common.enums.BrokerLocale;
import com.benrevo.data.persistence.repository.BrokerRepository;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MvcResult;
import com.auth0.client.mgmt.filter.UserFilter;
import com.auth0.json.mgmt.users.User;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.BrokerConfigDto;
import com.benrevo.common.dto.CarrierToEmails;
import com.benrevo.common.dto.ProgramDto;
import com.benrevo.common.enums.BrokerConfigType;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.BrokerConfig;
import com.benrevo.data.persistence.entities.Program;
import com.benrevo.data.persistence.entities.RfpCarrier;
import com.benrevo.data.persistence.repository.BrokerConfigRepository;

public class SharedBrokerControllerTest extends AbstractControllerTest {

    @Autowired
	private SharedBrokerController sharedBrokerController;
	
	@Autowired
    private BrokerConfigRepository brokerConfigRepository;

	@Autowired
    private BrokerRepository brokerRepository;

    @Before
    @Override
    public void init() {
        initController(sharedBrokerController);
    }
	
	@Test
	public void getBrokerConfigByType() throws Exception {	

		Broker broker = testEntityHelper.createTestBroker();
	    token = createToken(broker.getBrokerToken());
	    
	    BrokerConfig brokerConfig = testEntityHelper.createTestBrokerConfig(
                broker,
                BrokerConfigType.LANGUAGE,
                "Test new <br><strong>LANGUAGE1</strong>");
        

		String response = performGet("/v1/brokers/config", new Object[] {"type", BrokerConfigType.LANGUAGE});
        
		BrokerConfigDto[] result = jsonUtils.fromJson(response, BrokerConfigDto[].class);

		assertThat(result).hasSize(1);
		assertThat(result[0].getType()).isEqualTo(BrokerConfigType.LANGUAGE);
		assertThat(result[0].getData()).isEqualTo(brokerConfig.getData());
	    assertThat(result[0].getModifyBy()).isEqualTo(brokerConfig.getModifyBy());
	}

	@Test
    public void getAllBrokerConfigs() throws Exception {  
                
        Broker broker = testEntityHelper.createTestBroker();
        token = createToken(broker.getBrokerToken());
        
        BrokerConfig brokerConfig = testEntityHelper.createTestBrokerConfig(
                broker,
                BrokerConfigType.LANGUAGE,
                "Test new <br><strong>LANGUAGE2</strong>");
        
        String response = performGet("/v1/brokers/config", EMPTY);
        
        BrokerConfigDto[] result = jsonUtils.fromJson(response, BrokerConfigDto[].class);

        assertThat(result).hasSize(1);
        assertThat(result[0].getType()).isEqualTo(BrokerConfigType.LANGUAGE);
        assertThat(result[0].getData()).isEqualTo(brokerConfig.getData());
        assertThat(result[0].getModifyBy()).isEqualTo(brokerConfig.getModifyBy());
    }
	
	@Test
    public void putBrokerConfigs() throws Exception {  
        
        Broker broker = testEntityHelper.createTestBroker();
        token = createToken(broker.getBrokerToken());
        
        List<BrokerConfigDto> dtos = new ArrayList<>();
        BrokerConfigDto dto = new BrokerConfigDto();
        dto.setType(BrokerConfigType.LANGUAGE);
        dto.setData("Test new <br><strong>LANGUAGE</strong>");
        dtos.add(dto);
    
        User user = new User("test");
        user.setUserMetadata( build( entry("first_name", "FirstName"), entry("last_name", "LastName") ) );
        
        when(mgmtAPI.users().get(anyString(), any(UserFilter.class)).execute()).thenReturn(user);
        
        performPut("/v1/brokers/config", dtos);

        List<BrokerConfig> result = brokerConfigRepository.findByBrokerBrokerId(broker.getBrokerId());
        
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getModifyBy()).isEqualTo("FirstName LastName");
        assertThat(result.get(0).getType()).isEqualTo(dto.getType());
        assertThat(result.get(0).getData()).isEqualTo(dto.getData());
        
    }

    @Test
    public void brokerConfig_CarrierEmails_Save_Get() throws Exception {
        
        Broker broker = testEntityHelper.createTestBroker();
       
        List<CarrierToEmails> configData = new ArrayList<>();
        CarrierToEmails c2e = new CarrierToEmails(1L, "email@1", "email@2", "email@3");
        c2e.setCarrierDisplayName("Car 1");
        configData.add(c2e);
        c2e = new CarrierToEmails(2L, "email@4");
        c2e.setCarrierDisplayName("Car 2");
        configData.add(c2e);
        c2e = new CarrierToEmails(3L); // no emails
        c2e.setCarrierDisplayName("Car 3");
        configData.add(c2e);
        
        List<BrokerConfigDto> params = new ArrayList<>();
        BrokerConfigDto config = new BrokerConfigDto();
        config.setType(BrokerConfigType.CARRIER_EMAILS);
        config.setData(jsonUtils.toJson(configData));
        params.add(config);
    
        User user = new User("test");
        user.setUserMetadata(build(entry("first_name", "FirstName"), entry("last_name", "LastName")));

        when(mgmtAPI.users().get(anyString(), any(UserFilter.class)).execute()).thenReturn(user);
        
        performPut("/v1/brokers/config", params);

        String result = performGet("/v1/brokers/config", new Object[] {
            "type", BrokerConfigType.CARRIER_EMAILS.name()});
        
        BrokerConfigDto[] response = jsonUtils.fromJson(result, BrokerConfigDto[].class);
        
        assertThat(response).hasSize(1);
        assertThat(response[0].getModifyBy()).isEqualTo("FirstName LastName");
        assertThat(response[0].getType()).isEqualTo(config.getType());
        assertThat(response[0].getData()).isEqualTo(config.getData());
        
        CarrierToEmails[] configDataResp = jsonUtils.fromJson(response[0].getData(), CarrierToEmails[].class);
        assertThat(configDataResp).hasSize(configData.size());
        for(int i = 0; i < configDataResp.length; i++) {
            assertThat(configDataResp[i]).isEqualToComparingFieldByFieldRecursively(configData.get(i)); 
        }  
    }
    
    @Test
    public void brokerConfig_CarrierEmails_Initial_List() throws Exception {

        String result = performGet("/v1/brokers/config", new Object[] {
            "type", BrokerConfigType.CARRIER_EMAILS.name()});
        
        BrokerConfigDto[] response = jsonUtils.fromJson(result, BrokerConfigDto[].class);
        
        assertThat(response).hasSize(1);
        assertThat(response[0].getType()).isEqualTo(BrokerConfigType.CARRIER_EMAILS);
        CarrierToEmails[] configDataResp = jsonUtils.fromJson(response[0].getData(), CarrierToEmails[].class);
        assertThat(configDataResp).isNotEmpty();
        for(CarrierToEmails carrierToEmails : configDataResp) {
            assertThat(carrierToEmails.getCarrierId()).isNotNull();
            assertThat(carrierToEmails.getCarrierDisplayName()).isNotNull();
            assertThat(carrierToEmails.getEmails()).isEmpty();
            assertThat(carrierToEmails.isApproved()).isTrue();
        }
    }
    
    @Test
    public void getBrokerPrograms() throws Exception {
        Broker loggedInBroker = testEntityHelper.createTestBroker();
        Broker deniedBroker = testEntityHelper.createTestBroker();
        RfpCarrier rfpCarrier = testEntityHelper.createTestRfpCarrier(appCarrier[0], Constants.MEDICAL);
        
        Program availableProgram = testEntityHelper.createTestProgram("Program 1", rfpCarrier, loggedInBroker);
        Program deniedProgram = testEntityHelper.createTestProgram("Program 2", rfpCarrier, deniedBroker);

        token = createToken(loggedInBroker.getBrokerToken());
        
        String result = performGet("/v1/programs/{brokerId}", EMPTY, loggedInBroker.getBrokerId());

        ProgramDto[] programs = jsonUtils.fromJson(result, ProgramDto[].class);
        assertThat(programs).hasSize(1);
        assertThat(programs[0].getName()).isEqualTo(availableProgram.getName());
        assertThat(programs[0]).hasNoNullFieldsOrProperties();
    }

    @Test
    public void getBrokerages() throws Exception {
        Broker generalAgent = testEntityHelper.buildTestBroker();
        generalAgent.setName("General Agent");
        generalAgent.setGeneralAgent(true);
        generalAgent = brokerRepository.save(generalAgent);

        MvcResult result = performGetAndAssertResult(null, "/v1/brokers/brokerages");

        BrokerDto[] brokerages = jsonUtils.fromJson(result.getResponse().getContentAsString(), BrokerDto[].class);

        assertThat(brokerages.length).isLessThan((int) brokerRepository.count());

        for (BrokerDto brokerDto : brokerages) {
            assertThat(brokerDto.isGeneralAgent()).isFalse();
        }
    }

    @Test
    public void getGeneralAgents() throws Exception {
        Broker generalAgent = testEntityHelper.buildTestBroker();
        generalAgent.setName("General Agent");
        generalAgent.setGeneralAgent(true);
        generalAgent = brokerRepository.save(generalAgent);

        MvcResult result = performGetAndAssertResult(null, "/v1/brokers/generalAgents");

        BrokerDto[] generalAgents = jsonUtils.fromJson(result.getResponse().getContentAsString(), BrokerDto[].class);

        assertThat(generalAgents.length).isLessThan((int) brokerRepository.count());

        for (BrokerDto brokerDto : generalAgents) {
            assertThat(brokerDto.isGeneralAgent()).isTrue();
        }
    }
}
