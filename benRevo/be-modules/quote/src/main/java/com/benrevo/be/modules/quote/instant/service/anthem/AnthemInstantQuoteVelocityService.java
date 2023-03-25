package com.benrevo.be.modules.quote.instant.service.anthem;

import static com.benrevo.common.enums.CarrierType.ANTHEM_BLUE_CROSS;
import static java.util.Comparator.comparing;
import static java.util.Optional.ofNullable;
import static org.apache.commons.lang.StringEscapeUtils.escapeXml;
import static org.apache.commons.lang3.StringUtils.containsIgnoreCase;
import static org.apache.commons.lang3.StringUtils.equalsIgnoreCase;

import com.benrevo.be.modules.shared.service.SharedRfpService;
import com.benrevo.common.annotation.AppCarrier;
import com.benrevo.common.dto.AnthemCVCalculatedPlanDetails;
import com.benrevo.common.dto.AnthemCVPlan;
import com.benrevo.common.dto.AnthemCVProductQualificationDto;
import com.benrevo.common.dto.CensusInfoDto;
import com.benrevo.common.dto.ClientDto;
import com.benrevo.common.exception.BaseException;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Person;
import com.benrevo.data.persistence.entities.RFP;
import java.io.IOException;
import java.io.StringWriter;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import org.apache.commons.lang3.StringUtils;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AppCarrier(ANTHEM_BLUE_CROSS)
@Transactional
public class AnthemInstantQuoteVelocityService {

    private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("MM/dd/yyyy");

    @Autowired
    private VelocityEngine velocityEngine;

    @Autowired
    private SharedRfpService sharedRfpService;

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

        if(containsIgnoreCase(rfp.getProduct(), "medical")) {
            velocityContext.put("paymentMethod", rfp.getPaymentMethod());
            velocityContext.put("commission", rfp.getCommission());
            velocityContext.put("G6", (plan == null || plan.getG6() == null) ? "N/A" : plan.getG6());
        }

        velocityContext.put("isQualified", isQualifiedForAnthemCV);
        velocityContext.put("disqualificationReason", isQualifiedForAnthemCV ? "N/A" : escapeXml(qualificationDto.getDisqualificationReason()));

        return velocityContext;
    }

    public String getSubmissionTemplate(String templatePath, Broker authenticatedBroker, Broker clientBroker, ClientDto client, AnthemCVProductQualificationDto qualificationDto) {
        VelocityContext velocityContext = fillContextRfpSubmissionEmail(authenticatedBroker, clientBroker, client, qualificationDto);

        try(StringWriter stringWriter = new StringWriter()) {
            velocityEngine.mergeTemplate(templatePath, "UTF-8", velocityContext, stringWriter);
            return stringWriter.toString();
        } catch(IOException e) {
            throw new BaseException(e.getMessage(), e);
        }
    }

    private VelocityContext fillContextRfpSubmissionEmail(Broker authenticatedBroker, Broker clientBroker, ClientDto client, AnthemCVProductQualificationDto qualificationDto) {

        VelocityContext velocityContext = new VelocityContext();

        String presalesFirstName = clientBroker.getPresalesFirstName();
        String salesFirstName = clientBroker.getSalesFirstName();
        velocityContext.put("presale_first_name", escapeXml(presalesFirstName));
        velocityContext.put("sales_first_name", escapeXml(salesFirstName));
        velocityContext.put("client_name", escapeXml(client.getClientName()));
        velocityContext.put("effective_date", client.getEffectiveDate());
        velocityContext.put("proposal_date", client.getDueDate());
        velocityContext.put("eligible_employees", client.getEligibleEmployees());

        velocityContext.put("submittedByGA", authenticatedBroker.isGeneralAgent());
        velocityContext.put("brokerage_name", escapeXml(clientBroker.getName()));
        velocityContext.put("ga_broker_name", escapeXml(authenticatedBroker.getName()));
        velocityContext.put("authenticated_broker_name", escapeXml(authenticatedBroker.getName()));

        if(!qualificationDto.isFullyQualified()) {
            velocityContext.put("disqual_reason", escapeXml(qualificationDto.getDisqualificationReason()));
        }

        velocityContext.put("StringUtils", StringUtils.class);
        CensusInfoDto censusInfo = sharedRfpService.getCensusInfoByClientCalculations(client.getId());
        velocityContext.put("ccsScore", censusInfo.getCensusLevel());

        return velocityContext;
    }
}
