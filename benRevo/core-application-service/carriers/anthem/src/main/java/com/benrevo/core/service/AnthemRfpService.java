package com.benrevo.core.service;

import com.benrevo.be.modules.quote.instant.service.anthem.AnthemInstantQuoteService;
import com.benrevo.be.modules.rfp.service.BaseRfpService;
import com.benrevo.be.modules.salesforce.dto.SFOpportunity;
import com.benrevo.be.modules.salesforce.event.SalesforceEvent;
import com.benrevo.be.modules.shared.service.SharedClientService;
import com.benrevo.common.Constants;
import com.benrevo.common.annotation.AppCarrier;
import com.benrevo.common.dto.AnthemCVProductQualificationDto;
import com.benrevo.common.dto.CensusInfoDto;
import com.benrevo.common.dto.RfpSubmissionStatusDto;
import com.benrevo.common.enums.AttributeName;
import com.benrevo.common.enums.ClientFileType;
import com.benrevo.common.enums.ClientState;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.common.security.AuthenticatedUser;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientAttribute;
import com.benrevo.data.persistence.entities.Option;
import com.benrevo.data.persistence.entities.PlanNameByNetwork;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.entities.RfpSubmission;
import com.benrevo.data.persistence.entities.RfpToPnn;
import com.benrevo.data.persistence.entities.ancillary.AncillaryPlan;
import com.benrevo.data.persistence.entities.ancillary.RfpToAncillaryPlan;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.OptionRepository;
import com.benrevo.data.persistence.repository.PlanNameByNetworkRepository;
import com.benrevo.data.persistence.repository.RfpCarrierRepository;
import com.benrevo.data.persistence.repository.RfpRepository;
import com.benrevo.data.persistence.repository.RfpSubmissionRepository;
import com.benrevo.data.persistence.repository.RfpToPnnRepository;
import com.benrevo.data.persistence.repository.ancillary.AncillaryPlanRepository;
import com.benrevo.data.persistence.repository.ancillary.RfpToAncillaryPlanRepository;
import io.vavr.control.Try;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.benrevo.be.modules.salesforce.enums.OpportunityType.NewBusiness;
import static com.benrevo.common.enums.CarrierType.*;
import static com.benrevo.common.util.MapBuilder.field;
import static java.util.Objects.isNull;
import static org.apache.commons.lang3.StringUtils.equalsIgnoreCase;
import static org.apache.commons.lang3.StringUtils.isEmpty;
import static org.apache.commons.lang3.StringUtils.isNotBlank;

@Service
@AppCarrier(ANTHEM_BLUE_CROSS)
@Transactional
public class AnthemRfpService extends BaseRfpService{

    @Autowired
    private RfpRepository rfpRepository;

    @Autowired
    private RfpSubmissionRepository rfpSubmissionRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private AnthemInstantQuoteService anthemInstantQuoteService;

    @Autowired
    protected RfpCarrierRepository rfpCarrierRepository;

    @Autowired
    private SharedClientService sharedClientService;

    @Autowired
    private RfpToPnnRepository rfpToPnnRepository;

    @Autowired
    private AncillaryPlanRepository ancillaryPlanRepository;

    @Autowired
    private RfpToAncillaryPlanRepository rfpToAncillaryPlanRepository;

    @Autowired
    protected RfpSubmissionRepository submissionRepository;

    @Autowired
    protected PlanNameByNetworkRepository planNameByNetworkRepository;

    @Autowired
    protected OptionRepository optionRepository;

    @Value("${app.carrier}")
    String[] appCarrier;

    @Override
    public List<RfpSubmissionStatusDto> getRfpSubmissionStatus(Long clientId, List<Long> rfpIds){
        Client client = clientRepository.findOne(clientId);
        if (client == null) {
            throw new NotFoundException("Client not found")
                .withFields(
                    field("client_id", clientId)
                );
        }
        List<RfpSubmissionStatusDto> statues = new ArrayList<>();
        
        List<RFP> rfps = rfpRepository.findByClientClientIdAndRfpIdIn(client.getClientId(), rfpIds);
        
        RfpSubmissionStatusDto CVSubmissionStatusDto = new RfpSubmissionStatusDto();
        AnthemCVProductQualificationDto qualificationDto = anthemInstantQuoteService.doesUserQualifyForClearValue(clientId, rfps, CVSubmissionStatusDto);
        
        Set<String> products = rfps.stream().map(RFP::getProduct).collect(Collectors.toSet());
        for(String product : products) {
            List<RfpSubmission> submissions = submissionRepository.findByClientAndRfpCarrierCategory(client, product);
            for(RfpSubmission rfpSubmission : submissions) {
                RfpSubmissionStatusDto statusDto;
                if(!rfpSubmission.getRfpCarrier().getCarrier().getName().equals(ANTHEM_CLEAR_VALUE.name())) {
                    statusDto = super.buildRfpSubmissionStatusDto(rfpSubmission); 
                } else {
                    statusDto = new RfpSubmissionStatusDto();
                    statusDto.setRfpSubmittedSuccessfully(false);
                    statusDto.setType("CLEAR_VALUE");
                    statusDto.setProduct(rfpSubmission.getRfpCarrier().getCategory());
                    statusDto.setCarrierName(rfpSubmission.getRfpCarrier().getCarrier().getName());
                    statusDto.setCarrierId(rfpSubmission.getRfpCarrier().getCarrier().getCarrierId());
                    if(rfpSubmission.getSubmittedDate() != null) { // user has submitted
                        // resolve the submission reason missing from DB
                        rfpSubmission = resolveMissingAnthemCVDisqualificationReason(statusDto.getProduct(), rfpSubmission, qualificationDto);
                        statusDto.setSubmissionDate(rfpSubmission.getSubmittedDate());
                        statusDto.setDisqualificationReason(rfpSubmission.getDisqualificationReason());
                        statusDto.setRfpSubmittedSuccessfully(rfpSubmission.getDisqualificationReason() == null ? true : false);
                    }
                }
                statues.add(statusDto);
            }
        }
        // Salesforce
        Try.run(() -> publisher.publishEvent(
            new SalesforceEvent.Builder()
                .withObject(
                    new SFOpportunity.Builder()
                        .withBrokerageFirm(client.getBroker().getName())
                        .withName(client.getClientName())
                        .withCarrier(fromStrings(appCarrier))
                        .withTest(!equalsIgnoreCase(appEnv, "prod"))
                        .withCarrierContact(client.getBroker().getSalesEmail())
                        .withType(NewBusiness)
                        .withClearValueQuoteIssued(
                            statues.stream()
                                .anyMatch(s -> equalsIgnoreCase(s.getType(), "clear_value"))
                        )
                        .withCvDisqualificationReason(
                            statues.stream()
                                .filter(s -> isNotBlank(s.getDisqualificationReason()))
                                .findFirst()
                                .map(RfpSubmissionStatusDto::getDisqualificationReason)
                                .orElse(null)
                        )
                        .withCloseDate(client.getDueDate())
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

        return statues;
    }

    private RfpSubmission resolveMissingAnthemCVDisqualificationReason(String product,
        RfpSubmission CVSubmission, AnthemCVProductQualificationDto qualificationDto){

        if(product.equalsIgnoreCase(Constants.MEDICAL)
            && !qualificationDto.isQualifiedForMedical()
            && CVSubmission.getDisqualificationReason() == null){

            // user is disqualified for Medical but disqualification reason is not saved in the DB
            CVSubmission.setDisqualificationReason(qualificationDto.getDisqualificationReason());
        }else if(product.equalsIgnoreCase(Constants.DENTAL)
            && !qualificationDto.isQualifiedForDental()
            && CVSubmission.getDisqualificationReason() == null){

            // user is disqualified for Dental but disqualification reason is not saved in the DB
            CVSubmission.setDisqualificationReason(qualificationDto.getDisqualificationReason());
        }else if(product.equalsIgnoreCase(Constants.VISION)
            && !qualificationDto.isQualifiedForVision()
            && CVSubmission.getDisqualificationReason() == null){

            // user is disqualified for Vision but disqualification reason is not saved in the DB
            CVSubmission.setDisqualificationReason(qualificationDto.getDisqualificationReason());
        }
        return submissionRepository.save(CVSubmission);
    }

    @Override
    protected void setCensusType(Client client, CensusInfoDto infoDto){
        infoDto.setType(ClientFileType.SUBSCRIBER);
    }

    @Override
    protected void copyClientForCarrierAdminTool(Client client, List<Long> rfpIds) {

        boolean carrierOwnedCopyExist = false;
        if(isEmpty(client.getClientToken())){
            client.setClientToken(UUID.randomUUID().toString().toLowerCase());
            clientRepository.save(client);
        }else{
            carrierOwnedCopyExist = !isNull(clientRepository.findByClientTokenAndClientIdNot(
                client.getClientToken(), client.getClientId())
            );
        }

        if(!carrierOwnedCopyExist) {
            Client carrierClient = client.copy();
            carrierClient.setCarrierOwned(true);
            carrierClient.setClientState(ClientState.RFP_SUBMITTED);

            carrierClient.setClientToken(client.getClientToken());
            carrierClient = clientRepository.save(carrierClient);

            attributeRepository
                .save(new ClientAttribute(carrierClient, AttributeName.NOT_VIEWED_IN_DASHBOARD));

            for(Long rfpId : rfpIds) {
                RFP rfp = rfpRepository.findByClientClientIdAndRfpId(client.getClientId(), rfpId);
                copyRfp(carrierClient, rfp);
            }

            // copy rfp submission
            List<RfpSubmission> rfpSubmissions = rfpSubmissionRepository.findByClient(client);
            if (rfpSubmissions != null) {
                for (RfpSubmission rfpSubmission : rfpSubmissions) {
                    RfpSubmission rfpSubmissionCopy = rfpSubmission.copy();
                    rfpSubmissionCopy.setClient(carrierClient);
                    rfpSubmissionRepository.save(rfpSubmissionCopy);
                }
            }
        }
    }

    /**
     * Return the county list available for Anthem Clear Value
     * @return
     */
    public List<String> getCountyList() {
        return anthemInstantQuoteService.getCountyList().stream().sorted(Comparator.naturalOrder()).collect(Collectors.toList());
    }
}
