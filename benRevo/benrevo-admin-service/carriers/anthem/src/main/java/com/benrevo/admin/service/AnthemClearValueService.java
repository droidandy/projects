package com.benrevo.admin.service;

import com.benrevo.be.modules.salesforce.dto.SFOpportunity;
import com.benrevo.be.modules.salesforce.event.SalesforceEvent;
import com.benrevo.be.modules.shared.service.SharedRfpService;
import com.benrevo.common.Constants;
import com.benrevo.common.anthem.AnthemClearValueCalculator;
import com.benrevo.common.dto.*;
import com.benrevo.common.enums.ClientState;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.common.logging.CustomLogger;
import com.benrevo.common.security.AuthenticatedUser;
import com.benrevo.common.util.DateHelper;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.entities.RfpCarrier;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.RfpQuoteRepository;
import com.benrevo.data.persistence.repository.RfpRepository;
import com.benrevo.data.persistence.repository.RfpSubmissionRepository;
import io.vavr.control.Try;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.benrevo.be.modules.salesforce.enums.StageType.fromClientState;
import static com.benrevo.common.enums.CarrierType.ANTHEM_CLEAR_VALUE;
import static com.benrevo.common.enums.CarrierType.fromStrings;
import static com.benrevo.common.util.MapBuilder.field;
import static org.apache.commons.lang3.StringUtils.equalsIgnoreCase;

@Service
@Transactional
public class AnthemClearValueService implements InitializingBean {

    @Autowired
    private CustomLogger LOGGER;

    @Autowired
    private RfpRepository rfpRepository;

    @Autowired
    private SharedRfpService sharedRfpService;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private RfpQuoteRepository rfpQuoteRepository;

    @Autowired
    private RfpSubmissionRepository rfpSubmissionRepository;

    @Autowired
    private ApplicationEventPublisher publisher;

    @Value("${app.carrier}")
    String[] appCarrier;

    @Value("${app.env}")
    String appEnv;

    private static final String ANTHEM_CV_LARGE_CLAIMS_DISQUALIFICATION = "This client does not qualify for Clear Value due to large claims.";

    private boolean shouldAddMedicalOnePercent = true;
    
    @Autowired
    private AnthemClearValueCalculator calculator;

    @Override
    public void afterPropertiesSet() throws IOException {
        calculator.setShouldAddMedicalOnePercent(shouldAddMedicalOnePercent);
    }

    public void disqualify(Long clientId, String disqualificationType, String reasonType){

        if(!reasonType.equalsIgnoreCase("largeClaims")){
            throw new BaseException(String.format("Unsupported reason type; reasonType=%s",reasonType));
        }

        if(!disqualificationType.equalsIgnoreCase("full")){
            throw new BaseException(String.format("Unsupported disqualification type; disqualificationType=%s",disqualificationType));
        }

        List<RFP> rfps = rfpRepository.findByClientClientId(clientId);
        if(rfps == null) {
            throw new NotFoundException("RFPs not found")
                .withFields(
                    field("client_id", clientId)
                );
        }

        Client client = clientRepository.findOne(clientId);
        if(client == null) {
            throw new NotFoundException("Client not found").withFields(field("client_id", clientId));
        }

        if(!client.getClientState().equals(ClientState.QUOTED)){
            throw new BaseException(String.format(
                "Only clients in QUOTED state can be disqualified; clientState=%s", client.getClientState().name()
            ));
        }

        for(RFP rfp: rfps) {
            // Skip the Life, STD RFP Products
            if (!rfp.getProduct().equalsIgnoreCase(Constants.MEDICAL) && !rfp.getProduct()
                .equalsIgnoreCase(Constants.DENTAL) && !rfp.getProduct()
                .equalsIgnoreCase(Constants.VISION)) {
                continue;
            }
            RfpCarrier rc_cv = sharedRfpService.getRfpCarrier(
                ANTHEM_CLEAR_VALUE.name(), rfp.getProduct()
            );

            // set the rfp submission to disqualified for all products
            sharedRfpService.getRfpSubmission(rc_cv, client,
                new Date(), ANTHEM_CV_LARGE_CLAIMS_DISQUALIFICATION);
        }

        // Remove latest(true) from Anthem Clear Value quote that have already been issued
        List<RfpQuote> quotes = rfpQuoteRepository.
            findByRfpSubmissionClientClientIdAndLatestAndQuoteType(clientId,
                true, QuoteType.CLEAR_VALUE);

        for(RfpQuote rfpQuote : quotes){
            rfpQuote.setLatest(false);
            rfpQuoteRepository.save(rfpQuote);
        }

        // Salesforce
        Try.run(
            () -> publisher.publishEvent(
                new SalesforceEvent.Builder()
                    .withObject(
                        new SFOpportunity.Builder()
                            .withBrokerageFirm(client.getBroker().getName())
                            .withName(client.getClientName())
                            .withCarrier(fromStrings(appCarrier))
                            .withTest(!equalsIgnoreCase(appEnv, "prod"))
                            .withCarrierContact(client.getBroker().getSalesEmail())
                            .withCvDisqualificationReason(ANTHEM_CV_LARGE_CLAIMS_DISQUALIFICATION)
                            .withStageName(fromClientState(client.getClientState()))
                            .build()
                    )
                    .withEmail(
                        Try.of(
                            () -> ((AuthenticatedUser) SecurityContextHolder
                                .getContext()
                                .getAuthentication())
                                .getEmail()
                        ).getOrNull()
                    )
                    .build()
            )
        ).onFailure(t -> LOGGER.error(t.getMessage(), t));
    }

    public AnthemCVPlanBriefDto calculateAnthemCVRates(AnthemCVRateDto inputDto) {
        AnthemCVPlanBriefDto quote = new AnthemCVPlanBriefDto();
        calculator.setShouldAddMedicalOnePercent(inputDto.isTurnOnMedical1Percent());

        if (inputDto.getSicCode() == null) {
            LOGGER.warn("SicCode is null");
        }
        
        generateMedicalQuote(inputDto, quote);
        generateDentalQuote(inputDto, quote);
        generateVisionQuote(inputDto, quote);

        return quote;
    }

    private void generateMedicalQuote(AnthemCVRateDto inputDto, AnthemCVPlanBriefDto quoteDto){
        List<QuoteNetworkDto> medical = quoteDto.getMedical();

        calculator.getMedicalPlanMap().keySet().forEach(key -> {
            String networkName = key.getLeft();
            String networkType = key.getRight();

            QuoteNetworkDto networkDto = new QuoteNetworkDto();
            networkDto.setRfpQuoteNetwork(networkName);

            List<QuoteNetworkPlanDto> plans = new ArrayList<>();
            calculator.getMedicalPlanMap().get(key).forEach(anthemPlan -> {
                String name = anthemPlan.getMedName();

                QuoteNetworkPlanDto plan = new QuoteNetworkPlanDto();
                plan.setPlanName(name);
                plan.setPlanType(networkType);


                Float[] rates = calculator.getMedicalPlanRates(inputDto.getRatingTiers(), inputDto.getPredominantCounty(),
                    convertToDate(inputDto.getEffectiveDate()), inputDto.getAverageAge(), inputDto.getSicCode(),
                    inputDto.getPaymentMethod(), inputDto.getCommission(), anthemPlan);

                plan.setTier1Rate(getRate(rates, 1));
                plan.setTier2Rate(getRate(rates, 2));
                plan.setTier3Rate(getRate(rates, 3));
                plan.setTier4Rate(getRate(rates, 4));
                plans.add(plan);
            });
            networkDto.setQuoteNetworkPlans(plans);
            medical.add(networkDto);
        });
        quoteDto.setMedical(medical);
    }


    private static Float getRate(Float[] rates, int tier) {
        if (rates.length == 2) {
            switch (tier) {
                case 1:
                    return rates[0];
                case 2:
                    return rates[1];
                case 3:
                    return 0f;
                case 4:
                    return 0f;
                default:
                    return null;
            }
        } else if (rates.length == 3) {
            switch (tier) {
                case 1:
                    return rates[0];
                case 2:
                    return rates[1];
                case 3:
                    return rates[2];
                case 4:
                    return 0f;
                default:
                    return null;
            }
        } else {
            switch (tier) {
                case 1:
                    return rates[0];
                case 2:
                    return rates[1];
                case 3:
                    return rates[2];
                case 4:
                    return rates[3];
                default:
                    return null;
            }
        }
    }

    private void setDentalRates(QuoteNetworkPlanDto plan, Float[] rates){
        plan.setTier1Rate(getRate(rates, 1));
        plan.setTier2Rate(getRate(rates, 2));
        plan.setTier3Rate(getRate(rates, 3));
        plan.setTier4Rate(getRate(rates, 4));

    }

    private void generateDentalQuote(AnthemCVRateDto inputDto, AnthemCVPlanBriefDto quoteDto) {

        AnthemCVPlan highPlan = new AnthemCVPlan(Constants.ANTHEM_CV_DENTAL_HIGH_PLAN, null, null,
            Constants.ANTHEM_CV_DENTAL_DPPO_NETWORK, "DPPO", null);
        AnthemCVPlan mediumPlan = new AnthemCVPlan(Constants.ANTHEM_CV_DENTAL_MEDIUM_PLAN, null, null,
            Constants.ANTHEM_CV_DENTAL_DPPO_NETWORK, "DPPO", null);
        AnthemCVPlan lowPlan = new AnthemCVPlan(Constants.ANTHEM_CV_DENTAL_LOW_PLAN, null, null,
            Constants.ANTHEM_CV_DENTAL_DPPO_NETWORK, "DPPO", null);

        List<AnthemCVPlan> anthemCVDppoPlans = new ArrayList<>();
        anthemCVDppoPlans.add(highPlan);
        anthemCVDppoPlans.add(mediumPlan);
        anthemCVDppoPlans.add(lowPlan);


        List<QuoteNetworkDto> dental = quoteDto.getDental();

        // DPPO Network and plans
        QuoteNetworkDto dppoNetworkDto = new QuoteNetworkDto();
        dppoNetworkDto.setRfpQuoteNetwork(Constants.ANTHEM_CV_DENTAL_DPPO_NETWORK);


        List<QuoteNetworkPlanDto> dppoPlans = new ArrayList<>();
        AnthemCVDentalRates dentalRates = calculator.getDentalPlanRates(inputDto.getRatingTiers(),
            inputDto.getPredominantCounty().toUpperCase(), inputDto.getAverageAge(),
            inputDto.getSicCode(), DateHelper.fromStringToDate(inputDto.getEffectiveDate()), anthemCVDppoPlans, inputDto.getDentalPaymentMethod(), inputDto.getDentalCommission());

        QuoteNetworkPlanDto dentalHighPlan = new QuoteNetworkPlanDto();
        dentalHighPlan.setPlanName(Constants.ANTHEM_CV_DENTAL_HIGH_PLAN);
        dentalHighPlan.setPlanType("DPPO");
        setDentalRates(dentalHighPlan, dentalRates.getHighRates());


        QuoteNetworkPlanDto dentalMediumPlan = new QuoteNetworkPlanDto();
        dentalMediumPlan.setPlanName(Constants.ANTHEM_CV_DENTAL_MEDIUM_PLAN);
        dentalMediumPlan.setPlanType("DPPO");
        setDentalRates(dentalMediumPlan, dentalRates.getMediumRates());

        QuoteNetworkPlanDto dentalLowPlan = new QuoteNetworkPlanDto();
        dentalLowPlan.setPlanName(Constants.ANTHEM_CV_DENTAL_LOW_PLAN);
        dentalLowPlan.setPlanType("DPPO");
        setDentalRates(dentalLowPlan, dentalRates.getLowRates());

        dppoPlans.add(dentalHighPlan);
        dppoPlans.add(dentalMediumPlan);
        dppoPlans.add(dentalLowPlan);

        // DHMO Network and Plans
        QuoteNetworkDto dhmoNetworkDto = new QuoteNetworkDto();
        dhmoNetworkDto.setRfpQuoteNetwork(Constants.ANTHEM_CV_DENTAL_DHMO_NETWORK);

        List<QuoteNetworkPlanDto> dhmoPlans = new ArrayList<>();

        QuoteNetworkPlanDto dental2000APlan = new QuoteNetworkPlanDto();
        dental2000APlan.setPlanName(Constants.ANTHEM_CV_DENTAL_DHMO_2000A);
        dental2000APlan.setPlanType("DHMO");
        Float[] dhmoRates = calculator.getDentalPlanMap(DateHelper.fromStringToDate(inputDto.getEffectiveDate()))
            .get(inputDto.getRatingTiers()).get(Constants.ANTHEM_CV_DENTAL_DHMO_2000A);
        setDentalRates(dental2000APlan, dhmoRates);
        dhmoPlans.add(dental2000APlan);


        // add all the networks
        dppoNetworkDto.setQuoteNetworkPlans(dppoPlans);
        dhmoNetworkDto.setQuoteNetworkPlans(dhmoPlans);
        dental.add(dppoNetworkDto);
        dental.add(dhmoNetworkDto);
        quoteDto.setDental(dental);
    }


    private void generateVisionQuote(AnthemCVRateDto inputDto, AnthemCVPlanBriefDto quoteDto) {

        List<QuoteNetworkDto> vision = quoteDto.getVision();

        // Vision Network and plans
        QuoteNetworkDto visionNetworkDto = new QuoteNetworkDto();
        visionNetworkDto.setRfpQuoteNetwork(Constants.ANTHEM_CV_VISION_VPPO_NETWORK);

        Map<String, Float[]> plans = calculator.getVisionRates(inputDto.getRatingTiers());
        List<QuoteNetworkPlanDto> planList = new ArrayList<>();
        plans.entrySet().forEach(entry -> {
            QuoteNetworkPlanDto plan = new QuoteNetworkPlanDto();
            plan.setPlanName(entry.getKey());
            plan.setPlanType(Constants.VISION);

            Float[] rates = entry.getValue();
            plan.setTier1Rate(getRate(rates, 1));
            plan.setTier2Rate(getRate(rates, 2));
            plan.setTier3Rate(getRate(rates, 3));
            plan.setTier4Rate(getRate(rates, 4));
            planList.add(plan);
        });

        visionNetworkDto.setQuoteNetworkPlans(planList);
        vision.add(visionNetworkDto);
        quoteDto.setVision(vision);
    }

    private Date convertToDate(String dateStr){
        SimpleDateFormat formatter = new SimpleDateFormat("MM/dd/yyyy");

        try {
            return formatter.parse(dateStr);
        } catch (ParseException e) {
            LOGGER.info("Exception in fromStringToDate", e);
        }

        return null;
    }

    public static String getAnthemCvLargeClaimsDisqualification() {
        return ANTHEM_CV_LARGE_CLAIMS_DISQUALIFICATION;
    }
}
