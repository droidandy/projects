package com.benrevo.data.persistence.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpQuoteNetwork;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkCombination;

public interface RfpQuoteNetworkRepository extends CrudRepository<RfpQuoteNetwork, Long> {

    List<RfpQuoteNetwork> findByRfpQuote(RfpQuote quote);

    List<RfpQuoteNetwork> findByRfpQuoteRfpQuoteId(Long rfpQuoteId);

    List<RfpQuoteNetwork> findByRfpQuoteAndNetworkNetworkId(RfpQuote quote, Long networkId);

	RfpQuoteNetwork findByRfpQuoteAndRfpQuoteOptionName(RfpQuote quote, String optionName);
	
	List<RfpQuoteNetwork> findByRfpQuoteAndRfpQuoteNetworkCombination(RfpQuote quote, RfpQuoteNetworkCombination rfpQuoteNetworkCombination);
}
