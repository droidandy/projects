package com.benrevo.broker.service;

import static com.benrevo.common.util.MapBuilder.field;
import static java.util.Objects.isNull;
import static org.apache.commons.lang3.StringUtils.isEmpty;

import com.benrevo.be.modules.shared.service.SharedClientService;
import com.benrevo.be.modules.shared.service.SharedRfpQuoteService;
import com.benrevo.be.modules.shared.service.SharedRfpService;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.CarrierHistoryDto;
import com.benrevo.common.dto.FileInfoDto;
import com.benrevo.common.dto.OptionDto;
import com.benrevo.common.dto.RfpDto;
import com.benrevo.common.dto.ValidationDto;
import com.benrevo.common.enums.ClientDetailsStatus;
import com.benrevo.common.enums.PlanCategory;
import com.benrevo.common.enums.RateType;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientPlan;
import com.benrevo.data.persistence.entities.ClientRfpProduct;
import com.benrevo.data.persistence.entities.PlanNameByNetwork;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.entities.RfpQuoteOption;
import com.benrevo.data.persistence.entities.RfpQuoteOptionNetwork;
import com.benrevo.data.persistence.entities.RfpSubmission;
import com.benrevo.data.persistence.entities.RfpToPnn;
import com.benrevo.data.persistence.repository.ClientPlanRepository;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.RfpQuoteOptionRepository;
import com.benrevo.data.persistence.repository.RfpRepository;
import com.benrevo.data.persistence.repository.RfpSubmissionRepository;
import com.benrevo.data.persistence.repository.RfpToPnnRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;


@Service
@Transactional
public class ValidationService {

    @Value("${app.carrier}")
    protected String[] appCarrier;

    @Autowired
    protected SharedClientService sharedClientService;

    @Autowired
    protected SharedRfpService sharedRfpService;

    @Autowired
    protected RfpRepository rfpRepository;

    @Autowired
    protected ClientRepository clientRepository;

    @Autowired
    protected RfpToPnnRepository rfpToPnnRepository;

    @Autowired
    private RfpQuoteOptionRepository rfpQuoteOptionRepository;

    @Autowired
    private RfpSubmissionRepository rfpSubmissionRepository;

    @Autowired
    private ClientPlanRepository clientPlanRepository;

    @Autowired
    private SharedRfpQuoteService sharedRfpQuoteService;

    private static String RFP_BENEFIT_SUMMARY_SECTION_NAME = "fileSummary";
    private static String VOLUNTARY_CONTRIBUTION_TYPE = "VOLUNTARY";


    public ValidationDto getClientDetailsStatus(Long clientId) {
        ValidationDto dto = new ValidationDto();
        if(isNull(clientId)){
            return dto;
        }

        // client section status
        boolean clientSectionComplete = isClientCompleted(clientId);
        dto.setClient(clientSectionComplete ? ClientDetailsStatus.COMPLETED : ClientDetailsStatus.READY);
        dto.setRfp(clientSectionComplete ? ClientDetailsStatus.READY : ClientDetailsStatus.NOT_STARTED);
        dto.setPresentation(ClientDetailsStatus.NOT_STARTED);

        // short circuit
        if(!clientSectionComplete) return dto;

        boolean rfpSectionComplete = isRfpCompleted(clientId);
        dto.setRfp(rfpSectionComplete ? ClientDetailsStatus.COMPLETED : dto.getRfp());
        dto.setPresentation(rfpSectionComplete ? ClientDetailsStatus.READY : ClientDetailsStatus.NOT_STARTED);

        // short circuit
        if(!rfpSectionComplete) return dto;

        boolean presentationSectionComplete = isPresentationCompleted(clientId);
        dto.setPresentation(presentationSectionComplete ? ClientDetailsStatus.COMPLETED : dto.getPresentation());

        return dto;
    }

    private boolean isPresentationCompleted(Long clientId){

        List<RfpSubmission> rfpSubmissions = rfpSubmissionRepository.
            findByClient(clientRepository.findOne(clientId));

        boolean hasMedicalRfpSubmission = rfpSubmissions.stream()
            .anyMatch(sub -> sub.getRfpCarrier().getCategory().equalsIgnoreCase(Constants.MEDICAL));

        boolean hasDentalRfpSubmission = rfpSubmissions.stream()
            .anyMatch(sub -> sub.getRfpCarrier().getCategory().equalsIgnoreCase(Constants.DENTAL));

        boolean hasVisionRfpSubmission = rfpSubmissions.stream()
            .anyMatch(sub -> sub.getRfpCarrier().getCategory().equalsIgnoreCase(Constants.VISION));

        if(!hasMedicalRfpSubmission && !hasDentalRfpSubmission && !hasVisionRfpSubmission){
            return false;
        }

        List<RfpQuoteOption> medicalRfpQuoteOptions = rfpQuoteOptionRepository.findByClientIdAndCategory(
            clientId, Constants.MEDICAL);
        List<RfpQuoteOption> dentalRfpQuoteOptions = rfpQuoteOptionRepository.findByClientIdAndCategory(
            clientId, Constants.DENTAL);
        List<RfpQuoteOption> visionRfpQuoteOptions = rfpQuoteOptionRepository.findByClientIdAndCategory(
            clientId, Constants.VISION);

        if(hasMedicalRfpSubmission && !isValidQuoteOptions(clientId, Constants.MEDICAL, medicalRfpQuoteOptions)){
            return false;
        }

        if(hasDentalRfpSubmission && !isValidQuoteOptions(clientId, Constants.DENTAL, dentalRfpQuoteOptions)){
            return false;
        }

        if(hasVisionRfpSubmission && !isValidQuoteOptions(clientId, Constants.VISION,visionRfpQuoteOptions)){
            return false;
        }

        return true;
    }

    private boolean isValidQuoteOptions(Long clientId, String category, List<RfpQuoteOption> rfpQuoteOptions){

        // Check to make sure current is available - mostly via client plan
        PlanCategory planCategory = PlanCategory.valueOf(category);
        List<ClientPlan> clientPlans = clientPlanRepository.findByClientClientIdAndPnnPlanTypeIn(clientId, planCategory.getPlanTypes());

        // TODO validate client plan rates, enrollment, contribution, oos, network and pnn label - no nulls based on tier number
        if(clientPlans.isEmpty()){
            return false;
        }

        // now check the other options
        boolean isOptionComplete = true;
        for(RfpQuoteOption option : sharedRfpQuoteService.findAllCarrierQuoteOptions(clientId, category)) {
            for(RfpQuoteOptionNetwork optNetwork : option.getRfpQuoteOptionNetworks()) {
                if (!sharedRfpQuoteService.isCompleteRfpQuoteOptionNetwork(optNetwork)) {
                    isOptionComplete = false;
                    break;
                }
            }
        }

        if(!isOptionComplete) return false;

        return true;
    }

    /**
     * Checks if the client section is complete.
     * @param clientId - the client's Id
     * @return true if client has name, effective date and at least one rfp product
     */
    private boolean isClientCompleted(Long clientId) {
        Client client = clientRepository.findOne(clientId);

        if(client == null) {
            throw new NotFoundException("Client not found").withFields(field("client_id", clientId));
        }

        List<ClientRfpProduct> clientProducts = sharedClientService.getClientRfpProducts(clientId);

        return !isEmpty(client.getClientName()) && !isNull(client.getEffectiveDate())
            && !CollectionUtils.isEmpty(clientProducts);
    }

    /**
     * Checks if the rfp section is complete.
     * @param clientId - the client's Id
     * @return true if at least one rfp submission and or client submitted rfp outside benrevo
     * TODO Have to account for Virgin coverage
     */
    private boolean isRfpCompleted(Long clientId) {

        Client client = clientRepository.findOne(clientId);
        List<RfpSubmission> rfpSubmissions = rfpSubmissionRepository.findByClient(client);
        if(!client.isSubmittedRfpSeparately() && CollectionUtils.isEmpty(rfpSubmissions)){
            return false;
        }
        return true;
    }

}
