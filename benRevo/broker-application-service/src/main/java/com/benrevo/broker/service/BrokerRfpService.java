package com.benrevo.broker.service;

import static com.benrevo.common.util.MapBuilder.field;
import static java.util.Objects.isNull;

import com.benrevo.be.modules.rfp.service.BaseRfpService;
import com.benrevo.be.modules.rfp.service.RfpSubmitter;
import com.benrevo.be.modules.shared.access.CheckAccess;
import com.benrevo.be.modules.shared.service.SharedPlanService;
import com.benrevo.broker.service.email.BrokerRfpEmailService;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.MarketingStatusDto;
import com.benrevo.common.dto.RfpSubmissionDto;
import com.benrevo.common.dto.RfpSubmissionStatusDto;
import com.benrevo.common.exception.BadRequestException;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.ClientException;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientPlan;
import com.benrevo.data.persistence.entities.Network;
import com.benrevo.data.persistence.entities.Option;
import com.benrevo.data.persistence.entities.PlanNameByNetwork;
import com.benrevo.data.persistence.entities.Program;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.entities.ancillary.AncillaryPlan;
import com.benrevo.data.persistence.repository.BrokerProgramAccessRepository;
import com.benrevo.data.persistence.repository.ClientPlanRepository;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.PlanNameByNetworkRepository;
import com.benrevo.data.persistence.repository.PlanRepository;
import com.benrevo.data.persistence.repository.ProgramRepository;
import com.google.common.collect.Sets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class BrokerRfpService extends BaseRfpService {

    @Autowired
    private BrokerRfpEmailService brokerRfpEmailService;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private ClientPlanRepository clientPlanRepository;

    @Autowired
    private SharedPlanService sharedPlanService;

    @Autowired
    private MarketingStatusService marketingStatusService;
    
    @Autowired
    private ProgramRepository programRepository;
    
    @Autowired
    private RfpSubmitter rfpSubmitter;

    @Autowired
    private PresentationService presentationService;
    
    @Autowired
    private PlanNameByNetworkRepository planNameByNetworkRepository;
    
    @Autowired
    private PlanRepository planRepository;
    
    @Autowired
    private CheckAccess checkAccess;
 
    public List<RfpSubmissionStatusDto> submitRFPs(Long clientId, List<RfpSubmissionDto> rfpSubmissionDtos) {
        Client client = clientRepository.findOne(clientId);
        if (client == null) {
            throw new NotFoundException("Client not found").withFields(field("client_id", clientId));
        }
        
        validateRfpCarriersAndPrograms(rfpSubmissionDtos);
        
        /* distinct all the rfpIds
         * carrier 1 rfpIds: 1, 2, 3
         * carrier 2 rfpIds: 3
         * result: 1, 2, 3
         */
        List<Long> rfpIds = rfpSubmissionDtos.stream()
            .flatMap(s -> s.getRfpIds().stream())
            .distinct().collect(Collectors.toList());
        List<RfpSubmissionStatusDto> submissionStatuses = new ArrayList<>();
        
        try {
            updateClientState(client);
            for(RfpSubmissionDto rfpSubmissionDto : rfpSubmissionDtos) {
                if(rfpSubmissionDto.getProgramName() != null) {
                    List<Program> programs = programRepository.findByName(rfpSubmissionDto.getProgramName());
//                    List<Program> programs = checkAccess.findAvailablePrograms(rfpSubmissionDto.getProgramName());
                    for(Program program : programs) {
                        submissionStatuses.add(rfpSubmitter.createRfpSubmission(client, program));
                    }
                } else {
                    submissionStatuses.addAll(rfpSubmitter.createRfpSubmissions(client, 
                        rfpSubmissionDto.getCarrierId(), rfpSubmissionDto.getRfpIds()));
                }
            }
            // each rfpSubmissionDto contains unique carrier + email list + rfp list
            brokerRfpEmailService.sendRFPSubmissions(clientId, rfpSubmissionDtos, rfpIds);
            createClientPlans(client, rfpIds);
            createRfpSubmissionMarketingStatus(client.getClientId(), submissionStatuses); 
            // Salesforce
            publishSalesforceSubmissionEvent(client, rfpIds, submissionStatuses);

        } catch (BaseException e) {
            throw e;
        } catch (Exception e) {
            throw new ClientException("Unable to send/save RFP submission email", e)
                .withFields(field("client_id", clientId), field("rfp_ids", rfpIds));
        }

        return submissionStatuses;
    }
    
    private void validateRfpCarriersAndPrograms(List<RfpSubmissionDto> rfpSubmissionDtos) {
        Set<Long> trustCarriers = new HashSet<>();
        Set<Long> rfpCarriers = new HashSet<>();
       
        for(RfpSubmissionDto subDto : rfpSubmissionDtos) {
            if (CollectionUtils.isEmpty(subDto.getRfpIds())) {
                throw new BadRequestException("List of RFPs should not be empty");
            }
            if(subDto.getCarrierId() != null) {
                rfpCarriers.add(subDto.getCarrierId());
            } else if(subDto.getProgramName() != null) {
                List<Program> programs = programRepository.findByName(subDto.getProgramName());
                // FIXME is filtering required?
//                 List<Program> programs = checkAccess.findAvailablePrograms(subDto.getProgramName());
//                if(programs.isEmpty()) {
//                    throw new BaseException("Program is not available for current brokerage");
//                }
                for(Program program : programs) {
                    trustCarriers.add(program.getRfpCarrier().getRfpCarrierId());
                    /* All lines of coverage are required for the Trust. Therefore if user selects a Trust 
                     * from carrier list and any product is missing from RFP, will need a notice of missing 
                     * information. */
                    RFP requiredProductRfp = null;
                    for(Long rfpId : subDto.getRfpIds()) {
                        RFP rfp = rfpRepository.findOne(rfpId);
                        if(rfp.getProduct().equals(program.getRfpCarrier().getCategory())) {
                            requiredProductRfp = rfp;
                            break;
                        }
                    }
                    if(requiredProductRfp == null) {
                        throw new BaseException("Cannot find required product from RFP for selected Trust program")
                            .withFields(field("program", program.getName()), 
                                field("product", program.getRfpCarrier().getCategory()));
                    }
                }
            } else {
                throw new BaseException("Missing one of required params: carrierId or programName");
            }
        }
        // User can submit RFP to Anthem and not Trust (and visa versa). The two will not be connected.
        // find and check intersection
        if(!Sets.intersection(trustCarriers, rfpCarriers).isEmpty()) {
            throw new BaseException("Unable submit RFP and Trust program to the same carrier");
        } 
    }

    private void createRfpSubmissionMarketingStatus(Long clientId, List<RfpSubmissionStatusDto> submissionStatuses){
        List<MarketingStatusDto> params = new ArrayList<>();
        for(RfpSubmissionStatusDto status : submissionStatuses){
            MarketingStatusDto dto = new MarketingStatusDto();
            dto.setCarrierId(status.getCarrierId());
            dto.setProduct(status.getProduct());
            params.add(dto);
        }
        marketingStatusService.createOrUpdateMarketingStatusList(clientId, params, false);
    }

    @Override
    protected ClientPlan createAncillaryClientPlan(Client client, String product, AncillaryPlan plan) {
    	ClientPlan result = clientPlanRepository.findByClientAndPnnPlanTypeAndAncillaryPlan(client, product, plan);
    	if (isNull(result)) {
    		result = super.createAncillaryClientPlan(client, product, plan);
    		result = clientPlanRepository.save(result);
    	} else {
    		if (result.getPnn().getPlan().getPlanYear() != plan.getPlanYear()) {
    			throw new BaseException("Client plan year and ancillary plan year mismatch");
    		}
    		Network network = result.getPnn().getNetwork();
    		if (!network.getCarrier().getCarrierId().equals(plan.getCarrier().getCarrierId())) {
    			throw new BaseException("Client plan network carrier and ancillary plan carrier mismatch");
    		}
    		result.setAncillaryPlan(plan); // set up updated ancillary plan
    		
    		result.getPnn().getPlan().setName(plan.getPlanName());
    		planRepository.save(result.getPnn().getPlan());
    		
    		result.getPnn().setName(plan.getPlanName());
    		planNameByNetworkRepository.save(result.getPnn());
    	}
    	presentationService.initOrUpdateRenewalOptionPlans(Collections.singletonList(result), client.getClientId(), product);
    	return result;
    }
    
    // Note: Options with OOS contributions creates a second client plan.
    @Override
    public ClientPlan createClientPlan(Client client, Option option, boolean outOfState,
        PlanNameByNetwork pnn,
        PlanNameByNetwork rxPnn, Double censusTier1, Double censusTier2, Double censusTier3,
        Double censusTier4,
        Double rateTier1, Double rateTier2, Double rateTier3, Double rateTier4, Double renewalTier1,
        Double renewalTier2, Double renewalTier3, Double renewalTier4, String contributionType,
        Double contributionTier1, Double contributionTier2, Double contributionTier3,
        Double contributionTier4,
        String planType) {

        ClientPlan existingClientPlan = clientPlanRepository.
            findByClientClientIdAndOptionIdAndOutOfState(client.getClientId(), option.getId(), outOfState);

        ClientPlan newClientPlan = createNewClientPlan(client, option, outOfState, pnn, rxPnn,
            censusTier1, censusTier2, censusTier3,
            censusTier4, rateTier1, rateTier2, rateTier3, rateTier4, renewalTier1, renewalTier2,
            renewalTier3, renewalTier4, contributionType, contributionTier1, contributionTier2,
            contributionTier3, contributionTier4, planType);

        if(isNull(existingClientPlan)){
            newClientPlan = clientPlanRepository.save(newClientPlan);
            presentationService.updateRenewalCardUponRfpSubmission(newClientPlan);
            return newClientPlan;
        }else{
            // use helper method to update rates, census, contribution
            newClientPlan.setClientPlanId(existingClientPlan.getClientPlanId());
            ClientPlan updateClientPlan = sharedPlanService.updateClientPlan(newClientPlan);

            updateClientPlan.setOptionId(option.getId());
            updateClientPlan.setOutOfState(outOfState);

            updateClientPlan.setErContributionFormat("%".equals(contributionType) ? Constants.ER_CONTRIBUTION_FORMAT_PERCENT
                : Constants.ER_CONTRIBUTION_FORMAT_DOLLAR);

            updateClientPlan.setPlanType(planType);
            updateClientPlan.setRxPnn(rxPnn);
            presentationService.updateRenewalCardUponRfpSubmission(updateClientPlan);
            return updateClientPlan;
        }
    }

    private ClientPlan createNewClientPlan(Client client, Option option, boolean outOfState,
        PlanNameByNetwork pnn, PlanNameByNetwork rxPnn, Double censusTier1, Double censusTier2,
        Double censusTier3, Double censusTier4, Double rateTier1, Double rateTier2,
        Double rateTier3, Double rateTier4, Double renewalTier1, Double renewalTier2,
        Double renewalTier3, Double renewalTier4, String contributionType, Double contributionTier1,
        Double contributionTier2, Double contributionTier3, Double contributionTier4,
        String planType) {

        ClientPlan clientPlan = new ClientPlan(client, option, outOfState, pnn,
            longValue(censusTier1), longValue(censusTier2), longValue(censusTier3),
            longValue(censusTier4),
            floatValue(rateTier1), floatValue(rateTier2), floatValue(rateTier3),
            floatValue(rateTier4),
            floatValue(renewalTier1), floatValue(renewalTier2), floatValue(renewalTier3),
            floatValue(renewalTier4),
            "%".equals(contributionType) ? Constants.ER_CONTRIBUTION_FORMAT_PERCENT
                : Constants.ER_CONTRIBUTION_FORMAT_DOLLAR, // if voluntary, we use dollar as default
            floatValue(contributionTier1), floatValue(contributionTier2),
            floatValue(contributionTier3), floatValue(contributionTier4));

        clientPlan.setPlanType(planType);
        clientPlan.setRxPnn(rxPnn);
        return clientPlan;
    }
}
