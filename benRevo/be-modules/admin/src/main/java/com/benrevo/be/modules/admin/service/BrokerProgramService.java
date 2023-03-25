package com.benrevo.be.modules.admin.service;

import static com.benrevo.common.util.MapBuilder.field;
import static com.benrevo.common.util.ObjectMapperUtils.map;
import static org.springframework.web.util.HtmlUtils.htmlEscape;

import com.benrevo.be.modules.shared.service.SharedBrokerProgramService;
import com.benrevo.be.modules.shared.service.SharedCarrierService;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.CreateProgramQuoteDto;
import com.benrevo.common.dto.PlanNameByNetworkDto;
import com.benrevo.common.dto.RfpCarrierDto;
import com.benrevo.common.dto.RfpQuoteDto;
import com.benrevo.common.enums.BrokerLocale;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.PlanRateType;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.common.enums.RiderMetaType;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.common.util.ClientLocaleUtils;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.Network;
import com.benrevo.data.persistence.entities.PlanNameByNetwork;
import com.benrevo.data.persistence.entities.PlanRate;
import com.benrevo.data.persistence.entities.Program;
import com.benrevo.data.persistence.entities.ProgramToPnn;
import com.benrevo.data.persistence.entities.RfpCarrier;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpQuoteNetwork;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkCombination;
import com.benrevo.data.persistence.entities.RfpQuoteNetworkPlan;
import com.benrevo.data.persistence.entities.RfpQuoteVersion;
import com.benrevo.data.persistence.entities.RfpSubmission;
import com.benrevo.data.persistence.entities.Rider;
import com.benrevo.data.persistence.entities.RiderMeta;
import com.benrevo.data.persistence.mapper.MapperUtil;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.PlanNameByNetworkRepository;
import com.benrevo.data.persistence.repository.PlanRateRepository;
import com.benrevo.data.persistence.repository.ProgramRepository;
import com.benrevo.data.persistence.repository.ProgramToPnnRepository;
import com.benrevo.data.persistence.repository.RfpQuoteNetworkCombinationRepository;
import com.benrevo.data.persistence.repository.RfpQuoteNetworkPlanRepository;
import com.benrevo.data.persistence.repository.RfpQuoteNetworkRepository;
import com.benrevo.data.persistence.repository.RfpQuoteRepository;
import com.benrevo.data.persistence.repository.RfpQuoteVersionRepository;
import com.benrevo.data.persistence.repository.RfpSubmissionRepository;
import com.benrevo.data.persistence.repository.RiderMetaRepository;
import com.benrevo.data.persistence.repository.RiderRepository;
import com.google.common.base.Objects;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.TreeSet;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class BrokerProgramService extends SharedBrokerProgramService {
    
    @Autowired
    private ClientLocaleUtils clientLocaleUtils;
    
    @Autowired
    private ProgramToPnnRepository programToPnnRepository;
    
    @Autowired
    private ProgramRepository programRepository;
    
    @Autowired
    private SharedCarrierService sharedCarrierService; 
    
    @Autowired
    private PlanNameByNetworkRepository pnnRepository;
    
    @Autowired
    private RfpQuoteRepository rfpQuoteRepository;
    
    @Autowired
    private RfpQuoteVersionRepository rfpQuoteVersionRepository;
    
    @Autowired
    private RfpSubmissionRepository rfpSubmissionRepository;
    
    @Autowired
    private PlanRateRepository planRateRepository;
    
    @Autowired
    private ClientRepository clientRepository;
    
    @Autowired
    private RfpQuoteNetworkRepository rfpQuoteNetworkRepository;
    
    @Autowired
    private RfpQuoteNetworkPlanRepository rfpQuoteNetworkPlanRepository;
    
    @Autowired
    private RfpQuoteNetworkCombinationRepository rfpQuoteNetworkCombinationRepository;
    
    @Autowired
    private RiderMetaRepository riderMetaRepository;
    
    @Autowired
    private RiderRepository riderRepository;
    
    public List<PlanNameByNetworkDto> getProgramPlans(Long programId) {
        if(!programRepository.exists(programId)) {
            throw new NotFoundException("Program by id not found").withFields(field("program_id", programId));
        }
        List<PlanNameByNetwork> pnns = programToPnnRepository.findPnnsByProgramId(programId);
        List<PlanNameByNetworkDto> result = new ArrayList<>(pnns.size());
        for(PlanNameByNetwork pnn : pnns) {
            result.add(mapToDto(pnn));
        }
        return result;
    }
    
    public List<PlanNameByNetworkDto> updateProgramPlans(Long programId, List<PlanNameByNetworkDto> newPnns) {
        if(!programRepository.exists(programId)) {
            throw new NotFoundException("Program by id not found").withFields(field("program_id", programId));
        }
        List<PlanNameByNetworkDto> result = new ArrayList<>(newPnns.size());
        
        Map<Long, ProgramToPnn> oldPnns = programToPnnRepository.findByProgramId(programId).stream()
            .collect(Collectors.toMap(p -> p.getPnn().getPnnId(), Function.identity()));
        
        for(PlanNameByNetworkDto newPnn : newPnns) {
            ProgramToPnn prog2Pnn = oldPnns.get(newPnn.getPnnId());
            if(prog2Pnn == null) {
                prog2Pnn = new ProgramToPnn();
                PlanNameByNetwork pnn = pnnRepository.findOne(newPnn.getPnnId());
                prog2Pnn.setPnn(pnn);
                prog2Pnn.setProgramId(programId);
                prog2Pnn = programToPnnRepository.save(prog2Pnn);
            }
            result.add(mapToDto(prog2Pnn.getPnn()));
            // to find relations for removing
            oldPnns.remove(prog2Pnn.getPnn().getPnnId());
        }
        // remove missing in newPnns list 
        for(ProgramToPnn prog2Pnn : oldPnns.values()) {
            programToPnnRepository.delete(prog2Pnn.getProgramToPnnId());
        }
        return result;
    }
    
    public List<RfpQuoteDto> createQuotes(List<CreateProgramQuoteDto> params) {
        List<RfpQuoteDto> result = new ArrayList<>();
        for(CreateProgramQuoteDto createParams : params) {
            RfpQuote newQuote = createQuotes(createParams);
            if(newQuote != null) {
                RfpQuoteDto quoteDto = new RfpQuoteDto();
                quoteDto.setQuoteType(newQuote.getQuoteType());
                quoteDto.setRfpQuoteId(newQuote.getRfpQuoteId());
                quoteDto.setRatingTiers(newQuote.getRatingTiers());
                quoteDto.setRfpCarrierId(newQuote.getRfpSubmission().getRfpCarrier().getRfpCarrierId());
                result.add(quoteDto);
            }
        }
        return result;
    }


    private PlanNameByNetworkDto mapToDto(PlanNameByNetwork pnn) {
        PlanNameByNetworkDto dto = new PlanNameByNetworkDto();
        dto.setPnnId(pnn.getPnnId());
        dto.setName(pnn.getName());
        dto.setPlanType(pnn.getPlanType());
        dto.setNetworkId(pnn.getNetwork().getNetworkId());
        dto.setNetworkName(pnn.getNetwork().getName());
        return dto;
    }
    
    private RfpCarrierDto mapToDto(RfpCarrier rfpCarrier) {
        RfpCarrierDto dto = map(rfpCarrier, RfpCarrierDto.class);
        dto.getCarrier().setLogoUrl(sharedCarrierService.getLogoUrl(dto.getCarrier().getName()));
        dto.getCarrier().setOriginalImageUrl(sharedCarrierService.getOriginalImageUrl(dto.getCarrier().getName()));
        return dto;
    }
}