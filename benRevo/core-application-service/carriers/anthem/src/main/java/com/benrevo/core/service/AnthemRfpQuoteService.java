package com.benrevo.core.service;


import static com.benrevo.common.enums.CarrierType.ANTHEM_BLUE_CROSS;

import com.benrevo.be.modules.presentation.service.RfpQuoteService;
import com.benrevo.be.modules.shared.service.SharedActivityService;
import com.benrevo.common.annotation.AppCarrier;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.common.util.DateHelper;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpQuoteOption;
import com.benrevo.data.persistence.entities.Rider;
import com.benrevo.data.persistence.repository.RiderRepository;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AppCarrier(ANTHEM_BLUE_CROSS)
@Transactional
public class AnthemRfpQuoteService extends RfpQuoteService {

    public static final Date ANTHEM_CV_DENTAL_START_EFFECTIVE_DATE = DateHelper.fromStringToDate("06/01/2018");
    public static final String ANTHEM_3TIER_SPECIAL_RIDER_CATEGORY = "Special 3 Tier";
    public static final String ANTHEM_4TIER_SPECIAL_RIDER_CATEGORY = "Special 4 Tier";
    
    @Autowired
    private RiderRepository riderRepository;
    /**
     * See https://app.asana.com/0/583663077123126/578645828778359
     * @return
     */
    @Override
    protected String getEffectiveDateBasedFileName(String name, Date effectiveDate, String carrierName) {
        if(carrierName.equalsIgnoreCase(CarrierType.ANTHEM_CLEAR_VALUE.name()) &&
            isBefore06012018(effectiveDate)){
            return name + "_DC";
        }
        return name;
    }

    private boolean isBefore06012018(Date date){
        return date.before(ANTHEM_CV_DENTAL_START_EFFECTIVE_DATE);
    }
    
    @Override
    protected Set<Rider> getSpecialRiders(RfpQuoteOption rfpQuoteOption) {
        Set<Rider> result = new HashSet<>();
        RfpQuote quote = rfpQuoteOption.getRfpQuote();
        if(quote.getQuoteType() == QuoteType.STANDARD) {
            if(quote.getRatingTiers() == 3) {
                result.addAll(riderRepository.findByRiderMetaCategory(ANTHEM_3TIER_SPECIAL_RIDER_CATEGORY));
            } else if(quote.getRatingTiers() == 4) {
                result.addAll(riderRepository.findByRiderMetaCategory(ANTHEM_4TIER_SPECIAL_RIDER_CATEGORY));
            }
        }
        return result;
    }
}
