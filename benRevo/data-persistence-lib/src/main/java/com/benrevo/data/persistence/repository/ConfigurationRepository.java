package com.benrevo.data.persistence.repository;

import com.benrevo.common.enums.ConfigurationName;
import com.benrevo.data.persistence.entities.Configuration;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ConfigurationRepository extends JpaRepository<Configuration, Long> {

    Configuration findByCarrierIdAndName(Long carrierId, ConfigurationName name);


}
