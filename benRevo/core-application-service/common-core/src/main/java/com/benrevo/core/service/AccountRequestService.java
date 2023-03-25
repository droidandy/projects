package com.benrevo.core.service;

import com.benrevo.be.modules.shared.service.BaseEmailService;
import com.benrevo.common.dto.AccountRequestDto;
import com.benrevo.common.exception.BaseException;
import com.benrevo.core.service.email.CoreEmailService;
import com.benrevo.data.persistence.entities.AccountRequest;
import com.benrevo.data.persistence.repository.AccountRequestRepository;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AccountRequestService {

	@Autowired
	private AccountRequestRepository accountRequestRepository;
	
	@Autowired
	private CoreEmailService emailService;

	public AccountRequestDto create(AccountRequestDto accountRequestDto) {

		if(accountRequestDto.getAgentEmail() != null){
			accountRequestDto.setAgentEmail(StringUtils.lowerCase(accountRequestDto.getAgentEmail()));
		}
		if(accountRequestDto.getBrokerEmail() != null){
			accountRequestDto.setBrokerEmail(StringUtils.lowerCase(accountRequestDto.getBrokerEmail()));
		}

		AccountRequest request = new AccountRequest();
    	request.fromAccountRequestDto(accountRequestDto);
    	request.setAccountRequestId(null);
    	request.setBrokerId(null);
    	request.setGaId(null);
    	request.setCreated(new Date());
    	request.setVerificationCode(UUID.randomUUID().toString());

    	boolean agentEmailVerified = false;

    	List<AccountRequest> requestList = accountRequestRepository.findByAgentEmail(request.getAgentEmail());
    	if(requestList != null && requestList.size() != 0){
            AccountRequest verifiedEmailAccountRequest = requestList.stream()
                .filter(AccountRequest::getAgentVerified)
                .findFirst()
                .orElse(null);
            agentEmailVerified = verifiedEmailAccountRequest != null;
        }
    	request.setAgentVerified(agentEmailVerified);
    	request = accountRequestRepository.save(request);
    	
    	// Send to agent
//        if(!agentEmailVerified){
//            emailService.sendVerificationCode(request.getAgentName(), request.getAgentEmail(), request.getVerificationCode());
//        }
        AccountRequestDto result = request.toAccountRequestDto();
        
        emailService.sendAccountRequestEmail(result);
    	
    	return result;
    }
	
    public void verifyEmail(String verificationCode) {
        AccountRequest request = accountRequestRepository.findByVerificationCode(verificationCode);
        if (request == null) {
            throw new BaseException("Wrong code");
        }
        request.setAgentVerified(true);
        accountRequestRepository.save(request);
    }
	
}
