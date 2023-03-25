package com.benrevo.be.modules.onboarding.service;

import com.benrevo.be.modules.shared.service.SharedRfpQuoteService;
import com.benrevo.be.modules.shared.service.SharedRfpService;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.*;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.FormType;
import com.benrevo.common.enums.RateType;
import com.benrevo.common.exception.BadRequestException;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.logging.CustomLogger;
import com.benrevo.data.persistence.entities.*;
import com.benrevo.data.persistence.repository.AnswerRepository;
import com.benrevo.data.persistence.repository.RfpQuoteNetworkPlanRepository;
import com.benrevo.data.persistence.repository.RfpQuoteOptionNetworkRepository;
import com.google.common.base.Joiner;

import java.io.IOException;
import java.io.StringWriter;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Stream;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.benrevo.common.enums.CarrierType.carrierMatches;
import static com.benrevo.common.util.MapBuilder.field;
import static com.benrevo.common.util.StreamUtils.mapToList;
import static com.benrevo.common.util.StreamUtils.mapToMap;
import static java.lang.String.format;
import static java.util.Comparator.comparing;
import static java.util.Optional.ofNullable;
import static java.util.function.Function.identity;
import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toSet;
import static org.apache.commons.lang.StringEscapeUtils.escapeXml;
import static org.apache.commons.lang3.ObjectUtils.firstNonNull;
import static org.apache.commons.lang3.StringUtils.containsIgnoreCase;
import static org.apache.commons.lang3.StringUtils.equalsIgnoreCase;
import static org.apache.commons.lang3.StringUtils.isEmpty;

@Service
@Transactional
public class OnboardingVelocityService {

    @Autowired
    private CustomLogger LOGGER;

    @Autowired
    private VelocityEngine velocityEngine;

    @Autowired
    private SharedRfpService sharedRfpService;

    @Autowired
    private SharedRfpQuoteService rfpQuoteService;

    @Autowired
    private RfpQuoteOptionNetworkRepository rfpQuoteOptionNetworkRepository;
    
    @Autowired
    private RfpQuoteNetworkPlanRepository rfpQuoteNetworkPlanRepository;
    
    @Autowired
    private AnswerRepository answerRepository;
    
    @Value("${app.carrier}")
    String[] appCarrier;

    public String getOnboardingSubmissionTemplate(String templatePath, Broker authenticatedBroker, Broker broker, Client client) {
        VelocityContext velocityContext = fillContextOnboardingSubmissionEmail(authenticatedBroker, broker, client);

        try(StringWriter stringWriter = new StringWriter()) {
            velocityEngine.mergeTemplate(templatePath, "UTF-8", velocityContext, stringWriter);
            return stringWriter.toString();
        } catch(IOException e) {
            throw new BaseException(e.getMessage(), e);
        }
    }

    private VelocityContext fillContextOnboardingSubmissionEmail(Broker authenticatedBroker, Broker clientBroker, Client client) {
        
        VelocityContext velocityContext = new VelocityContext();

        velocityContext.put("submittedByGA", authenticatedBroker.isGeneralAgent());
        velocityContext.put("brokerage_name", escapeXml(clientBroker.getName()));
        velocityContext.put("ga_broker_name", escapeXml(authenticatedBroker.getName()));

        String presalesFirstName = client.getPresalesFirstName();
        String salesFirstName = client.getSalesFirstName();
        velocityContext.put("presale_first_name", escapeXml(presalesFirstName));
        velocityContext.put("sales_first_name", escapeXml(salesFirstName));
        velocityContext.put("client_name", escapeXml(client.getClientName()));
        velocityContext.put("effective_date", client.getEffectiveDate());
        velocityContext.put("proposal_date", client.getDueDate());
        velocityContext.put("eligible_employees", client.getEligibleEmployees());
        velocityContext.put("broker_name", escapeXml(clientBroker.getName()));
        velocityContext.put("StringUtils", StringUtils.class);
        CensusInfoDto censusInfo = sharedRfpService.getCensusInfoByClientCalculations(client.getClientId());
        velocityContext.put("ccsScore", censusInfo.getCensusLevel());
        
        return velocityContext;
    }

    public String[] getMeetingsAndPacketsPagesArray(Long clientId, String templatePath) {
        Map<String, String> answers = new HashMap<>(answerRepository.getAnswers(FormType.ANTHEM_KIT_REQUESTS.getMessage(), clientId));
        answers.putAll(answerRepository.getMultiselectableAnswers(FormType.ANTHEM_KIT_REQUESTS.getMessage(), clientId));

        if(answers.isEmpty()) {
            return ArrayUtils.EMPTY_STRING_ARRAY;
        }
        
        VelocityContext velocityContext = new VelocityContext();
        String isMeetingsPlanned = answers.get("are_open_enrollment_meetings_planned");
        velocityContext.put("are_open_enrollment_meetings_planned", isMeetingsPlanned);
        /*
        -If the user responds "No" to "Are Open Enrollment meetings planned?"; 
            the response for How many meetings should default to N/A on the output.

        -If the user responds "No" to "Are Open Enrollment meetings planned?"; 
            the Meeting #1 #2, etc sections should not appear.

        -If the user responds "Yes" to "Are Open Enrollment meetings planned?"; 
            the response for "Does the group want enrollment packets?" should default to "See Below" **Same for the English and Spanish boxes immediately below.
        */
        if (isMeetingsPlanned.equals("Yes")) {
            velocityContext.put("meetings_planned_count", Integer.parseInt(answers.get("meetings_planned_count")));
            velocityContext.put("does_the_group_want_enrollment_packets", "See Below");
            velocityContext.put("english_enrollment_packets_required", "See Below");
            velocityContext.put("spanish_enrollment_packets_required", "See Below");

            answers.keySet().forEach(k -> {
                if(!velocityContext.containsKey(k)) {
                    velocityContext.put(k, escapeXml(answers.get(k)));
                }
            });
        } else {
            velocityContext.put("meetings_planned_count", "N/A");
            
            String isPacketsRequired = answers.get("does_the_group_want_enrollment_packets");
            velocityContext.put("does_the_group_want_enrollment_packets", isPacketsRequired);
            if (isPacketsRequired.equals("Yes")) {
                velocityContext.put("english_enrollment_packets_required", escapeXml(answers.get("english_enrollment_packets_required")));
                velocityContext.put("spanish_enrollment_packets_required", escapeXml(answers.get("spanish_enrollment_packets_required")));
            } else {
                velocityContext.put("english_enrollment_packets_required", "N/A");
                velocityContext.put("spanish_enrollment_packets_required", "N/A");
            }
        }

        StringWriter stringWriter = new StringWriter();
        velocityEngine.mergeTemplate(templatePath, "UTF-8", velocityContext, stringWriter);

        return new String[] {stringWriter.toString()};
    }

    // testing purpose
    protected void setAppCarrier(String[] appCarrier) {
        this.appCarrier = appCarrier;
    }
    
    
}
