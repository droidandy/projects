package com.benrevo.be.modules.quote.instant.service.anthem;

import com.benrevo.be.modules.shared.service.BaseEmailService;
import com.benrevo.be.modules.shared.service.DocumentGeneratorService;
import com.benrevo.be.modules.shared.service.SharedClientService;
import com.benrevo.common.annotation.AppCarrier;
import com.benrevo.common.dto.*;
import com.benrevo.common.exception.BaseException;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.repository.ClientRepository;
import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.benrevo.common.enums.CarrierType.ANTHEM_BLUE_CROSS;
import static com.benrevo.common.mail.SMTPMailer.setMailRecipients;
import static com.benrevo.common.util.MapBuilder.field;
import static java.util.Arrays.stream;
import static javax.mail.Message.RecipientType.CC;
import static javax.mail.Message.RecipientType.TO;
import static org.apache.commons.lang3.StringUtils.containsIgnoreCase;

@Service
@AppCarrier(ANTHEM_BLUE_CROSS)
@Transactional
public class AnthemInstantQuoteEmailService extends BaseEmailService {


    protected static String ANTHEM_CLEAR_VALUE_MEDICAL_PLANS_TEMPLATE = "/clear-value-medical-plans.vm";
    protected static String ANTHEM_CLEAR_VALUE_DENTAL_PLANS_TEMPLATE = "/clear-value-dental-plans.vm";
    protected static String ANTHEM_CLEAR_VALUE_VISION_PLANS_TEMPLATE = "/clear-value-vision-plans.vm";
    protected static String CLEAR_VALUE_SUBMISSION_TEMPLATE = "/clear-value-submission.vm";
    protected static String CLEAR_VALUE_DISQUAL_SUBMISSION_TEMPLATE = "/clear-value-disqual-submission.vm";

    @Autowired
    private SharedClientService sharedClientService;

    @Autowired
    private DocumentGeneratorService documentGeneratorService;
    
    @Autowired
    private ClientRepository clientRepository;
    
    @Autowired
    private AnthemInstantQuoteVelocityService anthemInstantQuoteVelocityService;

    protected String buildAnthemCVSubmissionEmailTemplate(Broker clientBroker, ClientDto clientDto, String template, AnthemCVProductQualificationDto qualificationDto) {
        final String templatePath = getPrefix() + template;
        return anthemInstantQuoteVelocityService
            .getSubmissionTemplate(templatePath, findCurrentBroker(), clientBroker, clientDto, qualificationDto);
    }

    public void sendClearValueSubmissionEmail(Long clientId, List<Long> rfpIds, AnthemCVCalculatedPlanDetails planDetails,
        AnthemCVProductQualificationDto qualificationDto) throws BaseException {

        final ClientDto clientDto = sharedClientService.getById(clientId);
        final Client client = clientRepository.findOne(clientId);
        final Broker clientBroker = brokerRepository.findOne(clientDto.getBrokerId());

        MailDto mailDto = new MailDto();
        // Set recipients
        setMailRecipients(mailDto, TO, clientBroker.getPresalesEmail(), clientBroker.getSalesEmail());
        if(shouldAddSpecialtyBrokerEmail(client)){
            mailDto.getRecipients().add(client.getSpecialtyEmail());
        }
        setMailRecipients(mailDto, CC, clientBroker.getBcc());

        if(mailDto.getBccRecipients() == null) {
            logger.errorLog(
                "The broker has empty bcc email field",
                field("broker_id", clientBroker.getBrokerId())
            );
        }

        if(qualificationDto.isFullyQualified()){
            mailDto.setContent(buildAnthemCVSubmissionEmailTemplate(
                clientBroker, clientDto, CLEAR_VALUE_SUBMISSION_TEMPLATE, qualificationDto));

            mailDto.setSubject("Clear Value Quoted: " + clientDto.getClientName());
        }else{
            mailDto.setContent(buildAnthemCVSubmissionEmailTemplate(
                clientBroker, clientDto, CLEAR_VALUE_DISQUAL_SUBMISSION_TEMPLATE, qualificationDto));

            mailDto.setSubject("Clear Value Disqualification: " + clientDto.getClientName());
        }

        List<RFP> rfps = rfpRepository.findByClientClientIdAndRfpIdIn(clientId, rfpIds);

        List<AttachmentDto> attachments = new ArrayList<>();
        String anthemCVPages[] = getAnthemCVPages(rfps, clientDto, planDetails, qualificationDto);

        ByteArrayOutputStream baos = documentGeneratorService.stringArrayToPdfOS(anthemCVPages);
        attachments.add(new AttachmentDto(
            "Anthem_Clear_Value_Calculation_Grid.pdf",
            baos.toByteArray()
        ));

        try{
            send(mailDto, attachments);
            storeEmailNotification(clientId, "ANTHEM_CLEAR_VALUE_SUBMISSION");
        } catch(BaseException e) {
            throw e;
        } catch(Exception e) {
            throw new BaseException("Error attempting to send anthem clear value attachment", e)
                .withFields(field("email", mailDto.getRecipients().toString()));
        }
    }

    protected String[] getAnthemCVPages(List<RFP> rfps, ClientDto clientDto,
        AnthemCVCalculatedPlanDetails planDetails,
        AnthemCVProductQualificationDto qualificationDto){

        String[] pages = new String[0];
        for(RFP rfp : rfps) {
            String template = getPrefix() + ANTHEM_CLEAR_VALUE_MEDICAL_PLANS_TEMPLATE;

            if(containsIgnoreCase(rfp.getProduct(), "dental")){
                template = getPrefix() + ANTHEM_CLEAR_VALUE_DENTAL_PLANS_TEMPLATE;
            } else if(containsIgnoreCase(rfp.getProduct(), "vision")){
                template = getPrefix() + ANTHEM_CLEAR_VALUE_VISION_PLANS_TEMPLATE;
            }

            pages = Stream.concat(
                stream(pages),
                stream(anthemInstantQuoteVelocityService
                    .getAnthemCVPagesArray(clientDto, rfp, template, planDetails, qualificationDto))
            ).toArray(String[]::new);
        }

        return pages;
    }
}
