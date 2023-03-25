package com.benrevo.data.persistence.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import com.benrevo.common.enums.BrokerConfigType;
import com.benrevo.data.persistence.entities.BrokerConfig;


public interface BrokerConfigRepository extends CrudRepository<BrokerConfig, Long> {

    List<BrokerConfig> findByBrokerBrokerId(Long brokerId);
   
    @Query("select bc from BrokerConfig bc where broker_id = :brokerId and type = :type")
    BrokerConfig findByBrokerIdAndType(@Param("brokerId") Long brokerId, @Param("type") BrokerConfigType type);
    
}
