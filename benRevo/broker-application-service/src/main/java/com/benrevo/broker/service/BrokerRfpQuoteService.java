package com.benrevo.broker.service;


import static com.benrevo.common.enums.CarrierType.BENREVO;
import static com.benrevo.common.enums.CarrierType.carrierMatches;

import com.benrevo.be.modules.presentation.service.RfpQuoteService;
import com.benrevo.common.annotation.AppCarrier;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.exception.BaseException;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpQuoteOption;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AppCarrier(BENREVO)
@Transactional
public class BrokerRfpQuoteService extends RfpQuoteService {
	
    @Override
    protected RfpQuoteOption copyOverOption(RfpQuote rfpQuote, RfpQuoteOption option, boolean isNewCarrierQuote, boolean copyOnlyKaiser) {
        return option;
    }

    /**
     * Precondition = lastOptionNumber = 0
     * @param existingOptionSize
     * @param lastOptionNumber
     * @return
     */
    @Override
    public String getQuoteOptionName(int existingOptionSize, int lastOptionNumber){
        if(lastOptionNumber != 0){
            throw new BaseException("Precondition failed. lastOptionNumber must be 0!");
        }
        if(existingOptionSize == 1){
            return RENEWAL_OPTION_NAME + " " + (lastOptionNumber + 2);
        } else {
            return RENEWAL_OPTION_NAME;
        }
    }
}
