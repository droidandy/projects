package com.benrevo.core.service;

import static com.benrevo.common.enums.CarrierType.carrierMatches;
import static com.benrevo.common.util.MapBuilder.field;
import static java.util.Comparator.comparing;
import static org.apache.commons.lang.StringEscapeUtils.escapeXml;
import static org.apache.commons.lang3.StringUtils.containsIgnoreCase;
import static org.apache.commons.lang3.StringUtils.equalsIgnoreCase;

import com.benrevo.common.Constants;
import com.benrevo.common.dto.AccountRequestDto;
import com.benrevo.common.dto.AnthemCVCalculatedPlanDetails;
import com.benrevo.common.dto.AnthemCVPlan;
import com.benrevo.common.dto.AnthemCVProductQualificationDto;
import com.benrevo.common.dto.ClientDto;
import com.benrevo.common.dto.ContactUsDto;
import com.benrevo.common.dto.OptionDto;
import com.benrevo.common.dto.QuoteOptionPlanBriefDto;
import com.benrevo.common.dto.RequestDemoDto;
import com.benrevo.common.dto.SignupDto;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.FormType;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.logging.CustomLogger;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkPlan;
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
public class VelocityService {

    private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("MM/dd/yyyy");

    @Autowired
    private CustomLogger LOGGER;

    @Autowired
    private VelocityEngine velocityEngine;
    
    @Value("${app.carrier}")
    String[] appCarrier;

    public String getSignUpTemplate(String templatePath, SignupDto signupDto) {
        VelocityContext velocityContext = fillContextSignUpEmail(signupDto);

        try(StringWriter stringWriter = new StringWriter()) {
            velocityEngine.mergeTemplate(templatePath, "UTF-8", velocityContext, stringWriter);
            return stringWriter.toString();
        } catch(IOException e) {
            throw new BaseException(e.getMessage(), e);
        }
    }

    public String getRequestDemoTemplate(String templatePath, RequestDemoDto dto) {
        VelocityContext velocityContext = fillContextRequestDemoEmail(dto);

        try(StringWriter stringWriter = new StringWriter()) {
            velocityEngine.mergeTemplate(templatePath, "UTF-8", velocityContext, stringWriter);
            return stringWriter.toString();
        } catch(IOException e) {
            throw new BaseException(e.getMessage(), e);
        }
    }
    
    public String getAccountRequestTemplate(String templatePath, AccountRequestDto dto) {
        VelocityContext velocityContext = new VelocityContext();

        velocityContext.put("brokerName", dto.getBrokerName());
        velocityContext.put("gaName", dto.getGaName());
        velocityContext.put("agentName", dto.getAgentName());
        velocityContext.put("agentEmail", dto.getAgentEmail());
        velocityContext.put("created", dto.getCreated());

        try(StringWriter stringWriter = new StringWriter()) {
            velocityEngine.mergeTemplate(templatePath, "UTF-8", velocityContext, stringWriter);
            return stringWriter.toString();
        } catch(IOException e) {
            throw new BaseException(e.getMessage(), e);
        }
    }

    public String getContactUsTemplate(String templatePath, ContactUsDto contactUsDto) {
        VelocityContext velocityContext = fillContextContactUsEmail(contactUsDto);

        try(StringWriter stringWriter = new StringWriter()) {
            velocityEngine.mergeTemplate(templatePath, "UTF-8", velocityContext, stringWriter);
            return stringWriter.toString();
        } catch(IOException e) {
            throw new BaseException(e.getMessage(), e);
        }
    }

    private VelocityContext fillContextSignUpEmail(SignupDto signupDto){
        VelocityContext velocityContext = new VelocityContext();

        velocityContext.put("firstName", signupDto.getFirstName());
        velocityContext.put("lastName", signupDto.getLastName());
        velocityContext.put("brokerageFirmName", signupDto.getBrokerageFirmName());
        velocityContext.put("brokerageZipCode", signupDto.getBrokerageFirmZipCode());
        velocityContext.put("email", signupDto.getEmail());

        return velocityContext;
    }

    private VelocityContext fillContextRequestDemoEmail(RequestDemoDto dto){
        VelocityContext velocityContext = new VelocityContext();

        velocityContext.put("name", dto.getName());
        velocityContext.put("company", dto.getCompanyName());
        velocityContext.put("email", dto.getEmail());
        velocityContext.put("phone", dto.getPhoneNumber());

        return velocityContext;
    }

    private VelocityContext fillContextContactUsEmail(ContactUsDto contactUsDto){
        VelocityContext velocityContext = new VelocityContext();

        velocityContext.put("name", contactUsDto.getName());
        velocityContext.put("company", contactUsDto.getCompanyName());
        velocityContext.put("message", contactUsDto.getMessage());
        velocityContext.put("email", contactUsDto.getEmail());
        velocityContext.put("phone", contactUsDto.getPhoneNumber());

        return velocityContext;
    }

    public String[] getAnthemCVPagesArray(ClientDto clientDto, RFP rfp, String template,
                                          AnthemCVCalculatedPlanDetails planDetails, AnthemCVProductQualificationDto qualificationDto){

        StringWriter stringWriter = new StringWriter();
        VelocityContext velocityContext = fillContextForAnthemClearValuePlansPage(clientDto, rfp, planDetails, qualificationDto);
        velocityEngine.mergeTemplate(template, "UTF-8", velocityContext, stringWriter);

        return new String[]{
            stringWriter.toString()
        };
    }

    private VelocityContext fillContextForAnthemClearValuePlansPage(ClientDto clientDto, RFP rfp, AnthemCVCalculatedPlanDetails planDetails, AnthemCVProductQualificationDto qualificationDto) {
        boolean isQualifiedForAnthemCV = false;
        List<AnthemCVPlan> plans = null;
        AnthemCVPlan plan = null;
        VelocityContext velocityContext = new VelocityContext();
        DecimalFormat df = new DecimalFormat("#0.00");

        if(containsIgnoreCase(rfp.getProduct(), "medical")) {
            isQualifiedForAnthemCV = qualificationDto.isQualifiedForMedical();
            if(planDetails.getMedical().size() > 0) {
                plans = planDetails.getMedical();
            }
        } else if(containsIgnoreCase(rfp.getProduct(), "dental")) {
            isQualifiedForAnthemCV = qualificationDto.isQualifiedForDental();
            if(planDetails.getDental().size() > 0) {
                plans = planDetails.getDental();
            }
        }else if(containsIgnoreCase(rfp.getProduct(), "vision")) {
            isQualifiedForAnthemCV = qualificationDto.isQualifiedForVision();
            if(planDetails.getVision().size() > 0) {
                plans = planDetails.getVision();
            }
        }

        // Calculate Tier 1 rate differences based on corresponding incumbent plan
        if(plans != null) {
            plans.forEach(
                p -> {
                    if(rfp.getOptions() != null) {
                        final Optional<Float> currentRate = rfp.getOptions()
                            .stream()
                            .filter(o -> o.getRateTier1() != null && equalsIgnoreCase(o.getPlanType(), p.getNetworkType()))
                            .max(
                                comparing(
                                    o -> o.getCensusTier1() != null
                                         ? o.getCensusTier1()
                                         : o.getOosCensusTier1()
                                )
                            )
                            .map(o -> o.getRateTier1().floatValue());

                        currentRate.ifPresent(
                            cr -> {
                                if(cr != 0) {
                                    p.setCurrentEEtier1RateDiff(
                                        ((p.getTier1Rate() - cr) / cr) * 100);
                                }
                            }
                        );
                    }
                }
            );
        }

        velocityContext.put("DecimalFormat", df);
        velocityContext.put("ratingTiers", rfp.getRatingTiers());
        velocityContext.put("county", clientDto.getPredominantCounty());
        velocityContext.put("sicCode", clientDto.getSicCode());
        velocityContext.put("averageAge", clientDto.getAverageAge());
        velocityContext.put("effectiveDate", clientDto.getEffectiveDate());
        velocityContext.put("date", DATE_FORMAT.format(new Date()));
        velocityContext.put("clientName", escapeXml(clientDto.getClientName()));
        velocityContext.put("plans", plans);

        if(containsIgnoreCase(rfp.getProduct(), "medical")
            || containsIgnoreCase(rfp.getProduct(), "dental")) {
            velocityContext.put("paymentMethod", rfp.getPaymentMethod());
            velocityContext.put("commission", rfp.getCommission());
            velocityContext.put("G6", (plan == null || plan.getG6() == null) ? "N/A" : plan.getG6());
        }

        velocityContext.put("isQualified", isQualifiedForAnthemCV);
        velocityContext.put("disqualificationReason", isQualifiedForAnthemCV ? "N/A" : qualificationDto.getDisqualificationReason());

        return velocityContext;
    }

    public String getVerificationEmailTemplate(String templatePath, String agentName, String verificationCode) {

        VelocityContext velocityContext = new VelocityContext();
        velocityContext.put("verification_code", verificationCode);
        velocityContext.put("agent_name", agentName);
        
        try(StringWriter stringWriter = new StringWriter()) {
            velocityEngine.mergeTemplate(templatePath, "UTF-8", velocityContext, stringWriter);
            return stringWriter.toString();
        } catch(IOException e) {
            throw new BaseException(e.getMessage(), e);
        }
    }

    // testing purpose
    protected void setAppCarrier(String[] appCarrier) {
        this.appCarrier = appCarrier;
    }
    
    
}
