package com.benrevo.data.persistence.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.benrevo.data.persistence.entities.AdministrativeFee;

public interface AdministrativeFeeRepository extends CrudRepository<AdministrativeFee, Long> {
    
	List<AdministrativeFee> findByCarrierCarrierId(Long carrierId);

	AdministrativeFee findByCarrierCarrierIdAndName(Long carrierId, String name);
}