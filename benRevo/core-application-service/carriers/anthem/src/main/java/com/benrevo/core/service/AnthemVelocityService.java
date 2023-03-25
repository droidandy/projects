package com.benrevo.core.service;

import static java.util.Comparator.comparing;
import static org.apache.commons.lang.StringEscapeUtils.escapeXml;
import static org.apache.commons.lang3.StringUtils.containsIgnoreCase;
import static org.apache.commons.lang3.StringUtils.equalsIgnoreCase;

import com.benrevo.be.modules.presentation.service.RfpQuoteService;
import com.benrevo.common.dto.AccountRequestDto;
import com.benrevo.common.dto.AnthemCVCalculatedPlanDetails;
import com.benrevo.common.dto.AnthemCVPlan;
import com.benrevo.common.dto.AnthemCVProductQualificationDto;
import com.benrevo.common.dto.ClientDto;
import com.benrevo.common.dto.ContactUsDto;
import com.benrevo.common.dto.RequestDemoDto;
import com.benrevo.common.dto.SignupDto;
import com.benrevo.common.enums.FormType;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.logging.CustomLogger;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.entities.Timeline;
import com.benrevo.data.persistence.repository.AnswerRepository;
import com.benrevo.data.persistence.repository.RfpQuoteNetworkPlanRepository;
import com.benrevo.data.persistence.repository.RfpQuoteOptionNetworkRepository;
import java.io.IOException;
import java.io.StringWriter;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AnthemVelocityService {

    private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("MM/dd/yyyy");

    @Autowired
    private CustomLogger LOGGER;

    @Autowired
    private VelocityEngine velocityEngine;
   
    @Autowired
    private RfpQuoteService rfpQuoteService;

    @Autowired
    private RfpQuoteOptionNetworkRepository rfpQuoteOptionNetworkRepository;
    
    @Autowired
    private RfpQuoteNetworkPlanRepository rfpQuoteNetworkPlanRepository;
    
    @Autowired
    private AnswerRepository answerRepository;
    
    @Value("${app.carrier}")
    String[] appCarrier;
    
    public String[] getMeetingsAndPacketsPagesArray(Long clinetId, String templatePath) {
        Map<String, String> answers = new HashMap<>(answerRepository.getAnswers(FormType.ANTHEM_KIT_REQUESTS.getMessage(), clinetId));
        answers.putAll(answerRepository.getMultiselectableAnswers(FormType.ANTHEM_KIT_REQUESTS.getMessage(), clinetId));

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
                    velocityContext.put(k, answers.get(k));
                }
            });
        } else {
            velocityContext.put("meetings_planned_count", "N/A");
            
            String isPacketsRequired = answers.get("does_the_group_want_enrollment_packets");
            velocityContext.put("does_the_group_want_enrollment_packets", isPacketsRequired);
            if (isPacketsRequired.equals("Yes")) {
                velocityContext.put("english_enrollment_packets_required", answers.get("english_enrollment_packets_required"));
                velocityContext.put("spanish_enrollment_packets_required", answers.get("spanish_enrollment_packets_required"));
            } else {
                velocityContext.put("english_enrollment_packets_required", "N/A");
                velocityContext.put("spanish_enrollment_packets_required", "N/A");
            }
        }

        StringWriter stringWriter = new StringWriter();
        velocityEngine.mergeTemplate(templatePath, "UTF-8", velocityContext, stringWriter);

        return new String[] {stringWriter.toString()};
    }

    public String getIntoducingEmailTemplate(String templatePath, String agentName, String gaName) {

        VelocityContext velocityContext = new VelocityContext();
        velocityContext.put("general_agency", gaName);
        velocityContext.put("agent_name", agentName);

        try(StringWriter stringWriter = new StringWriter()) {
            velocityEngine.mergeTemplate(templatePath, "UTF-8", velocityContext, stringWriter);
            return stringWriter.toString();
        } catch(IOException e) {
            throw new BaseException(e.getMessage(), e);
        }
    }

    public String getCompletionEmailTemplate(String templatePath, String clientName, String item) {
        VelocityContext velocityContext = new VelocityContext();
        velocityContext.put("milestone_name", item);
        velocityContext.put("client_name", clientName);

        try(StringWriter stringWriter = new StringWriter()) {
            velocityEngine.mergeTemplate(templatePath, "UTF-8", velocityContext, stringWriter);
            return stringWriter.toString();
        } catch(IOException e) {
            throw new BaseException(e.getMessage(), e);
        }
    }

    public String getCompletionEmailTemplate(String templatePath, String clientName, List<Timeline> items) {

        VelocityContext velocityContext = new VelocityContext();
        velocityContext.put("items", items);
        velocityContext.put("client_name", clientName);

        try(StringWriter stringWriter = new StringWriter()) {
            velocityEngine.mergeTemplate(templatePath, "UTF-8", velocityContext, stringWriter);
            return stringWriter.toString();
        } catch(IOException e) {
            throw new BaseException(e.getMessage(), e);
        }
    }

    public String getTimelineCreationEmailTemplate(String templatePath, String clientName) {
        VelocityContext velocityContext = new VelocityContext();
        velocityContext.put("client_name", clientName);

        try(StringWriter stringWriter = new StringWriter()) {
            velocityEngine.mergeTemplate(templatePath, "UTF-8", velocityContext, stringWriter);
            return stringWriter.toString();
        } catch(IOException e) {
            throw new BaseException(e.getMessage(), e);
        }
    }
}
