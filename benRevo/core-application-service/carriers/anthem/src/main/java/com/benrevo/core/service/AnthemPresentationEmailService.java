package com.benrevo.core.service;

import static com.benrevo.common.enums.CarrierType.ANTHEM_BLUE_CROSS;
import static com.benrevo.common.util.MapBuilder.field;
import static com.benrevo.common.util.StreamUtils.mapToList;
import static com.benrevo.common.util.StreamUtils.mapToMap;
import static java.lang.String.format;
import static java.util.Arrays.stream;
import static java.util.Collections.singletonList;
import static java.util.Comparator.comparing;
import static java.util.stream.Collectors.toList;
import static org.apache.commons.lang3.StringUtils.containsIgnoreCase;
import static org.apache.commons.lang3.StringUtils.isNotBlank;

import com.benrevo.be.modules.presentation.email.PresentationEmailService;
import com.benrevo.be.modules.shared.service.BaseEmailService;
import com.benrevo.common.annotation.AppCarrier;
import com.benrevo.common.dto.AnthemCVCalculatedPlanDetails;
import com.benrevo.common.dto.AnthemCVProductQualificationDto;
import com.benrevo.common.dto.AttachmentDto;
import com.benrevo.common.dto.ClientDto;
import com.benrevo.common.dto.ClientMemberDto;
import com.benrevo.common.dto.FileDto;
import com.benrevo.common.dto.MailDto;
import com.benrevo.common.enums.FormType;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.DocumentGeneratorException;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.entities.Timeline;
import com.benrevo.data.persistence.mapper.ClientMapper;
import com.benrevo.data.persistence.repository.RfpCarrierRepository;
import com.google.common.base.Strings;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AppCarrier(ANTHEM_BLUE_CROSS)
@Transactional
public class AnthemPresentationEmailService extends PresentationEmailService {
    
    public static String NEW_SALE_NOTIFICATION_RECORD_TEMPLATE = "/new-sale-notification-record.vm";
    public static String ANTHEM_NEW_SALE_NOTIFICATION_SUBJECT = "Case Name: %s, Eff Date: %s";

    public AnthemPresentationEmailService() {
        appCarrier = new String[]{ ANTHEM_BLUE_CROSS.name() };
    }

    @Override
    protected String getNewSaleNotificationSubject(Client client) {
        return String.format(ANTHEM_NEW_SALE_NOTIFICATION_SUBJECT, client.getClientName(), client.getEffectiveDate());
    }

    @Override
    public void sendNewSaleNotificationRecord(Long clientId) {
        Client client = clientRepository.findOne(clientId);
        Broker broker = client.getBroker();
        ClientMemberDto user = getLoggedInUser();
        Broker authenticatedBroker = findCurrentBroker();
        
        String emailRecordTemplate = velocityService.getNewSaleNotificationTemplate(
                getPrefix() + NEW_SALE_NOTIFICATION_RECORD_TEMPLATE,
            authenticatedBroker,
                broker,
                client,
                user
            );
        MailDto mailRecordDto = new MailDto();
        mailRecordDto.setRecipient(user.getEmail());
        mailRecordDto.setSubject(getNewSaleNotificationSubject(client));
        mailRecordDto.setContent(emailRecordTemplate);
        send(mailRecordDto);

    }

}
