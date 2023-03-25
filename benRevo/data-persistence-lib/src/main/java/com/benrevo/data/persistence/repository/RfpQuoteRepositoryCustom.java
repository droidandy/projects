package com.benrevo.data.persistence.repository;

import com.benrevo.common.dto.QuoteOptionDisclaimerDto;
import com.benrevo.common.dto.RfpQuoteDto;

import java.util.List;

public interface RfpQuoteRepositoryCustom extends CustomRepository {
    List<RfpQuoteDto> getQuotes(Long clientId, Long rfpCarrierId, String category);
    List<RfpQuoteDto> getQuotesByClientIdAndCarrierName(Long clientId, String carrierName);
    List<QuoteOptionDisclaimerDto> findDisclaimersByProductAndCarrier(String product, Long clientId ,List<String> carrierNames);
}
