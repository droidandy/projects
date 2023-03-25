package com.benrevo.be.modules.presentation.service;

import static com.benrevo.common.util.MapBuilder.field;
import static org.springframework.util.CollectionUtils.isEmpty;

import com.benrevo.be.modules.shared.service.SharedPlanService;
import com.benrevo.be.modules.shared.service.SharedRfpService;
import com.benrevo.common.dto.ClientPlanDto;
import com.benrevo.common.dto.ClientPlanEnrollmentsDto;
import com.benrevo.common.dto.ClientPlanEnrollmentsDto.Enrollment;
import com.benrevo.common.dto.UpdateClientPlanEnrollmentsDto;
import com.benrevo.common.dto.ancillary.AncillaryPlanDto;
import com.benrevo.common.enums.PlanCategory;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientPlan;
import com.benrevo.data.persistence.entities.PlanNameByNetwork;
import com.benrevo.data.persistence.entities.ancillary.AncillaryPlan;
import com.benrevo.data.persistence.mapper.ClientPlanMapper;
import com.benrevo.data.persistence.mapper.RfpMapper;
import com.benrevo.data.persistence.repository.ClientPlanRepository;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.ancillary.AncillaryPlanRepository;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ClientPlanService extends SharedPlanService {

    @Autowired
    private ClientPlanRepository clientPlanRepository;

    @Autowired
    private SharedRfpService sharedRfpService;

    @Autowired
    private ClientRepository clientRepository;
    
    @Autowired
    private SharedPlanService sharedPlanService;
    
    @Autowired
    private AncillaryPlanRepository ancillaryPlanRepository;

    public ClientPlanDto create(ClientPlanDto clientPlanDto) {
        return save(clientPlanDto);
    }

    public ClientPlanDto update(ClientPlanDto clientPlanDto) {
        return save(clientPlanDto);
    }

    private ClientPlanDto save(ClientPlanDto clientPlanDto) {
        ClientPlan clientPlan = ClientPlanMapper.toEntity(clientPlanDto);

        // populate all child entities (pnn and rxPnn), because ClientPlanMapper.toEntity() is not return them correct
        if(clientPlan.getPnn() != null) {
            PlanNameByNetwork pnn = planNameByNetworkRepository.findOne(clientPlan.getPnn().getPnnId());
            if(pnn == null) {
                throw new BaseException("Cannot find PlanNameByNetwork by pnnId: " + clientPlanDto.getPnnId());
            }
            clientPlan.setPnn(pnn);
        }
        if(clientPlan.getRxPnn() != null) {
            PlanNameByNetwork rxpnn = planNameByNetworkRepository.findOne(clientPlan.getRxPnn().getPnnId());
            if(rxpnn == null) {
                throw new BaseException("Cannot find PlanNameByNetwork by rxPnnId: " + clientPlanDto.getRxPnnId());
            }
            clientPlan.setRxPnn(rxpnn);
        }
        clientPlan = clientPlanRepository.save(clientPlan);

        invalidateCachedRfpQuoteOption(clientPlan);
        
        return mapToDto(clientPlan);
    }

    public ClientPlanDto getById(Long id) {
        ClientPlan clientPlan = clientPlanRepository.findOne(id);

        if(clientPlan == null) {
            throw new NotFoundException("Client plan not found")
                .withFields(
                    field("client_plan_id", id)
                );
        }

        return mapToDto(clientPlan);
    }

    public void delete(Long id) {
        ClientPlan clientPlan = clientPlanRepository.findOne(id);

        if(clientPlan == null) {
            throw new NotFoundException("Client plan not found")
                .withFields(
                    field("client_plan_id", id)
                );
        }

        clientPlanRepository.delete(id);
        
        invalidateCachedRfpQuoteOption(clientPlan);
    }

    public Enrollment updateClientPlanEnrollments(List<UpdateClientPlanEnrollmentsDto> params) {
        Enrollment result = new Enrollment();

        List<ClientPlan> clientPlansToInvalidateCache = new ArrayList<>();
        for(UpdateClientPlanEnrollmentsDto dto : params) {
            ClientPlan clientPlan = clientPlanRepository.findOne(dto.getClientPlanId());

            if(clientPlan == null) {
                throw new NotFoundException("Client plan not found")
                    .withFields(
                        field("client_plan_id", dto.getClientPlanId())
                    );
            }

            clientPlan.setTier1Census(dto.getTier1Enrollment());
            clientPlan.setTier2Census(dto.getTier2Enrollment());
            clientPlan.setTier3Census(dto.getTier3Enrollment());
            clientPlan.setTier4Census(dto.getTier4Enrollment());

            clientPlan = clientPlanRepository.save(clientPlan);

            clientPlansToInvalidateCache.add(clientPlan);

            result.addPlanEnrollment(clientPlan.getClientPlanId(), clientPlan.getPnn().getPlanType(),
                clientPlan.getPnn().getName(), clientPlan.getTier1Census(), clientPlan.getTier2Census(),
                clientPlan.getTier3Census(), clientPlan.getTier4Census());
        }
        invalidateCachedRfpQuoteOption(clientPlansToInvalidateCache);
        return result;
    }

    public ClientPlanEnrollmentsDto getClientPlanEnrollments(Long clientId) {
        ClientPlanEnrollmentsDto result = new ClientPlanEnrollmentsDto();

        Enrollment medical = new Enrollment();
        result.setMedical(medical);

        Enrollment dental = new Enrollment();
        result.setDental(dental);

        Enrollment vision = new Enrollment();
        result.setVision(vision);

        List<ClientPlan> clientPlanList = clientPlanRepository.findByClientClientId(clientId);

        for(ClientPlan clientPlan : clientPlanList) {
            if(clientPlan != null) {
                Enrollment current;

                String planType = clientPlan.getPnn() != null && clientPlan.getPnn().getPlanType() != null
                    ? clientPlan.getPnn().getPlanType()
                    : "";

                PlanCategory pc = PlanCategory.findByPlanType(planType);

                if(pc != null) {
                    switch(pc) {
                        case MEDICAL:
                            current = medical;
                            break;
                        case DENTAL:
                            current = dental;
                            break;
                        case VISION:
                            current = vision;
                            break;
                        default:
                            continue;
                    }

                    current.addPlanEnrollment(
                        clientPlan.getClientPlanId(),
                        clientPlan.getPnn().getPlanType(),
                        clientPlan.getPnn().getName(),
                        clientPlan.getTier1Census(),
                        clientPlan.getTier2Census(),
                        clientPlan.getTier3Census(),
                        clientPlan.getTier4Census()
                    );
                }
            }
        }

        return result;
    }

    public void createClientPlan(Long clientId, List<Long> rfpIds) {
        if(isEmpty(clientPlanRepository.findByClientClientId(clientId))) {
            sharedRfpService.createClientPlans(clientRepository.findOne(clientId), rfpIds);
        }
    }
    
    public List<AncillaryPlanDto> getAncillaryPlansByClientId(Long clientId, String product) {
        Collection<String> planTypes;
        if(StringUtils.isBlank(product)) {
            planTypes = Arrays.asList(
                PlanCategory.LIFE.name(), PlanCategory.VOL_LIFE.name(),
                PlanCategory.STD.name(), PlanCategory.VOL_STD.name(),
                PlanCategory.LTD.name(), PlanCategory.VOL_LTD.name());
        } else {
            PlanCategory category = PlanCategory.valueOf(product);
            planTypes = category.getPlanTypes();
        }
        List<ClientPlan> clientPlans = clientPlanRepository.findByClientClientIdAndPnnPlanTypeIn(clientId, planTypes);
        List<AncillaryPlanDto> result = new ArrayList<>();
        for(ClientPlan clientPlan : clientPlans) {
            if(clientPlan.getAncillaryPlan() != null) {
                result.add(RfpMapper.rfpPlanToRfpPlanDto(clientPlan.getAncillaryPlan()));
            }
        }
        return result;
    }
    
	public AncillaryPlanDto createClientAncillaryPlan(Long clientId, AncillaryPlanDto planParams) {
		AncillaryPlanDto createdPlanDto = sharedPlanService.createAncillaryPlan(clientId, planParams);
		AncillaryPlan ancPlan = ancillaryPlanRepository.findOne(createdPlanDto.getAncillaryPlanId());
		PlanCategory product = ancPlan.getProduct();
		Client client = clientRepository.findOne(clientId);
		if (client == null) {
            throw new NotFoundException("Client not found").withFields(field("client_id", clientId));
        }

        sharedRfpService.createAncillaryClientPlans(client, product.name(), Collections.singletonList(ancPlan));
        sharedPlanService.updateAncillaryPlan(clientId, createdPlanDto);
		return createdPlanDto;
	}
    
}
