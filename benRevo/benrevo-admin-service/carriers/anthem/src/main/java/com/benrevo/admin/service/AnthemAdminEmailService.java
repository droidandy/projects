package com.benrevo.admin.service;

import static com.benrevo.common.enums.CarrierType.ANTHEM_BLUE_CROSS;
import static com.benrevo.common.mail.SMTPMailer.addMailRecipients;
import static com.benrevo.common.mail.SMTPMailer.setMailRecipients;
import static javax.mail.Message.RecipientType.CC;
import static javax.mail.Message.RecipientType.TO;
import static org.apache.commons.lang3.StringUtils.isBlank;

import com.benrevo.be.modules.admin.service.BaseAdminEmailService;
import com.benrevo.common.annotation.AppCarrier;
import com.benrevo.common.dto.ClientDto;
import com.benrevo.common.dto.MailDto;
import com.benrevo.common.exception.BaseException;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Client;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AppCarrier(ANTHEM_BLUE_CROSS)
@Transactional
public class AnthemAdminEmailService extends BaseAdminEmailService {

    private static final String TEMPLATE_PATH = "/templates/anthem/email/";
    
    @Override
    protected String getAccountRequestApproveEmailTemplatePath() {
        return TEMPLATE_PATH + ACCOUNT_APPROVE_TEMPLATE;
    }
    @Override
    protected String getAccountRequestDenyEmailTemplatePath() {
        return TEMPLATE_PATH + ACCOUNT_DENY_TEMPLATE;
    }
    @Override
    protected String getOnBoardingApproveMailTemplatePath() {
        return TEMPLATE_PATH + APPROVE_TEMPLATE;
    }
    @Override
    protected String getQuoteReadyEmailTemplatePath() {
        return TEMPLATE_PATH + QUOTE_READY_TEMPLATE;
    }
    @Override
    protected String getWelcomeEmailTemplatePath() {
        return TEMPLATE_PATH + WELCOME_TEMPLATE;
    }
    @Override
    protected String getIntroducingEmailTemplatePath() {
        return TEMPLATE_PATH + INTRODUCING_TEMPLATE;
    }

    @Override
    protected void setCarrierRepRecipients(MailDto mailDto, Long clientId) {
        Client client = clientRepository.findOne(clientId);

        String presaleEmail = client.getPresalesEmail();
        String salesEmail = client.getSalesEmail();
        String specialtyEmail = client.getSpecialtyEmail();
        String bccEmail = client.getBroker().getBcc();

        if(isBlank(presaleEmail) && isBlank(salesEmail)) {
            throw new BaseException("Missing pre-sales and sales email from broker, new sale notification cannot be sent");
        }

        addMailRecipients(mailDto, TO, presaleEmail, salesEmail);
        if(shouldAddSpecialtyBrokerEmail(client)){
            mailDto.getRecipients().add(specialtyEmail);
        }
        addMailRecipients(mailDto, CC, bccEmail);
    }

}
