package com.benrevo.be.modules.admin.domain.quotes.parsers.uhc;

import static com.benrevo.common.Constants.DATETIME_FORMAT;
import static com.benrevo.common.enums.CarrierType.UHC;
import static com.benrevo.common.enums.CarrierType.BENREVO;
import static com.benrevo.common.enums.CarrierType.carrierMatches;
import static com.benrevo.common.enums.CarrierType.validCarrier;
import static com.benrevo.common.util.DateHelper.fromDateToString;
import static com.benrevo.common.util.MapBuilder.field;
import static java.lang.String.format;
import static java.util.Objects.isNull;
import static java.util.stream.Collectors.toList;
import static java.util.stream.Collectors.toSet;
import static org.apache.commons.lang.math.NumberUtils.toLong;
import static org.apache.commons.lang3.StringUtils.remove;
import com.benrevo.be.modules.admin.domain.quotes.BaseUploader;
import com.benrevo.be.modules.admin.util.PlanUtil;
import com.benrevo.be.modules.admin.util.helper.QuoteHelper;
import com.benrevo.be.modules.shared.service.AdministrativeFeeService;
import com.benrevo.be.modules.shared.service.SharedActivityService;
import com.benrevo.be.modules.shared.service.SharedRfpQuoteService;
import com.benrevo.be.modules.shared.util.PlanCalcHelper;
import com.benrevo.common.Constants;
import com.benrevo.common.annotation.AppCarrier;
import com.benrevo.common.dto.QuoteChangesDto;
import com.benrevo.common.dto.QuoteParserErrorDto;
import com.benrevo.common.dto.QuoteUploaderDto;
import com.benrevo.common.enums.ActivityType;
import com.benrevo.common.enums.AttributeName;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.PlanCategory;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.common.enums.RfpQuoteOptionAttributeName;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.common.util.MathUtils;
import com.benrevo.data.persistence.dao.BaseDao;
import com.benrevo.data.persistence.entities.Activity;
import com.benrevo.data.persistence.entities.Benefit;
import com.benrevo.data.persistence.entities.BenefitName;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientAttribute;
import com.benrevo.data.persistence.entities.ClientPlan;
import com.benrevo.data.persistence.entities.Network;
import com.benrevo.data.persistence.entities.Plan;
import com.benrevo.data.persistence.entities.PlanNameByNetwork;
import com.benrevo.data.persistence.entities.QuotePlanAttribute;
import com.benrevo.data.persistence.entities.RfpCarrier;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpQuoteNetwork;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkPlan;
import com.benrevo.data.persistence.entities.RfpQuoteOption;
import com.benrevo.data.persistence.entities.RfpQuoteOptionAttribute;
import com.benrevo.data.persistence.entities.RfpQuoteOptionNetwork;
import com.benrevo.data.persistence.entities.RfpQuoteVersion;
import com.benrevo.data.persistence.entities.RfpSubmission;
import com.benrevo.data.persistence.entities.Rider;
import com.benrevo.data.persistence.entities.RiderMeta;
import com.benrevo.data.persistence.helper.PlanBenefitsHelper;
import com.benrevo.data.persistence.repository.ActivityRepository;
import com.benrevo.data.persistence.repository.AttributeRepository;
import com.benrevo.data.persistence.repository.BenefitNameRepository;
import com.benrevo.data.persistence.repository.BenefitRepository;
import com.benrevo.data.persistence.repository.CarrierRepository;
import com.benrevo.data.persistence.repository.ClientPlanRepository;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.NetworkRepository;
import com.benrevo.data.persistence.repository.PlanNameByNetworkRepository;
import com.benrevo.data.persistence.repository.PlanRepository;
import com.benrevo.data.persistence.repository.RfpCarrierRepository;
import com.benrevo.data.persistence.repository.RfpQuoteNetworkPlanRepository;
import com.benrevo.data.persistence.repository.RfpQuoteNetworkRepository;
import com.benrevo.data.persistence.repository.RfpQuoteOptionNetworkRepository;
import com.benrevo.data.persistence.repository.RfpQuoteOptionRepository;
import com.benrevo.data.persistence.repository.RfpQuoteRepository;
import com.benrevo.data.persistence.repository.RfpQuoteVersionRepository;
import com.benrevo.data.persistence.repository.RfpSubmissionRepository;
import com.benrevo.data.persistence.repository.RiderMetaRepository;
import com.benrevo.data.persistence.repository.RiderRepository;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Component
@AppCarrier({UHC, BENREVO}) // allow to upload UHC quotes on app_carrier = BENREVO environment as well
@Transactional(rollbackFor = Exception.class)
public class UHCQuoteUploader extends BaseUploader {

    private static final Logger LOGGER = LogManager.getLogger(UHCQuoteUploader.class);
    private final String CARRIER_NAME = "UHC";
    private final String RX_NETWORK_NAME = "Full Network";

    private static final String RENEWAL_1 = "Renewal 1";
    private static final String RENEWAL_2 = "Renewal 2";
    
    private final Pattern RIDER_CODE_PATTERN = Pattern.compile("(?:^|\\G)([^,\\(\\)]++(?>\\([^\\(\\)]++\\))?[^,\\(\\)]*+),\\s++",Pattern.CASE_INSENSITIVE);

    private List<BenefitName> benefitNames;

    @Autowired
    private BenefitRepository benefitRepository;

    @Autowired
    private BenefitNameRepository benefitNameRepository;

    @Autowired
    private CarrierRepository carrierRepository;

    @Autowired
    private RfpSubmissionRepository rfpSubmissionRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private RfpQuoteVersionRepository rfpQuoteVersionRepository;

    @Autowired
    private RfpQuoteRepository rfpQuoteRepository;

    @Autowired
    private RfpQuoteNetworkRepository rfpQuoteNetworkRepository;

    @Autowired
    private RfpQuoteNetworkPlanRepository rfpQuoteNetworkPlanRepository;

    @Autowired
    private NetworkRepository networkRepository;

    @Autowired
    private PlanNameByNetworkRepository planNameByNetworkRepository;

    @Autowired
    private PlanRepository planRepository;

    @Autowired
    private RfpCarrierRepository rfpCarrierRepository;

    @Autowired
    private RfpQuoteOptionRepository rfpQuoteOptionRepository;

    @Autowired
    private RfpQuoteOptionNetworkRepository rfpQuoteOptionNetworkRepository;

    @Autowired
    private QuoteHelper quoteHelper;

    @Autowired
    private SharedRfpQuoteService sharedRfpQuoteService;

    @Autowired
    private RiderRepository riderRepository;

    @Autowired
    private RiderMetaRepository riderMetaRepository;

    @Autowired
    private ClientPlanRepository clientPlanRepository;

    @Autowired
    private PlanUtil planUtil;

    @Autowired
    private AttributeRepository attributeRepository;

    @Autowired
    private UHCRenewalHelper uhcRenewalHelper;

    @Autowired
    private AdministrativeFeeService administrativeFeeService;
    
    @Autowired
    private PlanBenefitsHelper planBenefitsHelper;
    
    @Autowired
    private  ActivityRepository activityRepository;
    
    @Autowired
    private SharedActivityService sharedActivityService;

    @Value("${app.carrier}")
    String[] appCarrier;

    @Override
    public boolean useForCarrier(String carrier) {
        return validCarrier(carrier) && carrierMatches(carrier, UHC);
    }

    /**
     * Uploads several files with the same category and quoteType
     */
    @Override
    public List<RfpQuote> run(List<MultipartFile> files, Long clientId, Long brokerId,
        QuoteUploaderDto dto, boolean isTest, boolean persist) throws Exception{
        
        if(QuoteType.DECLINED.equals(dto.getQuoteType())) {
            return Arrays.asList(sharedRfpQuoteService.processDeclinedQuote(clientId, brokerId, Constants.UHC_CARRIER, dto.getCategory(), persist ));
        }

        LOGGER.info("Starting: "+ dto.getCategory() +" Quote Upload");
        RfpCarrier rfpCarrier  = rfpCarrierRepository.findByCarrierNameAndCategory(Constants.UHC_CARRIER, dto.getCategory());

        if(rfpCarrier == null){
            throw new NotFoundException(format("No RFP Carrier found for category=%s, carrier=UHC", dto.getCategory()));
        }
        if(!dto.getCategory().equals(Constants.MEDICAL) && dto.getQuoteType() == QuoteType.KAISER) {
            throw new IllegalArgumentException("Kaiser quotes are only applicable to the MEDICAL category.");
        }

        RfpQuote currentQuote = rfpQuoteRepository.findByRfpSubmissionRfpCarrierRfpCarrierIdAndRfpSubmissionClientClientIdAndLatestAndQuoteType(rfpCarrier.getRfpCarrierId(), clientId, true, dto.getQuoteType());
        if (currentQuote == null) {
            currentQuote = rfpQuoteRepository.findByRfpSubmissionRfpCarrierRfpCarrierIdAndRfpSubmissionClientClientIdAndLatestAndQuoteType(rfpCarrier.getRfpCarrierId(), clientId, true, QuoteType.DECLINED);
        }

        RfpQuote newQuote = null;
        if (dto.isAddToExisted()) {
            if (currentQuote == null) {
                throw new BaseException("Existed quote is not found");
            }
            newQuote = currentQuote;
        }
        for(MultipartFile file : files){
            InputStream fis = file.getInputStream();
            // create new quote or add to existed 
            newQuote = runInner(fis, clientId, brokerId, dto.getQuoteType(), dto.getCategory(), dto.isRenewal(), isTest, true, newQuote);
            quoteHelper.saveQuoteFileInS3(file, newQuote, UHC, true);
        }
        if (currentQuote != null && !dto.isAddToExisted()) {
            quoteHelper.updateQuote(currentQuote, newQuote, null, true);
        }
        LOGGER.info("Finished: "+ dto.getCategory() +" Quotes Upload");

        return Arrays.asList(newQuote);
    }

    @Override
    public QuoteUploaderDto validate(List<MultipartFile> files, Long clientId, Long brokerId) throws Exception {
        QuoteUploaderDto dto = new QuoteUploaderDto();

        Set<QuoteParserErrorDto> errors = new HashSet<>();
        run(files, clientId, brokerId, dto, false, false); // persist = false
        dto.setErrors(errors);

        return dto;
    }
    
    @Override
    public RfpQuote run(InputStream fis, List<InputStream> fis2List, Long clientId, Long brokerId,
        QuoteType quoteType, String category, boolean isRenewal, boolean isTest) throws Exception{

        if(QuoteType.DECLINED.equals(quoteType)) {
            return sharedRfpQuoteService.processDeclinedQuote(clientId, brokerId, Constants.UHC_CARRIER, category, persist );
        }

        LOGGER.info("Starting: "+ category +" Quote Upload");
        RfpCarrier rfpCarrier  = rfpCarrierRepository.findByCarrierNameAndCategory(Constants.UHC_CARRIER, category);

        if(rfpCarrier == null){
            throw new NotFoundException("No RFP Carrier found for category="+ category +", carrier=UHC");
        }
        if(!category.equals(Constants.MEDICAL) && quoteType == QuoteType.KAISER) {
            throw new IllegalArgumentException("Kaiser quotes are only applicable to the MEDICAL category.");
        }

        RfpQuote currentQuote = rfpQuoteRepository.findByRfpSubmissionRfpCarrierRfpCarrierIdAndRfpSubmissionClientClientIdAndLatestAndQuoteType(rfpCarrier.getRfpCarrierId(), clientId, true, quoteType);
        if (currentQuote == null) {
            currentQuote = rfpQuoteRepository.findByRfpSubmissionRfpCarrierRfpCarrierIdAndRfpSubmissionClientClientIdAndLatestAndQuoteType(rfpCarrier.getRfpCarrierId(), clientId, true, QuoteType.DECLINED);
        }

        RfpQuote newQuote = runInner(fis, clientId, brokerId, quoteType, category, isRenewal, isTest, true, null);
        if (currentQuote != null) {
            quoteHelper.updateQuote(currentQuote, newQuote, null, true);
        }
        LOGGER.info("Finished: "+ category +" Quote Upload");
        return newQuote;
    }

    private RfpQuote runInner(InputStream fis, Long clientId, Long brokerId, QuoteType quoteType,
        String category, boolean isRenewal, boolean isTest, boolean persist, RfpQuote rfpQuoteToAdd) throws Exception {

        this.isTest = isTest;
        this.persist = persist;
        RfpQuote newQuote = null;
        benefitNames = benefitNameRepository.findAll();
        if(category.equalsIgnoreCase(Constants.MEDICAL)){
            UHCMedicalQuoteParser medicalParser = new UHCMedicalQuoteParser();
            List<LinkedHashMap<String, UHCNetwork>> options = medicalParser.parseMedicalQuotes(fis, benefitNames, isRenewal);

            if(isRenewal){ // create rfp and rfp submission if missing
                uhcRenewalHelper.createRfpSubmissionIfNotFound(clientId, category, options, persist);
            }
            newQuote = saveMedicalQuotes(options, clientId, brokerId, quoteType, Constants.MEDICAL,
                medicalParser.getDisclaimer(), medicalParser.getDisclaimerType(), medicalParser.getTier(), isRenewal, rfpQuoteToAdd);
        } else if(category.equalsIgnoreCase(Constants.VISION)) {
            UHCVisionQuoteParser visionParser = new UHCVisionQuoteParser();
            ArrayList<UHCNetworkDetails> options = visionParser.parseVisionQuotes(fis, benefitNames);

            if(isRenewal){ // create rfp and rfp submission if missing
                uhcRenewalHelper.createRfpSubmissionIfNotFound(clientId, category, null, persist);
            }
            newQuote = saveDentalAndVisionQuotes(options, clientId, brokerId, quoteType,
                Constants.VISION, visionParser.getDisclaimer(), visionParser.getTier(), isRenewal);
        } else if(category.equalsIgnoreCase(Constants.DENTAL)) {
            UHCDentalQuoteParser dentalParser = new UHCDentalQuoteParser();
            ArrayList<UHCNetworkDetails> options = dentalParser.parseQuotes(fis, benefitNames);

            if(isRenewal){ // create rfp and rfp submission if missing
                uhcRenewalHelper.createRfpSubmissionIfNotFound(clientId, category, null, persist);
            }
            newQuote = saveDentalAndVisionQuotes(options, clientId, brokerId, quoteType, Constants.DENTAL,
                dentalParser.getDisclaimer(), dentalParser.getTier(), isRenewal);
        }

        if(isRenewal){ // mark client as RENEWAL
            // FIXME mark as RENEWAL during client creation or during quote loading? 
            ClientAttribute renewalAttribute = attributeRepository.findClientAttributeByClientIdAndName(clientId, AttributeName.RENEWAL);
            if (renewalAttribute == null) {
                Client client = clientRepository.findOne(clientId);
                client.getAttributes().add(attributeRepository.save(new ClientAttribute(client, AttributeName.RENEWAL)));
            }
        }
        
        return newQuote;
    }

    @Override
    public QuoteChangesDto findChanges(InputStream fis, List<InputStream> fis2List, Long clientId,
        Long brokerId, QuoteType quoteType, String category, boolean isRenewal, boolean isTest) throws Exception {
        RfpCarrier rfpCarrier  = rfpCarrierRepository.findByCarrierNameAndCategory(Constants.UHC_CARRIER, category);
        if(rfpCarrier == null){
            throw new NotFoundException("No RFP Carrier found for category="+ category +", carrier=UHC");
        }
        RfpQuote currentQuote = rfpQuoteRepository.findByRfpSubmissionRfpCarrierRfpCarrierIdAndRfpSubmissionClientClientIdAndLatestAndQuoteType(rfpCarrier.getRfpCarrierId(), clientId, true, quoteType);
        RfpQuote newQuote = runInner(fis, clientId, brokerId, quoteType, category, isRenewal, isTest, false, null);
        return quoteHelper.findChanges(currentQuote, newQuote);
    }

    public RfpQuote saveDentalAndVisionQuotes(List<UHCNetworkDetails> options, Long clientId,
        Long brokerId, QuoteType quoteType, String product,
        String disclaimer, int tiers, boolean isRenewal) throws Exception{
        RfpQuote rfpQuote = null;

        try{

            if(options == null){
                throw new BaseException("Parsed quote data to be saved is null for category=" + product);
            }

            List<Client> clientList = clientRepository.findByClientIdAndBrokerBrokerId(clientId, brokerId);
            if(null == clientList  || clientList.size() == 0) {
                throw new NotFoundException("No client with ID=" + clientId +", broker id= " + brokerId + " found");
            }
            Client client = clientList.get(0);

            RfpCarrier rfpCarrier  = rfpCarrierRepository.findByCarrierNameAndCategory(Constants.UHC_CARRIER, product);
            RfpSubmission rfpSubmission = rfpSubmissionRepository.findByRfpCarrierAndClient(rfpCarrier, client);
            if(null == rfpSubmission && !carrierMatches(CarrierType.BENREVO.name(), appCarrier)){
                throw new NotFoundException("No RFP Submission found for category="+ product +", clientId=" + client.getClientId());
            } else if (null == rfpSubmission && carrierMatches(CarrierType.BENREVO.name(), appCarrier)){
                // create rfp submission
                rfpSubmission = rfpSubmissionRepository.findByRfpCarrierAndClient(rfpCarrier, client);
                if(rfpSubmission == null) {
                    rfpSubmission = createRfpSubmission(client, rfpCarrier, persist);
                }
            }

            //create new version
            RfpQuoteVersion rfpQuoteVersion = new RfpQuoteVersion();
            rfpQuoteVersion.setRfpSubmissionId(rfpSubmission.getRfpSubmissionId());
            if (persist) {
                rfpQuoteVersionRepository.save(rfpQuoteVersion);
            }

            //create new quote w/ version
            rfpQuote = new RfpQuote();
            rfpQuote.setRatingTiers(tiers);
            rfpQuote.setLatest(true);
            rfpQuote.setUpdated(new Date());
            rfpQuote.setQuoteType(quoteType);
            rfpQuote.setRfpSubmission(rfpSubmission);
            rfpQuote.setRfpQuoteVersion(rfpQuoteVersion);
            rfpQuote.setDisclaimer(disclaimer);
            if (persist) {
                rfpQuoteRepository.save(rfpQuote);
            }

            for(UHCNetworkDetails plan : options){

                String networkType = "";
                String networkName = plan.getNetworkName();
                String networkNameWithPlan = plan.getNetworkName() + "__Plan:" + plan.getFullPlanName();

                /**
                 * UHC Dental
                 DHMO -> Full Network
                 DPPO -> Options PPO 20
                 Options PPO 30
                 UHC Vision
                 Vision -> Full Network
                 **/
                if(product.equals(Constants.VISION)){
                    networkType = "Vision";
                }else if(product.equals(Constants.DENTAL)){
                    if (plan.getNetworkName().contains("PPO")){
                        networkType = "DPPO";
                    } else if (plan.getNetworkName().equals("Full Network")) {
                        networkType = "DHMO";
                    }
                }

                Network network = networkRepository.findByNameAndTypeAndCarrier(networkName, networkType, rfpCarrier.getCarrier());
                if(network == null || network.getNetworkId() == null){ //this is very bad
                    throw new NotFoundException("No network found in DB for networkName=" + networkName + ", networkType=" + networkType);
                }

                RfpQuoteNetwork quoteNetwork = new RfpQuoteNetwork(rfpQuote, network, networkNameWithPlan);
                quoteNetwork.setaLaCarte(true);
                if (persist) {
                    rfpQuoteNetworkRepository.save(quoteNetwork);
                }

                // save the plan information for this primary plan
                saveUHCDentalAndVisionPlanInformation(plan, rfpCarrier, network, quoteNetwork, true, isRenewal);

                ArrayList<UHCNetworkDetails> alternatives = plan.getAlternatives();
                for(UHCNetworkDetails alt : alternatives){
                    // save the plan information for this alternative plan under the primary plan
                    saveUHCDentalAndVisionPlanInformation(alt, rfpCarrier, network, quoteNetwork, false, isRenewal);
                }
                rfpQuote.getRfpQuoteNetworks().add(quoteNetwork);
            }
        }catch(Exception e){
            BaseDao.rollback();
            throw e;
        }

        return rfpQuote;
    }

    private RfpSubmission createRfpSubmission(Client client, RfpCarrier rfpCarrier, boolean persist) {
        RfpSubmission rfpSubmission;
        rfpSubmission = new RfpSubmission();
        rfpSubmission.setClient(client);
        rfpSubmission.setRfpCarrier(rfpCarrier);
        rfpSubmission.setCreated(fromDateToString(new Date(), DATETIME_FORMAT));
        rfpSubmission.setDisqualificationReason(null);
        rfpSubmission.setSubmittedBy("BenrevoUHCAdmin");
        rfpSubmission.setSubmittedDate(new Date());
        if(persist) {
            rfpSubmission = rfpSubmissionRepository.save(rfpSubmission);
        }
        return rfpSubmission;
    }

    private boolean saveUHCDentalAndVisionPlanInformation(UHCNetworkDetails details, RfpCarrier rfpCarrier,
        Network network, RfpQuoteNetwork quoteNetwork, boolean isPrimaryPlan, boolean isRenewal){

        // Ensure plans exist if not, create a new one
        String planName = details.getFullPlanName();
        PlanNameByNetwork pnn = null;

        Client client = quoteNetwork.getRfpQuote().getRfpSubmission().getClient();
        int planYear = client.getEffectiveYear();

        List<PlanNameByNetwork> pnnList = findPnnHelper(planName, network, planYear, client.getClientId());
        if(null == pnnList || pnnList.size() == 0) {
            if(network.getType().equals("DHMO")){
                // per Ojas and Jimson exception out!

                throw new NotFoundException(
                    format("No PlanNameByNetwork found in DB for network=%s, planName=%s, year=%s, and networkType=%s",
                        network.getName(), planName, planYear, network.getType()));
            }
            Plan plan = new Plan(rfpCarrier.getCarrier(), planName, network.getType());
            plan.setPlanYear(planYear);
            if (persist) {
                planRepository.save(plan);
            }
            //create the network for test
            pnn = new PlanNameByNetwork(plan, network, planName, network.getType());
            pnn.setCustomPlan(true);
            pnn.setClientId(client.getClientId());
            if (persist) {
                planNameByNetworkRepository.save(pnn);
            }
            for (Benefit b : details.getGenericPlanDetails().getBenefits()) {
                b.setPlan(plan);
                if (persist) {
                    benefitRepository.save(b);
                }
            }
        } else {
            pnn = pnnList.get(0);
            planUtil.updatePlan(pnn.getPlan(), details.getGenericPlanDetails(), null, persist);
        }

        if(isRenewal && details.isRenewalRateAvailable()
            && details.getTier1CurrentRate() != null
            && !details.getTier1CurrentRate().equals("0")
            && !details.getTier1CurrentRate().isEmpty()){

            List<Benefit> benefitsCopy = benefitRepository.findByPlanId(pnn.getPlan().getPlanId()).stream().map(Benefit::copy).collect(toList());
            uhcRenewalHelper.createClientPlansIfNotFound(
                quoteNetwork.getRfpQuote().getRfpSubmission().getClient().getClientId(),
                network, rfpCarrier, details, benefitsCopy,
                quoteNetwork.getRfpQuote().getRatingTiers(), benefitNames, persist);
        }

        Float tier1Rate = Float.parseFloat(getValueOrDefault(details.getTier1Rate(), "0.0"));
        Float tier2Rate = Float.parseFloat(getValueOrDefault(details.getTier2Rate(), "0.0"));
        Float tier3Rate = Float.parseFloat(getValueOrDefault(details.getTier3Rate(), "0.0"));
        Float tier4Rate = Float.parseFloat(getValueOrDefault(details.getTier4Rate(), "0.0"));

        RfpQuoteNetworkPlan quoteNetworkPlan = new RfpQuoteNetworkPlan(quoteNetwork, pnn, tier1Rate, tier2Rate, tier3Rate, tier4Rate);
        quoteNetworkPlan.setMatchPlan(isPrimaryPlan);
        quoteNetworkPlan.setVoluntary(details.isVoluntary());

        // validate plan tier rates
        quoteHelper.validatePlanTierRates(quoteNetwork.getRfpQuote(), quoteNetworkPlan, null, persist);

        if (persist) {
            quoteNetworkPlan = rfpQuoteNetworkPlanRepository.save(quoteNetworkPlan);
        }

        // save attributes
        for (QuotePlanAttribute attr: details.getAttributes()) {
            attr.setPlan(quoteNetworkPlan);
            if(persist) {
                attributeRepository.save(attr);
            }
        }

        quoteNetwork.getRfpQuoteNetworkPlans().add(quoteNetworkPlan);

        return true;
    }

    private RfpQuote saveMedicalQuotes(List<LinkedHashMap<String, UHCNetwork>> networkToPlansMapList, 
        Long clientId, Long brokerId, QuoteType quoteType, String product, String disclaimer, String disclaimerType, int tiers, 
        boolean isRenewal, RfpQuote rfpQuoteToAdd) throws Exception{

        RfpQuote rfpQuote = rfpQuoteToAdd;

        List<Client> clientList = clientRepository.findByClientIdAndBrokerBrokerId(clientId, brokerId);
        if(null == clientList  || clientList.size() == 0) {
            throw new NotFoundException("No client with ID=" + clientId +", broker id= " + brokerId + " found");
        }
        Client client = clientList.get(0);

        RfpCarrier rfpCarrier  = rfpCarrierRepository.findByCarrierNameAndCategory(Constants.UHC_CARRIER, product);
        if (rfpQuote == null) { // create new quote
    
            RfpSubmission rfpSubmission = rfpSubmissionRepository.findByRfpCarrierAndClient(rfpCarrier, client); //TODO: get by product
            if(null == rfpSubmission && !carrierMatches(CarrierType.BENREVO.name(), appCarrier)){
                throw new NotFoundException("No RFP Submission found for category="+ product +", clientId=" + client.getClientId());
            } else if (null == rfpSubmission && carrierMatches(CarrierType.BENREVO.name(), appCarrier)){
                // create rfp submission
                rfpSubmission = rfpSubmissionRepository.findByRfpCarrierAndClient(rfpCarrier, client);
                if(rfpSubmission == null) {
                    rfpSubmission = createRfpSubmission(client, rfpCarrier, persist);
                }
            }
    
            //create new version
            RfpQuoteVersion rfpQuoteVersion = new RfpQuoteVersion();
            rfpQuoteVersion.setRfpSubmissionId(rfpSubmission.getRfpSubmissionId());
            if (persist) {
                rfpQuoteVersionRepository.save(rfpQuoteVersion);
            }
    
            //create new quote w/ version
            rfpQuote = new RfpQuote();
            rfpQuote.setRatingTiers(tiers);
            rfpQuote.setLatest(true);
            rfpQuote.setUpdated(new Date());
            rfpQuote.setQuoteType(quoteType);
            rfpQuote.setRfpSubmission(rfpSubmission);
            rfpQuote.setRfpQuoteVersion(rfpQuoteVersion);
            if (isRenewal) {
                rfpQuote.addDisclaimer(disclaimerType, disclaimer);
            } else {
                rfpQuote.setDisclaimer(disclaimer);
            }
            if (persist) {
                rfpQuoteRepository.save(rfpQuote);
            }
        } else if (isRenewal){
            // add disclaimer to existed quote
            rfpQuote.addDisclaimer(disclaimerType, disclaimer);
        }
        
        saveParsedQuotesToDB(rfpCarrier, rfpQuote, networkToPlansMapList, clientId, isRenewal);

        if(quoteType.equals(QuoteType.KAISER) || quoteType.equals(QuoteType.KAISER_EASY)){
            quoteHelper.addKaiserNetwork(rfpQuote, client, product, persist);
        }
        return rfpQuote;
    }


    /**
     * A function that saves all the aggregated parsed quote data into the respective DB tables via their entities
     *  LinkedMap Structure:
     *         {networkName: UHCNetworkDetails} e.g. {'Signature' : UHCNetworkDetails(which has the plan info and tier costs)}
     * @param networkToPlansMapList - the List of LinkedHashMap
     * @param clientId
     * @throws Exception
     */
    private void saveParsedQuotesToDB(RfpCarrier rfpCarrier, RfpQuote rfpQuote,
        List<LinkedHashMap<String, UHCNetwork>> networkToPlansMapList, Long clientId, boolean isRenewal) throws Exception{

        RfpQuoteOption rfpOption1 = null;
        RfpQuoteOption rfpOption2 = null;
        if (isRenewal) {
            rfpOption1 = createOrFindOption(rfpQuote, RENEWAL_1);
            rfpOption2 = createOrFindOption(rfpQuote, RENEWAL_2);
        }

        List<Long> listOfRqonsToDelete = new ArrayList<>();
        Set<Long> clientPlansIds = clientPlanRepository.findByClientClientId(clientId)
                .stream()
                .map(ClientPlan::getClientPlanId)
                .collect(Collectors.toSet());
        for (LinkedHashMap<String, UHCNetwork> networkToPlansMap : networkToPlansMapList) {
            // parse the MPE sheets
            for(String networkNameWithRx : networkToPlansMap.keySet()) {
                UHCNetwork uhcNetwork = networkToPlansMap.get(networkNameWithRx);
                ArrayList<UHCNetworkDetails> plans = uhcNetwork.getNetworksDetails();
                ArrayList<UHCNetworkDetails> rxPlans = uhcNetwork.getNetworksDetailsRx();
                ArrayList<UHCNetworkDetails> additionalRxPlans = uhcNetwork.getAdditionalPharmacyBenefits();

                UHCNetworkDetails firstPlan = plans.get(0);
                String networkType = firstPlan.getNetworkType();

                // save medical information
                String networkName = stripPlanNameIfExists(networkNameWithRx);
                networkName = deriveNetworkName(networkName, networkType);
                Network network = networkRepository.findByNameAndTypeAndCarrier(networkName, networkType, rfpCarrier.getCarrier());
                if(network == null || network.getNetworkId() == null){ //this is very bad
                    throw new NotFoundException("No network found in DB for network=" + networkName + ", networkType=" + networkType);
                }

                RfpQuoteNetwork rfpQuoteNetwork = medicalQuoteHelper(rfpQuote, network, networkNameWithRx, networkType, plans, isRenewal);

                // save riders
                if (CollectionUtils.isEmpty(uhcNetwork.getNetworksDetailsRider())) {
                    saveRiders(rfpQuoteNetwork, uhcNetwork.getOption().getOtherBenefits());
                } else {
                    saveRiders(rfpQuoteNetwork, uhcNetwork);
                }

                if(rxPlans.isEmpty()) {
                    throw new NotFoundException("No RX plan found for this network: " + networkNameWithRx);
                }
                additionalRxPlans.addAll(0, rxPlans);
                
                //find the Rx network
                String rxNetworkType = "HMO".equals(networkType) ? "RX_HMO" : "RX_PPO";
                Network rxNetwork = networkRepository.findByNameAndTypeAndCarrier(RX_NETWORK_NAME, rxNetworkType, rfpCarrier.getCarrier());
                if(rxNetwork == null || rxNetwork.getNetworkId() == null){ //this is very bad
                    throw new NotFoundException("No network found in DB for network=" + RX_NETWORK_NAME + ", networkType=" + rxNetworkType);
                }
                
                saveMedicalRXPlans(rfpQuoteNetwork, rxNetwork, rfpCarrier.getCarrier(), additionalRxPlans, isRenewal);
                rfpQuote.getRfpQuoteNetworks().add(rfpQuoteNetwork);

                // save clientPlans
                ClientPlan clientPlan = null;
                UHCNetworkDetails option = uhcNetwork.getOption();
                if(option != null
                    && option.isRenewalRateAvailable()
                    && option.getCurrentPlanName() != null
                    && option.getTier1CurrentRate() != null
                    && !option.getTier1CurrentRate().equals("0")
                    && !option.getTier1CurrentRate().isEmpty()){

                    Client client = rfpQuote.getRfpSubmission().getClient();
                    int planYear = client.getEffectiveYear();

                    List<Benefit> benefits = getBenefits(uhcNetwork.getNetworksDetails(), network, planYear, option.getCurrentPlanName(), client.getClientId());
                    List<Benefit> rxBenefits = getBenefits(uhcNetwork.getNetworksDetailsRx(), rxNetwork, planYear, option.getCurrentRxPlanName(), client.getClientId());

                    clientPlan = uhcRenewalHelper.createOrGetClientPlan(clientId, network,
                        rfpCarrier, option, rfpQuote.getRatingTiers(), persist, benefitNames, benefits, rxBenefits);
                }

                // create option1 and option2
                if (isRenewal && !isNull(clientPlan)) {
                    clientPlansIds.add(clientPlan.getClientPlanId());

                    // renewal rx has no buy-down per Ojas and Yusuf
                    RfpQuoteNetworkPlan rxRfpQuoteNetworkPlan = findMatchRx(rfpQuoteNetwork.getRfpQuoteNetworkPlans());
                    if (rfpQuoteNetwork.getRfpQuoteNetworkPlans().size() > 0) {
                        createOrFindRqon(rfpOption1, option, rfpQuoteNetwork, clientPlan,
                            rfpQuoteNetwork.getRfpQuoteNetworkPlans().get(0),
                            rxRfpQuoteNetworkPlan, listOfRqonsToDelete, clientPlansIds);
                    }
                    if (rfpQuoteNetwork.getRfpQuoteNetworkPlans().size() > 1) {
                        createOrFindRqon(rfpOption2, option, rfpQuoteNetwork, clientPlan,
                            rfpQuoteNetwork.getRfpQuoteNetworkPlans().get(1),
                            rxRfpQuoteNetworkPlan, listOfRqonsToDelete, clientPlansIds);
                    }
                }
            }
        }

        if (isRenewal) {
            if(CollectionUtils.isNotEmpty(listOfRqonsToDelete)) {
                rfpQuoteOptionNetworkRepository.deleteByRfpQuoteOptionNetworkIdIn(listOfRqonsToDelete);
            }
        }    
    }

    private String deriveNetworkName(String networkName, String networkType) {
        if ("HMO".equals(networkType)) {
            if (StringUtils.containsIgnoreCase(networkName, "Focus")) {
                networkName = "Focus";
            } else if (StringUtils.containsIgnoreCase(networkName, "Advantage")) {
                networkName = "Advantage";
            } else if (StringUtils.containsIgnoreCase(networkName, "Alliance")) {
                networkName = "Alliance";
            } else if (StringUtils.containsIgnoreCase(networkName, "Signature")) {
                networkName = "Signature";
            }
        }
        return networkName;
    }

    private RfpQuoteNetworkPlan findMatchRx(List<RfpQuoteNetworkPlan> rfpQuoteNetworkPlans){
        return rfpQuoteNetworkPlans.stream()
            .filter(rqnp -> rqnp.isMatchPlan() && rqnp.getPnn().getPlanType().startsWith("RX_"))
            .findFirst()
            .orElse(null);
    }

    private List<Benefit> getBenefits(ArrayList<UHCNetworkDetails> plans, Network network, int planYear, String planName, Long clientId) {
        List<Benefit> benefits;
        PlanNameByNetwork pnn = findPnn(planName, network, planYear, clientId);
        if (pnn == null) {
            // try to find parsed plan
            UHCNetworkDetails parsedPlan = plans
                .stream()
                .filter(p -> p.getShortPlanName().equals(planName))
                .findFirst()
                .orElseThrow(() -> new BaseException(format("CurrentPlan - can't find parsed plan with name %s", planName)));
            // use benefits from parsed plan
            benefits = parsedPlan.getGenericPlanDetails().getBenefits();
        } else {
            // use benefits from existing plan
            benefits = pnn.getPlan().getBenefits();
        }
        // return copy (parsed plans can already be saved)
        return benefits.stream().map(Benefit::copy).collect(toList());
    }

    private void createOrFindRqon(RfpQuoteOption rfpOption, UHCNetworkDetails option,
        RfpQuoteNetwork rfpQuoteNetwork, ClientPlan clientPlan, RfpQuoteNetworkPlan rqnp,
        RfpQuoteNetworkPlan rxRqnp, List<Long> listOfRqonsToDelete, Set<Long> clientPlansIds) {

        for(RfpQuoteOptionNetwork rqon : rfpOption.getRfpQuoteOptionNetworks()){
            if(!isNull(rqon.getClientPlan()) && !isNull(clientPlan)
                && !rqon.getClientPlan().getClientPlanId().equals(clientPlan.getClientPlanId())
                && !clientPlansIds.contains(rqon.getClientPlan().getClientPlanId())){

                listOfRqonsToDelete.add(rqon.getRfpQuoteOptionNetworkId());
            }else{
                if(listOfRqonsToDelete.contains(rqon.getRfpQuoteOptionNetworkId())){
                    listOfRqonsToDelete.remove(rqon.getRfpQuoteOptionNetworkId());
                }
            }
        }

        RfpQuoteOptionNetwork rqon = rfpOption.getRfpQuoteOptionNetworks()
            .stream()
            .filter(rfpQuoteOptionNetwork -> !isNull(rfpQuoteOptionNetwork.getClientPlan()) && !isNull(clientPlan)
                && rfpQuoteOptionNetwork.getClientPlan().getClientPlanId().equals(clientPlan.getClientPlanId()))
            .findFirst()
            .orElse(null);

        boolean isNewRqon = false;
        if(rqon == null){
            rqon = new RfpQuoteOptionNetwork();
            rqon.setRfpQuoteVersion(rfpOption.getRfpQuoteVersion());
            rqon.setRfpQuoteOption(rfpOption);
            isNewRqon = true;
        }

        rqon.setRfpQuoteNetwork(rfpQuoteNetwork);
        rqon.setSelectedRfpQuoteNetworkPlan(rqnp);
        rqon.setSelectedRfpQuoteNetworkRxPlan(rxRqnp);


        // set match riders as selected
        rqon.getSelectedRiders().clear();
        for(Rider rider : rqon.getRfpQuoteNetwork().getRiders()) {
            if (rider.isMatch()) {
                rqon.getSelectedRiders().add(rider);
            }
        }
        
        if (clientPlan != null) {
            rqon.setClientPlan(clientPlan);
            rqon.setOutOfState(clientPlan.isOutOfState());
            rqon.setErContributionFormat(StringUtils.defaultIfEmpty(clientPlan.getErContributionFormat(), Constants.ER_CONTRIBUTION_FORMAT_PERCENT));
            rqon.setTier1ErContribution(floatValue(clientPlan.getTier1ErContribution()));
            rqon.setTier2ErContribution(floatValue(clientPlan.getTier2ErContribution()));
            rqon.setTier3ErContribution(floatValue(clientPlan.getTier3ErContribution()));
            rqon.setTier4ErContribution(floatValue(clientPlan.getTier4ErContribution()));
        } else {
            rqon.setErContributionFormat(Constants.ER_CONTRIBUTION_FORMAT_DOLLAR);
            rqon.setTier1ErContribution(0f);
            rqon.setTier2ErContribution(0f);
            rqon.setTier3ErContribution(0f);
            rqon.setTier4ErContribution(0f);
        }

        if("Hsa".equalsIgnoreCase(rfpQuoteNetwork.getNetwork().getType())) {
            Carrier carrier = rfpOption.getRfpQuote().getRfpSubmission().getRfpCarrier().getCarrier();
            rqon.setAdministrativeFee(administrativeFeeService.getDefault(carrier.getCarrierId()));
        }

        rqon.setTier1Census(toLong(option.getTier1Census()));
        rqon.setTier2Census(toLong(option.getTier2Census()));
        rqon.setTier3Census(toLong(option.getTier3Census()));
        rqon.setTier4Census(toLong(option.getTier4Census()));

        rfpQuoteOptionNetworkRepository.save(rqon);
        if(isNewRqon) {
            rfpOption.getRfpQuoteOptionNetworks().add(rqon);
        }
    }

    private RfpQuoteOption createOrFindOption(RfpQuote rfpQuote, String optionName) {
        RfpQuoteOption existingRenewalOption = rfpQuoteOptionRepository.findByClientIdAndCategory(
            rfpQuote.getRfpSubmission().getClient().getClientId(),
            rfpQuote.getRfpSubmission().getRfpCarrier().getCategory()
        )
        .stream()
        .filter(opt -> opt.getRfpQuoteOptionName().equalsIgnoreCase(optionName))
        .findFirst()
        .orElse(new RfpQuoteOption());

        existingRenewalOption.setRfpQuote(rfpQuote);
        existingRenewalOption.setRfpQuoteOptionName(optionName);
        existingRenewalOption.setRfpQuoteVersion(rfpQuote.getRfpQuoteVersion());
        existingRenewalOption = rfpQuoteOptionRepository.save(existingRenewalOption);
        rfpQuote.getRfpQuoteOptions().add(existingRenewalOption);
        return existingRenewalOption;
    }

    private static Float floatValue(Float value) {
        return value == null ? 0F : value.floatValue();
    }

    private static Long longValue(Long value) {
        return value == null ? 0L : value;
    }

    private String stripPlanNameIfExists(String networkNameWithRx) {
        int stringIndex = networkNameWithRx.indexOf(UHCMedicalQuoteParser.NETWORK_WITH_PLAN_DELIM);
        if (stringIndex >= 0) {
            return networkNameWithRx.substring(0, stringIndex);
        } 
        
        stringIndex = networkNameWithRx.indexOf(UHCMedicalQuoteParser.NETWORK_WITH_RX_PLAN_DELIM);
        if (stringIndex >= 0) {
            return networkNameWithRx.substring(0, stringIndex);
        }
        return networkNameWithRx;
    }

    //TODO: refactor plan method below and this RX method, 85% the same.
    private void saveMedicalRXPlans(RfpQuoteNetwork rfpQuoteNetwork, Network network, Carrier carrier, ArrayList<UHCNetworkDetails> rxPlans, boolean isRenewal){

        Client client = rfpQuoteNetwork.getRfpQuote().getRfpSubmission().getClient();
        int planYear = client.getEffectiveYear();

        for(UHCNetworkDetails rxPlan : rxPlans) {
            // Ensure rx plans exist if not lose your shit
            String planName = rxPlan.getShortPlanName();

            PlanNameByNetwork pnn = null;
            List<PlanNameByNetwork> pnnList = findPnnHelper(planName, network, planYear, client.getClientId());

            if(null == pnnList || pnnList.size() == 0) {
                if (isTest) {
                    missingPlans++;
                    missingPlansList.add(network.getType() + "/" + RX_NETWORK_NAME + "/" + planName);
                    continue;
                } else {
                    if (isRenewal) {
                        pnn = createPnn(client, network, rxPlan.getGenericPlanDetails().getBenefits(), planName, planYear);
                    } else {
                        throw new NotFoundException(
                            format("No PlanNameByNetwork found in DB for network=%s, planName=%s, year=%s, and networkType=%s",
                                RX_NETWORK_NAME, planName, planYear, network.getType()));
                    }
                }
            } else {
                pnn = pnnList.get(0);
            }

            Float tier1Rate = null, tier2Rate = null, tier3Rate = null, tier4Rate = null;
            if(rfpQuoteNetwork.getRfpQuote().getRatingTiers() >= 1) {
                tier1Rate = Float.parseFloat(remove(rxPlan.getTier1Rate(), ","));
            }
            if(rfpQuoteNetwork.getRfpQuote().getRatingTiers() >= 2) {
                tier2Rate = Float.parseFloat(remove(rxPlan.getTier2Rate(), ","));
            }
            if(rfpQuoteNetwork.getRfpQuote().getRatingTiers() >= 3) {
                tier3Rate = Float.parseFloat(remove(rxPlan.getTier3Rate(), ","));
            }
            if(rfpQuoteNetwork.getRfpQuote().getRatingTiers() >= 4) {
                tier4Rate = Float.parseFloat(remove(rxPlan.getTier4Rate(), ","));
            }

            RfpQuoteNetworkPlan quoteNetworkPlan = new RfpQuoteNetworkPlan(rfpQuoteNetwork, pnn, tier1Rate, tier2Rate, tier3Rate, tier4Rate);
            quoteNetworkPlan.setMatchPlan(rxPlan.isMatch());

            // validate plan tier rates
            quoteHelper.validatePlanTierRates(rfpQuoteNetwork.getRfpQuote(), quoteNetworkPlan, null, persist);

            if (persist) {
                rfpQuoteNetworkPlanRepository.save(quoteNetworkPlan);
            }

            // save attributes
            for (QuotePlanAttribute attr: rxPlan.getAttributes()) {
                attr.setPlan(quoteNetworkPlan);
                if(persist) {
                    attributeRepository.save(attr);
                }
            }
            rfpQuoteNetwork.getRfpQuoteNetworkPlans().add(quoteNetworkPlan);
        }
    }

    private RfpQuoteNetwork medicalQuoteHelper(RfpQuote rfpQuote, Network network, String networkName, String networkType, 
            ArrayList<UHCNetworkDetails> plans, boolean isRenewal){

        RfpQuoteNetwork quoteNetwork = new RfpQuoteNetwork(rfpQuote, network, networkName);
        quoteNetwork.setaLaCarte(true);
        if (persist) {
            rfpQuoteNetworkRepository.save(quoteNetwork);
        }

        Client client = rfpQuote.getRfpSubmission().getClient();
        int planYear = client.getEffectiveYear();

        //Add plans to the rfp quote network
        for (UHCNetworkDetails planInfo : plans) {

            // Ensure plans exist if not, create a new one
            String planName = planInfo.getShortPlanName();
            PlanNameByNetwork pnn = findPnn(planName, network, planYear, client.getClientId());
            if(pnn == null) {
                if (isTest) {
                    missingPlans++;
                    missingPlansList.add(networkType + "/" + networkName + "/" + planName);
                    continue;
                } else {
                    if (isRenewal) {
                        pnn = createPnn(client, network, planInfo.getGenericPlanDetails().getBenefits(), planName, planYear);
                    } else {
                        throw new NotFoundException(
                            format("No PlanNameByNetwork found in DB for network=%s, planName=%s, year=%s, and networkType=%s",
                                networkName, planName, planYear, networkType));
                    }
                }
            } else {
                foundPlans++;
            }

            Float tier1Rate = Float.parseFloat(remove(planInfo.getTier1Rate(),","));
            Float tier2Rate = Float.parseFloat(remove(planInfo.getTier2Rate(),","));
            Float tier3Rate = Float.parseFloat(remove(planInfo.getTier3Rate(),","));
            Float tier4Rate = Float.parseFloat(remove(planInfo.getTier4Rate(),","));

            RfpQuoteNetworkPlan quoteNetworkPlan = new RfpQuoteNetworkPlan(quoteNetwork, pnn, tier1Rate, tier2Rate, tier3Rate, tier4Rate);
            quoteNetworkPlan.setMatchPlan(planInfo.isMatch());

            // validate plan tier rates
            quoteHelper.validatePlanTierRates(quoteNetwork.getRfpQuote(), quoteNetworkPlan, null, persist);

            if (persist) {
                rfpQuoteNetworkPlanRepository.save(quoteNetworkPlan);
            }
            quoteNetwork.getRfpQuoteNetworkPlans().add(quoteNetworkPlan);
        }

        return quoteNetwork;
    }

    private PlanNameByNetwork createPnn(Client client, Network network, List<Benefit> benefits,
            String planName, int planYear) {
        PlanNameByNetwork pnn;
        // create pnn
        Plan plan = new Plan(network.getCarrier(), planName, network.getType());
        plan.setPlanYear(planYear);
        if (persist) {
            planRepository.save(plan);
        }
        pnn = new PlanNameByNetwork(plan, network, planName, network.getType());
        pnn.setCustomPlan(true);
        pnn.setClientId(client.getClientId());
        if (persist) {
            planNameByNetworkRepository.save(pnn);
        }
        plan.setBenefits(new ArrayList<>());
        if (benefits == null || benefits.isEmpty()) {
            //add empty benefits for given plan type
            planBenefitsHelper.addPlaceHolderBenefitsToPlan(benefitNames, network.getCarrier(), plan);
        } else {
            // save real benefits
            for (Benefit b : benefits) {
                b.setPlan(plan);
                benefitRepository.save(b);
                if (persist) {
                    b = benefitRepository.save(b);
                }
                plan.getBenefits().add(b);
            }
        }
        return pnn;
    }

    /**
     * Finds the pnn by first looking for custom plans for client, then carrier plans
     * @return
     */
    private List<PlanNameByNetwork> findPnnHelper(String planName, Network network,
        int planYear, Long clientId){
        
        // try to find "Carrier Custom Plan for a Client"
        List<PlanNameByNetwork> pnnList = planNameByNetworkRepository.
            findByNetworkAndNameAndPlanTypeAndPlanPlanYearAndClientIdAndCustomPlan(network,
                planName, network.getType(), planYear, clientId, true);

        if(CollectionUtils.isEmpty(pnnList)){
            // try to find "Carrier Standard Plan"
            pnnList = planNameByNetworkRepository.
                    findByNetworkAndNameAndPlanTypeAndPlanPlanYearAndClientIdAndCustomPlan(network,
                            planName, network.getType(), planYear, null , false);
        }
        return pnnList;
    }


    private PlanNameByNetwork findPnn(String planName, Network network, int planYear, Long clientId) {

        List<PlanNameByNetwork> pnnList = findPnnHelper(planName, network, planYear, clientId); 
        
        if(CollectionUtils.isEmpty(pnnList)){
            // UHC quotes often are missing dashes that should be in pos 3 for plans that start with A or P
            String altPlanName = createAltUHCPlanNameWithDash(planName);
            if (altPlanName != null) {
                pnnList = planNameByNetworkRepository.
                        findByNetworkAndNameAndPlanTypeAndPlanPlanYearAndClientIdAndCustomPlan(
                                network, altPlanName, network.getType(), planYear, null, false);
            }
        }
        
        return CollectionUtils.isEmpty(pnnList) ? null : pnnList.get(0);
    }

    private void saveRiders(RfpQuoteNetwork quoteNetwork, String otherBenefits) {
        String[] riderCodes = splitRiderCodes(otherBenefits);
        if (riderCodes != null) {
            
            List<RiderMeta> riderMeta = quoteHelper.findRiderMeta(riderCodes, quoteNetwork.getNetwork().getType(), null, null, persist);
            Set<Rider> riders = new HashSet<>(riderMeta.size());
            riderMeta.forEach(meta -> {

                Rider rider = new Rider();
                rider.setRiderMeta(meta);
                rider.setTier1Rate(0f);
                rider.setTier2Rate(0f);
                rider.setTier3Rate(0f);
                rider.setTier4Rate(0f);
                riders.add(rider);
                
            });
            if (persist) {
                quoteNetwork.setRiders(new HashSet<>(riderRepository.save(riders)));
            } else {
                quoteNetwork.setRiders(riders);
            }

        }
    }

    /**
     * Splits rider's codes with parentheses
     * For example: "Infertility (Per Life, $2,000 Med, $2,000 Rx), Bariatric & Obesity Surgery"
     * is split to
     * "Infertility (Per Life, $2,000 Med, $2,000 Rx)" and "Bariatric & Obesity Surgery"
     * @param otherBenefits
     * @return String[]
     */
    private String[] splitRiderCodes(String otherBenefits) {
        
        if (otherBenefits == null) {
            return null;
        }

        List<String> result = new ArrayList<>();
        Matcher matcher = RIDER_CODE_PATTERN.matcher(otherBenefits);
        
        int endInd = 0;
        while (matcher.find()) {
            result.add(matcher.group(1).trim());
            endInd = matcher.end();
        }
        result.add(otherBenefits.substring(endInd).trim());
        
        return result.toArray(new String[result.size()]);
    }

    private void saveRiders(RfpQuoteNetwork quoteNetwork, UHCNetwork uhcNetwork) {
        
        List<UHCNetworkDetails> parsedRiders = uhcNetwork.getNetworksDetailsRider();
        String[] proposedRiderCodes = splitRiderCodes(uhcNetwork.getOption().getOtherBenefits());
        
        for (UHCNetworkDetails parsedRider: parsedRiders) {
            String riderCode = parsedRider.getShortPlanName();
            RiderMeta meta = quoteHelper.findRiderMeta(riderCode, quoteNetwork.getNetwork().getType(), null, null, persist);
            
            Rider rider = new Rider();
            rider.setRiderMeta(meta);
            rider.setTier1Rate(Float.parseFloat(remove(parsedRider.getTier1Rate(),",")));
            rider.setTier2Rate(Float.parseFloat(remove(parsedRider.getTier2Rate(),",")));
            rider.setTier3Rate(Float.parseFloat(remove(parsedRider.getTier3Rate(),",")));
            rider.setTier4Rate(Float.parseFloat(remove(parsedRider.getTier4Rate(),",")));
            rider.setSelectable(true);
            rider.setMatch(ArrayUtils.contains(proposedRiderCodes, riderCode));
            
            if (persist) {
                rider = riderRepository.save(rider);
            } 
            quoteNetwork.getRiders().add(rider);
            
        }
    }

    public static String createAltUHCPlanNameWithDash(String planName) {
        if ((planName.startsWith("A") || planName.startsWith("P") || planName.startsWith("U") || planName.startsWith("I"))
            && planName.length() > 2) {
            return planName.substring(0, 2) + "-" + planName.substring(2);
        }

        return null;
    }

    private List<String> getUhcNewtworkNames() {

        List<String> uchNetworkNames = new ArrayList<>();
        Carrier carrier = carrierRepository.findByName(CARRIER_NAME);

        List<Network> networks = networkRepository.findByCarrierCarrierId(carrier.getCarrierId());
        for(Network network : networks) {
            uchNetworkNames.add(network.getName());
        }

        return uchNetworkNames;
    }
}
