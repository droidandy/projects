package com.benrevo.be.modules.rfp.service;

import static java.util.stream.Collectors.toList;
import static com.benrevo.common.Constants.LIFE;
import static com.benrevo.common.Constants.STD;
import static com.benrevo.common.Constants.LTD;
import static com.benrevo.common.util.MapBuilder.field;

import com.benrevo.be.modules.shared.service.SharedPlanService;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.CreatePlanDto;
import com.benrevo.common.dto.ancillary.AncillaryPlanDto;
import com.benrevo.common.enums.AncillaryPlanType;
import com.benrevo.common.enums.PlanCategory;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.data.persistence.entities.Benefit;
import com.benrevo.data.persistence.entities.BenefitName;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Network;
import com.benrevo.data.persistence.entities.PlanNameByNetwork;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.entities.RfpToPnn;
import com.benrevo.data.persistence.entities.ancillary.AncillaryPlan;
import com.benrevo.data.persistence.entities.ancillary.RfpToAncillaryPlan;
import com.benrevo.data.persistence.entities.ancillary.VoluntaryRate;
import com.benrevo.data.persistence.helper.PlanBenefitsHelper;
import com.benrevo.data.persistence.mapper.RfpMapper;
import com.benrevo.data.persistence.repository.BenefitNameRepository;
import com.benrevo.data.persistence.repository.BenefitRepository;
import com.benrevo.data.persistence.repository.ClientPlanRepository;
import com.benrevo.data.persistence.repository.NetworkRepository;
import com.benrevo.data.persistence.repository.RfpRepository;
import com.benrevo.data.persistence.repository.RfpToPnnRepository;
import java.time.Year;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

import com.benrevo.data.persistence.repository.ancillary.*;
import com.google.common.base.MoreObjects;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class RfpPlanService extends SharedPlanService{

    @Autowired
    private BenefitRepository benefitRepository;

    @Autowired
    private BenefitNameRepository benefitNameRepository;

    @Autowired
    private RfpToPnnRepository rfpToPnnRepository;

    @Autowired
    protected NetworkRepository networkRepository;

    @Autowired
    private RfpRepository rfpRepository;
    
    @Autowired
    private ClientPlanRepository clientPlanRepository;

    @Autowired
    private PlanBenefitsHelper planBenefitsHelper;

    @Autowired
    private AncillaryPlanRepository ancillaryPlanRepository;

    @Autowired
    private AncillaryClassRepository classRepository;

    @Autowired
    private AncillaryRateRepository ratesRepository;

    @Autowired
    private AncillaryRateAgeRepository rateAgeRepository;

    @Autowired
    private RfpToAncillaryPlanRepository rfpToAncillaryPlanRepository;


    public void createOrUpdateInRfp(List<CreatePlanDto> dtos, Long rfpId) {
        RFP rfp = rfpRepository.findOne(rfpId);
        if (rfp == null) {
            throw new NotFoundException(String.format("RFP with id %s not found", rfpId));
        }

        List<BenefitName> benefitNames = benefitNameRepository.findAll();
    	List<RfpToPnn> oldRfpToPnns = rfpToPnnRepository.findByRfpRfpId(rfpId);
    	List<PlanNameByNetwork> oldPnns = oldRfpToPnns.stream().map(p -> p.getPnn()).collect(toList());
    	// removing rfpToPnns, they will be recreated below 
    	rfpToPnnRepository.delete(oldRfpToPnns);
    	rfpToPnnRepository.flush();
    	
        for (CreatePlanDto dto : dtos) {
            Network network = null;
            if (dto.getRfpQuoteNetworkId() != null) {
                network = networkRepository.findOne(dto.getRfpQuoteNetworkId());
            } else {
                // try to find network carrier specific method
                network = findNetworkUsingCarrierSpecifically(dto.getCarrierId(), dto.getPlanType());
            }
            if (network == null) {
                throw new NotFoundException(String.format("Network with id=%s, carrierId=%s, planType=%s not found", 
                        dto.getRfpQuoteNetworkId(), dto.getCarrierId(), dto.getPlanType()));
            }
            PlanNameByNetwork pnn = findPlanNameByNetwork(oldPnns, network, dto.getNameByNetwork(),
                network.getType(), rfp.getClient().getClientId());
            if (pnn == null) {
            	pnn = createAndSavePlanNameByNetwork(network.getCarrier(),
                    network, dto.getNameByNetwork(), network.getType(),
                    rfp.getClient().getClientId(), false,
                    Collections.emptyList());
            } else {
            	// plans and pnns will be reused (see createOrFindPlanNameByNetwork())
            	deleteBenefits(pnn);
            }
            createAndSaveBenefits(dto, benefitNames, network, pnn);
            saveRfpToPnn(network.getType(), rfp, pnn, dto.getOptionId());

            // add external Rx for other carriers
            addExternalRxPlan(network, rfp, dto.getOptionId(), dto.getNameByNetwork(), benefitNames, oldPnns);
        }
    }

    protected void deleteBenefits(PlanNameByNetwork pnn) {
        List<Benefit> oldBenefits = benefitRepository.findByPlanId(pnn.getPlan().getPlanId());
        // removing only benefits, they will be recreated below (see createAndSaveBenefits())
        benefitRepository.delete(oldBenefits);
        benefitRepository.flush();
    }

    protected void createAndSaveBenefits(CreatePlanDto dto, List<BenefitName> benefitNames, Network network,
            PlanNameByNetwork pnn) {
        planBenefitsHelper.addPlaceHolderBenefitsToPlan(benefitNames, network.getCarrier(), pnn.getPlan());
    }

    protected void addExternalRxPlan(Network network, RFP rfp, Long optionId, String planName,
        List<BenefitName> benefitNames, List<PlanNameByNetwork> oldPnns){
        return;
    }

    protected void saveRfpToPnn(String planType, RFP rfp, PlanNameByNetwork pnn, Long optionId){
        RfpToPnn rfpToPnn = new RfpToPnn();
        rfpToPnn.setPlanType(planType);
        rfpToPnn.setRfp(rfp);
        rfpToPnn.setPnn(pnn);
        rfpToPnn.setOptionId(optionId);
        rfpToPnnRepository.save(rfpToPnn);
    }
    
    protected PlanNameByNetwork findPlanNameByNetwork(List<PlanNameByNetwork> oldPnns,
        Network network, String planName, String planType, Long clientId) {
    	for (PlanNameByNetwork pnn : oldPnns) {
			if (Objects.equals(pnn.getName(), planName) && Objects.equals(pnn.getPlanType(), planType) 
					&& Objects.equals(pnn.getNetwork().getNetworkId(), network.getNetworkId())
                    && clientId.equals(pnn.getClientId())) {
				return pnn;
			}
		}
    	return null;
    }

    public void createOrUpdateAncillaryPlanInRfp(List<AncillaryPlanDto> planDtos, Long rfpId) {
        if(planDtos.isEmpty()) {
        	return;
        }
    	RFP rfp = rfpRepository.findOne(rfpId);
        if (rfp == null) {
            throw new NotFoundException(String.format("RFP with id %s not found", rfpId));
        }
		if (!StringUtils.equalsAny(rfp.getProduct(), LIFE, LTD, STD)) {
			throw new BaseException("Unsupported RFP product: " + rfp.getProduct()).withFields(field("product", rfp.getProduct()));
		} 
        List<AncillaryPlanDto> basicPlans = new ArrayList<>();
        List<AncillaryPlanDto> voluntaryPlans = new ArrayList<>();
        for (AncillaryPlanDto dto : planDtos) {
			if (dto.getPlanType() == AncillaryPlanType.BASIC) {
				basicPlans.add(dto);
			} else {
				voluntaryPlans.add(dto);
			}
		}
        if (!basicPlans.isEmpty()) {
        	List<RfpToAncillaryPlan> rfpToAncPlans = rfpToAncillaryPlanRepository.findByRfp_RfpId(rfpId);
            rfpToAncillaryPlanRepository.delete(rfpToAncPlans);
            rfpToAncillaryPlanRepository.flush();
            exportAncillaryInRfp(basicPlans, rfpId);
		}
        String volProduct = "VOL_" + rfp.getProduct();
    	RFP volRfp = rfpRepository.findByClientClientIdAndProduct(rfp.getClient().getClientId(), volProduct);
    	if (volRfp != null) {
    		List<RfpToAncillaryPlan> rfpToAncPlans = rfpToAncillaryPlanRepository.findByRfp_RfpId(volRfp.getRfpId());
            rfpToAncillaryPlanRepository.delete(rfpToAncPlans);
            rfpToAncillaryPlanRepository.flush();
    	}
    	if (!voluntaryPlans.isEmpty()) {
        	if (volRfp == null) {
        		volRfp = rfp.copy();
        		volRfp.setProduct(volProduct);
        		volRfp = rfpRepository.save(volRfp);
        	}
            exportAncillaryInRfp(voluntaryPlans, volRfp.getRfpId());
		} else if (volRfp != null) {
			deleteByRfpId(volRfp.getClient(), volRfp.getRfpId());
			rfpRepository.delete(volRfp);
		}
    }

    public List<AncillaryPlanDto> findAncillaryPlansByRfpId(Long rfpId) {
    	RFP rfp = rfpRepository.findOne(rfpId);
        if (rfp == null) {
            throw new NotFoundException(String.format("RFP with id %s not found", rfpId));
        }
		if (!StringUtils.equalsAny(rfp.getProduct(), LIFE, LTD, STD)) {
			throw new BaseException("Unsupported RFP product: " + rfp.getProduct()).withFields(field("product", rfp.getProduct()));
		} 
        List<AncillaryPlanDto> ancillaryPlans = rfpToAncillaryPlanRepository
        		.findByRfp_RfpId(rfpId)
                .stream()
                .map(rfpToAncillaryPlan -> RfpMapper.rfpPlanToRfpPlanDto(rfpToAncillaryPlan.getAncillaryPlan()))
                .collect(toList());
        RFP volRfp = rfpRepository.findByClientClientIdAndProduct(rfp.getClient().getClientId(), "VOL_" + rfp.getProduct());
    	if (volRfp != null) {
    		List<AncillaryPlanDto> voluntaryPlans = rfpToAncillaryPlanRepository
    			.findByRfp_RfpId(volRfp.getRfpId())
                .stream()
                .map(rfpToAncillaryPlan -> RfpMapper.rfpPlanToRfpPlanDto(rfpToAncillaryPlan.getAncillaryPlan()))
                .collect(toList());
    		ancillaryPlans.addAll(voluntaryPlans);
    	}
        return ancillaryPlans;
    }
}
