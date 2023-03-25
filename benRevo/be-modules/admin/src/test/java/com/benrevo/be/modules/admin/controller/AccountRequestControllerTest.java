package com.benrevo.be.modules.admin.controller;

import com.benrevo.be.modules.admin.controller.AdminAbstractControllerTest;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.AccountRequestDto;
import com.benrevo.common.dto.AccountRequestVerificationDto;
import com.benrevo.common.dto.RestMessageDto;
import com.benrevo.data.persistence.entities.AccountRequest;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.repository.AccountRequestRepository;
import com.benrevo.data.persistence.repository.BrokerRepository;
import org.apache.commons.lang3.StringUtils;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MvcResult;

import static org.assertj.core.api.Assertions.assertThat;

public class AccountRequestControllerTest extends AdminAbstractControllerTest {

	@Autowired
	private AccountRequestRepository accountRequestRepository;
	
    @Test
    public void getAccountRequests() throws Exception {
    	AccountRequest accRequest = testEntityHelper.createTestAccountRequest();

    	AccountRequest accRequest2 = testEntityHelper.buildTestAccountRequest();
    	accRequest2.setApprove(true);
    	accountRequestRepository.save(accRequest2);

    	MvcResult result = performGetAndAssertResult(null, "/admin/accountRequests/all");

    	AccountRequestDto[] response = jsonUtils.fromJson(result.getResponse().getContentAsString(), AccountRequestDto[].class);
        
    	assertThat(response).isNotEmpty();
    	assertThat(response).contains(accRequest.toAccountRequestDto());
    	assertThat(response).doesNotContain(accRequest2.toAccountRequestDto());
    }
    
    @Test
    public void updateAccountRequests() throws Exception {
    	AccountRequest accRequest = testEntityHelper.createTestAccountRequest();
    	accRequest.setBrokerEmail("BROKER_EMAIL@test.com");
		accRequest.setAgentEmail("AGENT_EMAIL@test.com");
		accRequest.setBrokerSpecialtyEmail("SPECIALTY_EMAIL@test.com");
		accountRequestRepository.save(accRequest);

    	Broker broker = testEntityHelper.createTestBroker("testBroker");
    	Broker ga = testEntityHelper.createTestBroker("testGA");
    	
    	AccountRequestDto params = accRequest.toAccountRequestDto();
    	params.setBrokerId(broker.getBrokerId());
    	params.setGaId(ga.getBrokerId());
    	
    	MvcResult result = performPutAndAssertResult(jsonUtils.toJson(params), null, "/admin/accountRequests/{id}", accRequest.getAccountRequestId());
        
    	AccountRequestDto updated = jsonUtils.fromJson(result.getResponse().getContentAsString(), AccountRequestDto.class);
        
    	assertThat(updated).hasNoNullFieldsOrProperties();

		assertThat(updated.getAgentEmail()).isEqualTo(StringUtils.lowerCase(params.getAgentEmail()));
		assertThat(updated.getBrokerEmail()).isEqualTo(StringUtils.lowerCase(params.getBrokerEmail()));
		assertThat(updated.getBrokerSpecialtyEmail()).isEqualTo(StringUtils.lowerCase(params.getBrokerSpecialtyEmail()));
    }
}
