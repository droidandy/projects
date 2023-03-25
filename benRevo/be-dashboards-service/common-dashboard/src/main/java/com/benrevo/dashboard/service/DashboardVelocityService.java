package com.benrevo.dashboard.service;

import static com.benrevo.be.modules.shared.service.SharedRfpQuoteService.DENTAL_BUNDLE_DISCOUNT_PERCENT;
import static com.benrevo.be.modules.shared.service.SharedRfpQuoteService.VISION_BUNDLE_DISCOUNT_PERCENT;
import com.benrevo.common.dto.ClientAllQuoteDto;
import com.benrevo.common.dto.ClientRateBankDto;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.util.DateHelper;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.RfpQuoteSummary;
import static com.benrevo.common.util.MathUtils.round;
import java.io.IOException;
import java.io.StringWriter;
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.util.Locale;
import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class DashboardVelocityService {
    
    private final NumberFormat currencyFormatter = NumberFormat.getCurrencyInstance(Locale.CANADA); // show negative with "-"

    @Autowired
    private VelocityEngine velocityEngine;

    @Value("${app.carrier}")
    String[] appCarrier;

    public String getRewardsEmailTemplate(String templatePath) {

        VelocityContext velocityContext = new VelocityContext();
        // TODO: waiting template description
//        velocityContext.put("client_name", client.getClientName());
        
        try(StringWriter stringWriter = new StringWriter()) {
            velocityEngine.mergeTemplate(templatePath, "UTF-8", velocityContext, stringWriter);
            return stringWriter.toString();
        } catch(IOException e) {
            throw new BaseException(e.getMessage(), e);
        }
    }

    public String getRaterEmailTemplate(String templatePath, Client client, String userName, String notes, String raterName) {

        VelocityContext velocityContext = new VelocityContext();
        
        velocityContext.put("client_name", StringEscapeUtils.escapeXml(client.getClientName()));
        velocityContext.put("effective_date", DateHelper.fromDateToString(client.getEffectiveDate()));
        velocityContext.put("proposal_date", DateHelper.fromDateToString(client.getDueDate()));
        velocityContext.put("user_name", StringEscapeUtils.escapeXml(userName));
        velocityContext.put("notes", StringEscapeUtils.escapeXml(notes));
        velocityContext.put("rater_name", StringEscapeUtils.escapeXml(raterName));
        
        try(StringWriter stringWriter = new StringWriter()) {
            velocityEngine.mergeTemplate(templatePath, "UTF-8", velocityContext, stringWriter);
            return stringWriter.toString();
        } catch(IOException e) {
            throw new BaseException(e.getMessage(), e);
        }
    }

    public String getQuoteReadyEmailTemplate(String templatePath, Client client, RfpQuoteSummary rqs, ClientAllQuoteDto quoteDto) {

        VelocityContext velocityContext = new VelocityContext();
        
        velocityContext.put("client_name", StringEscapeUtils.escapeXml(client.getClientName()));
        velocityContext.put("effective_date", DateHelper.fromDateToString(client.getEffectiveDate()));
        velocityContext.put("medical_notes", StringEscapeUtils.escapeXml(rqs.getMedicalNotes()));
        velocityContext.put("dental_notes", StringEscapeUtils.escapeXml(rqs.getDentalNotes()));
        velocityContext.put("vision_notes", StringEscapeUtils.escapeXml(rqs.getVisionNotes()));
        velocityContext.put("life_std_ltd_notes", StringEscapeUtils.escapeXml(rqs.getLifeNotes()));
        velocityContext.put("projected_bundle_discount", quoteDto.getProjectedBundleDiscount());
        
        
        boolean medical = quoteDto.getMedicalQuote() != null && !QuoteType.DECLINED.equals(quoteDto.getMedicalQuote().getQuoteType());
        boolean kaiser = quoteDto.getKaiserQuote() != null && !QuoteType.DECLINED.equals(quoteDto.getKaiserQuote().getQuoteType());
        boolean dental = quoteDto.getDentalQuote() != null && !QuoteType.DECLINED.equals(quoteDto.getDentalQuote().getQuoteType());
        boolean vision = quoteDto.getVisionQuote() != null && !QuoteType.DECLINED.equals(quoteDto.getVisionQuote().getQuoteType());

        StringBuilder sb = new StringBuilder();
        if(medical || kaiser) {
            sb.append("Medical"); // only "Medical"
        }
        if(dental) {
            if(medical && vision) {
                sb.append(", "); // "Medical, Dental and Vision"
            } else if(medical ) {
                sb.append(" and "); // "Medical and Dental"
            }
            sb.append("Dental");
        }
        if(vision) {
            if(medical || dental) {
                sb.append(" and "); // "... and Vision"
            }
            sb.append("Vision");
        }

        velocityContext.put("proposals", sb.toString());
        
        try(StringWriter stringWriter = new StringWriter()) {
            velocityEngine.mergeTemplate(templatePath, "UTF-8", velocityContext, stringWriter);
            return stringWriter.toString();
        } catch(IOException e) {
            throw new BaseException(e.getMessage(), e);
        }
    }

    public String getRaterBankApprovalEmailTemplate(String templatePath, Client client,
        ClientRateBankDto dto, String note, String raterManagerFullName) {

        DecimalFormat df = new DecimalFormat("$#,##0.00;-$#,##0.00");
        VelocityContext velocityContext = new VelocityContext();

        velocityContext.put("client_name", StringEscapeUtils.escapeXml(client.getClientName()));
        velocityContext.put("effective_date", DateHelper.fromDateToString(client.getEffectiveDate()));
        velocityContext.put("proposal_date", DateHelper.fromDateToString(client.getDueDate()));
        velocityContext.put("manager_name", StringEscapeUtils.escapeXml(raterManagerFullName));
        velocityContext.put("rate_bank_amount", dto.getRateBankAmountRequested());
        velocityContext.put("pepy", dto.getPEPY());
        velocityContext.put("premium", dto.getTotalPremium());
        velocityContext.put("quoteVsCurrent", dto.getCostVsCurrent());
        velocityContext.put("quoteVsCurrentPercentage", dto.getCostVsCurrentPercentage());
        velocityContext.put("quoteVsRenewal", dto.getCostVsRenewal());
        velocityContext.put("quoteVsRenewalPercentage", dto.getCostVsRenewalPercentage());
        velocityContext.put("sar_name", StringEscapeUtils.escapeXml(client.getPresalesFullName()));
        velocityContext.put("sae_name", StringEscapeUtils.escapeXml(client.getSalesFullName()));
        velocityContext.put("brokerage_name", StringEscapeUtils.escapeXml(client.getBroker().getName()));
        velocityContext.put("DecimalFormat", df);
        velocityContext.put("plans", dto.getPlans());
        velocityContext.put("note", StringEscapeUtils.escapeXml(note));

        try(StringWriter stringWriter = new StringWriter()) {
            velocityEngine.mergeTemplate(templatePath, "UTF-8", velocityContext, stringWriter);
            return stringWriter.toString();
        } catch(IOException e) {
            throw new BaseException(e.getMessage(), e);
        }
    }

    public String getFinancialSummaryPage(String templatePath, Client client, ClientAllQuoteDto quoteDto) {

        VelocityContext velocityContext = new VelocityContext();
        
        float medicalCurrentTotal = 0F;
        float medicalRenewalTotal = 0F;
        float medicalRenewalVsCurrent = 0F;
        float medicalCostVsCurrent = 0F;
        float medicalTotalPremium = 0F;

        ClientRateBankDto medical = quoteDto.getMedicalQuote();
        if (medical != null && ObjectUtils.allNotNull(
                medical.getTotalPremium(), 
                medical.getCostVsCurrent(), 
                medical.getCostVsRenewal(), 
                medical.getCostVsCurrentPercentage() )) {

            velocityContext.put("medical_carrier", medical.getCarrierName());
            velocityContext.put("m_enroll", medical.getEnrollment());
            
            medicalTotalPremium = medical.getTotalPremium();
            medicalCostVsCurrent = medical.getCostVsCurrent();
            medicalCurrentTotal = medicalTotalPremium - medicalCostVsCurrent;
            medicalRenewalTotal = medicalTotalPremium - medical.getCostVsRenewal();
            medicalRenewalVsCurrent = medicalCostVsCurrent - medical.getCostVsRenewal();
    
            velocityContext.put("c_m_total", currencyFormatter.format(medicalCurrentTotal));
            velocityContext.put("r_m_total", currencyFormatter.format(medicalRenewalTotal));
            velocityContext.put("a_m_total", currencyFormatter.format(medical.getTotalPremium()));
            velocityContext.put("r_m_dollar", currencyFormatter.format(medicalRenewalVsCurrent));
            velocityContext.put("a_m_dollar", currencyFormatter.format(medicalCostVsCurrent));
            velocityContext.put("r_m_percent", round(medicalRenewalVsCurrent * 100 / medicalCurrentTotal, 2) + "%");
            velocityContext.put("a_m_percent", medical.getCostVsCurrentPercentage() + "%");
        }

        float dentalCurrentTotal = 0F;
        float dentalRenewalTotal = 0F;
        float dentalRenewalVsCurrent = 0F;
        float dentalCostVsCurrent = 0F;
        float dentalBundleDiscount = 0F;

        ClientRateBankDto dental = quoteDto.getDentalQuote();
        if (dental != null && ObjectUtils.allNotNull(
                dental.getTotalPremium(), 
                dental.getCostVsCurrent(), 
                dental.getCostVsRenewal(), 
                dental.getCostVsCurrentPercentage() )) {

            velocityContext.put("dental_carrier", dental.getCarrierName());
            velocityContext.put("d_enroll", dental.getEnrollment());

            dentalCostVsCurrent = dental.getCostVsCurrent();
            dentalCurrentTotal = dental.getTotalPremium() - dentalCostVsCurrent;
            dentalRenewalTotal = dental.getTotalPremium() - dental.getCostVsRenewal();
            dentalRenewalVsCurrent = dentalCostVsCurrent - dental.getCostVsRenewal();

            velocityContext.put("c_d_total", currencyFormatter.format(dentalCurrentTotal));
            velocityContext.put("r_d_total", currencyFormatter.format(dentalRenewalTotal));
            velocityContext.put("a_d_total", currencyFormatter.format(dental.getTotalPremium()));
            velocityContext.put("r_d_dollar", currencyFormatter.format(dentalRenewalVsCurrent));
            velocityContext.put("a_d_dollar", currencyFormatter.format(dentalCostVsCurrent));
            velocityContext.put("r_d_percent", round(dentalRenewalVsCurrent * 100 / dentalCurrentTotal, 2) + "%");
            velocityContext.put("a_d_percent", dental.getCostVsCurrentPercentage() + "%");
            
            if (dental.isEligibleForDiscount()) {
                dentalBundleDiscount = round(medicalTotalPremium * DENTAL_BUNDLE_DISCOUNT_PERCENT / 100f, 2);
                velocityContext.put("a_d_discount", currencyFormatter.format(dentalBundleDiscount));
            }
        }

        float visionCurrentTotal = 0F;
        float visionRenewalTotal = 0F;
        float visionRenewalVsCurrent = 0F;
        float visionCostVsCurrent = 0F;
        float visionBundleDiscount = 0F;

        ClientRateBankDto vision = quoteDto.getVisionQuote();
        if (vision != null && ObjectUtils.allNotNull(
                vision.getTotalPremium(), 
                vision.getCostVsCurrent(), 
                vision.getCostVsRenewal(), 
                vision.getCostVsCurrentPercentage() )) {

            velocityContext.put("vision_carrier", vision.getCarrierName());
            velocityContext.put("v_enroll", vision.getEnrollment());

            visionCostVsCurrent = vision.getCostVsCurrent();
            visionCurrentTotal = vision.getTotalPremium() - visionCostVsCurrent;
            visionRenewalTotal = vision.getTotalPremium() - vision.getCostVsRenewal();
            visionRenewalVsCurrent = visionCostVsCurrent - vision.getCostVsRenewal();
    
            velocityContext.put("c_v_total", currencyFormatter.format(visionCurrentTotal));
            velocityContext.put("r_v_total", currencyFormatter.format(visionRenewalTotal));
            velocityContext.put("a_v_total", currencyFormatter.format(vision.getTotalPremium()));
            velocityContext.put("r_v_dollar", currencyFormatter.format(visionRenewalVsCurrent));
            velocityContext.put("a_v_dollar", currencyFormatter.format(visionCostVsCurrent));
            velocityContext.put("r_v_percent", round(visionRenewalVsCurrent * 100 / visionCurrentTotal, 2) + "%");
            velocityContext.put("a_v_percent", vision.getCostVsCurrentPercentage() + "%");

            if (vision.isEligibleForDiscount()) {
                visionBundleDiscount = round(medicalTotalPremium * VISION_BUNDLE_DISCOUNT_PERCENT / 100f, 2);
                velocityContext.put("a_v_discount", currencyFormatter.format(visionBundleDiscount));
            }
        }

        float totalCurrentTotal = medicalCurrentTotal + dentalCurrentTotal + visionCurrentTotal;
        float totalRenewalTotal = medicalRenewalTotal + dentalRenewalTotal + visionRenewalTotal;
        float totalRenewalVsCurrent = medicalRenewalVsCurrent + dentalRenewalVsCurrent + visionRenewalVsCurrent;
        float totalCostVsCurrent = medicalCostVsCurrent + dentalCostVsCurrent + visionCostVsCurrent;
        
        velocityContext.put("c_t_total", currencyFormatter.format(totalCurrentTotal));
        velocityContext.put("r_t_total", currencyFormatter.format(totalRenewalTotal));
        velocityContext.put("a_t_total", currencyFormatter.format(quoteDto.getTotalAnnualPremium()));
        velocityContext.put("r_t_dollar", currencyFormatter.format(totalRenewalVsCurrent));
        velocityContext.put("a_t_dollar", currencyFormatter.format(totalCostVsCurrent));
        velocityContext.put("r_t_percent", round(totalRenewalVsCurrent * 100 / totalCurrentTotal, 2) + "%");
        velocityContext.put("a_t_percent", round(totalCostVsCurrent * 100 / totalCurrentTotal, 2) + "%");
        velocityContext.put("a_t_discount", currencyFormatter.format(dentalBundleDiscount + visionBundleDiscount));

        try(StringWriter stringWriter = new StringWriter()) {
            velocityEngine.mergeTemplate(templatePath, "UTF-8", velocityContext, stringWriter);
            return stringWriter.toString();
        } catch(IOException e) {
            throw new BaseException(e.getMessage(), e);
        }
    }

}
