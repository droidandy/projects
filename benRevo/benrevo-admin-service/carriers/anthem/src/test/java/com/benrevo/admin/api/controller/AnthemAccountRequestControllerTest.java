package com.benrevo.admin.api.controller;

import com.benrevo.admin.service.AnthemAccountRequestService;
import com.benrevo.be.modules.admin.controller.AdminAbstractControllerTest;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.AccountRequestVerificationDto;
import com.benrevo.common.dto.RestMessageDto;
import com.benrevo.common.enums.PersonType;
import com.benrevo.data.persistence.entities.AccountRequest;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Person;
import com.benrevo.data.persistence.repository.AccountRequestRepository;
import com.benrevo.data.persistence.repository.BrokerRepository;

import java.util.HashSet;
import java.util.List;
import java.util.Map;

import org.apache.http.HttpStatus;
import org.junit.After;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class AnthemAccountRequestControllerTest extends AdminAbstractControllerTest {

	@Autowired
	private AccountRequestRepository accountRequestRepository;
	
	@Autowired
	private BrokerRepository brokerRepository;

	@Autowired
    private AnthemAccountRequestService anthemAccountRequestService;

    @Value("${app.env:local}")
    String appEnv;

    @Test
    public void getAccountContacts() throws Exception {
        
        Person testSales = testEntityHelper.createTestPerson(PersonType.SALES, 
            "testSales", "testSalesEmail@benrevo.com", appCarrier[0]);
        
        Person testPresales = testEntityHelper.createTestPerson(PersonType.PRESALES, 
            "testPresales", "testPresalesEmail@benrevo.com", appCarrier[0]);
        
        MvcResult result = performGetAndAssertResult(null, "/admin/accountRequests/contacts");

        Map<String, List<String>> response = jsonUtils.fromJson(result.getResponse().getContentAsString(), Map.class);
        
        assertThat(response).isNotEmpty();
        List<String> sales = response.get("sales");
        assertThat(sales).isNotNull().isNotEmpty();
        // added to dev DB for tests
        // assertThat(sales).doesNotContain(Constants.BENREVO_DEVSALE_NAME);
        assertThat(sales).contains(testSales.getFullName());
        List<String> presales = response.get("presales");
        assertThat(presales).isNotNull().isNotEmpty();
        // added to dev DB for tests
        // assertThat(presales).doesNotContain(Constants.BENREVO_DEVPRESALE_NAME);
        assertThat(presales).contains(testPresales.getFullName());
        // check for removed duplicates
        assertThat(sales).hasSize(new HashSet<>(sales).size());
        assertThat(presales).hasSize(new HashSet<>(presales).size());
    }
    
    @Test
    public void accountRequestApprove() throws Exception {
        AccountRequest accRequest = testEntityHelper.createTestAccountRequest();

        Broker brokerage = brokerRepository.findByName(accRequest.getBrokerName());
        assertThat(brokerage).isNull();
        Broker gAgent = brokerRepository.findByName(accRequest.getGaName());
        assertThat(gAgent).isNull();

        
        AccountRequestVerificationDto params = new AccountRequestVerificationDto();
        params.setAccountRequestId(accRequest.getAccountRequestId());
            
        MvcResult result = performPutAndAssertResult(jsonUtils.toJson(params), null, "/admin/accountRequests/approve");
        
        RestMessageDto response = jsonUtils.fromJson(result.getResponse().getContentAsString(), RestMessageDto.class);
        
        assertThat(response.isSuccess()).isTrue();
        
        AccountRequest approved = accountRequestRepository.findOne(accRequest.getAccountRequestId());
        
        assertThat(approved.getApprove()).isTrue();
        assertThat(approved.getDeny()).isFalse();
        assertThat(approved.getDenyReason()).isNull();
        
        brokerage = brokerRepository.findByName(accRequest.getBrokerName());
        assertThat(brokerage).isNotNull();
        assertThat(brokerage.getPresalesFullName()).isEqualTo(accRequest.getBrokerPresaleName());
        assertThat(brokerage.getSalesFullName()).isEqualTo(accRequest.getBrokerSalesName());
//        assertThat(brokerage.getSalesLastName()).isNull(); // not has lastName in accRequest.getBrokerSalesName()
        
        gAgent = brokerRepository.findByName(accRequest.getGaName());
        assertThat(gAgent).isNotNull();
    }

    @Test
    public void accountRequestApproveBCC_DEV() throws Exception {
        final String brokerName = "accountRequestBrokerName";
        AccountRequest accRequest = testEntityHelper.createTestAccountRequest();
        accRequest.setBrokerName(brokerName);
        accountRequestRepository.save(accRequest);

        testEntityHelper.createTestPerson(PersonType.SALES,
                accRequest.getBrokerSalesName(), "testSalesEmail@benrevo.com", appCarrier[0]);
        testEntityHelper.createTestPerson(PersonType.PRESALES,
                accRequest.getBrokerPresaleName(), "testPresalesEmail@benrevo.com", appCarrier[0]);

        /* Giving bcc in not-prod should have no bcc on the response for both NEW and EXISTING brokers*/
        /* creating new broker */
        AccountRequestVerificationDto params = new AccountRequestVerificationDto();
        params.setAccountRequestId(accRequest.getAccountRequestId());
        params.setBcc("george.karma@benrevo.com");
        MvcResult result = performPutAndAssertResult(jsonUtils.toJson(params), null, "/admin/accountRequests/approve");
        RestMessageDto response = jsonUtils.fromJson(result.getResponse().getContentAsString(), RestMessageDto.class);
        assertThat(response.isSuccess()).isTrue();
        AccountRequest approved = accountRequestRepository.findOne(accRequest.getAccountRequestId());
        Broker broker = brokerRepository.findOne(approved.getBrokerId());
        assertThat(broker.getBcc()).isNull();
        assertThat(broker.getName()).isEqualTo(brokerName);
        assertThat(approved.getApprove()).isTrue();
        assertThat(approved.getDeny()).isFalse();
        assertThat(approved.getDenyReason()).isNull();
        assertThat(approved.getBrokerId()).isEqualTo(broker.getBrokerId());

        /* using existing broker */
        result = performPutAndAssertResult(jsonUtils.toJson(params), null, "/admin/accountRequests/approve");
        response = jsonUtils.fromJson(result.getResponse().getContentAsString(), RestMessageDto.class);
        assertThat(response.isSuccess()).isTrue();
        approved = accountRequestRepository.findOne(accRequest.getAccountRequestId());
        broker = brokerRepository.findOne(accountRequestRepository.findOne(accRequest.getAccountRequestId()).getBrokerId());
        assertThat(broker.getBcc()).isNull();
        assertThat(broker.getName()).isEqualTo(brokerName);
        assertThat(approved.getApprove()).isTrue();
        assertThat(approved.getDeny()).isFalse();
        assertThat(approved.getDenyReason()).isNull();
        assertThat(approved.getBrokerId()).isEqualTo(broker.getBrokerId());
    }

    @Test
    public void accountRequestApproveBCC_PROD() throws Exception {
        /* CHANGING ENVIRONMENT TO PROD!!! */
        ReflectionTestUtils.setField(anthemAccountRequestService, "appEnv", "prod");

        final String brokerName = "accountRequestBrokerName";
        AccountRequest accRequest = testEntityHelper.createTestAccountRequest();
        accRequest.setBrokerName(brokerName);
        accountRequestRepository.save(accRequest);

        testEntityHelper.createTestPerson(PersonType.SALES,
                accRequest.getBrokerSalesName(), "testSalesEmail@benrevo.com", appCarrier[0]);
        testEntityHelper.createTestPerson(PersonType.PRESALES,
                accRequest.getBrokerPresaleName(), "testPresalesEmail@benrevo.com", appCarrier[0]);

        /* Giving bcc in prod -- on a NEW broker -- should return same bcc in response*/
        AccountRequestVerificationDto params = new AccountRequestVerificationDto();
        params.setAccountRequestId(accRequest.getAccountRequestId());
        params.setBcc("george.karma@benrevo.com");
        MvcResult result = performPutAndAssertResult(jsonUtils.toJson(params), null, "/admin/accountRequests/approve");
        RestMessageDto response = jsonUtils.fromJson(result.getResponse().getContentAsString(), RestMessageDto.class);
        assertThat(response.isSuccess()).isTrue();
        AccountRequest approved = accountRequestRepository.findOne(accRequest.getAccountRequestId());
        broker = brokerRepository.findOne(approved.getBrokerId());
        assertThat(broker.getBcc()).isEqualTo("george.karma@benrevo.com");
        assertThat(broker.getName()).isEqualTo(brokerName);
        assertThat(approved.getApprove()).isTrue();
        assertThat(approved.getDeny()).isFalse();
        assertThat(approved.getBrokerId()).isEqualTo(broker.getBrokerId());

        /* Giving bcc in prod -- on an EXISTING broker -- should return existing broker's bcc in the response */
        params = new AccountRequestVerificationDto();
        params.setAccountRequestId(accRequest.getAccountRequestId());
        params.setBcc("bccShouldNotPersistOnExistingBroker");
        result = performPutAndAssertResult(jsonUtils.toJson(params), null, "/admin/accountRequests/approve");
        response = jsonUtils.fromJson(result.getResponse().getContentAsString(), RestMessageDto.class);
        assertThat(response.isSuccess()).isTrue();
        approved = accountRequestRepository.findOne(accRequest.getAccountRequestId());
        broker = brokerRepository.findOne(approved.getBrokerId());
        assertThat(broker.getBcc()).isEqualTo("george.karma@benrevo.com");
        assertThat(broker.getName()).isEqualTo(brokerName);
        assertThat(approved.getApprove()).isTrue();
        assertThat(approved.getDeny()).isFalse();
        assertThat(approved.getBrokerId()).isEqualTo(broker.getBrokerId());

        /* Not giving a bcc (or empty bcc) in prod -- on an EXISTING broker -- should return existing bcc in response */
        params.setBcc(null);
        result = mockMvc.perform(MockMvcRequestBuilders.put("/admin/accountRequests/approve")
                .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
                .content(jsonUtils.toJson(params))
                .accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk())
                .andReturn();
        //request should fail since no bcc given and env == prod
        response = jsonUtils.fromJson(result.getResponse().getContentAsString(), RestMessageDto.class);
        assertThat(response.isSuccess()).isTrue();
        approved = accountRequestRepository.findOne(accRequest.getAccountRequestId());
        broker = brokerRepository.findOne(approved.getBrokerId());
        assertThat(broker.getBcc()).isEqualTo("george.karma@benrevo.com");
        assertThat(broker.getName()).isEqualTo(brokerName);
        assertThat(approved.getApprove()).isTrue();
        assertThat(approved.getDeny()).isFalse();
        assertThat(approved.getBrokerId()).isEqualTo(broker.getBrokerId());

        /* Not giving a bcc (or empty bcc) in prod -- on a NEW broker -- should return FAILURE */
        accRequest.setBrokerName("New Broker Name");
        accRequest.setBrokerId(null);
        accountRequestRepository.save(accRequest);
        params = new AccountRequestVerificationDto();
        params.setAccountRequestId(accRequest.getAccountRequestId());
        params.setBcc(null);
        result = mockMvc.perform(MockMvcRequestBuilders.put("/admin/accountRequests/approve")
                .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
                .content(jsonUtils.toJson(params))
                .accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().isNotFound())
                .andReturn();
        assertThat(result.getResponse().getStatus() == HttpStatus.SC_NOT_FOUND);
        assertThat(result.getResponse().getContentAsString()).contains("AccountRequest needs a bcc field");

    }
    
    @Test
    public void accountRequestDeny() throws Exception {
        AccountRequest accRequest = testEntityHelper.createTestAccountRequest();

        AccountRequestVerificationDto params = new AccountRequestVerificationDto();
        params.setAccountRequestId(accRequest.getAccountRequestId());
        params.setDenyReason("denyReason");
        
        MvcResult result = performPutAndAssertResult(jsonUtils.toJson(params), null, "/admin/accountRequests/deny");
        
        RestMessageDto response = jsonUtils.fromJson(result.getResponse().getContentAsString(), RestMessageDto.class);
        
        assertThat(response.isSuccess()).isTrue();
        
        AccountRequest denied = accountRequestRepository.findOne(accRequest.getAccountRequestId());
        
        assertThat(denied.getApprove()).isFalse();
        assertThat(denied.getDeny()).isTrue();
        assertThat(denied.getDenyReason()).isEqualTo(params.getDenyReason());
    }

    @After
    public void appEnvToLocal(){
        ReflectionTestUtils.setField(anthemAccountRequestService, "appEnv", "local");
    }
}
