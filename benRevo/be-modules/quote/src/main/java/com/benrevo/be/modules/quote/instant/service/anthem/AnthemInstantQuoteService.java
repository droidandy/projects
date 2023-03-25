package com.benrevo.be.modules.quote.instant.service.anthem;

import com.benrevo.be.modules.quote.instant.service.InstantQuoteService;
import com.benrevo.be.modules.salesforce.dto.SFOpportunity;
import com.benrevo.be.modules.salesforce.event.SalesforceEvent;
import com.benrevo.be.modules.shared.service.AdministrativeFeeService;
import com.benrevo.be.modules.shared.service.SharedClientService;
import com.benrevo.be.modules.shared.service.SharedRfpQuoteService;
import com.benrevo.be.modules.shared.service.SharedRfpService;
import com.benrevo.common.Constants;
import com.benrevo.common.annotation.AppCarrier;
import com.benrevo.common.anthem.AnthemClearValueCalculator;
import com.benrevo.common.dto.*;
import com.benrevo.common.enums.AttributeName;
import com.benrevo.common.enums.ClientState;
import com.benrevo.common.enums.PlanCategory;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.common.logging.CustomLogger;
import com.benrevo.common.security.AuthenticatedUser;
import com.benrevo.common.util.DateHelper;
import com.benrevo.common.util.MathUtils;
import com.benrevo.common.util.ObjectMapperUtils;
import com.benrevo.data.persistence.entities.*;
import com.benrevo.data.persistence.repository.*;
import com.google.common.collect.Iterables;
import io.vavr.control.Try;

import java.io.IOException;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.benrevo.be.modules.shared.util.PlanCalcHelper.calcAlterPlanTotal;
import static com.benrevo.be.modules.shared.util.PlanCalcHelper.calcClientPlanTotal;
import static com.benrevo.common.Constants.ANTHEM_CV_DISCLAIMER;
import static com.benrevo.common.Constants.ER_CONTRIBUTION_TYPE_VOLUNTARY;
import static com.benrevo.common.enums.CarrierType.*;
import static java.util.Objects.isNull;
import static org.apache.commons.lang3.StringUtils.equalsIgnoreCase;
import static org.springframework.web.util.HtmlUtils.htmlEscape;

@Service
@AppCarrier(ANTHEM_BLUE_CROSS)
@Transactional
public class AnthemInstantQuoteService extends InstantQuoteService implements InitializingBean {

    public static final String DHMO = "DHMO";
    public static final String DPPO = "DPPO";
	private static final String PPO = "PPO";
    private static final String HSA = "HSA";
    private static final String HMO = "HMO";
    private static final String VISION = "VISION";

    @Autowired
    private ApplicationEventPublisher publisher;

    @Autowired
    private RfpQuoteRepository rfpQuoteRepository;

    @Autowired
    private RfpQuoteVersionRepository rfpQuoteVersionRepository;

    @Autowired
    private NetworkRepository networkRepository;

    @Autowired
    private RfpQuoteNetworkRepository rfpQuoteNetworkRepository;

    @Autowired
    private PlanNameByNetworkRepository planNameByNetworkRepository;

    @Autowired
    private RfpRepository rfpRepository;

    @Autowired
    private ClientPlanRepository clientPlanRepository;

    @Autowired
    private RfpToPnnRepository rfpToPnnRepository;

    @Autowired
    private RfpQuoteOptionRepository rfpQuoteOptionRepository;

    @Autowired
    private RfpQuoteOptionNetworkRepository rfpQuoteOptionNetworkRepository;

    @Autowired
    private RfpQuoteNetworkPlanRepository rfpQuoteNetworkPlanRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private ClientRfpProductRepository clientRfpProductRepository;

    @Autowired
    private RfpQuoteSummaryRepository rfpQuoteSummaryRepository;

    @Autowired
    private AdministrativeFeeService administrativeFeeService;

    @Autowired
    private RfpSubmissionRepository submissionRepository;

    @Autowired
    private SharedRfpService sharedRfpService;

    @Autowired
    private SharedRfpQuoteService sharedRfpQuoteService;

    @Autowired
    private SharedClientService sharedClientService;

    @Autowired
    private RfpCarrierRepository rfpCarrierRepository;

    @Autowired
    private AnthemInstantQuoteEmailService anthemInstantQuoteEmailService;

    @Value("${app.carrier}")
    protected String[] appCarrier;

    @Value("${app.env}")
    protected String appEnv;

    @Autowired
    private CustomLogger logger;

    private boolean shouldAddMedicalOnePercent = true;
    
    @Autowired
    private AnthemClearValueCalculator calculator;

    //TODO Rip this hard coded CV quote summary out.
    private String DEFAULT_MEDICAL_QUOTE_SUMMARY = "Anthem Clear Value medical quote has not been provided because medical was not requested in the RFP";
    private String DEFAULT_DENTAL_QUOTE_SUMMARY = "Anthem Clear Value dental quote has not been provided because dental was not requested in the RFP";
    private String DEFAULT_VISION_QUOTE_SUMMARY = "Anthem Clear Value vision quote has not been provided because vision was not requested in the RFP";
    private String MEDICAL_QUOTE_SUMMARY = "Anthem Clear Value allows you to choose 1 HMO (Traditional, Select or Priority Select), 1 PPO (Traditional) and 1 H.S.A (Traditional) to replace your current carrier. Clear Value cannot be sold alongside another carrier and must be sold with at least one line of employer paid specialty coverage";
    private String DENTAL_QUOTE_SUMMARY = "Anthem Clear Value allows you to pick from 3 different employer paid DPPO plans as well as a DHMO plan to put alongside your Clear Value medical quote";
    private String VISION_QUOTE_SUMMARY = "Anthem Clear Value allows you to pick from 3 different employer paid Vision plans to put alongside your Clear Value medical quote";


    /**
     * Static final instance variables
     */
    private static final String OPTION_1 = "Option 1";
    private static final float PERCENT_CHANGE_FROM_CURRENT_OFR_MATCH_PLAN = -5f;

    public static final Date ANTHEM_CV_START_EFFECTIVE_DATE = DateHelper.fromStringToDate("01/01/2018");

    private static final String ANTHEM_CV_TIER1_DISQUALIFICATION_REASON = "This client does not qualify for an instant Clear Value quote because the minimum requirement for all coverages is 2-tier.";
    private static final String ANTHEM_CV_NO_MEDICAL_DISQUALIFICATION_REASON = "This client does not qualify for an instant Clear Value quote because medical was not submitted as part of the RFP.";
    private static final String ANTHEM_CV_MEDICAL_NO_DENTAL_OR_VISION_DISQUALIFICATION_REASON = "This client does not qualify for Anthem Clear Value because you did not include dental or vision in the RFP.";
    private static final String ANTHEM_CV_DENTAL_OR_VISION__VOLUNTARY_DISQUALIFICATION_REASON = "This client does not qualify for Anthem Clear Value because you did not include employer-paid dental or vision in the RFP.";
    private static final String ANTHEM_CV_RETIREES_DISQUALIFICATION_REASON = "This client does not qualify for Anthem Clear Value because retirees are covered on the plan.";
    private static final String ANTHEM_CV_DENTAL_VOLUNTARY_DISQUALIFICATION_REASON = "This client does not qualify for Anthem Clear Value dental and will not receive an instant dental quote because the current dental plan is voluntary.";
    private static final String ANTHEM_CV_VISION_VOLUNTARY_DISQUALIFICATION_REASON = "This client does not qualify for Anthem Clear Value vision and will not receive an instant vision quote because the current vision plan is voluntary.";
    private static final String ANTHEM_CV_EFFECTIVE_DATE_DISQUALIFICATION_REASON = "To receive a Clear Value quote the effective date must be on or after 01/01/2018";
    private static final String ANTHEM_CV_NOT_ENOUGH_ELIGIBLE_EMPLOYEES_DISQUALIFICATION_REASON = "The employer group must have a minimum of 101 full time employees, including full time equivalents, to qualify for Large Group benefits";
    private static final String ANTHEM_CV_PERCENT_PARTICIPATING_EMPLOYEES_REASON = "You may receive a standard quote with your RFP submission but Clear Value instant quote requires a minimum of 75% participation";

    @Override
    public void afterPropertiesSet() throws IOException {
        calculator.setShouldAddMedicalOnePercent(shouldAddMedicalOnePercent);
    }

    @Override
    public RfpSubmissionStatusDto startInstantQuoteGeneration(Long clientId, List<Long> rfpIds){
        Client client = clientRepository.findOne(clientId);
        return createRfpSubmissions(client, rfpIds);
    }

    private String returnFirstNonNull(String ... reasons){
        return Stream.of(reasons).filter(Objects::nonNull).findFirst().orElse(null);
    }

    //TODO Edit this section so that the qualification and disqualification reason is divided by product
    @Override
    public AnthemCVProductQualificationDto doesUserQualifyForClearValue(Long clientId, List<RFP> rfps, RfpSubmissionStatusDto rfpSubmissionStatusDto) {

        ClientDto clientDto = sharedClientService.getById(clientId);
        AnthemCVProductQualificationDto qualificationDto = new AnthemCVProductQualificationDto();
        RFP medicalRFP = null;
        RFP dentalRFP = null;
        RFP visionRFP = null;
        RfpSubmission medicalRfpSubmission = null;
        RfpSubmission dentalRfpSubmission = null;
        RfpSubmission visionRfpSubmission = null;
        boolean invalidCVTier = false;
        String reason = null;
        boolean medicalStatus = false, dentalStatus = false, visionStatus = false;

        // Find Medical RFP
        for(RFP rfp : rfps) {

            if(isNull(rfp)){
                continue;
            }

            RfpCarrier rc_cv = sharedRfpService.getRfpCarrier(
                ANTHEM_CLEAR_VALUE.name(), rfp.getProduct()
            );

            RfpSubmission submission = submissionRepository.findByRfpCarrierAndClient(rc_cv, clientRepository.findOne(clientId));
            if(rfp != null && rfp.getProduct().equalsIgnoreCase(Constants.MEDICAL)) {
                medicalRFP = rfp;
                medicalRfpSubmission = submission;
            }
            if(rfp != null && rfp.getProduct().equalsIgnoreCase(Constants.DENTAL)) {
                dentalRFP = rfp;
                dentalRfpSubmission = submission;
            }

            if(rfp != null && rfp.getProduct().equalsIgnoreCase(Constants.VISION)) {
                visionRFP = rfp;
                visionRfpSubmission = submission;
            }

            if(rfp != null && (rfp.getRatingTiers() == null || rfp.getRatingTiers() == 1)) {
                invalidCVTier = true;
            }

        }

        /** If user has rfp submission and is disqualified, then return that. If not, let the process proceed
         *  user has submitted so check for full or partial disqualification
         */
        String medicalReason = null, dentalReason = null, visionReason = null;
        if(medicalRfpSubmission != null && medicalRfpSubmission.getDisqualificationReason() != null){
            medicalReason = medicalRfpSubmission.getDisqualificationReason();
        }

        if(dentalRfpSubmission != null && dentalRfpSubmission.getDisqualificationReason() != null){
            dentalReason = dentalRfpSubmission.getDisqualificationReason();
        }

        if(visionRfpSubmission != null && visionRfpSubmission.getDisqualificationReason() != null){
            visionReason = visionRfpSubmission.getDisqualificationReason();
        }

        if(ObjectUtils.anyNotNull(medicalReason, dentalReason, visionReason)){
            // some disqualification to return it
            reason = returnFirstNonNull(medicalReason, dentalReason, visionReason);
            setQualificationStatuses(medicalReason == null,
                dentalReason == null, visionReason == null,
                reason, qualificationDto);
            rfpSubmissionStatusDto.setDisqualificationReason(reason);
            return qualificationDto;
        }

        boolean percentParticipatingEmployeesGreaterThan75Percent = false;
        if(clientHasDirectToPresentationAttribute(clientDto) || isProductVirgin(clientId, Constants.MEDICAL)){
            percentParticipatingEmployeesGreaterThan75Percent = true;
        }else{
            if(clientDto.getParticipatingEmployees() != null && clientDto.getEligibleEmployees() != null){
                double percent = ((double)clientDto.getParticipatingEmployees() / clientDto.getEligibleEmployees()) * 100;
                if(percent >= 75){
                    percentParticipatingEmployeesGreaterThan75Percent = true;
                }
            }
        }

        /** Start of Anthem Clear Value Full Disqualification Rules **/
        if(isNull(clientDto.getEligibleEmployees()) || clientDto.getEligibleEmployees() < 101L){
            reason = ANTHEM_CV_NOT_ENOUGH_ELIGIBLE_EMPLOYEES_DISQUALIFICATION_REASON;
        }else if(!percentParticipatingEmployeesGreaterThan75Percent) {
            reason = ANTHEM_CV_PERCENT_PARTICIPATING_EMPLOYEES_REASON;
        }else if(isNull(medicalRFP)){
            reason = ANTHEM_CV_NO_MEDICAL_DISQUALIFICATION_REASON;
        }else if(isNull(dentalRFP) && isNull(visionRFP) && !clientHasDirectToPresentationAttribute(clientDto)){
            reason = ANTHEM_CV_MEDICAL_NO_DENTAL_OR_VISION_DISQUALIFICATION_REASON;
        }else if(invalidCVTier){
            reason = ANTHEM_CV_TIER1_DISQUALIFICATION_REASON;
        }else if(!isNull(dentalRFP) && dentalRFP.getContributionType().equalsIgnoreCase(ER_CONTRIBUTION_TYPE_VOLUNTARY)
                && !isNull(visionRFP) && visionRFP.getContributionType().equalsIgnoreCase(ER_CONTRIBUTION_TYPE_VOLUNTARY)
                && !clientHasDirectToPresentationAttribute(clientDto)){
            reason = ANTHEM_CV_DENTAL_OR_VISION__VOLUNTARY_DISQUALIFICATION_REASON;
        }else if(clientDto.getRetireesCount() != null && clientDto.getRetireesCount() > 0){
            reason = ANTHEM_CV_RETIREES_DISQUALIFICATION_REASON;
        }else if(clientDto.getEffectiveDate() == null || DateHelper.fromStringToDate(clientDto.getEffectiveDate()).before(ANTHEM_CV_START_EFFECTIVE_DATE)){
            reason = ANTHEM_CV_EFFECTIVE_DATE_DISQUALIFICATION_REASON;
        }else if(isNull(dentalRFP) && !isNull(visionRFP) && !isNull(visionRFP.getContributionType()) && visionRFP.getContributionType().equalsIgnoreCase(ER_CONTRIBUTION_TYPE_VOLUNTARY)){
            reason = ANTHEM_CV_DENTAL_OR_VISION__VOLUNTARY_DISQUALIFICATION_REASON;
        }else if(isNull(visionRFP) && !isNull(dentalRFP) && !isNull(dentalRFP.getContributionType())
                && dentalRFP.getContributionType().equalsIgnoreCase(ER_CONTRIBUTION_TYPE_VOLUNTARY)){
            reason = ANTHEM_CV_DENTAL_OR_VISION__VOLUNTARY_DISQUALIFICATION_REASON;
        }
        /** End of Anthem Clear Value Full Disqualification Rules **/

        /** Start of Anthem Clear Value Partial Disqualification Rules **/
        else if(!isNull(dentalRFP) && !isNull(dentalRFP.getContributionType()) && dentalRFP.getContributionType().equalsIgnoreCase(ER_CONTRIBUTION_TYPE_VOLUNTARY)){
            reason = ANTHEM_CV_DENTAL_VOLUNTARY_DISQUALIFICATION_REASON;
            medicalStatus = true;
            visionStatus = true;
        }else if(!isNull(visionRFP) && !isNull(visionRFP.getContributionType()) &&visionRFP.getContributionType().equalsIgnoreCase(ER_CONTRIBUTION_TYPE_VOLUNTARY)){
            reason = ANTHEM_CV_VISION_VOLUNTARY_DISQUALIFICATION_REASON;
            medicalStatus = true;
            dentalStatus = true;
        }
        /** End of Anthem Clear Value Partial Disqualification Rules **/

        if(reason != null){
            setQualificationStatuses(medicalStatus, dentalStatus, visionStatus, reason, qualificationDto);
            rfpSubmissionStatusDto.setDisqualificationReason(reason);
        }

        return qualificationDto;
    }

    private boolean isProductVirgin(Long clientId, String product){
        ClientRfpProduct clientRfpProduct = clientRfpProductRepository.findByClientId(clientId).stream()
            .filter(r -> r.isVirginGroup() && r.getExtProduct().getName().equalsIgnoreCase(product))
            .findFirst()
            .orElse(null);

        return clientRfpProduct != null;
    }

    private boolean clientHasDirectToPresentationAttribute(ClientDto clientDto){
        List<AttributeName> attributeNames = clientDto.getAttributes();

        boolean hasDirectToPresentation = false;
        if(attributeNames == null){
            return hasDirectToPresentation;
        }
        for(AttributeName attr : attributeNames){
            if(attr.equals(AttributeName.DIRECT_TO_PRESENTATION)){
                hasDirectToPresentation = true;
                break;
            }
        }
        return hasDirectToPresentation;
    }

    private RfpSubmissionStatusDto createRfpSubmissions(Client client, List<Long> rfpIds){
        Date submissionDate = new Date();
        RfpQuoteSummary rfpQuoteSummary = createCVDefaultQuoteSummary();
        rfpQuoteSummary.setClient(client);

        Long clientId = client.getClientId();

        RfpSubmissionStatusDto CVSubmissionStatusDto = new RfpSubmissionStatusDto();
        CVSubmissionStatusDto.setType("CLEAR_VALUE");

        List<RFP> rfps = rfpRepository.findByClientClientIdAndRfpIdIn(clientId, rfpIds);
        
        AnthemCVProductQualificationDto qualificationDto = doesUserQualifyForClearValue(clientId, rfps, CVSubmissionStatusDto);

        AnthemCVCalculatedPlanDetails planDetails = new AnthemCVCalculatedPlanDetails();
        for(RFP rfp: rfps) {
            
            String category = rfp.getProduct();

            // Skip the Life, STD RFP Products
            if(!category.equalsIgnoreCase(Constants.MEDICAL) && !category.equalsIgnoreCase(Constants.DENTAL) && !category.equalsIgnoreCase(Constants.VISION)){
                continue;
            }
            RfpCarrier rc_cv = sharedRfpService.getRfpCarrier(ANTHEM_CLEAR_VALUE.name(), category);

            // create anthem cv rfp submission
            RfpSubmission anthemClearValueRfpSubmission = null;

            // do not create an rfpQuote for products user is not qualified for
            if(category.equals(Constants.MEDICAL) && !qualificationDto.isQualifiedForMedical()) {
                anthemClearValueRfpSubmission = sharedRfpService.getRfpSubmission(rc_cv, client, submissionDate, CVSubmissionStatusDto.getDisqualificationReason());
                rfpQuoteSummary.setMedicalNotes(qualificationDto.getDisqualificationReason());
                continue;
            } else if(category.equals(Constants.DENTAL) && !qualificationDto.isQualifiedForDental()){
                anthemClearValueRfpSubmission = sharedRfpService.getRfpSubmission(rc_cv, client, submissionDate, CVSubmissionStatusDto.getDisqualificationReason());
                rfpQuoteSummary.setDentalNotes(qualificationDto.getDisqualificationReason());
                continue;
            } else if(category.equals(Constants.VISION) && !qualificationDto.isQualifiedForVision()){
                anthemClearValueRfpSubmission = sharedRfpService.getRfpSubmission(rc_cv, client, submissionDate, CVSubmissionStatusDto.getDisqualificationReason());
                rfpQuoteSummary.setVisionNotes(qualificationDto.getDisqualificationReason());
                continue;
            }

            anthemClearValueRfpSubmission = sharedRfpService.getRfpSubmission(rc_cv, client, submissionDate, null);

            if(qualificationDto.isPartiallyQualified()) {
                setShouldAddMedicalOnePercent(true);
                RfpQuote rfpQuote = generateInstantQuote(rfp, anthemClearValueRfpSubmission, category, planDetails, true);

                // Time to create Option 1
                createOption1(rfpQuote, rfp);

                //create clear value activity
                sharedRfpQuoteService.saveOption1ReleaseActivity(clientId,category, rfpQuote);

                //TODO: rip out hard coded quote summary
                if(category.equals(Constants.MEDICAL)) {
                    rfpQuoteSummary.setMedicalNotes(MEDICAL_QUOTE_SUMMARY);
                } else if (category.equals(Constants.DENTAL)) {
                    rfpQuoteSummary.setDentalNotes(DENTAL_QUOTE_SUMMARY);
                } else if (category.equals(Constants.VISION)) {
                    rfpQuoteSummary.setVisionNotes(VISION_QUOTE_SUMMARY);
                }
            }
        }
        if(qualificationDto.isPartiallyQualified()) {
            RfpQuoteSummary mergedQuoteSummary = mergeQuoteSummary(client.getClientId(), rfpQuoteSummary);
            mergedQuoteSummary.setUpdated(new Date());
            rfpQuoteSummaryRepository.save(mergedQuoteSummary);

            // toggle client's state after quoting Clear Value
            client.setClientState(ClientState.QUOTED);
            clientRepository.save(client);

            // do not set disqualification reason if client partially qualifies for Anthem CV
            CVSubmissionStatusDto.setDisqualificationReason(null);
        }

        CVSubmissionStatusDto.setSubmissionDate(submissionDate);
        CVSubmissionStatusDto.setRfpSubmittedSuccessfully(qualificationDto.isPartiallyQualified());

        // Send Anthem Clear Value submission email to broker's presales and sales person
        anthemInstantQuoteEmailService
            .sendClearValueSubmissionEmail(client.getClientId(), rfpIds, planDetails, qualificationDto);

        // Salesforce
        Try.run(() -> publisher.publishEvent(
            new SalesforceEvent.Builder()
                .withObject(
                    new SFOpportunity.Builder()
                        .withBrokerageFirm(client.getBroker().getName())
                        .withName(client.getClientName())
                        .withCarrier(fromStrings(appCarrier))
                        .withTest(!equalsIgnoreCase(appEnv, "prod"))
                        .withEffectiveDate(client.getEffectiveDate())
                        .withEligibleEmployees(client.getEligibleEmployees())
                        .withParticipatingEmployees(client.getParticipatingEmployees())
                        .withClearValueQuoteIssued(CVSubmissionStatusDto.isRfpSubmittedSuccessfully())
                        .withCvDisqualificationReason(CVSubmissionStatusDto.getDisqualificationReason())
                        .withCloseDate(client.getDueDate())
                        .withRfpSubmitted(CVSubmissionStatusDto.getSubmissionDate())
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
        ).onFailure(t -> logger.error(t.getMessage(), t));

        return CVSubmissionStatusDto;

    }

    private RfpQuoteSummary mergeQuoteSummary(Long clientId, RfpQuoteSummary summary){
        RfpQuoteSummary savedSummary = rfpQuoteSummaryRepository.findByClientClientId(clientId);

        if(savedSummary == null){
            return summary;
        }else{
            // time to merge the summaries
            if(savedSummary.getMedicalNotes() != null) {
                savedSummary.setMedicalNotes(summary.getMedicalNotes() + System.lineSeparator() + savedSummary.getMedicalNotes());
            }else{
                savedSummary.setMedicalNotes(summary.getMedicalNotes());
            }
            if(savedSummary.getDentalNotes() != null){
                savedSummary.setDentalNotes(summary.getDentalNotes() + System.lineSeparator() + savedSummary.getDentalNotes());
            }else{
                savedSummary.setDentalNotes(summary.getDentalNotes());
            }
            if(savedSummary.getVisionNotes() != null){
                savedSummary.setVisionNotes(summary.getVisionNotes() + System.lineSeparator() + savedSummary.getVisionNotes());
            }else{
                savedSummary.setVisionNotes(summary.getVisionNotes());
            }
            return savedSummary;
        }
    }

    /** TODO How to map client plan to network.
     * TODO: Ojas:  Medical - pick one network from each type(HMO, PPO, HSA)
     * TODO:        Dental it depends on norcal or socal. nor cal you get DPPO and so cal you get DHMO
     * TODO:        Vision, only one
     */
    public Long createOption1(RfpQuote rfpQuote, RFP rfp) {
        RfpQuoteOption option = new RfpQuoteOption();
        option.setRfpQuote(rfpQuote);
        option.setRfpQuoteOptionName(OPTION_1);
        option.setRfpQuoteVersion(rfpQuote.getRfpQuoteVersion());
        option = rfpQuoteOptionRepository.save(option);
        rfpQuote.getRfpQuoteOptions().add(option);
        final RfpQuoteOption finalOption = option;

        PlanCategory planCategory = PlanCategory.valueOf(rfp.getProduct());
        List<ClientPlan> clientPlanList = clientPlanRepository.findByClientClientIdAndPnnPlanTypeIn(rfpQuote.getRfpSubmission().getClient().getClientId(), planCategory.getPlanTypes());

        Map<String, ClientPlan> basePlans = new HashMap<>();
        basePlans.put("HMO", findBaseCurrentPlan(clientPlanList, "HMO"));
        basePlans.put("PPO", findBaseCurrentPlan(clientPlanList, "PPO"));
        basePlans.put("HSA", findBaseCurrentPlan(clientPlanList, "HSA"));

        Map<String, RfpQuoteNetworkPlan> baseRfpQuoteNetworkPlans = findBaseRfpQuoteNetworkPlan(basePlans, finalOption, rfp);

        Set<String> clientPlans = clientPlanList.stream()
            .filter(cp -> cp.getPnn() != null)
            .map(cp -> cp.getPnn().getPlanType()).collect(Collectors.toSet());

        final List<RfpQuoteOptionNetwork> rqonsForCopy = new ArrayList<>();
        clientPlanList.forEach(clientPlan -> {
            RfpQuoteOptionNetwork rqon = new RfpQuoteOptionNetwork();
            rqon.setRfpQuoteVersion(finalOption.getRfpQuoteVersion());
            rqon.setRfpQuoteOption(finalOption);

            rqon.setClientPlan(clientPlan);
            rqon.setOutOfState(clientPlan.isOutOfState());

            rqon.setErContributionFormat(clientPlan.getErContributionFormat());
            rqon.setTier1ErContribution(floatValue(clientPlan.getTier1ErContribution()));
            rqon.setTier2ErContribution(floatValue(clientPlan.getTier2ErContribution()));
            rqon.setTier3ErContribution(floatValue(clientPlan.getTier3ErContribution()));
            rqon.setTier4ErContribution(floatValue(clientPlan.getTier4ErContribution()));

            rqon.setTier1Census(longValue(clientPlan.getTier1Census()));
            rqon.setTier2Census(longValue(clientPlan.getTier2Census()));
            rqon.setTier3Census(longValue(clientPlan.getTier3Census()));
            rqon.setTier4Census(longValue(clientPlan.getTier4Census()));

            if (clientPlan.getPnn() != null) {
                String networkType = clientPlan.getPnn().getNetwork().getType();
                RfpQuoteNetwork matchNetwork = findMatchNetwork(rqon, networkType);
                rqon.setRfpQuoteNetwork(matchNetwork);
                RfpQuoteNetworkPlan selectedPlan;

                if(isProductVirgin(rfp.getClient().getClientId(), rfp.getProduct())){
                    selectedPlan = getVirginProductSelectedPlan(matchNetwork, networkType, rfp.getClient().getPredominantCounty(),
                        rfp.getClient().getEffectiveDate());
                } else{

                    if (rfp.getProduct().equals(Constants.MEDICAL)) {
                        selectedPlan = baseRfpQuoteNetworkPlans.get(networkType);
                    } else {
                        selectedPlan = findMatchPlan(rqon, clientPlan, matchNetwork);
                    }
                }

                if(selectedPlan != null) {
                    selectedPlan.setMatchPlan(true);
                    rqon.setSelectedRfpQuoteNetworkPlan(selectedPlan);
                }

                if("HSA".equals(networkType)) {
                    Carrier carrier = finalOption.getRfpQuote().getRfpSubmission().getRfpCarrier().getCarrier();
                    rqon.setAdministrativeFee(administrativeFeeService.getDefault(carrier.getCarrierId()));
                }
            }
            if (rfp.getProduct().equals(Constants.MEDICAL) && clientPlan.getRxPnn() != null) {
                String rxNetworkType = clientPlan.getRxPnn().getNetwork().getType();
                RfpQuoteNetwork matchRxNetwork = findMatchNetwork(rqon, rxNetworkType);
                RfpQuoteNetworkPlan selectedRxPlan = findMatchPlan(rqon, clientPlan, matchRxNetwork);
                if (selectedRxPlan != null) {
                    selectedRxPlan.setMatchPlan(true);
                    rqon.setSelectedRfpQuoteNetworkRxPlan(selectedRxPlan);
                }
            }
            rqonsForCopy.add(rqon);
            rfpQuoteOptionNetworkRepository.save(rqon);
        });
        option.getRfpQuoteOptionNetworks().addAll(rqonsForCopy);


        if(rfp.getProduct().equals(Constants.DENTAL)
            && "Northern".equals(getDentalLocale(rfp.getClient().getPredominantCounty(), rfp.getClient().getEffectiveDate()))
            && clientPlans.size() == 1
            && DHMO.equals(Iterables.getFirst(clientPlans, null))) {
            RfpQuoteOptionNetwork dppoRqon = new RfpQuoteOptionNetwork();

            ObjectMapperUtils.map(rqonsForCopy.get(0), dppoRqon);
            dppoRqon.setRfpQuoteOptionNetworkId(null);
            dppoRqon.setClientPlan(null);

            RfpQuoteNetwork matchNetwork = findMatchNetwork(dppoRqon, DPPO);
            dppoRqon.setRfpQuoteNetwork(matchNetwork);
            RfpQuoteNetworkPlan selectedPlan;

            if(isProductVirgin(rfp.getClient().getClientId(), rfp.getProduct())){
                selectedPlan = getVirginProductSelectedPlan(matchNetwork, DPPO, rfp.getClient().getPredominantCounty(),
                    rfp.getClient().getEffectiveDate());
            }else{
                selectedPlan = findMatchPlan(dppoRqon, rqonsForCopy.get(0).getClientPlan(), matchNetwork);
            }
            if (selectedPlan != null) {
                selectedPlan.setMatchPlan(true);
                dppoRqon.setSelectedRfpQuoteNetworkPlan(selectedPlan);
            }
            rfpQuoteOptionNetworkRepository.save(dppoRqon);
            option.getRfpQuoteOptionNetworks().add(dppoRqon);
        }
        return option.getRfpQuoteOptionId();
    }

    private RfpQuoteNetworkPlan getVirginProductSelectedPlan(RfpQuoteNetwork rqn, String networkType, String county,
        Date effectiveDate) {

        String clientLocale = getDentalLocale(county, effectiveDate);

        if(networkType.equalsIgnoreCase("HMO")){
            return findVirginPlanInNetwork(rqn, "S-Anthem Clear Value HMO 20/40/250/4 days 4000 OOP Rx:Essential $5/$20/$50/$70/30%");
        }else if(networkType.equalsIgnoreCase("PPO")){
            return findVirginPlanInNetwork(rqn, "T-Anthem Clear Value PPO 2500 Rx:Essential $5/$20/$50/$70/30%");
        }else if(networkType.equalsIgnoreCase("HSA")){
            return findVirginPlanInNetwork(rqn, "T-Anthem Clear Value PPO HSA 3500/30/50 Rx:Essential $5/$20/$50/$70/30%");
        }else if(networkType.equalsIgnoreCase("DHMO") && clientLocale == null){
            return findVirginPlanInNetwork(rqn, "DentalNet 2000A");
        }else if(networkType.equalsIgnoreCase("DPPO") && clientLocale == null){
            return findVirginPlanInNetwork(rqn, "Medium Plan");
        }else if(networkType.equalsIgnoreCase("DPPO") && "Northern".equals(clientLocale)){
            return findVirginPlanInNetwork(rqn, "Medium Plan");
        }else if(networkType.equalsIgnoreCase("DHMO") && "Southern".equals(clientLocale)){
            return findVirginPlanInNetwork(rqn, "DentalNet 2000A");
        }else if(networkType.equalsIgnoreCase("DPPO") && "Southern".equals(clientLocale)){
            return findVirginPlanInNetwork(rqn, "Medium Plan");
        }else if(networkType.equalsIgnoreCase("VISION")){
            return findVirginPlanInNetwork(rqn, "BV 3B");
        }
        return null;
    }

    private RfpQuoteNetworkPlan findVirginPlanInNetwork(RfpQuoteNetwork rqn, String planName){

        RfpQuoteNetworkPlan rqnp = rqn.getRfpQuoteNetworkPlans()
            .stream()
            .filter(plan -> plan.getPnn().getName().equalsIgnoreCase(planName))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException(String.format("Could not find plan '%s' in network %s", planName, rqn.getNetwork().getName())));

        return rqnp;
    }

    private Map<String, RfpQuoteNetworkPlan> findBaseRfpQuoteNetworkPlan(Map<String, ClientPlan> basePlans, RfpQuoteOption finalOption, RFP rfp){
        HashMap<String, RfpQuoteNetworkPlan> result = new HashMap<>();
        for(String key : basePlans.keySet()){
            ClientPlan clientPlan = basePlans.get(key);
            RfpQuoteNetworkPlan selectedPlan = null;
            if(clientPlan != null){
                RfpQuoteOptionNetwork rqon = new RfpQuoteOptionNetwork();
                rqon.setRfpQuoteVersion(finalOption.getRfpQuoteVersion());
                rqon.setRfpQuoteOption(finalOption);

                rqon.setClientPlan(clientPlan);
                rqon.setOutOfState(clientPlan.isOutOfState());

                rqon.setErContributionFormat(clientPlan.getErContributionFormat());
                rqon.setTier1ErContribution(floatValue(clientPlan.getTier1ErContribution()));
                rqon.setTier2ErContribution(floatValue(clientPlan.getTier2ErContribution()));
                rqon.setTier3ErContribution(floatValue(clientPlan.getTier3ErContribution()));
                rqon.setTier4ErContribution(floatValue(clientPlan.getTier4ErContribution()));

                rqon.setTier1Census(longValue(clientPlan.getTier1Census()));
                rqon.setTier2Census(longValue(clientPlan.getTier2Census()));
                rqon.setTier3Census(longValue(clientPlan.getTier3Census()));
                rqon.setTier4Census(longValue(clientPlan.getTier4Census()));

                if (clientPlan.getPnn() != null) {
                    if (rfp.getProduct().equals(Constants.MEDICAL)) {
                        selectedPlan = findMatchPlan(rqon, clientPlan);
                    }
                }
            }
            result.put(key, selectedPlan);
        }
        return result;
    }

    private ClientPlan findBaseCurrentPlan(List<ClientPlan> clientPlans, String planType) {
        ClientPlan current = null, currentKaiser = null;
        Long maxEnrollment = 0L, maxEnrollmentKaiser = 0L;
        for (ClientPlan clientPlan : clientPlans) {
            if (clientPlan.getPnn() == null || !clientPlan.getPnn().getPlanType().equals(planType)) {
                continue;
            }
            Long enrollment = clientPlan.getTier1Census() + clientPlan.getTier2Census()
                + clientPlan.getTier3Census() + clientPlan.getTier4Census();
            if (clientPlan.getPnn().getNetwork().getCarrier().getName().equals(Constants.KAISER_CARRIER)) {
                if (enrollment > maxEnrollmentKaiser) {
                    maxEnrollmentKaiser = enrollment;
                    currentKaiser = clientPlan;
                }
                continue;
            }
            if (enrollment > maxEnrollment) {
                maxEnrollment = enrollment;
                current = clientPlan;
            }
        }
        return current != null ? current : currentKaiser;
    }

    private RfpQuoteNetworkPlan findMatchPlan(RfpQuoteOptionNetwork rqon, ClientPlan clientPlan) {
        RfpQuoteNetwork matchNetwork = findMatchNetwork(rqon, clientPlan.getPnn().getNetwork().getType());
        return findMatchPlan(rqon, clientPlan, matchNetwork);
    }

    private RfpQuoteNetwork findMatchNetwork(RfpQuoteOptionNetwork rqon, String networkType) {
        RfpQuote rfpQuote = rqon.getRfpQuoteOption().getRfpQuote();
        RfpQuoteNetwork quoteNetwork = rfpQuote.getRfpQuoteNetworks()
            .stream()
            .filter(rfpQuoteNetwork -> networkType.equals(rfpQuoteNetwork.getNetwork().getType())
                && !rfpQuoteNetwork.getNetwork().getCarrier().getName().equals(Constants.KAISER_CARRIER))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException(String.format("Could not find network '%s' in quote %s", networkType, rfpQuote.getRfpQuoteId())));
        return quoteNetwork;
    }

    private RfpQuoteNetworkPlan findMatchPlan(RfpQuoteOptionNetwork rqon, ClientPlan clientPlan, RfpQuoteNetwork quoteNetwork) {
        if(clientPlan == null || quoteNetwork == null) {
            return null;
        }
        float clientPlanTotal = calcClientPlanTotal(clientPlan);
        Map<Float, RfpQuoteNetworkPlan> plansByChangeFromCurrent = quoteNetwork.getRfpQuoteNetworkPlans()
            .stream()
            .collect(Collectors.toMap(p -> {
                    /* NOTE: the discount in current case (the third argument of the calcAlterPlanTotal function)
                     * does not matter, because we are just sorting by diffPecent */
                    float total = calcAlterPlanTotal(rqon, p, 0f);
                    return MathUtils.diffPecent(total, clientPlanTotal, 1);
                },
                Function.identity(),
                (u,v) -> u, /* return one from duplicates */
                HashMap::new));
        if(plansByChangeFromCurrent.isEmpty()) {
            return null;
            // not fatal error: broker may not have access to plans of this network (Northern and Southern California case)
            // throw new NotFoundException(String.format("Could not find any plan in network %s", quoteNetwork.getNetwork().getType()));
        }
        Float matchPlanChangeFromCurrent = MathUtils.findClosest(PERCENT_CHANGE_FROM_CURRENT_OFR_MATCH_PLAN, plansByChangeFromCurrent.keySet());
        return plansByChangeFromCurrent.get(matchPlanChangeFromCurrent);
    }

    private RfpQuoteSummary createCVDefaultQuoteSummary() {
        RfpQuoteSummary rfpQuoteSummary = new RfpQuoteSummary();
        rfpQuoteSummary.setMedicalNotes(DEFAULT_MEDICAL_QUOTE_SUMMARY);
        rfpQuoteSummary.setDentalNotes(DEFAULT_DENTAL_QUOTE_SUMMARY);
        rfpQuoteSummary.setVisionNotes(DEFAULT_VISION_QUOTE_SUMMARY);
        return rfpQuoteSummary;
    }


    private void setQualificationStatuses(boolean medicalStatus, boolean dentalStatus, boolean visionStatus,
                                         String reason, AnthemCVProductQualificationDto qualificationDto){

        qualificationDto.setQualifiedForMedical(medicalStatus);
        qualificationDto.setQualifiedForDental(dentalStatus);
        qualificationDto.setQualifiedForVision(visionStatus);
        qualificationDto.setDisqualificationReason(reason);
    }

    public RfpQuote generateInstantQuote(RFP rfp, RfpSubmission rfpSubmission, String category, AnthemCVCalculatedPlanDetails planDetails, boolean persist) {

        if(rfp.getClient().getAverageAge() > 65f){
            rfp.getClient().setAverageAge(65f);
            logger.warn("Anthem Clear Value - average age > 65. client_id=" + rfp.getClient().getClientId() + " product=" + category);
        }

        switch (category) {
            case Constants.MEDICAL:
                return generateMedicalQuote(rfp, rfpSubmission, planDetails, persist);
            case Constants.DENTAL:
                return generateDentalQuote(rfp, rfpSubmission, planDetails, persist);
            case Constants.VISION:
                return generateVisionQuote(rfp, rfpSubmission, planDetails, persist);
            default:
                throw new IllegalArgumentException("Product category must be one of MEDICAL, DENTAL or VISION");
        }
    }

    private RfpQuote generateMedicalQuote(RFP rfp, RfpSubmission rfpSubmission, AnthemCVCalculatedPlanDetails planDetails, boolean persist) {
        RfpQuote quote = createQuote(rfpSubmission, rfp.getRatingTiers(), persist);

        final RfpQuote finalQuote = quote;
        calculator.getMedicalPlanMap().keySet().forEach(key -> {
            String networkName = key.getLeft();
            String networkType = key.getRight();
            Carrier carrier = rfpSubmission.getRfpCarrier().getCarrier();
            Network network = networkRepository.findByNameAndTypeAndCarrier(networkName, networkType, carrier);
            if(network == null){
                throw new NotFoundException(String.format("Network with name %s, type %s and carrier %s not found in database", networkName, networkType, carrier));
            }
            RfpQuoteNetwork quoteNetwork = new RfpQuoteNetwork(finalQuote, network, network.getName());
            quoteNetwork.setaLaCarte(true);
            if(persist){
                rfpQuoteNetworkRepository.save(quoteNetwork);
            }

            calculator.getMedicalPlanMap().get(key).forEach(anthemPlan -> {
                String name = anthemPlan.getMedName();
                Float[] rates = calculator.getMedicalPlanRates(rfp.getRatingTiers(), rfp.getClient().getPredominantCounty(),
                    rfp.getClient().getEffectiveDate(), rfp.getClient().getAverageAge(), rfp.getClient().getSicCode(),
                    rfp.getPaymentMethod(), rfp.getCommission(), anthemPlan);

                anthemPlan.setTier1Rate(getRate(rates, 1));
                anthemPlan.setTier2Rate(getRate(rates, 2));
                anthemPlan.setTier3Rate(getRate(rates, 3));
                anthemPlan.setTier4Rate(getRate(rates, 4));
                planDetails.getMedical().add(anthemPlan);

                RfpQuoteNetworkPlan plan = createRfpQuoteNetworkPlan(quoteNetwork, name, rates, persist);
                quoteNetwork.getRfpQuoteNetworkPlans().add(plan);
            });
            finalQuote.getRfpQuoteNetworks().add(quoteNetwork);
        });
        return quote;
    }

    private RfpQuote createQuote(RfpSubmission rfpSubmission, int tier, boolean persist) {
        RfpQuoteVersion version = new RfpQuoteVersion();
        version.setRfpSubmissionId(rfpSubmission.getRfpSubmissionId());
        if(persist) {
            version = rfpQuoteVersionRepository.save(version);
        }

        RfpQuote quote = new RfpQuote();
        quote.setRfpSubmission(rfpSubmission);
        quote.setRfpQuoteVersion(version);
        quote.setLatest(true);
        quote.setRatingTiers(tier);
        quote.setUpdated(new Date());
        quote.setQuoteType(QuoteType.CLEAR_VALUE);
        quote.setDisclaimer(htmlEscape(ANTHEM_CV_DISCLAIMER));
        if(persist) {
            quote = rfpQuoteRepository.save(quote);
        }
        return quote;
    }

    private void addRatesToAnthemPlan(Float[] rates, AnthemCVPlan anthemPlan){
        anthemPlan.setTier1Rate(getRate(rates, 1));
        anthemPlan.setTier2Rate(getRate(rates, 2));
        anthemPlan.setTier3Rate(getRate(rates, 3));
        anthemPlan.setTier4Rate(getRate(rates, 4));

    }

    private RfpQuote generateDentalQuote(RFP rfp, RfpSubmission rfpSubmission, AnthemCVCalculatedPlanDetails planDetails, boolean persist) {
        AnthemCVPlan highPlan = new AnthemCVPlan(Constants.ANTHEM_CV_DENTAL_HIGH_PLAN, null, null,
            Constants.ANTHEM_CV_DENTAL_DPPO_NETWORK, DPPO, null);
        AnthemCVPlan mediumPlan = new AnthemCVPlan(Constants.ANTHEM_CV_DENTAL_MEDIUM_PLAN, null, null,
            Constants.ANTHEM_CV_DENTAL_DPPO_NETWORK, DPPO, null);
        AnthemCVPlan lowPlan = new AnthemCVPlan(Constants.ANTHEM_CV_DENTAL_LOW_PLAN, null, null,
            Constants.ANTHEM_CV_DENTAL_DPPO_NETWORK, DPPO, null);

        AnthemCVPlan dhmoPlan = new AnthemCVPlan(Constants.ANTHEM_CV_DENTAL_DHMO_2000A, null, null,
            Constants.ANTHEM_CV_DENTAL_DHMO_NETWORK, DHMO, null);

        List<AnthemCVPlan> dppoPlans = new ArrayList<>();
        dppoPlans.add(highPlan);
        dppoPlans.add(mediumPlan);
        dppoPlans.add(lowPlan);

        RfpQuote quote = createQuote(rfpSubmission, rfp.getRatingTiers(), persist);

        Network dppoNetwork = networkRepository.findByNameAndTypeAndCarrier(Constants.ANTHEM_CV_DENTAL_DPPO_NETWORK, DPPO, rfpSubmission.getRfpCarrier().getCarrier());
        if(dppoNetwork == null){
            throw new NotFoundException(String.format("Network with name %s, type %s and carrier %s not found in database", Constants.ANTHEM_CV_DENTAL_DPPO_NETWORK,
                DPPO, rfpSubmission.getRfpCarrier().getCarrier()));
        }
        RfpQuoteNetwork dppoQuoteNetwork = new RfpQuoteNetwork(quote, dppoNetwork, dppoNetwork.getName());
        if(persist) {
            rfpQuoteNetworkRepository.save(dppoQuoteNetwork);
        }

        AnthemCVDentalRates dentalRates = calculator.getDentalPlanRates(rfp.getRatingTiers(), rfp.getClient().getPredominantCounty().toUpperCase(),
            rfp.getClient().getAverageAge(), rfp.getClient().getSicCode(), rfp.getClient().getEffectiveDate(), dppoPlans, rfp.getPaymentMethod(), rfp.getCommission());

        dppoQuoteNetwork.getRfpQuoteNetworkPlans().add(createRfpQuoteNetworkPlan(dppoQuoteNetwork, Constants.ANTHEM_CV_DENTAL_HIGH_PLAN, dentalRates.getHighRates(), persist));
        dppoQuoteNetwork.getRfpQuoteNetworkPlans().add(createRfpQuoteNetworkPlan(dppoQuoteNetwork, Constants.ANTHEM_CV_DENTAL_MEDIUM_PLAN, dentalRates.getMediumRates(), persist));

        addRatesToAnthemPlan(dentalRates.getHighRates(), highPlan);
        addRatesToAnthemPlan(dentalRates.getMediumRates(), mediumPlan);

        quote.getRfpQuoteNetworks().add(dppoQuoteNetwork);

        Network dhmoNetwork = networkRepository.findByNameAndTypeAndCarrier(Constants.ANTHEM_CV_DENTAL_DHMO_NETWORK, DHMO, rfpSubmission.getRfpCarrier().getCarrier());
        if(dhmoNetwork == null){
            throw new NotFoundException(String.format("Network with name %s, type %s and carrier %s not found in database",
                Constants.ANTHEM_CV_DENTAL_DHMO_NETWORK, DHMO, rfpSubmission.getRfpCarrier().getCarrier()));
        }
        RfpQuoteNetwork dhmoQuoteNetwork = new RfpQuoteNetwork(quote, dhmoNetwork, dhmoNetwork.getName());
        if(persist) {
            rfpQuoteNetworkRepository.save(dhmoQuoteNetwork);
        }
        quote.getRfpQuoteNetworks().add(dhmoQuoteNetwork);


        planDetails.getDental().add(highPlan);
        planDetails.getDental().add(mediumPlan);

        String clientLocale = getDentalLocale(rfp.getClient().getPredominantCounty(), rfp.getClient().getEffectiveDate());
        if ( clientLocale == null || "Northern".equals(clientLocale) ) {
        	 // Norcal groups will have access to the DPPO Low plan, they do not get pick DHMO (2000A) plan.
        	 dppoQuoteNetwork.getRfpQuoteNetworkPlans().add(createRfpQuoteNetworkPlan(dppoQuoteNetwork, Constants.ANTHEM_CV_DENTAL_LOW_PLAN, dentalRates.getLowRates(), persist));

        	 addRatesToAnthemPlan(dentalRates.getLowRates(), lowPlan);

        	 planDetails.getDental().add(lowPlan);
        }
        if ( clientLocale == null || "Southern".equals(clientLocale) ) {
        	// SoCal groups will not have access to the DPPO Low plan, their option for Low plan is DHMO (2000A) plan.
            Float[] dhmoRates = calculator.getDentalPlanMap(rfp.getClient().getEffectiveDate()).get(rfp.getRatingTiers()).get(Constants.ANTHEM_CV_DENTAL_DHMO_2000A);
            Float[] dhmoRatesWithCommission = calculator.addCommission(dhmoRates, rfp.getPaymentMethod(), rfp.getCommission());

        	dhmoQuoteNetwork.getRfpQuoteNetworkPlans().add(createRfpQuoteNetworkPlan(dhmoQuoteNetwork, Constants.ANTHEM_CV_DENTAL_DHMO_2000A,
                dhmoRatesWithCommission, persist));

        	addRatesToAnthemPlan(dhmoRatesWithCommission, dhmoPlan);

        	planDetails.getDental().add(dhmoPlan);
        }
        return quote;
    }

    private RfpQuote generateVisionQuote(RFP rfp, RfpSubmission rfpSubmission, AnthemCVCalculatedPlanDetails planDetails, boolean persist) {
        RfpQuote quote = createQuote(rfpSubmission, rfp.getRatingTiers(), persist);
        Carrier carrier = rfpSubmission.getRfpCarrier().getCarrier();
        Network network = networkRepository.findByNameAndTypeAndCarrier(Constants.ANTHEM_CV_VISION_VPPO_NETWORK, Constants.VISION, carrier);
        if(network == null){
            throw new NotFoundException(String.format("Network with name %s, type %s and carrier %s not found in database", Constants.ANTHEM_CV_VISION_VPPO_NETWORK, Constants.VISION, carrier));
        }
        Map<String, Float[]> plans = calculator.getVisionRates(rfp.getRatingTiers());
        RfpQuoteNetwork quoteNetwork = new RfpQuoteNetwork(quote, network, network.getName());
        if(persist) {
            rfpQuoteNetworkRepository.save(quoteNetwork);
        }
        plans.entrySet().forEach(entry -> {
            AnthemCVPlan visionPlan = new AnthemCVPlan(entry.getKey(), null, null, network.getName(), network.getType(), null);
            visionPlan.setRatingTiers(rfp.getRatingTiers());
            addRatesToAnthemPlan(entry.getValue(), visionPlan);

            RfpQuoteNetworkPlan plan = createRfpQuoteNetworkPlan(quoteNetwork, entry.getKey(), entry.getValue(), persist);
            planDetails.getVision().add(visionPlan);
            quoteNetwork.getRfpQuoteNetworkPlans().add(plan);
        });
        quote.getRfpQuoteNetworks().add(quoteNetwork);
        return quote;
    }

    public List<String> getCountyList() {
        return new ArrayList<>(calculator.getMedicalAreaFactors().keySet());
    }

    private RfpQuoteNetworkPlan createRfpQuoteNetworkPlan(RfpQuoteNetwork quoteNetwork, String planName, Float[] rates, boolean persist) {
        List<PlanNameByNetwork> pnnList = planNameByNetworkRepository.findByNetworkAndNameAndPlanType(quoteNetwork.getNetwork(), planName, quoteNetwork.getNetwork().getType());
        if (CollectionUtils.isEmpty(pnnList)) {
            throw new NotFoundException(String.format("Plan with name %s, type %s and network %s not found in database", planName, quoteNetwork.getNetwork().getType(), quoteNetwork.getNetwork().getName()));
        }
        RfpQuoteNetworkPlan quoteNetworkPlan = new RfpQuoteNetworkPlan(quoteNetwork, pnnList.get(0), getRate(rates, 1), getRate(rates, 2), getRate(rates, 3), getRate(rates, 4));
        if(persist) {
            quoteNetworkPlan = rfpQuoteNetworkPlanRepository.save(quoteNetworkPlan);
        }
        return quoteNetworkPlan;
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

    public void setShouldAddMedicalOnePercent(boolean shouldAddMedicalOnePercent) {
        this.shouldAddMedicalOnePercent = shouldAddMedicalOnePercent;
        calculator.setShouldAddMedicalOnePercent(shouldAddMedicalOnePercent);
    }

    public static String getAnthemCvTier1DisqualificationReason() {
        return ANTHEM_CV_TIER1_DISQUALIFICATION_REASON;
    }

    public static String getAnthemCvNoMedicalDisqualificationReason() {
        return ANTHEM_CV_NO_MEDICAL_DISQUALIFICATION_REASON;
    }

    public static String getAnthemCvMedicalNoDentalOrVisionDisqualificationReason() {
        return ANTHEM_CV_MEDICAL_NO_DENTAL_OR_VISION_DISQUALIFICATION_REASON;
    }

    public static String getAnthemCvDentalOrVision_voluntaryDisqualificationReason() {
        return ANTHEM_CV_DENTAL_OR_VISION__VOLUNTARY_DISQUALIFICATION_REASON;
    }

    public static String getAnthemCvRetireesDisqualificationReason() {
        return ANTHEM_CV_RETIREES_DISQUALIFICATION_REASON;
    }

    public static String getAnthemCvDentalVoluntaryDisqualificationReason() {
        return ANTHEM_CV_DENTAL_VOLUNTARY_DISQUALIFICATION_REASON;
    }

    public static String getAnthemCvVisionVoluntaryDisqualificationReason() {
        return ANTHEM_CV_VISION_VOLUNTARY_DISQUALIFICATION_REASON;
    }

    public String getAnthemCvEffectiveDateDisqualificationReason() {
        return ANTHEM_CV_EFFECTIVE_DATE_DISQUALIFICATION_REASON;
    }

    public static String getAnthemCvNotEnoughEligibleEmployeesDisqualificationReason() {
        return ANTHEM_CV_NOT_ENOUGH_ELIGIBLE_EMPLOYEES_DISQUALIFICATION_REASON;
    }

    public static String getAnthemCvPercentParticipatingEmployeesReason() {
        return ANTHEM_CV_PERCENT_PARTICIPATING_EMPLOYEES_REASON;
    }

    public String getDentalLocale(String predominantCounty, Date effectiveDate) {
        return calculator.getDentalLocale(predominantCounty, effectiveDate);
    }

    private static Long longValue(Double value) {
        return value == null ? 0L : value.longValue();
    }

    private static Float floatValue(Double value) {
        return value == null ? 0F : value.floatValue();
    }

    private static Float floatValue(Float value) {
        return value == null ? 0F : value;
    }

    private static Long longValue(Long value) {
        return value == null ? 0L : value;
    }
}
