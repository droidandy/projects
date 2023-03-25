package com.benrevo.data.persistence.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkCombination;

public interface RfpQuoteNetworkCombinationRepository extends CrudRepository<RfpQuoteNetworkCombination, Long> {
	
	RfpQuoteNetworkCombination findByName(String name);
	
	List<RfpQuoteNetworkCombination> findByCarrierAndNetworkCount(Carrier carrier, int networkCount);
}
