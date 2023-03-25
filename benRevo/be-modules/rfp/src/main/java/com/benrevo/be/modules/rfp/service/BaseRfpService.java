package com.benrevo.be.modules.rfp.service;

import com.benrevo.be.modules.rfp.util.RfpTypeValidator;
import com.benrevo.be.modules.salesforce.dto.SFOpportunity;
import com.benrevo.be.modules.salesforce.event.SalesforceEvent;
import com.benrevo.be.modules.shared.service.DocumentGeneratorService;
import com.benrevo.be.modules.shared.service.SharedBrokerService;
import com.benrevo.be.modules.shared.service.SharedClientService;
import com.benrevo.be.modules.shared.service.SharedRfpService;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.ClientDto;
import com.benrevo.common.dto.RfpDto;
import com.benrevo.common.dto.RfpSubmissionStatusDto;
import com.benrevo.common.enums.*;
import com.benrevo.common.exception.*;
import com.benrevo.common.logging.CustomLogger;
import com.benrevo.common.security.AuthenticatedUser;
import com.benrevo.common.util.DateHelper;
import com.benrevo.data.persistence.entities.*;
import com.benrevo.data.persistence.mapper.RfpMapper;
import com.benrevo.data.persistence.repository.*;
import com.itextpdf.text.Document;
import com.itextpdf.text.pdf.PdfCopy;
import com.itextpdf.text.pdf.PdfReader;
import com.itextpdf.text.pdf.PdfSmartCopy;
import io.vavr.control.Try;

import java.io.ByteArrayOutputStream;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.Map.Entry;
import java.util.stream.Collectors;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.benrevo.be.modules.salesforce.enums.OpportunityType.NewBusiness;
import static com.benrevo.be.modules.salesforce.enums.StageType.RfpSubmitted;
import static com.benrevo.common.Constants.LIFE;
import static com.benrevo.common.Constants.LTD;
import static com.benrevo.common.Constants.STD;
import static com.benrevo.common.enums.CarrierType.fromStrings;
import static com.benrevo.common.util.MapBuilder.field;
import static java.util.Comparator.comparing;
import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toList;
import static org.apache.commons.lang3.StringUtils.equalsIgnoreCase;
import static org.apache.commons.lang3.StringUtils.isNotBlank;

@Service
@Transactional
public class BaseRfpService extends SharedRfpService{

    @Autowired
    protected CustomLogger logger;

    @Autowired
    protected ApplicationEventPublisher publisher;

    @Autowired
    protected RfpRepository rfpRepository;

    @Autowired
    private OptionRepository optionRepository;

    @Autowired
    private RfpEmailService rfpEmailService;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private CarrierHistoryRepository historyRepository;

    @Autowired
    private BrokerRepository brokerRepository;

    @Autowired
    private RfpVelocityService rfpVelocityService;

    @Autowired
    private DocumentGeneratorService documentGeneratorService;

    @Autowired
    private RfpSubmitter rfpSubmitter;
    
    @Autowired
    protected RfpCarrierRepository rfpCarrierRepository;

    @Autowired
    protected RfpSubmissionRepository submissionRepository;

    @Autowired
    private ExtClientAccessRepository extClientAccessRepository;

    @Autowired
    private SharedBrokerService sharedBrokerService;

    @Autowired
    private SharedClientService sharedClientService;

    @Autowired
    private CarrierRepository carrierRepository;

    @Value("${app.carrier}")
    protected String[] appCarrier;

    @Value("${app.env}")
    protected String appEnv;

    public RfpDto getById(Long id) {
        final RFP rfp = rfpRepository.findOne(id);

        if(rfp == null) {
            throw new NotFoundException("RFP not found")
                .withFields(
                    field("rfp_id", id)
                );
        }

        return RfpMapper.rfpToDTO(rfp);
    }

    public boolean checkIfExist(Long id) {
        return rfpRepository.findOne(id) != null;
    }


    public List<RfpDto> create(List<RfpDto> dtoList, Long clientId) {
        Client client = clientRepository.findOne(clientId);

        if(client == null) {
            throw new NotFoundException("No client found")
                .withFields(
                    field("client_id", clientId)
                );
        }

        if(dtoList == null || dtoList.isEmpty()) {
            throw new BadRequestException("No RFPs provided")
                .withFields(
                    field("client_id", clientId)
                );
        }

        List<RfpDto> newDtolist = new ArrayList<>();

        for(RfpDto rfpDto : dtoList) {
            rfpDto.setClientId(clientId);
            validateDtoBeforeCreation(rfpDto);
            rfpDto = create(rfpDto);
            newDtolist.add(rfpDto);
        }

        calcRfpAttributes(newDtolist);
        
        return newDtolist;
    }

    public RfpDto update(Long clientId, RfpDto rfpDto) {
        if(clientRepository.findOne(clientId) == null) {
            throw new NotFoundException("Client not found")
                .withFields(
                    field("client_id", clientId)
                );
        }

        final RFP rfp = rfpRepository.findByClientClientIdAndRfpId(clientId, rfpDto.getId());

        if(rfp == null) {
            throw new BadRequestException("RFP does not belong to client")
                .withFields(
                    field("client_id", clientId),
                    field("rfp_id", rfpDto.getId())
                );
        }

        validateRfpAttributes(rfpDto);
        
        RFP newRfp = RfpMapper.rfpDtoToRFP(rfpDto);
        newRfp.setRfpId(rfp.getRfpId());

        updateOptionsForRfp(newRfp, rfp.getOptions());
        updateCarrierHistoryForRfp(newRfp, rfp.getCarrierHistories());
        updateAttributesForRfp(newRfp, rfp.getAttributes(), rfpDto.getAttributes());
        
        SimpleDateFormat dateFormatter = new SimpleDateFormat(Constants.DATETIME_FORMAT);
        dateFormatter.setTimeZone(TimeZone.getTimeZone("America/Los_Angeles"));
        newRfp.setLastUpdated(DateHelper
            .fromStringToDate(dateFormatter.format(new Date()), Constants.DATETIME_FORMAT));

        newRfp = rfpRepository.save(newRfp);
        
        RfpDto result = RfpMapper.rfpToDTO(newRfp);

        // fill in rfp submission date
        fillInRfpSubmissionInfo(rfp.getClient(), result);
        
        if (StringUtils.equalsAny(rfp.getProduct(), LIFE, LTD, STD)) {
        	String volProduct = "VOL_" + rfp.getProduct();
        	RFP volRfp = rfpRepository.findByClientClientIdAndProduct(clientId, volProduct);
         	if (volRfp != null) {
         		RFP updated = newRfp.copy();
         		updated.setProduct(volProduct);
         		updated.setRfpId(volRfp.getRfpId());
         		volRfp = rfpRepository.save(updated);
         	}
		} 
        return result;
    }

    protected void validateRfpAttributes(RfpDto rfpDto) {
        // do nothing
    }

    public List<RfpDto> update(List<RfpDto> dtoList, Long clientId) {
        if(dtoList == null || dtoList.isEmpty()) {
            throw new BadRequestException("No RFPs provided")
                .withFields(
                    field("client_id", clientId)
                );
        }

        List<RfpDto> newDtolist = new ArrayList<>();

        for(RfpDto rfpDto : dtoList) {
            Long rfpClientId = rfpDto.getClientId();

            if(null == rfpClientId) {
                rfpDto.setClientId(clientId);
            } else if(!rfpClientId.equals(clientId)) {
                throw new BadRequestException("RFP does not belong to client");
            }

            rfpDto = update(clientId, rfpDto);
            newDtolist.add(rfpDto);
        }

        calcRfpAttributes(newDtolist);

        return newDtolist;
    }

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
        Set<String> products = rfps.stream().map(RFP::getProduct).collect(Collectors.toSet());
        for(String product : products) {
            List<RfpSubmission> submissions = submissionRepository.findByClientAndRfpCarrierCategory(client, product);
            for(RfpSubmission rfpSubmission : submissions) {
                RfpSubmissionStatusDto statusDto = buildRfpSubmissionStatusDto(rfpSubmission);
                statues.add(statusDto);
            }
        }
        // Salesforce
        publishSalesforceSubmissionStatusEvent(client, statues);

        return statues;
    }

    public List<RfpSubmissionStatusDto> rfpSubmission(Long clientId, List<Long> rfpIds) {
        Carrier incumbentCarrier = carrierRepository.findByName(appCarrier[0]);
        return rfpSubmission(clientId, incumbentCarrier.getCarrierId(), rfpIds);
    }

    public List<RfpSubmissionStatusDto> rfpSubmission(Long clientId, Long carrierId, List<Long> rfpIds) {
        Client client = clientRepository.findOne(clientId);

        List<RfpSubmissionStatusDto> submissionStatuses;
        if (client == null) {
            throw new NotFoundException("Client not found")
                .withFields(
                    field("client_id", clientId)
                );
            }

        if (rfpIds == null || rfpIds.isEmpty()) {
            throw new BadRequestException("List of RFPs should not be empty");
        }

        try {
            updateClientState(client);
            submissionStatuses = rfpSubmitter.createRfpSubmissions(client, carrierId, rfpIds);
            createClientPlans(client, rfpIds);
            rfpEmailService.sendRFPSubmission(clientId, rfpIds);
            
            copyClientForCarrierAdminTool(client, rfpIds);
            
            // Salesforce
            publishSalesforceSubmissionEvent(client, rfpIds, submissionStatuses);

        } catch (BaseException e) {
            throw e;
        } catch (Exception e) {
            throw new ClientException("Unable to send/save RFP submission email", e)
                .withFields(
                    field("client_id", clientId),
                    field("rfp_ids", rfpIds)
                );
        }

        return submissionStatuses;
    }

    protected void copyClientForCarrierAdminTool(Client client, List<Long> rfpIds) {
        // do nothing
    }

    protected void publishSalesforceSubmissionStatusEvent(Client client, List<RfpSubmissionStatusDto> statues) {
        Try.run(() -> { 
            for (RfpSubmissionStatusDto submissionStatus : statues) {
                publisher.publishEvent(
                new SalesforceEvent.Builder()
                    .withObject(
                        new SFOpportunity.Builder()
                            .withBrokerageFirm(client.getBroker().getName())
                            .withName(client.getClientName())
                            .withCarrier(fromStrings(submissionStatus.getCarrierName()))
                            .withTest(!equalsIgnoreCase(appEnv, "prod"))
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
                );
            }
        }).onFailure(t -> logger.error(t.getMessage(), t));
    }

    protected void publishSalesforceSubmissionEvent(Client client, List<Long> rfpIds,
        List<RfpSubmissionStatusDto> submissionStatuses) {

        List<String> productBuilder = new ArrayList<>();
        Map<String, List<String>> incumbentCarrierBuilder = new HashMap<>();
        List<ExtClientAccess> gaAccessList = extClientAccessRepository.findByClient(client);

        if(rfpIds == null || rfpIds.isEmpty()) {
            throw new BadRequestException("List of RFPs should not be empty");
        } else {
            for (Long rfpId : rfpIds) {
                RFP rfp = rfpRepository.findByClientClientIdAndRfpId(client.getClientId(), rfpId);

                if(rfp == null) {
                    throw new NotFoundException("RFP not found")
                        .withFields(
                            field("rfp_id", rfpId)
                        );
                }

                if(rfp.getProduct() != null) {
                    productBuilder.add(rfp.getProduct());
                }

                if(rfp.getCarrierHistories() != null) {
                    incumbentCarrierBuilder.put(
                        rfp.getProduct(),
                        rfp.getCarrierHistories()
                            .stream()
                            .filter(CarrierHistory::isCurrent)
                            .map(CarrierHistory::getName)
                            .distinct()
                            .collect(toList())
                    );
                }
            }
        }
        Try.run(() -> {
            for (RfpSubmissionStatusDto submissionStatus : submissionStatuses) {
                publisher.publishEvent(
                new SalesforceEvent.Builder()
                    .withObject(
                        new SFOpportunity.Builder()
                            .withName(client.getClientName())
                            .withCarrier(fromStrings(submissionStatus.getCarrierName()))
                            .withTest(!equalsIgnoreCase(appEnv, "prod"))
                            .withEffectiveDate(client.getEffectiveDate())
                            .withEligibleEmployees(client.getEligibleEmployees())
                            .withParticipatingEmployees(client.getParticipatingEmployees())
                            .withProductsQuoted(productBuilder.stream().distinct().collect(joining(";")))
                            .withClearValueQuoteIssued(equalsIgnoreCase(submissionStatus.getType(), "clear_value"))
                            .withType(NewBusiness)
                            .withIncumbentMedicalCarrier(
                                incumbentCarrierBuilder.entrySet()
                                    .stream()
                                    .filter(e -> e.getKey().equalsIgnoreCase("medical"))
                                    .map(Entry::getValue)
                                    .flatMap(List::stream)
                                    .map(vs -> CarrierType.fromDisplayNameString(vs).name())
                                    .collect(joining(";"))
                            )
                            .withIncumbentDentalCarrier(
                                incumbentCarrierBuilder.entrySet()
                                    .stream()
                                    .filter(e -> e.getKey().equalsIgnoreCase("dental"))
                                    .map(Entry::getValue)
                                    .flatMap(List::stream)
                                    .map(vs -> CarrierType.fromDisplayNameString(vs).name())
                                    .collect(joining(";"))
                            )
                            .withIncumbentVisionCarrier(
                                incumbentCarrierBuilder.entrySet()
                                    .stream()
                                    .filter(e -> e.getKey().equalsIgnoreCase("vision"))
                                    .map(Entry::getValue)
                                    .flatMap(List::stream)
                                    .map(vs -> CarrierType.fromDisplayNameString(vs).name())
                                    .collect(joining(";"))
                            )
                            .withGeneralAgent(
                                gaAccessList != null && gaAccessList.size() > 0
                                    ? gaAccessList.get(0).getExtBroker().getName()
                                    : null
                            )
                            .withStageName(RfpSubmitted)
                            .withCloseDate(client.getDueDate())
                                .withRfpSubmitted(submissionStatus.getSubmissionDate())
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
                );
            }
        }).onFailure(t -> logger.error(t.getMessage(), t));
    }

    

    private Broker getBrokerFromAuth(){
        Long id = (Long) SecurityContextHolder.getContext().getAuthentication().getDetails();
        return brokerRepository.findOne(id);
    }

    public ByteArrayOutputStream generatePDF(Long clientId, String rfpType,
        boolean shouldAddClientPage) {
        Broker broker = getBrokerFromAuth();
        ClientDto clientDto = sharedClientService.getById(clientId);

        String rfpPagesArray[] = rfpVelocityService.getRfpPagesArray(broker, clientDto, rfpType);
        
        if(shouldAddClientPage){
            RfpDto rfpDto = getRfpForClientByType(clientDto.getId(), rfpType);

            String[] clientArray = new String[1];
            clientArray[0] = rfpVelocityService
                .getRfpClientPage(broker, clientDto, rfpDto.getWaitingPeriod());

            String[] finalRfpPagesArray = (String[]) ArrayUtils.addAll(clientArray, rfpPagesArray);
            return getByteArrayOutputStreamOfStringArray(finalRfpPagesArray);
        }else{
            return getByteArrayOutputStreamOfStringArray(rfpPagesArray);
        }
    }
    
    public byte[] getRfpPagePdf(ClientDto clientDto, Broker broker, RFP rfp) {
       RfpDto rfpDto = RfpMapper.rfpToDTO(rfp);
       String rfpPagesArray[] = rfpVelocityService.getRfpPagesArray(broker, clientDto, rfpDto);
       ByteArrayOutputStream byteArrayOutputStream = getByteArrayOutputStreamOfStringArray(rfpPagesArray);

       if(byteArrayOutputStream != null){
           return byteArrayOutputStream.toByteArray();
       }
       return null;
    }

    private ByteArrayOutputStream getByteArrayOutputStreamOfStringArray(String[] rfpPagesArray) {
        try {
            if(rfpPagesArray.length == 0) {
                return null;
            }
            return (ByteArrayOutputStream) documentGeneratorService
                .stringArrayToPdfOS(rfpPagesArray);
        } catch(BaseException e) {
            throw e;
        } catch(Exception e) {
            throw new BaseException(e.getMessage(), e);
        }
    }

    private void addClientPage(PdfCopy copy, List<RFP> rfps, Long clientId){
        Broker broker = getBrokerFromAuth();
        ClientDto clientDto = sharedClientService.getById(clientId);

        try{
            byte[] clientPage = getClientPagePdf(clientDto, broker, rfps);
            if(clientPage.length > 0) {
                PdfReader reader = new PdfReader(clientPage);
                copy.addDocument(reader);
                reader.close();
            }
        }catch(Exception e) {
            throw new BaseException(e.getMessage(), e);
        }
    }
    
    public byte[] getClientPagePdf(ClientDto clientDto, Broker broker, List<RFP> rfps){
        String[] clientArray = new String[1];
        clientArray[0] = getClientPage(clientDto, broker, rfps);
        ByteArrayOutputStream stream = getByteArrayOutputStreamOfStringArray(clientArray);
        return stream != null ? stream.toByteArray() : new byte[0];
    }
    
    public byte[] getBrokerLanguagePagePdf(Broker broker) {
        String brokerLanguage = sharedBrokerService.getBrokerLanguage(broker.getBrokerId());
        if (brokerLanguage != null && ! brokerLanguage.isEmpty()) {
            String brokerLanguagePage = rfpVelocityService.getRfpBrokerLanguagePage(broker, brokerLanguage);
            ByteArrayOutputStream stream = getByteArrayOutputStreamOfStringArray(new String[]{brokerLanguagePage});
            return stream != null ? stream.toByteArray() : new byte[0];
        } 
        return new byte[0];
    }

    private String getClientPage(ClientDto clientDto, Broker broker, List<RFP> rfps) {
    	String waitingPeriod = "";
        if(rfps.size() != 0){
            waitingPeriod = rfps.get(0).getWaitingPeriod();
        }
        return rfpVelocityService.getRfpClientPage(broker, clientDto, waitingPeriod);
    }
    
    public byte[] generateRfpDOCXsByClient(Long clientId, List<Long> rfpIds) {
    	if(rfpIds == null || rfpIds.isEmpty()) {
    		throw new ValidationException("List of RFPs should not be empty");
        }
    	
        List<RFP> rfps = rfpRepository.findByClientClientIdAndRfpIdIn(clientId, rfpIds);

        // Same as rfp1.getRfpId().compareTo(rfp2.getRfpId()
        rfps.sort(comparing(RFP::getRfpId));
        
        Broker broker = getBrokerFromAuth();
        ClientDto clientDto = sharedClientService.getById(clientId);

        String clientPage = getClientPage(clientDto, broker, rfps);
        
        List<String[]> pages = new ArrayList<>();
        pages.add(new String[] {clientPage});

        for(RFP rfp : rfps) {
            String rfpPagesArray[] = rfpVelocityService
                .getRfpPagesArray(broker, clientDto, rfp.getProduct());
            if(rfpPagesArray.length > 0) {
                pages.add(rfpPagesArray);
            }
        }
        
        String brokerLanguage = sharedBrokerService.getBrokerLanguage(broker.getBrokerId());
        if (brokerLanguage != null && ! brokerLanguage.isEmpty()) {
            pages.add(
                new String[]{rfpVelocityService.getRfpBrokerLanguagePage(broker, brokerLanguage)});
        }

        String[] finalRfpPagesArray = pages.stream().flatMap(a -> Arrays.stream(a))
            .toArray(String[]::new);

        return documentGeneratorService.stringArrayToDocxOS(finalRfpPagesArray).toByteArray();
    }
    
    public OutputStream generateRfpPDFsByClient(Long clientId, List<Long> rfpIds) {
    	if(rfpIds == null || rfpIds.isEmpty()) {
            throw new ValidationException("List of RFPs should not be empty");
        }
    	
    	OutputStream resultingStream = new ByteArrayOutputStream();

        try {
            Document document = new Document();
            List<RFP> rfps = rfpRepository.findByClientClientIdAndRfpIdIn(clientId, rfpIds);

            // Same as rfp1.getRfpId().compareTo(rfp2.getRfpId()
            rfps.sort(comparing(RFP::getRfpId));

            PdfCopy copy = new PdfSmartCopy(document, resultingStream);
            document.open();

            addClientPage(copy, rfps, clientId);
            for(RFP rfp : rfps) {
                ByteArrayOutputStream r = generatePDF(clientId, rfp.getProduct(), false);
                if(r != null) {
                    PdfReader reader = new PdfReader(r.toByteArray());
                    copy.addDocument(reader);
                    reader.close();
                }
            }

            // add broker language to RFP.pdf
            Broker broker = getBrokerFromAuth();
            byte[] brokerLanguagePage = getBrokerLanguagePagePdf(broker);
            if (brokerLanguagePage.length > 0) {
                PdfReader reader = new PdfReader(brokerLanguagePage);
                copy.addDocument(reader);
                reader.close();
            }
            
            document.close();
        } catch(Exception e) {
            throw new BaseException(e.getMessage(), e);
        }

        return resultingStream;
    }

    protected void updateClientState(Client client) {
        client.setClientState(ClientState.RFP_SUBMITTED);
        clientRepository.save(client);
    }

    private void updateOptionsForRfp(RFP newRfp, List<Option> currentOptions) {
        Set<Long> currentIds = getOptionsIdSet(currentOptions);
        List<Option> newOptions =
            newRfp.getOptions() == null ? Collections.emptyList() : newRfp.getOptions();
        Set<Long> newIds = getOptionsIdSet(newOptions);

        Collection<Long> removedIds = CollectionUtils.subtract(currentIds, newIds);
        removedIds.forEach(id -> optionRepository.delete(id));

        for(Option o : newOptions) {
            if(o.getId() != null && !currentIds.contains(o.getId())) {
                throw new BadRequestException("RFP does not contain the requested option ID")
                    .withFields(
                        field("rfp_id", newRfp.getRfpId()),
                        field("option_id", o.getId())
                    );
            }

            o.setRfp(newRfp);
            optionRepository.save(o);
        }

    }

    private Set<Long> getCarriersIdSet(List<CarrierHistory> carrierHistoryList) {
        Set<Long> idSet = new HashSet<>();

        if(carrierHistoryList != null) {
            for(CarrierHistory o : carrierHistoryList) {
                idSet.add(o.getId());
            }
        }

        return idSet;
    }

    private void updateCarrierHistoryForRfp(RFP newRfp, List<CarrierHistory> dbHistoryList) {
        Set<Long> currentIds = getCarriersIdSet(dbHistoryList);
        List<CarrierHistory> newHistoryList =
            newRfp.getCarrierHistories() == null ? Collections.emptyList()
                : newRfp.getCarrierHistories();
        Set<Long> newIds = getCarriersIdSet(newHistoryList);

        Collection<Long> removedIds = CollectionUtils.subtract(currentIds, newIds);
        removedIds.forEach(id -> historyRepository.delete(id));

        for(CarrierHistory ch : newHistoryList) {
            if(ch.getId() != null && !currentIds.contains(ch.getId())) {
                throw new BadRequestException(
                    "RFP does not contain the requested carrier history ID")
                    .withFields(
                        field("rfp_id", newRfp.getRfpId()),
                        field("carrier_history_id", ch.getId())
                    );
            }

            ch.setRfp(newRfp);
            historyRepository.save(ch);
        }
    }

    private Set<Long> getOptionsIdSet(List<Option> optionList) {
        Set<Long> idSet = new HashSet<>();

        if(null != optionList) {
            for(Option o : optionList) {
                idSet.add(o.getId());
            }
        }

        return idSet;
    }

    private void updateAttributesForRfp(RFP newRfp, List<RFPAttribute> currentAttributes, Map<RFPAttributeName, String> newAttributes) {
        
        for (RFPAttribute current : currentAttributes) {
            String newValue = newAttributes.remove(current.getName());
            if (newValue == null) {
                // delete
                attributeRepository.delete(current);
            } else {
                if (!newValue.equals(current.getValue())){
                    // update value
                    current.setValue(newValue);
                }
                // to return value
                newRfp.getAttributes().add(current);
            }
        }

        // if something left in map
        newAttributes.forEach((attribute, value) ->
            newRfp.getAttributes().add(attributeRepository.save(new RFPAttribute(newRfp, attribute, value))));
        
    }

    
    public RfpDto getRfpForClientByType(Long id, String type) {
        final RFP rfp = rfpRepository.findByClientClientIdAndProduct(id, type);

        if(rfp == null) {
            throw new NotFoundException("RFP not found")
                .withFields(
                    field("rfp_id", id)
                );
        }

        return RfpMapper.rfpToDTO(rfp);
    }

    public boolean checkIfExist(Long id, String type) {
        final RFP rfp = rfpRepository.findByClientClientIdAndProduct(id, type);

        return rfp != null;
    }

    private void validateDtoBeforeCreation(RfpDto rfpDto) {
        if(rfpDto.getId() != null) {
            throw new BadRequestException("Cannot create RFP with non-null ID");
        }

        if(!RfpTypeValidator.checkType(rfpDto.getProduct())) {
            throw new BadRequestException("Invalid product type provided")
                .withFields(
                    field("product_type", rfpDto.getProduct())
                );
        }

        if(checkIfExist(rfpDto.getClientId(), rfpDto.getProduct())) {
            throw new BadRequestException(
                "Cannot create RFP as duplicate RFP with provided product type exists")
                .withFields(
                    field("product_type", rfpDto.getProduct()),
                    field("client_id", rfpDto.getClientId())
                );
        }
        validateRfpAttributes(rfpDto);
    }

}
