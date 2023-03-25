package com.benrevo.be.modules.admin.service;

import static com.benrevo.common.enums.CarrierType.UHC;
import static com.benrevo.common.mail.SMTPMailer.setMailRecipients;
import static com.benrevo.common.util.MapBuilder.field;
import static java.util.Objects.isNull;
import static javax.mail.Message.RecipientType.CC;
import static javax.mail.Message.RecipientType.TO;
import static org.apache.commons.collections4.CollectionUtils.isEmpty;
import static org.apache.commons.lang3.StringUtils.isBlank;

import com.benrevo.be.modules.admin.service.BaseAdminEmailService;
import com.benrevo.common.annotation.AppCarrier;
import com.benrevo.common.dto.ClientDto;
import com.benrevo.common.dto.MailDto;
import com.benrevo.common.enums.AttributeName;
import com.benrevo.common.exception.BaseException;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientAttribute;
import com.benrevo.data.persistence.entities.ClientPlan;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AppCarrier(UHC)
@Transactional
public class UHCAdminEmailService extends BaseAdminEmailService {

    private static final String TEMPLATE_PATH = "/templates/uhc/email/";
    
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

    /**
     * Validates that the employer contribution format is set in each client plan
     * @param clientId
     */
    @Override
    public void validateRenewal(Long clientId) {

        Client client = clientRepository.findOne(clientId);
        if(client == null){
            throw new BaseException("Client not found").withFields(field("client_id", clientId));
        }

        ClientAttribute clientAttribute = client.getAttributes()
            .stream()
            .filter(a -> a.getName().equals(AttributeName.RENEWAL))
            .findFirst()
            .orElse(null);

        if(clientAttribute != null){
            // client is a renewal client so make sure ER contribution was set in admin tool
            for(ClientPlan cp : clientPlanRepository.findByClientClientId(clientId)){
                if(isNull(cp.getErContributionFormat())){
                    throw new BaseException("Client plan missing ERContributionFormat")
                        .withFields(
                            field("client_plan_id", cp.getClientPlanId()),
                            field("client_id", clientId)
                        );
                }
                if((isNull(cp.getTier1ErContribution()) || cp.getTier1ErContribution() == 0f)
                    && (isNull(cp.getTier2ErContribution()) || cp.getTier2ErContribution() == 0f)
                    && (isNull(cp.getTier3ErContribution()) || cp.getTier3ErContribution() == 0f)
                    && (isNull(cp.getTier4ErContribution()) || cp.getTier4ErContribution() == 0f)) {
                    throw new BaseException("Client plan missing ErContribution values")
                        .withFields(
                            field("client_plan_id", cp.getClientPlanId()),
                            field("client_id", clientId)
                        );
                }
            }

        }
    }

    @Override
    protected void setCarrierRepRecipients(MailDto mailDto, Long clientId) {
        Client client = clientRepository.findOne(clientId);
        if(client.getAttributes().stream().anyMatch(p -> p.getName().equals(AttributeName.RENEWAL))){
            String salesEmail = client.getSalesEmail();
            mailDto.getBccRecipients().add(salesEmail);
        } else {
            // new business - add only presales/sales
            String presaleEmail = client.getPresalesEmail();
            String salesEmail = client.getSalesEmail();

            mailDto.getBccRecipients().add(presaleEmail);
            mailDto.getBccRecipients().add(salesEmail);
        }
    }

}
