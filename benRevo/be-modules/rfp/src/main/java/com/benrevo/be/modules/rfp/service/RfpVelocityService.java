package com.benrevo.be.modules.rfp.service;

import static com.benrevo.common.Constants.DENTAL;
import static com.benrevo.common.Constants.LIFE;
import static com.benrevo.common.Constants.LTD;
import static com.benrevo.common.Constants.MEDICAL;
import static com.benrevo.common.Constants.STD;
import static com.benrevo.common.Constants.VISION;
import static com.benrevo.common.enums.CarrierType.carrierMatches;
import static com.benrevo.common.util.MapBuilder.field;
import static java.lang.String.format;
import static java.util.Objects.isNull;
import static org.apache.commons.lang.StringEscapeUtils.escapeXml;
import static org.apache.commons.lang3.StringUtils.equalsAny;
import static org.apache.commons.lang3.StringUtils.equalsAnyIgnoreCase;
import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.apache.commons.lang3.StringUtils.isEmpty;

import com.benrevo.be.modules.rfp.util.RfpTypeValidator;
import com.benrevo.be.modules.shared.service.SharedClientMemberService;
import com.benrevo.be.modules.shared.service.SharedRfpService;
import com.benrevo.be.modules.shared.service.SharedVelocityService;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.CensusInfoDto;
import com.benrevo.common.dto.ClientDto;
import com.benrevo.common.dto.OptionDto;
import com.benrevo.common.dto.RfpDto;
import com.benrevo.common.dto.ancillary.AncillaryPlanDto;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.RateType;
import com.benrevo.common.exception.BadRequestException;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.logging.CustomLogger;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.entities.RfpToPnn;
import com.benrevo.data.persistence.entities.ancillary.AncillaryPlan;
import com.benrevo.data.persistence.entities.ancillary.RfpToAncillaryPlan;
import com.benrevo.data.persistence.mapper.RfpMapper;
import com.benrevo.data.persistence.repository.BrokerRepository;
import com.benrevo.data.persistence.repository.RfpToPnnRepository;
import com.benrevo.data.persistence.repository.ancillary.RfpToAncillaryPlanRepository;
import java.io.IOException;
import java.io.StringWriter;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import org.apache.commons.lang3.StringUtils;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.VelocityEngine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class RfpVelocityService extends SharedVelocityService {

    private static final String RFP_CLIENT_PAGE = Constants.RFP_TEMPLATE_LOCATION + "/rfp_client_page.vm";
    private static final String RFP_PRODUCT_PAGE = Constants.RFP_TEMPLATE_LOCATION + "/rfp_product_page.vm";
    private static final String RFP_ANCILLARY_BASICS_PAGE = Constants.RFP_TEMPLATE_LOCATION + "/ancillary_rfp_basics.vm";
    private static final String RFP_ANCILLARY_VOL_STD_LTD_PAGE = Constants.RFP_TEMPLATE_LOCATION + "/ancillary_vol_std_ltd.vm";
    private static final String RFP_ANCILLARY_VOL_LIFE_PAGE = Constants.RFP_TEMPLATE_LOCATION + "/ancillary_vol_life.vm";
    private static final String RFP_MEDICAL_LOGO = "https://s3-us-west-2.amazonaws.com/benrevo-prod-global-static/image/medical_icon_2x.png";
    private static final String RFP_DENTAL_LOGO = "https://s3-us-west-2.amazonaws.com/benrevo-prod-global-static/image/dental_icon_2x.png";
    private static final String RFP_VISION_LOGO = "https://s3-us-west-2.amazonaws.com/benrevo-prod-global-static/image/vision_icon_2x.png";
    private static final String RFP_LTD_STD_LOGO = "https://s3-us-west-2.amazonaws.com/benrevo-prod-global-static/image/std_ltd_icon_2x.png";
    private static final String RFP_LIFE_LOGO = "https://s3-us-west-2.amazonaws.com/benrevo-prod-global-static/image/life_icon_2x.png";
    private static final String RFP_LANGUAGE_PAGE = Constants.RFP_TEMPLATE_LOCATION + "/rfp_language_page.vm";
    private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("MM/dd/yyyy");

    @Autowired
    private CustomLogger LOGGER;

    @Autowired
    private VelocityEngine velocityEngine;

    @Autowired
    private SharedRfpService sharedRfpService;

    @Autowired
    private BaseRfpService baseRfpService;

    @Autowired
    private SharedClientMemberService sharedClientMemberService;

    @Autowired
    private BrokerRepository brokerRepository;

    @Autowired
    private RfpToPnnRepository rfpToPnnRepository;

    @Autowired
    private RfpToAncillaryPlanRepository rfpToAncillaryPlanRepository;

    @Value("${app.carrier}")
    String[] appCarrier;

    public String getSubmissionTemplate(String templatePath, Broker broker, ClientDto client) {
        VelocityContext velocityContext = fillContextRfpSubmissionEmail(broker, client);

        try(StringWriter stringWriter = new StringWriter()) {
            velocityEngine.mergeTemplate(templatePath, "UTF-8", velocityContext, stringWriter);
            return stringWriter.toString();
        } catch(IOException e) {
            throw new BaseException(e.getMessage(), e);
        }
    }

    private VelocityContext fillContextRfpSubmissionEmail(Broker authenticatedBroker, ClientDto client) {

        VelocityContext velocityContext = new VelocityContext();

        // presale and sale should come from main brokerage not the broker from authentication context
        Broker nonGABroker = brokerRepository.findOne(client.getBrokerId());
        String presalesFirstName = nonGABroker.getPresalesFirstName();
        String salesFirstName = nonGABroker.getSalesFirstName();

        velocityContext.put("presale_first_name", escapeXml(presalesFirstName));
        velocityContext.put("sales_first_name", escapeXml(salesFirstName));
        velocityContext.put("client_name", escapeXml(client.getClientName()));
        velocityContext.put("effective_date", client.getEffectiveDate());
        velocityContext.put("proposal_date", client.getDueDate());
        velocityContext.put("eligible_employees", client.getEligibleEmployees());
        velocityContext.put("submittedByGA", authenticatedBroker.isGeneralAgent());
        velocityContext.put("brokerage_name", escapeXml(nonGABroker.getName()));
        velocityContext.put("ga_broker_name", escapeXml(authenticatedBroker.getName()));
        velocityContext.put("authenticated_broker_name", escapeXml(authenticatedBroker.getName()));
        velocityContext.put("StringUtils", StringUtils.class);
        CensusInfoDto censusInfo = sharedRfpService.getCensusInfoByClientCalculations(client.getId());
        velocityContext.put("ccsScore", censusInfo.getCensusLevel());

        return velocityContext;
    }

    public String getRfpClientPage(final Broker broker, final ClientDto dto, String waitingPeriod) {
        VelocityContext velocityContext = fillContextForRfpClientPage(broker, dto, waitingPeriod);

        try(StringWriter stringWriter = new StringWriter()) {
            velocityEngine.mergeTemplate(RFP_CLIENT_PAGE, "UTF-8", velocityContext, stringWriter);

            return stringWriter.toString();
        } catch(IOException e) {
            throw new BaseException(e.getMessage(), e);
        }
    }

    public String[] getRfpPagesArray(final Broker broker, final ClientDto dto, String rfpType) {
        if(!RfpTypeValidator.checkType(rfpType)) {
            throw new BadRequestException(
                format(
                    "Invalid RFP type provided; rfp_type=%s",
                    rfpType
                )
            );
        }
        final RfpDto rfpDto = baseRfpService.getRfpForClientByType(dto.getId(), rfpType);
        
        return getRfpPagesArray(broker, dto, rfpDto);
    }
    
    public String[] getRfpPagesArray(final Broker broker, final ClientDto dto, RfpDto rfpDto) {

        String[] pageArray = null;

        switch(rfpDto.getProduct()) {
            case MEDICAL:
            case DENTAL:
            case VISION:
                pageArray = new String[]{
                    getProductRfpPage(broker, dto, rfpDto)
                };
                break;
            case LIFE:
            case STD:
            case LTD:
                pageArray = getAncillaryTemplate(broker, rfpDto);
                break;
        }

        return pageArray;
    }

    private VelocityContext fillContextForRfpClientPage(final Broker broker, final ClientDto dto, String waitingPeriod) {
        VelocityContext velocityContext = new VelocityContext();

        velocityContext.put("broker_firm", escapeXml(broker.getName()));
        velocityContext.put("broker_address", escapeXml(broker.getAddress()));
        velocityContext.put("broker_city", escapeXml(broker.getCity()));
        velocityContext.put("broker_state", escapeXml(broker.getState()));
        velocityContext.put("broker_zip", escapeXml(broker.getZip()));
        velocityContext.put("StringUtils", StringUtils.class);

        velocityContext.put("client_name", escapeXml(dto.getClientName()));
        velocityContext.put("client_address", escapeXml(dto.getAddress()));
        velocityContext.put("client_city", escapeXml(dto.getCity()));
        velocityContext.put("client_state", escapeXml(dto.getState()));
        velocityContext.put("client_zip", escapeXml(dto.getZip()));
        velocityContext.put("sic_code", dto.getSicCode());
        velocityContext.put("effective_date", dto.getEffectiveDate());
        velocityContext.put("due_date", dto.getDueDate());
        velocityContext.put("eligible_employees", dto.getEligibleEmployees());
        velocityContext.put("participating_employees", dto.getParticipatingEmployees());
        if(carrierMatches(CarrierType.UHC.name(), appCarrier)) {
            velocityContext.put("total_members", dto.getMembersCount() == null ? StringUtils.EMPTY : dto.getMembersCount());
        }
        velocityContext.put("cobra_enrollees", dto.getCobraCount());
        velocityContext.put("brokerage_logo", get2xBrokerageLogo(broker.getLogo()));
        velocityContext.put("date", DATE_FORMAT.format(new Date()));
        velocityContext.put("retirees", dto.getRetireesCount());
        velocityContext.put("domestic_partner", escapeXml(dto.getDomesticPartner()));
        velocityContext.put("waiting_period", (isEmpty(waitingPeriod)) ? " " : waitingPeriod);
        velocityContext.put("out_to_bid", escapeXml(dto.getOutToBidReason()));
        velocityContext.put("broker_contacts", escapeClientMemberDto(sharedClientMemberService.getByClientId(dto.getId())));
        return velocityContext;
    }


    private String[] getAncillaryTemplate(final Broker broker, final RfpDto rfpDto){
        ArrayList<String> pages = new ArrayList<>();
        List<RfpToAncillaryPlan> basicAncillaryPlans = rfpToAncillaryPlanRepository.findByRfp_RfpId(rfpDto.getId());

        if(!basicAncillaryPlans.isEmpty()){
            AncillaryPlanDto basicAncillaryPlanDto = RfpMapper.rfpPlanToRfpPlanDto(basicAncillaryPlans.get(0).getAncillaryPlan());
            String basicPage = getAncillaryProductRfpPage(broker, rfpDto, basicAncillaryPlanDto, rfpDto.getProduct());
            pages.add(basicPage);
        }

        String volProduct = "VOL_" + rfpDto.getProduct();
        RFP volRfp = rfpRepository.findByClientClientIdAndProduct(rfpDto.getClientId(), volProduct);
        if (volRfp != null) {
            List<RfpToAncillaryPlan> volAncillaryPlans = rfpToAncillaryPlanRepository.findByRfp_RfpId(volRfp.getRfpId());
            if(!volAncillaryPlans.isEmpty()){
                AncillaryPlanDto volAncillaryPlanDto = RfpMapper.rfpPlanToRfpPlanDto(volAncillaryPlans.get(0).getAncillaryPlan());
                String volPage = getAncillaryProductRfpPage(broker, rfpDto, volAncillaryPlanDto, volProduct);
                pages.add(volPage);
            }
        }
        return pages.toArray(new String[0]);
    }

    public String getAncillaryProductRfpPage(final Broker broker, final RfpDto rfpDto, final AncillaryPlanDto ancillaryPlanDto,
        String ancillaryProduct) {

        VelocityContext velocityContext = fillContextForAncillaryProductRfpPage(broker, rfpDto, ancillaryPlanDto, ancillaryProduct);

        try(StringWriter stringWriter = new StringWriter()) {
            velocityEngine.mergeTemplate(getAncillaryPage(ancillaryProduct), "UTF-8", velocityContext, stringWriter);
            return stringWriter.toString();
        } catch(IOException e) {
            throw new BaseException(e.getMessage(), e);
        }
    }

    private String getAncillaryPage(String ancillaryProduct){
        if(ancillaryProduct.equalsIgnoreCase(LIFE)) {
            return RFP_ANCILLARY_BASICS_PAGE;
        } else if(ancillaryProduct.equalsIgnoreCase("VOL_" + LIFE)) {
            return RFP_ANCILLARY_VOL_LIFE_PAGE;
        } else if(ancillaryProduct.equalsIgnoreCase(STD)) {
            return RFP_ANCILLARY_BASICS_PAGE;
        } else if(ancillaryProduct.equalsIgnoreCase("VOL_" + STD)) {
            return RFP_ANCILLARY_VOL_STD_LTD_PAGE;
        } else if(ancillaryProduct.equalsIgnoreCase(LTD)) {
            return RFP_ANCILLARY_BASICS_PAGE;
        } else if(ancillaryProduct.equalsIgnoreCase("VOL_" + LTD)) {
            return RFP_ANCILLARY_VOL_STD_LTD_PAGE;
        } else {
            throw new BaseException("Unknown ancillary product")
                .withFields(field("ancillary_product", ancillaryProduct));
        }
    }

    public VelocityContext fillContextForAncillaryProductRfpPage(Broker broker, RfpDto rfpDto,
        AncillaryPlanDto ancillaryPlanDto, String ancillaryProduct) {
        DecimalFormat df = new DecimalFormat("#0.000");

        VelocityContext velocityContext = new VelocityContext();
        velocityContext.put("broker_firm", escapeXml(broker.getName()));
        velocityContext.put("product", escapeXml(ancillaryProduct));
        velocityContext.put("full_product_name", escapeXml(getAncillaryFullProduct(ancillaryProduct)));
        velocityContext.put("plan", escapeAncillaryDto(ancillaryPlanDto));
        velocityContext.put("broker_of_record", rfpDto.isBrokerOfRecord() ? "Yes" : "No");
        velocityContext.put("commissions", getRfpCommission(rfpDto));
        velocityContext.put("brokerage_logo", get2xBrokerageLogo(broker.getLogo()));
        velocityContext.put("DecimalFormat", df);
        velocityContext.put("rate_text", escapeXml(getAncillaryRateTextByProduct(ancillaryProduct)));
        velocityContext.put("additional_requests", escapeXml(rfpDto.getComments()));
        velocityContext.put("StringUtils", StringUtils.class);

        if(rfpDto.getCarrierHistories() == null) {
            velocityContext.put("carrier_history", new ArrayList<>());
        } else {
            velocityContext.put("carrier_history", rfpDto.getCarrierHistories());
        }

        if(equalsAny(ancillaryProduct, LIFE, "VOL_" + LIFE)){
            velocityContext.put("product_logo", RFP_LIFE_LOGO);
        } else if(equalsAnyIgnoreCase(rfpDto.getProduct(), STD, LTD, "VOL_" + STD, "VOL_" + LTD)){
            velocityContext.put("product_logo", RFP_LTD_STD_LOGO);
        }

        return velocityContext;
    }

    private String getAncillaryFullProduct(String ancillaryProduct){
        if(ancillaryProduct.equalsIgnoreCase(LIFE)) {
            return "BASIC LIFE/AD&D";
        } else if(ancillaryProduct.equalsIgnoreCase("VOL_" + LIFE)) {
            return "VOLUNTARY LIFE/AD&D";
        } else if(ancillaryProduct.equalsIgnoreCase(STD)) {
            return "BASIC STD";
        } else if(ancillaryProduct.equalsIgnoreCase("VOL_" + STD)) {
            return "VOLUNTARY STD";
        } else if(ancillaryProduct.equalsIgnoreCase(LTD)) {
            return "BASIC LTD";
        } else if(ancillaryProduct.equalsIgnoreCase("VOL_" + LTD)) {
            return "VOLUNTARY LTD";
        } else {
            throw new BaseException("Unknown ancillary product")
                .withFields(field("ancillary_product", ancillaryProduct));
        }
    }

    private String getAncillaryRateTextByProduct(String ancillaryProduct){
        if(ancillaryProduct.equalsIgnoreCase(LIFE)) {
            return "RATES (per $1,000 of covered benefit)";
        } else if(ancillaryProduct.equalsIgnoreCase("VOL_" + LIFE)) {
            return "RATES (per $1,000 of covered benefit)";
        } else if(ancillaryProduct.equalsIgnoreCase(STD)) {
            return "RATES (per $10 of weekly benefit)";
        } else if(ancillaryProduct.equalsIgnoreCase("VOL_" + STD)) {
            return "RATES (per $10 of weekly benefit)";
        } else if(ancillaryProduct.equalsIgnoreCase(LTD)) {
            return "RATES (per $100 of monthly covered payroll)";
        } else if(ancillaryProduct.equalsIgnoreCase("VOL_" + LTD)) {
            return "RATES (per $100 of monthly covered payroll)";
        } else {
            throw new BaseException("Unknown ancillary product")
                .withFields(field("ancillary_product", ancillaryProduct));
        }
    }


    public String getProductRfpPage(final Broker broker, final ClientDto dto, final RfpDto rfpDto) {
        VelocityContext velocityContext = fillContextForProductRfpPage(broker, dto, rfpDto);

        try(StringWriter stringWriter = new StringWriter()) {
            velocityEngine.mergeTemplate(RFP_PRODUCT_PAGE, "UTF-8", velocityContext, stringWriter);
            return stringWriter.toString();
        } catch(IOException e) {
            throw new BaseException(e.getMessage(), e);
        }
    }

    public VelocityContext fillContextForProductRfpPage(final Broker broker, final ClientDto dto, RfpDto rfpDto) {
        VelocityContext velocityContext = new VelocityContext();
        DecimalFormat df = new DecimalFormat("#0.00");

        velocityContext.put("broker_firm", escapeXml(broker.getName()));
        velocityContext.put("date", DATE_FORMAT.format(new Date()));
        velocityContext.put("product", rfpDto.getProduct());
        velocityContext.put("self_funding", (rfpDto.isSelfFunding()) ? "Yes" : "No");
        velocityContext.put("brokerage_logo", get2xBrokerageLogo(broker.getLogo()));
        velocityContext.put("broker_of_record", rfpDto.isBrokerOfRecord() ? "Yes" : "No");
        velocityContext.put("DecimalFormat", df);
        velocityContext.put("StringUtils", StringUtils.class);

        if(rfpDto.getCarrierHistories() == null) {
            velocityContext.put("carrier_history", new ArrayList<>());
        } else {
            velocityContext.put("carrier_history", rfpDto.getCarrierHistories());
        }

        String commission = getRfpCommission(rfpDto);

        HashMap<Long, String> optionToCarrier = new HashMap();
        rfpDto.getOptions().forEach(o -> {
            RfpToPnn rfpToPnn = rfpToPnnRepository.findByRfpRfpIdAndOptionIdAndPlanType(
                rfpDto.getId(), o.getId(), o.getPlanType());

            if(rfpToPnn != null){
                optionToCarrier.put(o.getId(), rfpToPnn.getPnn().getNetwork().getCarrier().getDisplayName());
            }
        });

        velocityContext.put("optionToCarrier", optionToCarrier);
        velocityContext.put("commissions", commission);

        // always dollar for rates
        velocityContext = setDollarOrPercent(velocityContext, rfpDto.getContributionType());
        velocityContext.put("optionList", escapeOptions(rfpDto.getOptions()));
        velocityContext.put("numOfTiers", rfpDto.getRatingTiers());
        velocityContext.put("showOutOfStateContribution", showOutOfStateContribution(rfpDto.getOptions()));

        OptionDto firstOption = rfpDto.getOptions()
            .stream()
            .findFirst()
            .orElse(null);

        if(firstOption != null && firstOption.getRateType() != null){
            velocityContext.put("rate_type", firstOption.getRateType().name());
        }else{
            velocityContext.put("rate_type", RateType.COMPOSITE.name());
        }

        velocityContext.put("showOutOfStateRate", showOutOfStateRate(rfpDto.getOptions()));

        String kaiserA = ((rfpDto.isAlongside()) ? "Alongside" : "");
        String kaiserFT = ((rfpDto.isTakeOver()) ? "Full Takeover" : "");

        if(!kaiserA.isEmpty() && !kaiserFT.isEmpty()) {
            kaiserA += " and ";
        }

        kaiserA += kaiserFT;
        velocityContext.put("kaiser", kaiserA);

        Integer altTiers = rfpDto.getQuoteAlteTiers();
        String altTiersStr = (isNull(altTiers) || altTiers == 0) ? "N/A" : altTiers.toString();
        velocityContext.put("quote_alt_tiers", altTiersStr);

        velocityContext.put("large_claim", escapeXml(rfpDto.getLargeClaims()));
        velocityContext.put("additional_requests", escapeXml(rfpDto.getComments()));
        velocityContext.put("showRenewal", showRenewal(rfpDto.getOptions(), rfpDto.getRatingTiers()));
        velocityContext.put("showOutOfState", showOutOfStateRenewal(rfpDto.getOptions())
            || showOutOfStateRate(rfpDto.getOptions()) || showOutOfStateContribution(rfpDto.getOptions()));

        if(rfpDto.getProduct().equalsIgnoreCase(MEDICAL)){
            velocityContext.put("product_logo", RFP_MEDICAL_LOGO);
        } else if(rfpDto.getProduct().equalsIgnoreCase(DENTAL)){
            velocityContext.put("product_logo", RFP_DENTAL_LOGO);
        } else if(rfpDto.getProduct().equalsIgnoreCase(VISION)){
            velocityContext.put("product_logo", RFP_VISION_LOGO);
        }

        return velocityContext;
    }

    private String getRfpCommission(RfpDto rfpDto) {
        String paymentMethod = rfpDto.getPaymentMethod();
        String commission = rfpDto.getCommission();

        if(isBlank(paymentMethod)){
            return "%";
        }
        switch(paymentMethod) {
            case "COMMISSION":
                commission = "NET OF COMMISSION";
                break;
            case "PEPM":
                commission = "$ " + commission + " PEPM";
                break;
            default:
                commission += "%";
                break;
        }
        return commission;
    }

    /************************
     * Broker Language page
     ************************/

    public String getRfpBrokerLanguagePage(final Broker broker, String brokerLanguage) {

        VelocityContext velocityContext = new VelocityContext();
        velocityContext.put("broker_firm", escapeXml(broker.getName()));
        velocityContext.put("date", DATE_FORMAT.format(new Date()));
        velocityContext.put("broker_language", brokerLanguage);
        velocityContext.put("brokerage_logo", get2xBrokerageLogo(broker.getLogo()));
        velocityContext.put("StringUtils", StringUtils.class);

        try(StringWriter stringWriter = new StringWriter()) {
            velocityEngine.mergeTemplate(RFP_LANGUAGE_PAGE, "UTF-8", velocityContext, stringWriter);

            return stringWriter.toString();
        } catch(IOException e) {
            throw new BaseException(e.getMessage(), e);
        }
    }

    /************************
     * Helper Methods
     ************************/

    private List<OptionDto> escapeOptions(List<OptionDto> dtos){
        if(dtos != null) {
            dtos.forEach(dto -> {
                dto.setLabel(escapeXml(dto.getLabel()));
                dto.setPlanType(escapeXml(dto.getPlanType()));
                dto.setAltRequest(escapeXml(dto.getAltRequest()));
            });
        }
        return dtos;
    }

    private VelocityContext setDollarOrPercent(VelocityContext velocityContext, String dollarOrPercent) {
        String dollar = "";
        String percent = "";

        if(null == dollarOrPercent || dollarOrPercent.trim().isEmpty()) {
            LOGGER.warn("Missing field mapping on RFP, contribution type ($ or %) is not set. Using $ as default");

            dollar = "$"; //default value
        } else if(dollarOrPercent.equals(Constants.ER_CONTRIBUTION_TYPE_DOLLAR)) {
            dollar = "$";
        } else if(dollarOrPercent.equals(Constants.ER_CONTRIBUTION_TYPE_PERCENT)) {
            percent = "%";
        } else if(dollarOrPercent.equals(Constants.ER_CONTRIBUTION_TYPE_VOLUNTARY)) {
            velocityContext.put("isVoluntary", true);
        } else {
            LOGGER.warnLog(
                "Dollar or percent was not passed into number formatter for RFP generation",
                field("received_string", dollarOrPercent)
            );
        }

        velocityContext.put("dol", dollar);
        velocityContext.put("per", percent);

        return velocityContext;
    }

    private boolean showOutOfStateContribution(List<OptionDto> options) {
        boolean show = false;

        for(OptionDto o : options) {
            show |= o.isOutOfStateContribution();
        }

        return show;
    }

    private boolean showOutOfStateRate(List<OptionDto> options) {
        boolean show = false;

        for(OptionDto o : options) {
            show |= o.isOutOfStateRate();
        }

        return show;
    }

    private boolean showRenewal(List<OptionDto> options, int tierRates) {
        
        for(OptionDto o : options) {
            if ( ( tierRates >= 1 && o.getTier1Renewal() != null ) 
                    || ( tierRates >= 2 && o.getTier2Renewal() != null )
                    || ( tierRates >= 3 && o.getTier3Renewal() != null )
                    || ( tierRates >= 4 && o.getTier4Renewal() != null ) ) {
                return true;
            }
        }
        
        return false;
    }

    private boolean showOutOfStateRenewal(List<OptionDto> options) {
        boolean show = false;

        for(OptionDto o : options) {
            show |= o.isOutOfStateRenewal();
        }

        return show;
    }
}
