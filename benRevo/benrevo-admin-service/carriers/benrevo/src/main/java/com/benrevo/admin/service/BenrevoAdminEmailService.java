package com.benrevo.admin.service;

import static com.benrevo.common.enums.CarrierType.ANTHEM_BLUE_CROSS;
import static com.benrevo.common.enums.CarrierType.BENREVO;

import com.benrevo.be.modules.admin.service.BaseAdminEmailService;
import com.benrevo.common.annotation.AppCarrier;
import org.apache.commons.lang.NotImplementedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AppCarrier(BENREVO)
@Transactional
public class BenrevoAdminEmailService extends BaseAdminEmailService {

    private static final String TEMPLATE_PATH = "/templates/benrevo/email/";

    @Override
    protected String getAccountRequestApproveEmailTemplatePath() {
        throw new NotImplementedException("Not Implemented for Benrevo carrier");
    }
    @Override
    protected String getAccountRequestDenyEmailTemplatePath() {
        throw new NotImplementedException("Not Implemented for Benrevo carrier");
    }
    @Override
    protected String getOnBoardingApproveMailTemplatePath() {
        throw new NotImplementedException("Not Implemented for Benrevo carrier");
    }
    @Override
    protected String getQuoteReadyEmailTemplatePath() {
        return TEMPLATE_PATH + QUOTE_READY_TEMPLATE;
    }
    @Override
    protected String getWelcomeEmailTemplatePath() {
        throw new NotImplementedException("Not Implemented for Benrevo carrier");
    }
    @Override
    protected String getIntroducingEmailTemplatePath() {
        throw new NotImplementedException("Not Implemented for Benrevo carrier");
    }
}
