package com.benrevo.core.api.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.UUID;

import org.apache.commons.lang3.StringUtils;
import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.AccountRequestDto;
import com.benrevo.common.dto.MailDto;
import com.benrevo.data.persistence.entities.AccountRequest;
import com.benrevo.data.persistence.repository.AccountRequestRepository;

public class AccountRequestControllerTest extends AbstractControllerTest {

  @Autowired
  private AccountRequestController accountRequestController;

  @Autowired
  private AccountRequestRepository accountRequestRepository;

  @Before
  @Override
  public void init() {
    initController(accountRequestController);
  }

  @Test
  public void testAccountRequestWithoutAuthorization() throws Exception {
    AccountRequestDto dto = new AccountRequestDto();
    dto.setBrokerName("AccRequestBrokerName");
    dto.setBrokerPresaleName("brokerPresaleName");
    dto.setBrokerSalesName("brokerSalesName");
    dto.setBrokerAddress("brokerAddress");
    dto.setBrokerCity("brokerCity");
    dto.setBrokerEmail("brokerEmail");
    dto.setBrokerState("brokerState");
    dto.setBrokerZip("brokerZip");
    dto.setGaName("gaName");
    dto.setGaAddress("gaAddress");
    dto.setGaCity("gaCity");
    dto.setGaState("gaState");
    dto.setGaZip("gaZip");
    dto.setAgentName("agentName");
    dto.setAgentEmail("agentEmail");
    dto.setBrokerRegion("brokerRegion");
    dto.setBrokerSpecialtyEmail("brokerSpecialtyEmail");

    // check what SignUpController not requires correct Authorization
    token = "emptyToken";

    MvcResult result = performPostAndAssertResult(jsonUtils.toJson(dto), null, "/v1/accountRequest");

    AccountRequestDto updated = jsonUtils
        .fromJson(result.getResponse().getContentAsString(), AccountRequestDto.class);

    assertThat(updated).hasNoNullFieldsOrPropertiesExcept("brokerId", "gaId");
    assertThat(updated.getAgentEmail().equals(StringUtils.lowerCase(dto.getAgentEmail())));
    assertThat(updated.getBrokerEmail().equals(StringUtils.lowerCase(dto.getBrokerEmail())));
    
    // test for notification email 
    ArgumentCaptor<MailDto> mailCaptor = ArgumentCaptor.forClass(MailDto.class);
    // first call - sendVerificationCode, second - sendAccountRequestEmail
    Mockito.verify(smtpMailer, Mockito.times(1)).send(mailCaptor.capture());
    
    MailDto mailDto = mailCaptor.getValue();
    assertThat(mailDto.getSubject()).contains("New Account Request");
    assertThat(mailDto.getRecipient()).isEqualTo(Constants.SITE_CONTACT_US_EMAIL);
    assertThat(mailDto.getContent()).contains(dto.getBrokerName());

    // check for success call without Authorization header
    mockMvc.perform(MockMvcRequestBuilders.post("/v1/accountRequest")
        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
        .contentType(MediaType.APPLICATION_JSON_UTF8)
        .content(jsonUtils.toJson(dto))
        .accept(MediaType.APPLICATION_JSON_UTF8))
        .andExpect(status().isCreated())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
        .andReturn();
  }

  @Test
  public void testVerificationEmailWithoutAuthorization() throws Exception {

    // check what SignUpController not requires correct Authorization
    token = "emptyToken";

    AccountRequest accountRequest = new AccountRequest();
    accountRequest.setVerificationCode(UUID.randomUUID().toString());
    accountRequestRepository.save(accountRequest);

    // check for success call without Authorization header
    mockMvc.perform(MockMvcRequestBuilders.post("/v1/verifyEmail")
        .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON)
        .param("verificationCode", accountRequest.getVerificationCode())
        .accept(MediaType.APPLICATION_JSON_UTF8))
        .andExpect(status().isCreated())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
        .andReturn();

    flushAndClear();
  }

}
