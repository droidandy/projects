package com.benrevo.dashboard.service;

import static com.benrevo.common.enums.CarrierType.ANTHEM_BLUE_CROSS;

import com.benrevo.be.modules.presentation.service.RfpQuoteService;
import com.benrevo.be.modules.rfp.service.BaseRfpService;
import com.benrevo.common.Constants;
import com.benrevo.common.annotation.AppCarrier;
import com.benrevo.common.dto.OptionDto;
import com.benrevo.common.dto.RfpDto;
import com.benrevo.common.enums.RFPAttributeName;
import com.benrevo.common.exception.BadRequestException;
import com.benrevo.data.persistence.entities.PlanNameByNetwork;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpQuoteOption;
import com.benrevo.data.persistence.entities.RfpToPnn;
import com.benrevo.data.persistence.repository.RfpToPnnRepository;
import java.util.List;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AppCarrier(ANTHEM_BLUE_CROSS)
@Transactional
public class AnthemDashboardRfpQuoteService extends RfpQuoteService {

    @Override
    protected RfpQuoteOption copyOverOption(RfpQuote rfpQuote, RfpQuoteOption option, boolean isNewCarrierQuote, boolean copyOnlyKaiser) {
        return option;
    }
    
}
