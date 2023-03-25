package com.benrevo.be.modules.admin.util.helper;

import com.benrevo.be.modules.shared.service.S3FileManager;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.PlanChangesDto;
import com.benrevo.common.dto.QuoteChangesDto;
import com.benrevo.common.dto.QuoteParserErrorDto;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.common.logging.CustomLogger;
import com.benrevo.data.persistence.entities.*;
import com.benrevo.data.persistence.repository.*;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.*;
import org.springframework.web.multipart.MultipartFile;

import static com.benrevo.common.enums.CarrierType.ANTHEM_BLUE_CROSS;
import static com.benrevo.common.util.MapBuilder.field;
import static java.lang.String.format;
import static java.util.Arrays.asList;
import static java.util.Objects.isNull;
import static org.apache.commons.lang3.tuple.Pair.of;

/**
 * Created by lemdy on 6/1/17.
 */
@Component
public class QuoteHelper {

    @Autowired
    private RfpQuoteRepository rfpQuoteRepository;

    @Autowired
    private RfpQuoteOptionRepository rfpQuoteOptionRepository;

    @Autowired
    private RfpQuoteOptionNetworkRepository rfpQuoteOptionNetworkRepository;

    @Autowired
    private RiderMetaRepository riderMetaRepository;

    @Autowired
    private RfpCarrierRepository rfpCarrierRepository;

    @Autowired
    private NetworkRepository networkRepository;

    @Autowired
    private RfpQuoteNetworkRepository rfpQuoteNetworkRepository;

    @Autowired
    private ClientPlanRepository clientPlanRepository;

    @Autowired
    private RfpQuoteNetworkPlanRepository rfpQuoteNetworkPlanRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private RfpSubmissionRepository rfpSubmissionRepository;
    
    @Autowired
    private RfpQuoteVersionRepository  rfpQuoteVersionRepository;

    @Autowired
    private S3FileManager s3FileManager;

    @Autowired
    private CustomLogger LOGGER;

    private final String INVALID_RIDER = "The Medical quote includes an invalid rider. Please check cell %s";
    private final String INVALID_RIDER_SUB_MESSAGE = "Invalid Rider Name: %s";
    private final String MISMATCHED_TIERS = "The %s quote does not match the client's current rating tiers.";
    private final String MISSING_RATES = "The %s quote appears to be missing rates. Check for missing and zero values.";
    private final String OLD_NETWORK_NOT_FOUND_IN_NEW_QUOTE_NETWORKS = "The new %s quote does not contain an existing network.";
    private final String OLD_NETWORK_NOT_FOUND_IN_NEW_QUOTE_NETWORKS_SUB_MESSAGE = "Network Name: %s";
    private final String OLD_SELECTED_PLAN_NOT_FOUND_IN_NEW_QUOTE_PLANS = "The new %s quote does not contain an existing selected plan by broker.";
    private final String OLD_SELECTED_PLAN_NOT_FOUND_IN_NEW_QUOTE_PLANS_SUB_MESSAGE = "Plan Name: %s, Network name: %s.";
    private final String OLD_SELECTED_RX_PLAN_NOT_FOUND_IN_NEW_QUOTE_PLANS = "The new %s quote does not contain an existing plan.";
    private final String OLD_SELECTED_RX_PLAN_NOT_FOUND_IN_NEW_QUOTE_PLANS_SUB_MESSAGE = "Plan Name: %s, Network name: %s.";

    public List<RiderMeta> findRiderMeta(String[] riderCodes, String networkType,
        String riderLocation, Set<QuoteParserErrorDto> errors, boolean persist) {

        List<RiderMeta> codes = new ArrayList<RiderMeta>();
        for(String code : riderCodes) {
            if(code.equalsIgnoreCase("N/A")){
                continue;
            }
            RiderMeta riderMeta = findRiderMeta(code, networkType, riderLocation, errors, persist);
            if (riderMeta != null) {
                codes.add(riderMeta);
            }
        }
        return codes;
    }

    public RiderMeta findRiderMeta(String code, String networkType,
            String riderLocation, Set<QuoteParserErrorDto> errors, boolean persist) {

        if (networkType.equals("HSA")) {
            networkType = "PPO";
        }
        List<RiderMeta> riders = riderMetaRepository.findByCodeAndPlanType(code, networkType);
        if(riders.size() != 1) {
            log(persist, errors,
                new QuoteParserErrorDto(
                    format(INVALID_RIDER, riderLocation),
                    format(INVALID_RIDER_SUB_MESSAGE, code)
                ),
                format("No unique rider found for code=%s, networkType=%s", code, networkType),
                null
            );
            return null;
        }
        return riders.get(0);
    }

    public void updateQuote(RfpQuote previousQuote, RfpQuote newQuote, Set<QuoteParserErrorDto> errors,  boolean persist) {
        if(persist) {
            previousQuote.setLatest(false);
            rfpQuoteRepository.save(previousQuote);
        }
        updateQuoteHelper(previousQuote, newQuote, errors, persist);
    }

    public void updateQuoteHelper(RfpQuote previousQuote, RfpQuote newQuote, Set<QuoteParserErrorDto> errors,  boolean persist){
        for (RfpQuoteOption option : previousQuote.getRfpQuoteOptions()) {
            if(persist){
                option.setRfpQuoteVersion(newQuote.getRfpQuoteVersion());
                option.setRfpQuote(newQuote);
                option = rfpQuoteOptionRepository.save(option);
            }

            for (RfpQuoteOptionNetwork rfpQuoteOptionNetwork : option.getRfpQuoteOptionNetworks()) {
                if(persist) {
                    rfpQuoteOptionNetwork.setRfpQuoteVersion(newQuote.getRfpQuoteVersion());
                }

                RfpQuoteNetwork rfpQuoteNetwork = findRfpQuoteNetworkByNetworkId(newQuote,
                    rfpQuoteOptionNetwork.getRfpQuoteNetwork().getNetwork().getNetworkId(),
                    rfpQuoteOptionNetwork.getRfpQuoteNetwork().getRfpQuoteOptionName());

                if(rfpQuoteNetwork == null){
                    log(persist, errors,
                        new QuoteParserErrorDto(
                            format(OLD_NETWORK_NOT_FOUND_IN_NEW_QUOTE_NETWORKS, newQuote.getRfpSubmission().getRfpCarrier().getCategory()),
                            format(OLD_NETWORK_NOT_FOUND_IN_NEW_QUOTE_NETWORKS_SUB_MESSAGE,
                                rfpQuoteOptionNetwork.getRfpQuoteNetwork().getNetwork().getName())
                        ),
                        format("Quote Network with name=%s, and id=%s not found in new quote",
                            rfpQuoteOptionNetwork.getRfpQuoteNetwork().getRfpQuoteOptionName(),
                            rfpQuoteOptionNetwork.getRfpQuoteNetwork().getRfpQuoteNetworkId()
                        ), null
                    );
                }

                if(persist) rfpQuoteOptionNetwork.setRfpQuoteNetwork(rfpQuoteNetwork);

                //TODO: new loaded quote could have plan missing if accidentally removed by carrier. This will be a NPE. Need proper rollback

                RfpQuoteNetworkPlan medPlan = rfpQuoteOptionNetwork.getSelectedRfpQuoteNetworkPlan();
                if(medPlan != null){
                    RfpQuoteNetworkPlan newSelectedPlan = findRfpQuoteNetworkPlanByName(rfpQuoteNetwork, medPlan.getPnn().getName());

                    if(newSelectedPlan == null){
                        log(persist, errors,
                            new QuoteParserErrorDto(
                                format(OLD_SELECTED_PLAN_NOT_FOUND_IN_NEW_QUOTE_PLANS, newQuote.getRfpSubmission().getRfpCarrier().getCategory()),
                                format(OLD_SELECTED_PLAN_NOT_FOUND_IN_NEW_QUOTE_PLANS_SUB_MESSAGE,
                                    medPlan.getPnn().getName(), rfpQuoteOptionNetwork.getRfpQuoteNetwork().getNetwork().getName())
                            ),
                            format("Quote Network Plan with name=%s, and id=%s not found in new quote",
                                medPlan.getPnn().getName(),
                                medPlan.getRfpQuoteNetworkPlanId()
                            ), null
                        );
                    }

                    if(persist) rfpQuoteOptionNetwork.setSelectedRfpQuoteNetworkPlan(newSelectedPlan);
                }
                //non-medical plans don't have Rx
                RfpQuoteNetworkPlan rxPlan = rfpQuoteOptionNetwork.getSelectedRfpQuoteNetworkRxPlan();
                if(null != rxPlan) {

                    RfpQuoteNetworkPlan newSelectedRxPlan = findRfpQuoteNetworkPlanByName(rfpQuoteNetwork, rxPlan.getPnn().getName());
                    if(newSelectedRxPlan == null){
                        log(persist, errors,
                            new QuoteParserErrorDto(
                                format(OLD_SELECTED_RX_PLAN_NOT_FOUND_IN_NEW_QUOTE_PLANS, newQuote.getRfpSubmission().getRfpCarrier().getCategory()),
                                format(OLD_SELECTED_RX_PLAN_NOT_FOUND_IN_NEW_QUOTE_PLANS_SUB_MESSAGE,
                                    medPlan.getPnn().getName(), rfpQuoteOptionNetwork.getRfpQuoteNetwork().getNetwork().getName())
                            ),
                            format("Quote Network Plan(Rx) with name=%s, and id=%s not found in new quote",
                                rxPlan.getPnn().getName(),
                                rxPlan.getRfpQuoteNetworkPlanId()
                            ), null
                        );
                    }

                    if(persist) rfpQuoteOptionNetwork.setSelectedRfpQuoteNetworkRxPlan(newSelectedRxPlan);
                }
                if(persist) {
                    rfpQuoteOptionNetworkRepository.save(rfpQuoteOptionNetwork);
                }
            }
        }
    }

    private RfpQuoteNetwork findRfpQuoteNetworkByNetworkId(RfpQuote newQuote, Long networkId, String rfpQuoteOptionName) {
        Optional<RfpQuoteNetwork> result = newQuote.getRfpQuoteNetworks().stream()
                .filter(rfpQuoteNetwork -> rfpQuoteNetwork.getNetwork() != null
                    && networkId.equals(rfpQuoteNetwork.getNetwork().getNetworkId())
                    && rfpQuoteOptionName.equalsIgnoreCase(rfpQuoteNetwork.getRfpQuoteOptionName())).findFirst();
        return result.orElse(null);
    }

    private RfpQuoteNetworkPlan findRfpQuoteNetworkPlanByName(RfpQuoteNetwork rfpQuoteNetwork, String planName) {
        if(rfpQuoteNetwork == null){
            return null;
        }
        Optional<RfpQuoteNetworkPlan> result = rfpQuoteNetwork.getRfpQuoteNetworkPlans().stream()
                .filter(rfpQuoteNetworkPlan -> rfpQuoteNetworkPlan.getPnn() != null && planName.equals(rfpQuoteNetworkPlan.getPnn().getName())).findFirst();
        return result.orElse(null);
    }

    public void addKaiserNetwork(RfpQuote rfpQuote, Client client, String product, boolean persist){
        RfpCarrier rfpCarrier  = rfpCarrierRepository.findByCarrierNameAndCategory(Constants.KAISER_CARRIER, product);
        Network hmoNetwork = networkRepository.findByNameAndTypeAndCarrier("Kaiser HMO", "HMO", rfpCarrier.getCarrier());
        Network hsaNetwork = networkRepository.findByNameAndTypeAndCarrier("Kaiser HSA", "HSA", rfpCarrier.getCarrier());
        Network ppoNetwork = networkRepository.findByNameAndTypeAndCarrier("Kaiser PPO", "PPO", rfpCarrier.getCarrier());

        //RX networks
        Network rxHmoNetwork = networkRepository.findByNameAndTypeAndCarrier("Full Network", "RX_HMO", rfpCarrier.getCarrier());
        Network rxHsaNetwork = networkRepository.findByNameAndTypeAndCarrier("Full Network", "RX_PPO", rfpCarrier.getCarrier());
        Network rxPpoNetwork = networkRepository.findByNameAndTypeAndCarrier("Full Network", "RX_PPO", rfpCarrier.getCarrier());

        RfpQuoteNetwork hmoQuoteNetwork = null;
        RfpQuoteNetwork hsaQuoteNetwork = null;
        RfpQuoteNetwork ppoQuoteNetwork = null;
        List<ClientPlan> clientPlans = clientPlanRepository.findByClientClientId(client.getClientId());

        for(ClientPlan cp : clientPlans){
            hmoQuoteNetwork = addKaiserPlan(cp.getPnn(), hmoNetwork, rfpQuote, hmoQuoteNetwork, cp, persist);
            hmoQuoteNetwork = addKaiserPlan(cp.getRxPnn(), rxHmoNetwork, rfpQuote, hmoQuoteNetwork, cp, persist);
            hsaQuoteNetwork = addKaiserPlan(cp.getPnn(), hsaNetwork, rfpQuote, hsaQuoteNetwork, cp, persist);
            hsaQuoteNetwork = addKaiserPlan(cp.getRxPnn(), rxHsaNetwork, rfpQuote, hsaQuoteNetwork, cp, persist);
            ppoQuoteNetwork = addKaiserPlan(cp.getPnn(), ppoNetwork, rfpQuote, ppoQuoteNetwork, cp, persist);
            ppoQuoteNetwork = addKaiserPlan(cp.getRxPnn(), rxPpoNetwork, rfpQuote, ppoQuoteNetwork, cp, persist);
        }
    }

    private RfpQuoteNetwork addKaiserPlan(PlanNameByNetwork pnn, Network network, RfpQuote rfpQuote, RfpQuoteNetwork quoteNetwork, ClientPlan cp, boolean persist){
        if(pnn != null && pnn.getNetwork().getNetworkId() == network.getNetworkId()){

            if (quoteNetwork == null) {
                quoteNetwork = new RfpQuoteNetwork(rfpQuote, network, network.getName());
                quoteNetwork.setaLaCarte(true);

                if (persist) {
                    rfpQuoteNetworkRepository.save(quoteNetwork);
                }
        
                rfpQuote.getRfpQuoteNetworks().add(quoteNetwork);
            }
            
            RfpQuoteNetworkPlan quoteNetworkPlan;

            if(pnn.getPlanType().startsWith("RX_")) {
                quoteNetworkPlan = new RfpQuoteNetworkPlan(quoteNetwork, pnn, 1f, 1f, 1f, 1f);
            } else{
                quoteNetworkPlan = new RfpQuoteNetworkPlan(quoteNetwork, pnn, 
                        cp.getTier1Rate(), cp.getTier2Rate(), cp.getTier3Rate(), cp.getTier4Rate());
            }
            quoteNetworkPlan.setMatchPlan(true);

            if (persist) {
                rfpQuoteNetworkPlanRepository.save(quoteNetworkPlan);
            }
            quoteNetwork.getRfpQuoteNetworkPlans().add(quoteNetworkPlan);
        }
        return quoteNetwork;
    }

    public QuoteChangesDto findChanges(RfpQuote currentQuote, RfpQuote newQuote) throws Exception {

        Map<Pair<String, String>, RfpQuoteNetworkPlan> currentPlanMap = getPlanMap(currentQuote);
        Map<Pair<String, String>, RfpQuoteNetworkPlan> newPlanMap = getPlanMap(newQuote);

        Set<Pair<String, String>> commonKeySet = new HashSet<>();
        commonKeySet.addAll(currentPlanMap.keySet());
        commonKeySet.addAll(newPlanMap.keySet());

        QuoteChangesDto quoteChangesDto = new QuoteChangesDto();

        commonKeySet.forEach(key -> {
            if (currentPlanMap.containsKey(key) && newPlanMap.containsKey(key)) {
                RfpQuoteNetworkPlan currentPlan = currentPlanMap.get(key);
                RfpQuoteNetworkPlan newPlan = newPlanMap.get(key);
                if (!Objects.equals(currentPlan.getTier1Rate(), newPlan.getTier1Rate())
                    || !Objects.equals(currentPlan.getTier2Rate(), newPlan.getTier2Rate())
                    || !Objects.equals(currentPlan.getTier3Rate(), newPlan.getTier3Rate())
                    || !Objects.equals(currentPlan.getTier4Rate(), newPlan.getTier4Rate())) {
                    quoteChangesDto.addChangedPlan(new PlanChangesDto(key.getLeft(),
                        key.getRight(),
                        new Float[]{currentPlan.getTier1Rate(), currentPlan.getTier2Rate(), currentPlan.getTier3Rate(), currentPlan.getTier4Rate()},
                        new Float[]{newPlan.getTier1Rate(), newPlan.getTier2Rate(), newPlan.getTier3Rate(), newPlan.getTier4Rate()}));
                }
            } else if (newPlanMap.containsKey(key)) {
                RfpQuoteNetworkPlan newPlan = newPlanMap.get(key);
                quoteChangesDto.addNewPlan(new PlanChangesDto(key.getLeft(),
                    key.getRight(),
                    new Float[]{null, null, null, null},
                    new Float[]{newPlan.getTier1Rate(), newPlan.getTier2Rate(), newPlan.getTier3Rate(), newPlan.getTier4Rate()}));
            } else if (currentPlanMap.containsKey(key)) {
                RfpQuoteNetworkPlan currentPlan = currentPlanMap.get(key);
                quoteChangesDto.addRemovedPlan(new PlanChangesDto(key.getLeft(),
                    key.getRight(),
                    new Float[]{currentPlan.getTier1Rate(), currentPlan.getTier2Rate(), currentPlan.getTier3Rate(), currentPlan.getTier4Rate()},
                    new Float[]{null, null, null, null}));
            }
        });

        return quoteChangesDto;
    }

    private Map<Pair<String, String>, RfpQuoteNetworkPlan> getPlanMap(RfpQuote quote) {
        Map<Pair<String, String>, RfpQuoteNetworkPlan> planMap = new HashMap<>();
        if (quote != null) {
            quote.getRfpQuoteNetworks().forEach(network -> {
                network.getRfpQuoteNetworkPlans().forEach(plan -> {
                    planMap.put(of(network.getNetwork().getName(), plan.getPnn().getName()), plan);
                });
            });
        }
        return planMap;
    }

    public void validatePlanTierRates(RfpQuote rfpQuote, RfpQuoteNetworkPlan plan, Set<QuoteParserErrorDto> errors, boolean persist){
        checkForAccurateTierNumber(rfpQuote, plan, errors, persist);
        checkForMisplacedTierRates(rfpQuote, plan, errors, persist);
    }

    /**
     * Check for case where the parser works but the rates are misplaced due to empty hidden rows
     * E.g. tier1 = 568.99, tier2 = 1194.86, tier3 = 0, tier4 = 1706.97
     * This example should error if the quote has rating tier = 3
     * @param rfpQuote
     * @param plan
     */
    private void checkForMisplacedTierRates(RfpQuote rfpQuote, RfpQuoteNetworkPlan plan, Set<QuoteParserErrorDto> errors, boolean persist){
        if(rfpQuote != null && rfpQuote.isLatest() && !isNull(rfpQuote.getRatingTiers())){
            int tier = rfpQuote.getRatingTiers();
            int numberOfMisplacedTier = 0;

            if(tier >= 1 && isFloatEmptyOrNull(plan.getTier1Rate())){
                numberOfMisplacedTier++;
            }

            if(tier >= 2 && isFloatEmptyOrNull(plan.getTier2Rate())){
                numberOfMisplacedTier++;
            }

            if(tier >= 3 && isFloatEmptyOrNull(plan.getTier3Rate())){
                numberOfMisplacedTier++;
            }

            if(tier >= 4 && isFloatEmptyOrNull(plan.getTier4Rate())){
                numberOfMisplacedTier++;
            }

            if(numberOfMisplacedTier != 0){

                log(persist, errors,
                    new QuoteParserErrorDto(format(MISMATCHED_TIERS, rfpQuote.getRfpSubmission().getRfpCarrier().getCategory())),
                    "One or more of the parsed plans have rates ordered incorrectly in the quote file. Plan Name="
                        + plan.getPnn().getName(),
                    field("planName", plan.getPnn().getName()),
                    field("networkName", plan.getPnn().getNetwork().getName()),
                    field("tier1Rate", plan.getTier1Rate()),
                    field("tier2Rate", plan.getTier2Rate()),
                    field("tier3Rate", plan.getTier3Rate()),
                    field("tier4Rate", plan.getTier4Rate())
                );
            }

        }
    }

    private void checkForAccurateTierNumber(RfpQuote rfpQuote, RfpQuoteNetworkPlan plan, Set<QuoteParserErrorDto> errors, boolean persist){
        if(rfpQuote != null && rfpQuote.isLatest() && !isNull(rfpQuote.getRatingTiers())){
            int tier = rfpQuote.getRatingTiers();
            int numberOfEmptyTiers = countZerosAndNulls(plan.getTier1Rate(),
                plan.getTier2Rate(), plan.getTier3Rate(), plan.getTier4Rate());

            if(tier != numberOfEmptyTiers){
                log(persist, errors,
                    new QuoteParserErrorDto(format(MISSING_RATES, rfpQuote.getRfpSubmission().getRfpCarrier().getCategory())),
                    "One or more of the parsed plans have rates missing from the quote file. Plan Name="
                        + plan.getPnn().getName(),
                    field("planName", plan.getPnn().getName()),
                    field("networkName", plan.getPnn().getNetwork().getName()),
                    field("tier1Rate", plan.getTier1Rate()),
                    field("tier2Rate", plan.getTier2Rate()),
                    field("tier3Rate", plan.getTier3Rate()),
                    field("tier4Rate", plan.getTier4Rate())
                );
            }

        }
    }

    private boolean isFloatEmptyOrNull(Float rate){
        if(isNull(rate) || rate == 0.00F){
            return true;
        }
        return false;
    }

    private int countZerosAndNulls(Float ... rates){
        int result = 0;

        for(Float r : rates){
            if(!isNull(r) && r != 0.00F){
                result++;
            }
        }
        return result;
    }

    private void log(boolean persist, Set<QuoteParserErrorDto> errors, QuoteParserErrorDto userFriendlyMessage,
        String splunkMessage, Pair<String, Object>... fields){

        if(!persist && errors != null){
            LOGGER.error(splunkMessage);
            errors.add(userFriendlyMessage);
        }else{
            throw new BaseException(
                userFriendlyMessage.getMainMessage()
                    + " " + userFriendlyMessage.getSubMessage()).withFields(fields);
        }
    }

    public void saveQuoteFileInS3(MultipartFile file, RfpQuote rfpQuote, CarrierType carrierType, boolean persist) throws Exception{
        if(file != null && !isNull(rfpQuote) && persist){
            String key = s3FileManager.uploadQuote(
                file.getOriginalFilename(),
                file.getInputStream(),
                file.getContentType(),
                file.getSize(),
                carrierType
            );

            rfpQuote.setS3Key(key);
            rfpQuoteRepository.save(rfpQuote);
        }
    }

    public String getINVALID_RIDER() {
        return INVALID_RIDER;
    }

    public String getMISMATCHED_TIERS() {
        return MISMATCHED_TIERS;
    }

    public String getMISSING_RATES() {
        return MISSING_RATES;
    }
}
