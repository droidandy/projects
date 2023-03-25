package com.benrevo.be.modules.admin.domain.quotes.parsers.anthem;

import static com.benrevo.common.Constants.ANTHEM_DISCLAIMER;
import static com.benrevo.common.Constants.ANTHEM_WITH_DPPO_DISCLAIMER;
import static com.benrevo.common.Constants.DATETIME_FORMAT;
import static com.benrevo.common.Constants.LIFE;
import static com.benrevo.common.enums.CarrierType.ANTHEM_BLUE_CROSS;
import static com.benrevo.common.enums.CarrierType.carrierMatches;
import static com.benrevo.common.enums.CarrierType.validCarrier;
import static com.benrevo.common.util.DateHelper.fromDateToString;
import static com.benrevo.common.util.MapBuilder.field;
import static com.benrevo.common.util.StringHelper.getStandardAnthemPlanName;
import static java.lang.String.format;
import static java.util.Objects.isNull;
import static org.apache.commons.lang3.StringUtils.containsIgnoreCase;
import static org.springframework.util.CollectionUtils.isEmpty;
import static org.springframework.web.util.HtmlUtils.htmlEscape;

import com.benrevo.be.modules.admin.domain.quotes.BaseUploader;
import com.benrevo.be.modules.admin.util.PlanUtil;
import com.benrevo.be.modules.admin.util.helper.QuoteHelper;
import com.benrevo.be.modules.shared.service.S3FileManager;
import com.benrevo.be.modules.shared.service.SharedBrokerService;
import com.benrevo.be.modules.shared.service.SharedRfpQuoteService;
import com.benrevo.be.modules.shared.service.SharedRfpService;
import com.benrevo.common.Constants;
import com.benrevo.common.annotation.AppCarrier;
import com.benrevo.common.dto.QuoteChangesDto;
import com.benrevo.common.dto.QuoteParserErrorDto;
import com.benrevo.common.dto.QuoteUploaderDto;
import com.benrevo.common.dto.QuoteUploaderDto.DPPOOption;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.common.exception.ValidationException;
import com.benrevo.data.persistence.entities.BenefitName;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.Network;
import com.benrevo.data.persistence.entities.PlanNameByNetwork;
import com.benrevo.data.persistence.entities.QuotePlanAttribute;
import com.benrevo.data.persistence.entities.RfpCarrier;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpQuoteNetwork;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkCombination;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkPlan;
import com.benrevo.data.persistence.entities.RfpQuoteVersion;
import com.benrevo.data.persistence.entities.RfpSubmission;
import com.benrevo.data.persistence.entities.Rider;
import com.benrevo.data.persistence.entities.RiderMeta;
import com.benrevo.data.persistence.repository.AttributeRepository;
import com.benrevo.data.persistence.repository.BenefitNameRepository;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.NetworkRepository;
import com.benrevo.data.persistence.repository.PlanNameByNetworkRepository;
import com.benrevo.data.persistence.repository.PlanRepository;
import com.benrevo.data.persistence.repository.RfpCarrierRepository;
import com.benrevo.data.persistence.repository.RfpQuoteNetworkCombinationRepository;
import com.benrevo.data.persistence.repository.RfpQuoteNetworkPlanRepository;
import com.benrevo.data.persistence.repository.RfpQuoteNetworkRepository;
import com.benrevo.data.persistence.repository.RfpQuoteRepository;
import com.benrevo.data.persistence.repository.RfpQuoteVersionRepository;
import com.benrevo.data.persistence.repository.RfpSubmissionRepository;
import com.benrevo.data.persistence.repository.RiderMetaRepository;
import com.benrevo.data.persistence.repository.RiderRepository;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.StringJoiner;
import java.util.stream.Collectors;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Component
@AppCarrier(ANTHEM_BLUE_CROSS)
@Transactional(rollbackFor = Exception.class)
public class AnthemQuoteUploader extends BaseUploader {

    private static final Logger LOGGER = LogManager.getLogger(AnthemQuoteUploader.class);

    private String TIER_1_CENSUS = "tier1Census_";
    private String TIER_2_CENSUS = "tier2Census_";
    private String TIER_3_CENSUS = "tier3Census_";

    private String[] networkTypes = {"HMO", "PPO", "HSA", "Vision"};

    private IAnthemParser anthemParser;

    private boolean hasDPPO;
    
    @Autowired
    private RfpSubmissionRepository rfpSubmissionRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private SharedBrokerService sharedBrokerService;

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
    private RiderRepository riderRepository;

    @Autowired
    private RiderMetaRepository riderMetaRepository;

    @Autowired
    private RfpQuoteNetworkCombinationRepository rfpQuoteNetworkCombinationRepository;

    @Autowired
    private QuoteHelper quoteHelper;
    
    @Autowired
    private SharedRfpQuoteService sharedRfpQuoteService;
    
    @Autowired
    private BenefitNameRepository benefitNameRepository;

    @Autowired
    private PlanUtil planUtil;
    
    @Autowired
    private AttributeRepository attributeRepository;

    @Autowired
    private S3FileManager s3FileManager;

    @Autowired
    private SharedRfpService sharedRfpService;

    private Set<QuoteParserErrorDto> validationErrorCollector;
    private Map<String, RfpQuoteNetworkCombination> numberOfNetworksToRfpQuoteNetworkCombination = new HashMap<>();

    // User friendly error messages
    private final String CONTACT_BENREVO_MSG = "Please contact the BenRevo team to resolve this issue and have your quote(s) uploaded.";
    private final String DHMO_AND_DPPO_RATING_TIERS_DO_NOT_MATCH = "The DHMO and DPPO quotes have a different number of rating tiers. The rating tiers must be the same (e.g., 4-tier rates).";
    private final String DHMO_NETWORK_MISSING_FROM_QUOTE_FILE = "The DHMO quote does not appear to have any valid networks or plans listed. Please check the file rate description and plans and re-upload the quote.";
    private final String DPPO_NETWORK_MISSING_FROM_QUOTE_FILE = "The DPPO quote does not appear to have any valid networks or plans listed. Please check the file and re-upload the quote.";
    private final String DPPO_FILES_HAVE_DIFFERENT_TIERS = "The DPPO quotes have a different number of rating tiers. The rating tiers must be the same (e.g., 4-tier rates).";
    private final String NETWORK_NOT_FOUND = "The %s quote includes an invalid network.";
    private final String NETWORK_NOT_FOUND_SUB_MESSAGE = "%s, %s";
    private final String PLAN_NOT_FOUND = "The %s quote includes an invalid plan";
    private final String PLAN_NOT_FOUND_SUB_MESSAGE = "Invalid Plan Name: %s, Cell: %s.";
    private final String MORE_THAN_ONE_STANDARD_FILE_ERROR_MESSAGE = "More than one standard file uploaded. You may only load one standard file and multiple DPPO files";

    @Override
    public boolean useForCarrier(String carrier) {
        return validCarrier(carrier) && carrierMatches(carrier, ANTHEM_BLUE_CROSS);
    }

    private LinkedHashMap<String, AnthemNetworkDetails> getDentalNetworksMap(LinkedHashMap<String, RateDescriptionDTO> data){
        LinkedHashMap<String, AnthemNetworkDetails> networkMap = null;
        for(String rateDescription : data.keySet()) {
            RateDescriptionDTO rd = data.get(rateDescription);
            networkMap = rd.getAnthemNetworks();
            break;
        }
        return networkMap;
    }

    /**
     * Validates the Anthem quotes files by parsing them and returning errors to the user
     * @param files
     * @return
     * @throws Exception
     */
    @Override
    public QuoteUploaderDto validate(List<MultipartFile> files, Long clientId, Long brokerId) throws Exception{
        QuoteUploaderDto dto = new QuoteUploaderDto();

        validationErrorCollector = new HashSet<QuoteParserErrorDto>();
        run(files, clientId, brokerId, dto, false, false);
        dto.setErrors(this.validationErrorCollector);

        if(!isNull(anthemParser) && !isEmpty(anthemParser.getAllMedicalParsedPlanInformation())){
            dto.setNeedsMedicalQuoteType(true);
        }

        if(!isNull(anthemParser) && !isEmpty(anthemParser.getAllDentalParsedPlanInformation())){
            boolean isDPPOQuoteIncluded = anthemParser.getAllDentalParsedPlanInformation().values()
                .stream()
                .flatMap(n -> n.getAnthemNetworks().keySet().stream())
                .anyMatch(s -> s.equalsIgnoreCase("DPPO Network"));

            if(isDPPOQuoteIncluded){
                dto.setNeedsDPPOOption(true);
            }
        }
        return dto;
    }

    /**
     * Note that this method will create RFP submission if not found.
     * Existing run method(file, List<files>, ...) will not per requirements
     */
    @Override
    public List<RfpQuote> run(List<MultipartFile> files, Long clientId, Long brokerId,
        QuoteUploaderDto dto, boolean isTest, boolean persist) throws Exception{

        this.persist = persist;
        this.createRfpSubmissionIfNotFound = true;
        AnthemQuoteFileDifferentiator differentiator = new AnthemQuoteFileDifferentiator();
        List<RfpQuote> quotes = new ArrayList<>();
        List<InputStream> dppoFiles = new ArrayList<>();
        List<InputStream> standardFiles = new ArrayList<>();
        MultipartFile standardFile = differentiator.setAnthemFilesAndGetStandardFile(files, standardFiles, dppoFiles);

        if(standardFiles.size() > 1) { // only one standard file can be uploaded
            log(persist, new QuoteParserErrorDto(MORE_THAN_ONE_STANDARD_FILE_ERROR_MESSAGE),
                new BaseException(
                    format(
                        MORE_THAN_ONE_STANDARD_FILE_ERROR_MESSAGE + ". file_names=%s",
                        files.stream().map( f -> f.getOriginalFilename()).collect(Collectors.joining( ", " ))
                    )
                )
            );
        }

        // parse quote files and join Dental DHMO and DPPO if available
        parseQuoteFilesAndJoinDHMOANDPPO(isEmpty(standardFiles) ? null : standardFiles.get(0), dppoFiles, Constants.DENTAL);

        // Save Medical(If available)
        if(!isEmpty(anthemParser.getAllMedicalParsedPlanInformation())){
            RfpQuote quote = runInner(isEmpty(standardFiles) ? null : standardFiles.get(0), null,
                clientId, brokerId, dto.getMedicalQuoteType(), Constants.MEDICAL, false,
                persist, false, true);

            quoteHelper.saveQuoteFileInS3(standardFile, quote, ANTHEM_BLUE_CROSS, persist); // We only save Standard quote file
            quotes.add(quote);
        }

        // Save Dental(If available)
        if(!isEmpty(anthemParser.getAllDentalParsedPlanInformation())){
            RfpQuote quote = runInner(isEmpty(standardFiles) ? null : standardFiles.get(0), dppoFiles,
                clientId, brokerId, QuoteType.STANDARD, Constants.DENTAL, false, persist,
                false, DPPOOption.NEW_QUOTE.equals(dto.getDPPOOption()));

            quoteHelper.saveQuoteFileInS3(standardFile, quote, ANTHEM_BLUE_CROSS, persist); // We only save Standard quote file
            quotes.add(quote);
        }

        // Save Vision(If available)
        if(!isEmpty(anthemParser.getAllVisionParsedPlanInformation())){
            RfpQuote quote = runInner(isEmpty(standardFiles) ? null : standardFiles.get(0), null,
                clientId, brokerId, QuoteType.STANDARD, Constants.VISION, false,
                persist, false, true);

            quoteHelper.saveQuoteFileInS3(standardFile, quote, ANTHEM_BLUE_CROSS, persist); // We only save Standard quote file
            quotes.add(quote);
        }

        return quotes;
    }

    @Override
    public RfpQuote run(InputStream fis, List<InputStream> dppoFisList, Long clientId, Long brokerId,
        QuoteType quoteType, String category, boolean isRenewal, boolean isTest) throws Exception{

        validationErrorCollector = null; // no validation collection
        this.createRfpSubmissionIfNotFound = false;
        return runInner(fis, dppoFisList, clientId, brokerId, quoteType, category, isTest, true, true, true);
    }


    /**
     * Utility method for saving validation errors or to splunk(if not validating)
     * @param persist
     * @param userFriendlyMessage
     * @param e1
     */
    private void log(boolean persist, QuoteParserErrorDto userFriendlyMessage, BaseException e1){
        if(!persist && this.validationErrorCollector != null){
            if(!validationErrorCollector.contains(userFriendlyMessage)) { // check for duplicates
                LOGGER.error(e1.getMessage());
                validationErrorCollector.add(userFriendlyMessage);
            }
        }else{
            throw e1;
        }
    }

    private RfpQuote processLifeStdQuote(Long clientId, Long brokerId, QuoteType quoteType){

        Client client = clientRepository.findOne(clientId);
        if(null == client) {
            throw new NotFoundException(format("No client with id=%s, broker_id=%s found", clientId, brokerId));
        }

        RfpCarrier rc = rfpCarrierRepository.findByCarrierNameAndCategory(ANTHEM_BLUE_CROSS.name(), LIFE);
        if(rc == null) {
            throw new NotFoundException("No RFP Carrier found").withFields(
                field("category", LIFE),
                field("carrier", ANTHEM_BLUE_CROSS.name())
            );
        }

        RfpSubmission rs = rfpSubmissionRepository.findByRfpCarrierAndClient(rc, client);
        if(rs == null) {
            rs = new RfpSubmission();
            rs.setClient(client);
            rs.setRfpCarrier(rc);
            rs.setCreated(fromDateToString(new Date(), DATETIME_FORMAT));
            rs.setDisqualificationReason(null);
            rs.setSubmittedBy("AnthemQuoteUploader");
            rs.setSubmittedDate(new Date());
            if(persist) {
                rfpSubmissionRepository.save(rs);
            }
        }

        RfpQuote previousQuote = rfpQuoteRepository.findByRfpSubmissionRfpCarrierRfpCarrierIdAndRfpSubmissionClientClientIdAndLatestAndQuoteType(rc.getRfpCarrierId(), client.getClientId(), true, quoteType);
        if (previousQuote == null) {
            previousQuote = rfpQuoteRepository.findByRfpSubmissionRfpCarrierRfpCarrierIdAndRfpSubmissionClientClientIdAndLatestAndQuoteType(rc.getRfpCarrierId(), client.getClientId(), true, QuoteType.DECLINED);
        }


        RfpQuoteVersion rfpQuoteVersion = new RfpQuoteVersion();
        rfpQuoteVersion.setRfpSubmissionId(rs.getRfpSubmissionId());

        if(persist) {
            rfpQuoteVersionRepository.save(rfpQuoteVersion);
        }

        // create new quote w/ version
        RfpQuote rfpQuote = new RfpQuote();
        rfpQuote.setRatingTiers(0);
        rfpQuote.setLatest(true);
        rfpQuote.setUpdated(new Date());
        rfpQuote.setQuoteType(QuoteType.STANDARD);
        rfpQuote.setRfpSubmission(rs);
        rfpQuote.setRfpQuoteVersion(rfpQuoteVersion);
        if(persist){
            rfpQuote = rfpQuoteRepository.save(rfpQuote);
        }

        if(previousQuote != null){
            previousQuote.setLatest(false);
            if(persist) {
                rfpQuoteRepository.save(previousQuote);
            }
        }

        return rfpQuote;
    }

    public RfpQuote runInner(InputStream fis, List<InputStream> dppoFisList, Long clientId, Long brokerId,
        QuoteType quoteType, String category, boolean isTest, boolean persist, boolean shouldParseQuote, boolean shouldCreateNewQuote) throws Exception{

        this.isTest = isTest;
        this.persist = persist;
        RfpQuote quote = null;

        brokerId = sharedBrokerService.getOriginalBrokerIdIfGeneralAgent(clientId, brokerId);
        if (QuoteType.DECLINED.equals(quoteType)) {
            return sharedRfpQuoteService.processDeclinedQuote(clientId, brokerId, "ANTHEM_BLUE_CROSS", category, persist);
        }

        if (QuoteType.STANDARD.equals(quoteType) && category.equals(LIFE)) {
            return processLifeStdQuote(clientId, brokerId, quoteType);
        }

        // join Dental DHMO and DPPO if available
        if(shouldParseQuote){
            anthemParser = null;
            parseQuoteFilesAndJoinDHMOANDPPO(fis, dppoFisList, category);
        }

        List<Client> clientList = clientRepository.findByClientIdAndBrokerBrokerId(clientId, brokerId);
        if(null == clientList  || clientList.size() == 0) {
            log(persist, new QuoteParserErrorDto(CONTACT_BENREVO_MSG),
                new NotFoundException(format("No client with id=%s, broker_id=%s found", clientId, brokerId))
            );
            return quote; // return if no client
        }

        numberOfNetworksToRfpQuoteNetworkCombination.clear();
        Client client = clientList.get(0);

        switch(category) {
            case Constants.MEDICAL:
                quote = saveParsedQuotesToDB(
                    client,
                    Constants.MEDICAL,
                    anthemParser.getAllMedicalParsedPlanInformation(),
                    quoteType,
                    shouldCreateNewQuote
                );
                break;
            case Constants.VISION:
                quote = saveParsedQuotesToDB(
                    client,
                    Constants.VISION,
                    anthemParser.getAllVisionParsedPlanInformation(),
                    quoteType,
                    shouldCreateNewQuote
                );
                break;
            case Constants.DENTAL:
                quote = saveParsedQuotesToDB(
                    client,
                    Constants.DENTAL,
                    anthemParser.getAllDentalParsedPlanInformation(),
                    quoteType,
                    shouldCreateNewQuote
                );
                break;
            default:
                RfpQuote newMedicalQuote = saveParsedQuotesToDB(
                    client,
                    Constants.MEDICAL,
                    anthemParser.getAllMedicalParsedPlanInformation(),
                    quoteType,
                    shouldCreateNewQuote
                );
                RfpQuote newVisionQuote = saveParsedQuotesToDB(
                    client,
                    Constants.VISION,
                    anthemParser.getAllVisionParsedPlanInformation(),
                    quoteType,
                    shouldCreateNewQuote
                );
                RfpQuote newDentalQuote = saveParsedQuotesToDB(
                    client,
                    Constants.DENTAL,
                    anthemParser.getAllDentalParsedPlanInformation(),
                    quoteType,
                    shouldCreateNewQuote
                );

                return newMedicalQuote;
        }

        return quote;
    }

    private void parseQuoteFilesAndJoinDHMOANDPPO(InputStream fis, List<InputStream> dppoFisList, String category)
        throws Exception {

        hasDPPO = false;
        // run normal parser if available
        if (fis != null) {
            anthemParser = new AnthemParser();
            anthemParser.parseAnthemQuotes(fis, this.validationErrorCollector);

            // run the Dental DPPO file if available
            if (!dppoFisList.isEmpty() && category.equalsIgnoreCase(Constants.DENTAL)) {
                hasDPPO = true;
                IAnthemParser anthemDPPOParser = getJoinedDppoData(dppoFisList, benefitNameRepository.findAll());

                if(anthemParser.getTiers() != anthemDPPOParser.getTiers()) {
                    log(persist, new QuoteParserErrorDto(DHMO_AND_DPPO_RATING_TIERS_DO_NOT_MATCH),
                        new ValidationException("Quote files have different number of tiers. file:" + anthemParser.getTiers() + " file2:" + anthemDPPOParser.getTiers())
                    );
                }

                // merge the dental objects
                LinkedHashMap<String, AnthemNetworkDetails> dhmoNetworks = getDentalNetworksMap(anthemParser.getAllDentalParsedPlanInformation());
                LinkedHashMap<String, AnthemNetworkDetails> dppoNetworks = getDentalNetworksMap(anthemDPPOParser.getAllDentalParsedPlanInformation());

                LinkedHashMap<String, AnthemNetworkDetails> joinedNetworks = new LinkedHashMap<>();
                if(dhmoNetworks == null){
                    log(persist, new QuoteParserErrorDto(DHMO_NETWORK_MISSING_FROM_QUOTE_FILE),
                        new ValidationException("DHMO quote file was uploaded but quote file does not contain any DHMO Networks or Plans")
                    );
                }else{
                    joinedNetworks.putAll(dhmoNetworks);
                }

                if(dppoNetworks == null){
                    log(persist, new QuoteParserErrorDto(DPPO_NETWORK_MISSING_FROM_QUOTE_FILE),
                        new ValidationException("DPPO quote file was uploaded but quote file does not contain any DPPO Networks or Plans")
                    );
                }else{
                    joinedNetworks.putAll(dppoNetworks);
                }

                if(isNull(dhmoNetworks) && !isNull(dppoNetworks)){
                    anthemParser.setAllDentalParsedPlanInformation(anthemDPPOParser.getAllDentalParsedPlanInformation());
                }else{
                    for (String rateDescription : anthemParser.getAllDentalParsedPlanInformation().keySet()) {
                        RateDescriptionDTO rd = anthemParser.getAllDentalParsedPlanInformation().get(rateDescription);
                        rd.setAnthemNetworks(joinedNetworks);
                        break;
                    }
                }
            }
        } else if(fis == null && !dppoFisList.isEmpty() && category.equalsIgnoreCase(Constants.DENTAL)){
            // load only DPPO
            hasDPPO = true;
            anthemParser = getJoinedDppoData(dppoFisList, benefitNameRepository.findAll());
        } else if(fis == null && dppoFisList.isEmpty() && !category.equalsIgnoreCase(Constants.DENTAL)){
            // fis is null so no Medical, Vision or Dental(DHMO)
            log(persist, new QuoteParserErrorDto(CONTACT_BENREVO_MSG),
                new ValidationException("No Medical, Vision or Dental(DHMO) quote file found. Please upload quote file")
            );
        }
    }

    private IAnthemParser getJoinedDppoData(List<InputStream> dppoFisList, List<BenefitName> benefitNames) throws Exception {
        IAnthemParser parser = null; 
        ArrayList<AnthemPlanDetails> previousPlanDetails = new ArrayList<>();
        int previousTiers = 0;
        for (InputStream dppoFis : dppoFisList) {
        
            parser = new AnthemDPPOParser();
            parser.setBenefitNames(benefitNames);
            parser.parseAnthemQuotes(dppoFis, this.validationErrorCollector);

            if(previousTiers == 0){ // set previous tiers once only
                previousTiers = parser.getTiers();
            }

            if(previousTiers > 0 && previousTiers != parser.getTiers()) {
                log(persist, new QuoteParserErrorDto(DPPO_FILES_HAVE_DIFFERENT_TIERS),
                    new ValidationException("DPPO Quote files have different number of tiers.")
                );
            }

            // add previous plans to parser
            for (Entry<String, RateDescriptionDTO> rateDescriptionEntry : parser.getAllDentalParsedPlanInformation().entrySet()) {
                LinkedHashMap<String, AnthemNetworkDetails> networks = rateDescriptionEntry.getValue().getAnthemNetworks();
                for (Entry<String, AnthemNetworkDetails> networkEntry : networks.entrySet()) {
                    AnthemNetworkDetails network = networkEntry.getValue();
                    network.getPlanDetails().addAll(previousPlanDetails);
                    previousPlanDetails = network.getPlanDetails();
                    break;
                }
                break;
            }

        }
        return parser;
    }

    @Override
    public QuoteChangesDto findChanges(InputStream fis, List<InputStream> dppoFisList, Long clientId,
        Long brokerId, QuoteType quoteType, String category, boolean isRenewal, boolean isTest) throws Exception {
        RfpCarrier rfpCarrier  = rfpCarrierRepository.findByCarrierNameAndCategory("ANTHEM_BLUE_CROSS", category);
        if(rfpCarrier == null){
            log(persist, new QuoteParserErrorDto(CONTACT_BENREVO_MSG),
                new NotFoundException("No RFP Carrier found for category="+ category +", carrier=ANTHEM_BLUE_CROSS")
            );
        }
        RfpQuote previousQuote = rfpQuoteRepository.findByRfpSubmissionRfpCarrierRfpCarrierIdAndRfpSubmissionClientClientIdAndLatestAndQuoteType(rfpCarrier.getRfpCarrierId(), clientId, true, quoteType);
        RfpQuote newQuote = runInner(fis, dppoFisList, clientId, brokerId, quoteType, category, isTest, false, true, true);
        return quoteHelper.findChanges(previousQuote, newQuote);
    }

    private RfpQuote saveParsedQuotesToDB(Client client, String category,
                                      LinkedHashMap<String, RateDescriptionDTO> data, QuoteType quoteType, boolean shouldCreateNewQuote) throws Exception{

        LOGGER.info("Starting: "+ category +" Quote Upload");
        RfpCarrier rfpCarrier  = rfpCarrierRepository.findByCarrierNameAndCategory("ANTHEM_BLUE_CROSS", category);
        if(rfpCarrier == null){
            log(persist, new QuoteParserErrorDto(CONTACT_BENREVO_MSG),
                new NotFoundException(
                    format("No RFP Carrier found for category=%s, carrier=ANTHEM_BLUE_CROSS", category
                    )
                )
            );
            return null;
        }
        RfpQuote previousQuote = rfpQuoteRepository.findByRfpSubmissionRfpCarrierRfpCarrierIdAndRfpSubmissionClientClientIdAndLatestAndQuoteType(rfpCarrier.getRfpCarrierId(), client.getClientId(), true, quoteType);
        if (previousQuote == null) {
            previousQuote = rfpQuoteRepository.findByRfpSubmissionRfpCarrierRfpCarrierIdAndRfpSubmissionClientClientIdAndLatestAndQuoteType(rfpCarrier.getRfpCarrierId(), client.getClientId(), true, QuoteType.DECLINED);
        }

        RfpSubmission rfpSubmission = rfpSubmissionRepository.findByRfpCarrierAndClient(rfpCarrier, client);
        if(null == rfpSubmission){
            if(!this.createRfpSubmissionIfNotFound) {
                log(persist, new QuoteParserErrorDto(CONTACT_BENREVO_MSG),
                    new NotFoundException(
                        format("No RFP Submission for %s found for client_id=%s", category,
                            client.getClientId()))
                );
                return null;
            }else{
                // create rfp submission
                rfpSubmission = new RfpSubmission();
                rfpSubmission.setClient(client);
                rfpSubmission.setRfpCarrier(rfpCarrier);
                rfpSubmission.setCreated(fromDateToString(new Date(), DATETIME_FORMAT));
                rfpSubmission.setDisqualificationReason(null);
                sharedRfpService.setSubmissionOriginDetails(rfpSubmission);
                rfpSubmissionRepository.save(rfpSubmission);
            }
        }

        // Create RfpQuote iff (shouldCreateNewQuote || previous is empty and shouldCreateNewQuote is false)
        RfpQuote newQuote = null;
        if(shouldCreateNewQuote || (!shouldCreateNewQuote && isNull(previousQuote))) {
            RfpQuoteVersion rfpQuoteVersion = new RfpQuoteVersion();
            rfpQuoteVersion.setRfpSubmissionId(rfpSubmission.getRfpSubmissionId());
            if(persist) {
                rfpQuoteVersionRepository.save(rfpQuoteVersion);
            }

            newQuote = new RfpQuote();
            newQuote.setRatingTiers(anthemParser.getTiers());
            newQuote.setLatest(true);
            newQuote.setUpdated(new Date());
            newQuote.setQuoteType(quoteType);
            newQuote.setRfpSubmission(rfpSubmission);
            newQuote.setRfpQuoteVersion(rfpQuoteVersion);

            // quote disclaimer
            if(hasDPPO) {
                newQuote.setDisclaimer(htmlEscape(ANTHEM_WITH_DPPO_DISCLAIMER));
            }else{
                newQuote.setDisclaimer(htmlEscape(ANTHEM_DISCLAIMER));
            }
        }else{
            newQuote = previousQuote;
        }

        if(persist) {
            rfpQuoteRepository.save(newQuote);
        }

        saveAnthemPlans(category, data, rfpCarrier, newQuote, shouldCreateNewQuote);

        if(QuoteType.KAISER.equals(quoteType) || QuoteType.KAISER_EASY.equals(quoteType)){
            quoteHelper.addKaiserNetwork(newQuote, client, category, persist);
        }

        if (previousQuote != null && shouldCreateNewQuote) {
            quoteHelper.updateQuote(previousQuote, newQuote, this.validationErrorCollector, persist);
        }

        LOGGER.info(format("Finished: %s Quote Upload", category));
        return newQuote;
    }

    private String[] getNetworksInsideParenthesis(String rateDescription) {
    	int startIndex = rateDescription.indexOf("(");
    	int endIndex = rateDescription.indexOf(")");
    	if(startIndex == -1 || endIndex == -1) {
    		return ArrayUtils.EMPTY_STRING_ARRAY;
    	}
    	String networksInsideParenthesis = rateDescription.substring(startIndex + 1, endIndex);
    	String[] split;
    	if(networksInsideParenthesis.contains(",")) {
    		split = networksInsideParenthesis.split(",");
    	} else {
    		split = networksInsideParenthesis.split("/");
    	}
        for (int i = 0; i < split.length; i++) {
        	 split[i] = split[i].trim();
		}
        return split;
    }
    /**
     * Makes sure the quote option name is unique without any loss of information from the rate description
     * @param category
     * @param rateDescription
     * @param network
     * @return
     */
    private String getQuoteOptionName(String category, String rateDescription, Network network){
        String quoteOptionName = rateDescription;
        if(category.equalsIgnoreCase(Constants.MEDICAL)) {
            String[] commaSeparatedRateDescription = rateDescription.split(",");
            String[] slashSeparatedRateDescription = rateDescription.split("/");
            if(containsIgnoreCase(rateDescription, "single") && !containsIgnoreCase(rateDescription, "HIGH-LOW")) {
                quoteOptionName =  "Single_" + network.getName();
            } else if(containsIgnoreCase(rateDescription, "dual")) {
                String[] split = getNetworksInsideParenthesis(rateDescription);
                if(split.length == 2) {
                    String network1 = split[0].trim();
                    String network2 = split[1].trim();

                    // add network keyword at the end if not there
                    network1 = !containsIgnoreCase(network1,"network") ? network1 + " Network" : network1;
                    network2 = !containsIgnoreCase(network2,"network") ? network2 + " Network" : network2;

                    // run the network1 and network2 through the Anthem network name determiner in the parser
                    network1 = anthemParser.deriveNetworkName(category, "", network1);
                    network2 = anthemParser.deriveNetworkName(category, "", network2);

                    if(network1.equalsIgnoreCase(network.getName())) {
                        quoteOptionName = "Dual_" + network.getName() + "_" + network2;
                    } else if(network2.equalsIgnoreCase(network.getName())) {
                        quoteOptionName = "Dual_" + network.getName() + "_" + network1;
                    }
                }
            } else if(commaSeparatedRateDescription.length > 1) {
                return getCommaSeparatedOrSlashSeparatedOptionName(category, network, commaSeparatedRateDescription);
            } else if(slashSeparatedRateDescription.length > 1) {
                return getCommaSeparatedOrSlashSeparatedOptionName(category, network, slashSeparatedRateDescription);
            }
        }else if(category.equalsIgnoreCase(Constants.DENTAL)){
            quoteOptionName = anthemParser.deriveNetworkName(category, "", network.getName());
        }else if(category.equalsIgnoreCase(Constants.VISION)){
            quoteOptionName = anthemParser.deriveNetworkName(category, "", network.getName());
        }
        return quoteOptionName;
    }

    private String getCommaSeparatedOrSlashSeparatedOptionName(String category, Network network, String[] commaSeparatedRateDescription) {
        ArrayList<String> networks = new ArrayList<>();
        for(String str : commaSeparatedRateDescription) {
            str = anthemParser.deriveNetworkName(category, "", str);
            if(!str.equalsIgnoreCase(network.getName())) {
                networks.add(str);
            }
        }
        return network.getName() + "_" + String.join("_", networks);
    }

    private boolean isAlaCarte(String rateDescription, Network network){
        if(containsIgnoreCase(rateDescription, "single")){
            return false;
        }else if(containsIgnoreCase(rateDescription, "dual")){
            return false;
        }else if(containsIgnoreCase(rateDescription, "HIGH-LOW PPO")){
            return false;
        } else if(containsIgnoreCase(rateDescription, "HIGH-LOW SINGLE HMO NETWORK")){
            return false;
        }
        return (containsIgnoreCase(rateDescription, "PPO") || containsIgnoreCase(rateDescription, "HSA")
            || network.getType().contains("PPO") || network.getType().contains("HSA")) ? true : false;
    }

    private RfpQuoteNetworkCombination getRfpQuoteNetworkCombination(Carrier carrier, String rateDescription, RateDescriptionDTO rd, boolean isAlaCarte){

        RfpQuoteNetworkCombination combination = null;
        
        boolean isHighLowPpo = containsIgnoreCase(rateDescription, "HIGH-LOW PPO");
        boolean isHighLowHmo = containsIgnoreCase(rateDescription, "HIGH-LOW SINGLE HMO NETWORK");
        // use the hash map to store the unique combinations created based on network. Store it and return if already created
        if(!isAlaCarte && (isHighLowHmo || isHighLowPpo || rd.getAnthemNetworks().size() > 0)){
            StringJoiner joiner = null;
            String[] networks = null;
            int networkCount = 0;
            boolean isSingle = containsIgnoreCase(rateDescription, "single") && !containsIgnoreCase(rateDescription, "HIGH-LOW");
            if(isHighLowHmo) {
            	// special Anthem combination of dual High/Low networks
                String[] hiLowHmoNetwork = getNetworksInsideParenthesis(rateDescription);
            	networks = new String[] {hiLowHmoNetwork[0], hiLowHmoNetwork[0]};
            	networkCount = 2;
            	joiner = new StringJoiner(" / ", "HIGH-LOW HMO (", ")");
            } else if(isSingle || containsIgnoreCase(rateDescription, "dual")){
            	networks = getNetworksInsideParenthesis(rateDescription);
            	if(networks.length > 0) {
            		if(isSingle) {
            			networkCount = 1;
            			joiner = new StringJoiner(", ", "Single (", ")");
            		} else {
            			networkCount = 2;
            			joiner = new StringJoiner(" / ", "Dual (", ")");
            		}
            	}
            } else if(isHighLowPpo) {
            	// special Anthem combination of dual Premier networks or dual Non-Premier networks
                String[] hiLowPpoNetwork = getNetworksInsideParenthesis(rateDescription);
            	networks = new String[] {hiLowPpoNetwork[0], hiLowPpoNetwork[0]};
            	networkCount = 2;
            	joiner = new StringJoiner(" / ", "HIGH-LOW PPO (", ")");
            } else {
            	networks = rateDescription.split(",");	
            	if(networks.length > 1) {
            		networkCount = networks.length;
            		joiner = new StringJoiner("_", "", "");
            	} else {
            		return null; // incorrect combination, just single network
            	}
            }
            Arrays.sort(networks);
            for (String s: networks) {
	            joiner.add(s.trim());
	        }
            String combinationName = joiner.toString();
            if(numberOfNetworksToRfpQuoteNetworkCombination.containsKey(combinationName)){
                combination = numberOfNetworksToRfpQuoteNetworkCombination.get(combinationName);
            }else{
            	combination = rfpQuoteNetworkCombinationRepository.findByName(combinationName);
            	if(combination == null) {
            		combination = new RfpQuoteNetworkCombination(carrier, combinationName, networkCount);
            		if(persist) {
                        combination = rfpQuoteNetworkCombinationRepository.save(combination);
                    }
	                numberOfNetworksToRfpQuoteNetworkCombination.put(combinationName, combination);
            	}
            }
        }

        return combination;
    }

    private void saveAnthemPlans(String category, LinkedHashMap<String, RateDescriptionDTO> data, RfpCarrier rfpCarrier, RfpQuote rfpQuote, boolean shouldCreateNewQuote) {
        int planYear = rfpQuote.getRfpSubmission().getClient().getEffectiveYear();
        Long clientId = rfpQuote.getRfpSubmission().getClient().getClientId();
        for(String rateDescription : data.keySet()) {
            RateDescriptionDTO rd = data.get(rateDescription);
            for(AnthemNetworkDetails networkDetails : rd.getAnthemNetworks().values()) {
                String networkName = networkDetails.getNetworkName();
                String networkType = networkDetails.getNetworkType();

                Network network = networkRepository.findByNameAndTypeAndCarrier(networkName, networkType, rfpCarrier.getCarrier());
                if(network == null || network.getNetworkId() == null){
                    log(persist,
                        new QuoteParserErrorDto(
                            format(NETWORK_NOT_FOUND, category),
                            format(NETWORK_NOT_FOUND_SUB_MESSAGE, networkName, networkType)
                        ),
                        new NotFoundException(format("No network found in DB for networkName=%s with networkType=%s", networkName, networkType))
                    );
                }

                RfpQuoteNetwork quoteNetwork = getOrCreateRfpQuoteNetwork(rfpQuote, rfpCarrier, rd, rateDescription, network, category);
                for (AnthemPlanDetails planInfo  : networkDetails.getPlanDetails()) {

                    // Ensure plans exist if not, create a new one
                    String planName = getStandardAnthemPlanName(planInfo.getPlanName());
                    PlanNameByNetwork pnn = null;
                    List<PlanNameByNetwork> pnnList = findPnns(network, planName, planYear, clientId);
                    if(null == pnnList || pnnList.size() == 0) {
                        if (planInfo.getGenericPlanDetails() != null) {
                            // create a plan on the fly. Currently only used for DPPO
                            planInfo.getGenericPlanDetails().addIfValidPlanNameByNetwork(network, planName);
                            
                            pnnList = planUtil.createPlans(clientId, true,
                                rfpCarrier.getCarrier(), network.getType(), planInfo.getGenericPlanDetails(), planYear, persist);
                            pnn = pnnList.get(0);
                        } else {
                            if (isTest) {
                                missingPlans++;

                                if(!plans.containsKey(networkType + "," + networkName + "," + planName)){
                                    plans.put(networkType + "," + networkName + "," + planName, 1);
                                }else{
                                    plans.put(networkType + "," + networkName + "," + planName, plans.get(networkType + "," + networkName + "," + planName)+1);
                                }
                                missingPlansList.add(networkType + "/" + networkName + "/" + planName);
                                continue;
                            }

                            log(persist,
                                new QuoteParserErrorDto(
                                    format(PLAN_NOT_FOUND, category),
                                    format(PLAN_NOT_FOUND_SUB_MESSAGE, planName, planInfo.getPlanNameLocation())
                                ),
                                new NotFoundException(
                                    format("No PlanNameByNetwork found in DB for network=%s, planName=%s, networkType=%s, and planYear(client's effective date)=%s",
                                        networkName, planName, networkType, planYear)
                                )
                            );
                        }
                    } else {
                        foundPlans++;
                        pnn = pnnList.get(0);
                        if (planInfo.getGenericPlanDetails() != null) {
                            // currently only used for DPPO
                            planUtil.updatePlan(pnn.getPlan(), planInfo.getGenericPlanDetails(), null, persist);
                        }
                    }

                    RfpQuoteNetworkPlan quoteNetworkPlan = new RfpQuoteNetworkPlan(quoteNetwork, pnn,
                            Float.parseFloat(planInfo.getTier1Rate()), Float.parseFloat(planInfo.getTier2Rate()),
                            Float.parseFloat(planInfo.getTier3Rate()), Float.parseFloat(planInfo.getTier4Rate()));
                    quoteNetworkPlan.setVoluntary(planInfo.isVoluntary());

                    // validate plan tier rates
                    quoteHelper.validatePlanTierRates(quoteNetwork.getRfpQuote(), quoteNetworkPlan, this.validationErrorCollector, persist);

                    if(persist) {
                    	quoteNetworkPlan = rfpQuoteNetworkPlanRepository.save(quoteNetworkPlan);
                    }
                    
                    // save attributes
                    for (QuotePlanAttribute attr: planInfo.getAttributes()) {
                        attr.setPlan(quoteNetworkPlan);
                        if(persist) {
                            attributeRepository.save(attr);
                        }		
                    }
                    
                    quoteNetwork.getRfpQuoteNetworkPlans().add(quoteNetworkPlan);
                }
            }
        }
    }

    /**
     * Finds the pnn for DPPO using clientId and customPlan = true
     * @return
     */
    private List<PlanNameByNetwork> findPnns(Network network, String planName, int planYear, Long clientId){

        if(network.getType().equals("DPPO")) {
            return planNameByNetworkRepository.
                findByNetworkAndNameAndPlanTypeAndPlanPlanYearAndClientIdAndCustomPlan(network,
                    planName, network.getType(), planYear, clientId, true);
        }

        return planNameByNetworkRepository.
            findByNetworkAndNameAndPlanTypeAndPlanPlanYearAndClientIdAndCustomPlan(network,
                planName, network.getType(), planYear, null, false);
    }

    private RfpQuoteNetwork getOrCreateRfpQuoteNetwork(RfpQuote rfpQuote, RfpCarrier rfpCarrier, RateDescriptionDTO rd, String rateDescription, Network network, String category){

        String quoteOptionName = getQuoteOptionName(category, rateDescription, network);
        RfpQuoteNetwork quoteNetwork = null;
        if (persist) {
            quoteNetwork = rfpQuoteNetworkRepository
                .findByRfpQuoteAndRfpQuoteOptionName(rfpQuote, quoteOptionName);
        }

        if(isNull(quoteNetwork)) {
            boolean isAlaCarte = isAlaCarte(rateDescription, network);
            quoteNetwork = new RfpQuoteNetwork(rfpQuote, network, quoteOptionName);
            quoteNetwork.setaLaCarte(isAlaCarte);

            RfpQuoteNetworkCombination combination = getRfpQuoteNetworkCombination(
                rfpCarrier.getCarrier(), rateDescription, rd, isAlaCarte);
            if (combination != null) {
                quoteNetwork.setRfpQuoteNetworkCombination(combination);
            }

            saveChiroRiders(rd, quoteNetwork, category);

            if (persist) {
                rfpQuoteNetworkRepository.save(quoteNetwork);
            }
            rfpQuote.getRfpQuoteNetworks().add(quoteNetwork);
        }

        return quoteNetwork;
    }

    private void saveChiroRiders(RateDescriptionDTO rd, RfpQuoteNetwork quoteNetwork, String category) {
        if(category.equals(Constants.MEDICAL)){
            for(ChiroRider chiroRider : rd.getChiroRiders()){
                List<RiderMeta> riderMeta = quoteHelper.findRiderMeta(
                    new String[]{generateRiderName(chiroRider.getName())},
                    quoteNetwork.getNetwork().getType(),
                    chiroRider.getLocation(),
                    validationErrorCollector,
                    persist
                );
                Set<Rider> riders = new HashSet<>(riderMeta.size());
                riderMeta.forEach(meta -> {
                    Rider rider = new Rider();
                    rider.setRiderMeta(meta);
                    rider.setTier1Rate(Float.parseFloat(chiroRider.getTier1Rate()));
                    rider.setTier2Rate(Float.parseFloat(chiroRider.getTier2Rate()));
                    rider.setTier3Rate(Float.parseFloat(chiroRider.getTier3Rate()));
                    rider.setTier4Rate(Float.parseFloat(chiroRider.getTier4Rate()));
                    riders.add(rider);
                });

                if(persist) {
                    quoteNetwork.getRiders().addAll(new HashSet<>(riderRepository.save(riders)));
                }else{
                    quoteNetwork.getRiders().addAll(riders);
                }
            }
        }
    }

    private String generateRiderName(String name){
        String[] nameSplit = name.split(",");
        String[] result = new String[nameSplit.length-1];

        if(nameSplit.length > 0){
            for(int i = 0; i < nameSplit.length-1; i++){
                result[i] = nameSplit[i];
            }
        }

        return StringUtils.join(result, ",");
    }

    public String getCONTACT_BENREVO_MSG() {
        return CONTACT_BENREVO_MSG;
    }

    public String getDHMO_AND_DPPO_RATING_TIERS_DO_NOT_MATCH() {
        return DHMO_AND_DPPO_RATING_TIERS_DO_NOT_MATCH;
    }

    public String getDHMO_NETWORK_MISSING_FROM_QUOTE_FILE() {
        return DHMO_NETWORK_MISSING_FROM_QUOTE_FILE;
    }

    public String getDPPO_NETWORK_MISSING_FROM_QUOTE_FILE() {
        return DPPO_NETWORK_MISSING_FROM_QUOTE_FILE;
    }

    public String getDPPO_FILES_HAVE_DIFFERENT_TIERS() {
        return DPPO_FILES_HAVE_DIFFERENT_TIERS;
    }

    public String getNETWORK_NOT_FOUND() {
        return NETWORK_NOT_FOUND;
    }

    public String getPLAN_NOT_FOUND() {
        return PLAN_NOT_FOUND;
    }

    public String getMORE_THAN_ONE_STANDARD_FILE_ERROR_MESSAGE() {
        return MORE_THAN_ONE_STANDARD_FILE_ERROR_MESSAGE;
    }
}
