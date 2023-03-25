package com.benrevo.data.persistence.repository;

import com.benrevo.common.enums.UserAttributeName;
import com.benrevo.data.persistence.entities.UserAttribute;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserAttributeRepository extends JpaRepository<UserAttribute, Long> {

    List<UserAttribute> findByAuthId(String authId);
    
    boolean existsByAuthIdAndName(String authId, UserAttributeName name);

}
