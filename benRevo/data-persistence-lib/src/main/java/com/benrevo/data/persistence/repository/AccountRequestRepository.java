/**
 * 
 */
package com.benrevo.data.persistence.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.benrevo.data.persistence.entities.AccountRequest;

/**
 * @author Akorchak
 *
 */

public interface AccountRequestRepository extends JpaRepository<AccountRequest, Long> {
	
    List<AccountRequest> findAllByApproveIsFalseAndDenyIsFalse();
    
    AccountRequest findByVerificationCode(String verificationCode);

    List<AccountRequest> findByAgentEmail(String agentEmail);
    
}
