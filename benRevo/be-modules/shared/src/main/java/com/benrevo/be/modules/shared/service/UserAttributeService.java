package com.benrevo.be.modules.shared.service;

import com.benrevo.be.modules.shared.service.Auth0Service;
import com.benrevo.common.dto.UserLoginDetailsDto;
import com.benrevo.common.dto.UserStatusDto;
import com.benrevo.common.enums.UserAttributeName;
import com.benrevo.data.persistence.entities.UserAttribute;
import com.benrevo.data.persistence.repository.UserAttributeRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserAttributeService {

    @Autowired
    private UserAttributeRepository userAttributeRepository;
    
    @Autowired
    private Auth0Service auth0Service;

    public void saveUserAttribute(String authId, UserAttributeName name) {
        
       if (!userAttributeRepository.existsByAuthIdAndName(authId, name)) { 
           userAttributeRepository.save(new UserAttribute(authId, name));
       }
       
    }

  	public UserStatusDto getStatusByAuthId(String authId) {
    
  	  UserLoginDetailsDto loginDetails = auth0Service.getLoginCount(authId);
      List<UserAttributeName> attributes = userAttributeRepository
               .findByAuthId(authId)
               .stream()
               .map(UserAttribute::getName)
               .collect(Collectors.toList());
        
      return new UserStatusDto.Builder()
                .withLastLogin(loginDetails.getLastLogin())
                .withLoginCount(loginDetails.getLoginCount())
                .withAttributes(attributes)
                .build();
    }
  	
  	
}
