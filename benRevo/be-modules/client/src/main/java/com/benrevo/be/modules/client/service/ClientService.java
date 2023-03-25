package com.benrevo.be.modules.client.service;

import com.benrevo.be.modules.salesforce.dto.SFOpportunity;
import com.benrevo.be.modules.salesforce.enums.StageType;
import com.benrevo.be.modules.salesforce.event.SalesforceEvent;
import com.benrevo.be.modules.shared.access.BrokerageRole;
import com.benrevo.be.modules.shared.service.SharedClientService;
import com.benrevo.be.modules.shared.service.SharedFileService;
import com.benrevo.be.modules.shared.service.SharedPlanService;
import com.benrevo.be.modules.shared.service.SharedRfpService;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.*;
import com.benrevo.common.dto.QuoteOptionAltPlanDto.Benefit;
import com.benrevo.common.dto.QuoteOptionAltPlanDto.Rx;
import com.benrevo.common.dto.ancillary.AncillaryPlanDto;
import com.benrevo.common.enums.AttributeName;
import com.benrevo.common.enums.ClientState;
import com.benrevo.common.exception.BadRequestException;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.NotAuthorizedException;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.common.logging.CustomLogger;
import com.benrevo.common.security.AuthenticatedUser;
import com.benrevo.data.persistence.entities.*;
import com.benrevo.data.persistence.entities.ancillary.RfpToAncillaryPlan;
import com.benrevo.data.persistence.mapper.ClientMapper;
import com.benrevo.data.persistence.mapper.OptionMapper;
import com.benrevo.data.persistence.mapper.RfpMapper;
import com.benrevo.data.persistence.repository.*;
import com.benrevo.data.persistence.repository.ancillary.RfpToAncillaryPlanRepository;
import io.vavr.control.Try;

import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.*;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.oxm.XmlMappingException;
import org.springframework.oxm.jaxb.Jaxb2Marshaller;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.benrevo.be.modules.salesforce.enums.OpportunityType.NewBusiness;
import static com.benrevo.be.modules.salesforce.enums.StageType.fromClientState;
import static com.benrevo.common.enums.AttributeName.CLSA_AVG_AGE;
import static com.benrevo.common.enums.AttributeName.CLSA_NUM_ELIGIBLE;
import static com.benrevo.common.enums.AttributeName.CLSA_ZIP_CODE;
import static com.benrevo.common.enums.AttributeName.TOP_CLIENT;
import static com.benrevo.common.enums.CarrierType.fromStrings;
import static com.benrevo.common.enums.ClientState.RFP_STARTED;
import static com.benrevo.common.util.MapBuilder.field;
import static java.lang.String.format;
import static java.util.Objects.isNull;
import static java.util.Optional.ofNullable;
import static java.util.function.Function.identity;
import static org.apache.commons.lang3.StringUtils.equalsAny;
import static org.apache.commons.lang3.StringUtils.equalsIgnoreCase;


@Service
@Transactional
public class ClientService extends SharedClientService{

    @Autowired
    private CustomLogger logger;

    @Autowired
    private ApplicationEventPublisher publisher;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private Jaxb2Marshaller jaxb2Marshaller;

    @Autowired
    private SharedRfpService sharedRfpService;

    @Autowired
    private SharedPlanService sharedPlanService;

    @Autowired
    private BrokerRepository brokerRepository;

    @Autowired
    private NetworkRepository networkRepository;

    @Autowired
    private OptionRepository optionRepository;

    @Autowired
    private CarrierRepository carrierRepository;

    @Autowired
    private CarrierHistoryRepository historyRepository;

    @Autowired
    private SharedFileService sharedFileService;

    @Autowired
    private ClientExtProductRepository clientExtProductRepository;

    @Autowired
    private ClientRfpProductRepository clientRfpProductRepository;

    @Autowired
    private ExtProductRepository extProductRepository;

    @Autowired
    private AttributeRepository attributeRepository;

    @Autowired
    private ExtClientAccessRepository extClientAccessRepository;

    @Autowired
    private ExtBrokerageAccessRepository extBrokerageAccessRepository;

    @Autowired
    private ClientTeamRepository clientTeamRepository;

    @Autowired
    private ClientMemberService clientMemberService;

    @Autowired
    private SharedClientService sharedClientService;
    
    @Autowired
    private RfpToAncillaryPlanRepository rfpToAncillaryPlanRepository; 

    @Value("${app.carrier}")
    String[] appCarrier;

    @Value("${app.env}")
    private String appEnv;

    public List<OnBoardingClientDto> getOnBoardingClients() {
        Carrier carrier = carrierRepository.findByName(appCarrier[0]);
        // see calculations and mapping in query
        List<OnBoardingClientDto> result =
            clientRepository.findOnBoardingClients(carrier.getCarrierId(),
                Constants.IMPLEMENTATION_MANAGER_ACCESSIBLE_CLIENT_STATES
            );
        // completedDate actual only for all completed timelines
        result.forEach(c -> {
            if(c.getProgressPercent() == null || c.getProgressPercent() != 100) {
                c.setCompletedDate(null);
            }
        });
        return result;
    }

    public List<ClientDto> getClientsByBrokerId(Long brokerId) {

        Broker broker = brokerRepository.findOne(brokerId);
        if(broker == null) {
            throw new NotAuthorizedException().withFields(field("broker_id", brokerId));
        }

        List<Client> clients;
        if(!broker.isGeneralAgent()) {
            // broker
            clients = clientRepository.findByBrokerBrokerIdAndCarrierOwnedIsFalse(brokerId);
        } else {
            // general agent
            AuthenticatedUser currentUser =
                (AuthenticatedUser) SecurityContextHolder.getContext().getAuthentication();
            if(BrokerageRole.FULL_CLIENT_ACCESS.getValue().equals(currentUser.getBrokerRole())) {
                clients = extClientAccessRepository.findClientsByBrokerId(brokerId);

                // filter: return clients GA has access to
                clients = clients.stream()
                    .filter(c -> extBrokerageAccessRepository
                        .findByExtBrokerIdAndBrokerId(brokerId, c.getBroker().getBrokerId()) != null)
                    .collect(Collectors.toList());
            } else {
                clients = clientTeamRepository.findClientsByAuthId(currentUser.getName());
            }

        }

        if(clients == null) {
            throw new NotFoundException("Client(s) not found").withFields(
                field("broker_id", brokerId));
        }

        if(clients.isEmpty()){
            return new ArrayList<ClientDto>();
        }

        sharedClientService.filterClientClientTeamByBrokerId(clients, brokerId);

        List<ClientDto> result = ClientMapper.clientsToDTOs(clients);
        for(ClientDto clientDto : result) {
            clientDto.setRfpProducts(sharedClientService.getRfpProducts(clientDto.getId()));
        }

        return result;
    }

    public ClientDto create(ClientDto clientDto, Long brokerId, boolean carrierOwned) {
        Long extBrokerId;
        if(clientDto.getId() != null) {
            throw new BadRequestException("Cannot create client if ID is non-null");
        }

        if(clientDto.getClientName() == null) {
            throw new BadRequestException("Client name is required");
        }

        Broker broker = brokerRepository.findOne(brokerId);
        if(broker == null) {
            throw new NotAuthorizedException().withFields(field("broker_id", brokerId));
        }

        if(!broker.isGeneralAgent()) {
            // broker
            clientDto.setBrokerId(brokerId);
        } else {
            // general agent
            brokerId = clientDto.getBrokerId();
            extBrokerId = broker.getBrokerId();
            if(brokerId == null) {
                throw new BadRequestException("BrokerId is required");
            }
            // check if general agent has access to broker
            ExtBrokerageAccess extBrokerageAccess =
                extBrokerageAccessRepository.findByExtBrokerIdAndBrokerId(extBrokerId, brokerId);
            if(extBrokerageAccess == null) {
                throw new NotAuthorizedException().withFields(field("ext_broker_id", extBrokerId),
                    field("broker_id", brokerId)
                );
            }
        }

        Client client = ClientMapper.dtoToClient(clientDto);
        client.setClientState(isNull(clientDto.getClientState()) ? RFP_STARTED : clientDto.getClientState());
        client.setCarrierOwned(carrierOwned);
        String uuid = UUID.randomUUID().toString().toLowerCase();
        client.setClientToken(uuid);

        client = clientRepository.save(client);

        if(broker.isGeneralAgent()) {
            // save client to general agent
            extClientAccessRepository.save(new ExtClientAccess(broker, client));
        }

        ClientDto result = ClientMapper.clientToDTO(client);

        List<ExtProductDto> rfpProducts;
        if(clientDto.getRfpProducts() == null || clientDto.getRfpProducts().isEmpty()) {
            rfpProducts = createClientDefaultRfpProducts(client.getClientId());
        } else {
            rfpProducts = updateClientRfpProducts(client.getClientId(), clientDto.getRfpProducts());
        }
        result.setRfpProducts(rfpProducts);
        
        result.setExtProducts(updateClientExtProducts(client.getClientId(), clientDto.getExtProducts()));        

        if (!carrierOwned) {
            // add current user to client team
            clientMemberService.addCurrentUserToClientTeam(client, broker);

            // Salesforce
            final Client finalClient = client;
    
            Try.run(
                () -> publisher.publishEvent(
                    new SalesforceEvent.Builder()
                        .withObject(
                            new SFOpportunity.Builder()
                                .withBrokerageFirm(broker.getName())
                                .withName(finalClient.getClientName())
                                .withCarrier(fromStrings(appCarrier))
                                .withTest(!equalsIgnoreCase(appEnv, "prod"))
                                .withCarrierContact(broker.getSalesEmail())
                                .withEffectiveDate(finalClient.getEffectiveDate())
                                .withCloseDate(finalClient.getDueDate())
                                .withType(NewBusiness)
                                .withStageName(fromClientState(finalClient.getClientState()))
                                .build()
                        ).build()
                )
            ).onFailure(t -> logger.error(t.getMessage(), t));
        }

        return result;
    }
    
    public void updateClientState(Long id, ClientState state) {
        Client client = clientRepository.findOne(id);
        if(client == null) {
            throw new NotFoundException(format("Client not found; client_id=%s", id));
        }
        client.setClientState(state);
        clientRepository.save(client);
    }

    public ClientDto update(ClientDto clientDto) {
        final Client client = clientRepository.findOne(clientDto.getId());

        if(client == null) {
            throw new NotFoundException("Client not found").withFields(
                field("client_id", clientDto.getId()));
        }

        Client newClient = ClientMapper.dtoToClient(clientDto);

        // Salesforce
        Client finalNewClient = newClient;
        Try.run(
            () -> publisher.publishEvent(
                new SalesforceEvent.Builder()
                    .withObject(
                        new SFOpportunity.Builder()
                            .withBrokerageFirm(client.getBroker().getName())
                            .withCurrentName(client.getClientName())
                            .withName(finalNewClient.getClientName())
                            .withCarrier(fromStrings(appCarrier))
                            .withTest(!equalsIgnoreCase(appEnv, "prod"))
                            .withEligibleEmployees(client.getEligibleEmployees())
                            .withParticipatingEmployees(client.getParticipatingEmployees())
                            .withStageName(StageType.fromClientState(client.getClientState()))
                            .withType(NewBusiness)
                            .withEffectiveDate(client.getEffectiveDate())
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

        newClient.setClientId(client.getClientId());
        newClient.setClientState(client.getClientState());
        newClient.setAttributes(client.getAttributes());
        newClient = clientRepository.save(newClient);

        ClientDto result = ClientMapper.clientToDTO(newClient);
        result.setRfpProducts(
            updateClientRfpProducts(newClient.getClientId(), clientDto.getRfpProducts()));

        result.setExtProducts(
            updateClientExtProducts(newClient.getClientId(), clientDto.getExtProducts()));
        
        return result;
    }

    private String restoreValue(String value, String format) {
        if("DOLLAR".equals(format)) {
            return "$" + value;
        } else if("PERCENT".equals(format)) {
            return value + "%";
        } else if("MULTIPLE".equals(format)) {
            return value + "x";
        }
        return value;
    }

    public byte[] exportToXML(Long id) {

        ClientDto clientDto = sharedClientService.getById(id);

        List<RfpDto> rfps = sharedRfpService.getByClientId(id);
        for(RfpDto rfp : rfps) {
            List<CreatePlanDto> plans = sharedPlanService.getByRfpId(rfp.getId());
            for(CreatePlanDto plan : plans) {
                Network network = networkRepository.findOne(plan.getRfpQuoteNetworkId());
                plan.setNetworkName(network.getName());
                plan.setNetworkType(network.getType());
                plan.setCarrierName(network.getCarrier().getName());
                // restore benefit values
                for(Benefit benefit : plan.getBenefits()) {
                    if(benefit.value != null) {
                        benefit.value = restoreValue(benefit.value, benefit.type);
                        benefit.type = null; // do not serialize
                    }
                    if(benefit.valueIn != null) {
                        benefit.valueIn = restoreValue(benefit.valueIn, benefit.typeIn);
                        benefit.typeIn = null; // do not serialize

                    }
                    if(benefit.valueOut != null) {
                        benefit.valueOut = restoreValue(benefit.valueOut, benefit.typeOut);
                        benefit.typeOut = null; // do not serialize
                    }
                    benefit.name = null;
                }
                for(Rx rx : plan.getRx()) {
                    if(rx.value != null) {
                        rx.value = restoreValue(rx.value, rx.type);
                        rx.type = null; // do not serialize
                    }
                    rx.name = null;
                }
            }

            for(OptionDto option : rfp.getOptions()) {
                option.setPlans(new ArrayList<CreatePlanDto>());
                // find plan to bind option with
                for(CreatePlanDto plan : plans) {
                    if(option.getId().equals(plan.getOptionId())) {
                        option.getPlans().add(plan);
                    }
                }
            }
            
            List<RfpToAncillaryPlan> ancPlans = rfpToAncillaryPlanRepository.findByRfp_RfpId(rfp.getId());
            if(!ancPlans.isEmpty()) {
                List<AncillaryPlanDto> rfpPlans = new ArrayList<>();
                for(RfpToAncillaryPlan r2ap : ancPlans) {
                    rfpPlans.add(RfpMapper.rfpPlanToRfpPlanDto(r2ap.getAncillaryPlan()));
                }
                rfp.setAncillaryPlans(rfpPlans);
            }
        }

        clientDto.setRfps(rfps);

        List<ExtProductDto> extProducts = getExtProducts(id);
        clientDto.setExtProducts(extProducts);

        ByteArrayOutputStream outStream = new ByteArrayOutputStream();
        try {
            jaxb2Marshaller.marshal(clientDto, new StreamResult(outStream));
        } catch(XmlMappingException e) {
            throw new BaseException("Error generate XML", e);
        }

        return outStream.toByteArray();
    }

    public ClientDto importFromXML(
        byte[] input, String clientName, Long currentBrokerId, boolean overWrite,
        Long wantedBrokerId
    ) {

        ClientDto clientDto = null;
        try {
            clientDto = (ClientDto) jaxb2Marshaller.unmarshal(
                new StreamSource(new ByteArrayInputStream(input)));
        } catch(XmlMappingException e) {
            throw new BaseException("Error parse XML", e);
        }

        if(clientDto == null) {
            throw new BaseException("Error parse XML: not clientDto");
        }

        if(clientName != null && clientName.length() != 0) {
            // replace with a new clientName
            clientDto.setClientName(clientName);
        }

        Long brokerId = currentBrokerId;
        Broker currentBroker = brokerRepository.findOne(currentBrokerId);
        if(currentBroker.isGeneralAgent()) {
            if(wantedBrokerId == null) {
                throw new BaseException("BrokerId needed");
            }
            brokerId = wantedBrokerId;
            clientDto.setBrokerId(wantedBrokerId);
        }

        List<Client> client =
            clientRepository.findByClientNameAndBrokerBrokerIdAndCarrierOwned(
                clientDto.getClientName(), brokerId, false);
        if(!client.isEmpty()) {
            if(overWrite) {
                if(currentBroker.isGeneralAgent()) {
                    ExtClientAccess clientAccess =
                        extClientAccessRepository.findDistinctFirstByClientClientIdAndExtBrokerBrokerId(
                            client.get(0).getClientId(), currentBrokerId);
                    if(clientAccess != null) {
                        extClientAccessRepository.delete(clientAccess);
                    } else {
                        throw new NotAuthorizedException().withFields(
                            field("ext_broker_id", currentBrokerId),
                            field("client_id", client.get(0).getClientId())
                        );
                    }
                }
                delete(client.get(0));
            } else {
                ClientDto existClientDto = new ClientDto();
                existClientDto.setClientName(clientDto.getClientName());
                existClientDto.setClientState(client.get(0).getClientState());
                return existClientDto;
            }
            //throw new BaseException(String.format("Client with name '%s' exists", clientDto.getClientName()));
        }

        ClientDto newClientDto = create(clientDto, currentBrokerId, false);
        clientDto.setId(newClientDto.getId()); // for output
        clientDto.setClientState(newClientDto.getClientState());

        List<RfpDto> rfps = clientDto.getRfps();

        if(rfps != null) {
            for(RfpDto rfp : rfps) {
                List<OptionDto> optionDtos = rfp.getOptions();
                // prevent auto creation (disable cascading), we need option_id to bind with plans
                rfp.setOptions(null);
                rfp.setClientId(newClientDto.getId());
                RfpDto newRfp = sharedRfpService.create(rfp);
                rfp.setId(newRfp.getId()); // for output
                if(optionDtos != null) {
                    rfp.setOptions(optionDtos);
                    for(OptionDto optionDto : optionDtos) {
                        optionDto.setRfpId(newRfp.getId());
                        Option option = OptionMapper.dtoToOption(optionDto);
                        Option newOption = optionRepository.save(option);
                        optionDto.setId(newOption.getId()); // for output
                        List<CreatePlanDto> planDtos = optionDto.getPlans();
                        if(planDtos != null) {
                            for(CreatePlanDto planDto : planDtos) {
                                planDto.setOptionId(newOption.getId());
                            }
                            sharedPlanService.exportInRfp(planDtos, newRfp.getId());
                        }
                    }
                }
                if(rfp.getAncillaryPlans() != null) {
                   sharedPlanService.exportAncillaryInRfp(rfp.getAncillaryPlans(), newRfp.getId());   
                }
            }
        }

        //Client c = clientRepository.findOne(clientDto.getId());

        return clientDto;
    }

    public void delete(Client client) {

        if((client.getClientState() != null) && (!RFP_STARTED
            .equals(client.getClientState()))) {
            throw new BaseException(
                "Client has passed RFP_STARTED state=" + client.getClientState());
        }

        List<RfpDto> rfpDtos = sharedRfpService.getByClientId(client.getClientId());
        for(RfpDto rfpDto : rfpDtos) {
            sharedPlanService.deleteByRfpId(client, rfpDto.getId());
            if(rfpDto.getOptions() != null) {
                for(OptionDto option : rfpDto.getOptions()) {
                    optionRepository.delete(option.getId());
                }
            }
            if(rfpDto.getCarrierHistories() != null) {
                for(CarrierHistoryDto ch : rfpDto.getCarrierHistories()) {
                    historyRepository.delete(ch.getId());
                }
            }
            List<ClientFileUpload> fileList = sharedFileService.getClientFilesByRfpId(rfpDto.getId());
            for(ClientFileUpload file : fileList) {
                sharedFileService.markDeleted(file.getClientFileUploadId());
            }
            sharedRfpService.delete(rfpDto.getId());
        }

        List<ClientExtProduct> clientProducts =
            clientExtProductRepository.findByClientId(client.getClientId());
        if(!clientProducts.isEmpty()) {
            clientExtProductRepository.deleteInBatch(clientProducts);
        }

        List<ClientRfpProduct> rfpProducts =
            clientRfpProductRepository.findByClientId(client.getClientId());
        if(!rfpProducts.isEmpty()) {
            clientRfpProductRepository.delete(rfpProducts);
        }

        clientRepository.delete(client);
    }

    public void archive(Long clientId) {
        setArchivedFlag(clientId, true);
    }

    public void unarchive(Long clientId) {
        setArchivedFlag(clientId, false);
    }

    private List<ExtProductDto> updateClientExtProducts(Long clientId, List<ExtProductDto> externalProducts) {
        if (externalProducts == null || externalProducts.isEmpty()) {
            return externalProducts;
        }
        List<String> strList = externalProducts.stream().map(e -> e.getName()).collect(Collectors.toList());
        return setExternalProducts(clientId, strList);
    }
    
    public List<ExtProductDto> setExternalProducts(Long clientId, List<String> externalProducts) {
        List<ClientExtProduct> products = clientExtProductRepository.findByClientId(clientId);
        if(!products.isEmpty()) {
            // remove old selected client products
            clientExtProductRepository.delete(products);
            clientExtProductRepository.flush();
        }
        if(externalProducts.isEmpty()) {
            return Collections.emptyList();
        }
        List<ExtProduct> allProducts = (List<ExtProduct>) extProductRepository.findAll();
        Map<String, ExtProduct> extProductByName =
            allProducts.stream().collect(Collectors.toMap(p -> p.getName(), identity()));
        products = new ArrayList<>();
        for(String extProduct : externalProducts) {
            ExtProduct ep = extProductByName.get(extProduct);
            if(ep == null) {
                throw new BadRequestException("Incorrect ExtProduct name").withFields(
                    field("name", ep));
            }
            products.add(new ClientExtProduct(clientId, ep));
        }
        products = clientExtProductRepository.save(products);
        
        List<ExtProductDto> result = new ArrayList<>();
        for(ClientExtProduct clExtProduct : products) {
            ExtProduct ep = clExtProduct.getExtProduct();
            result.add(new ExtProductDto(ep.getExtProductId(), ep.getName(), ep.getDisplayName(),
                false /* virginGroup not supported by ClientExtProduct */
            ));
        }
        return result;
    }

    private List<ExtProductDto> mapToExtProductDto(List<ClientRfpProduct> clientProducts) {
        List<ExtProductDto> result = new ArrayList<>();
        for(ClientRfpProduct clRfpProduct : clientProducts) {
            ExtProduct ep = clRfpProduct.getExtProduct();
            result.add(new ExtProductDto(ep.getExtProductId(), ep.getName(), ep.getDisplayName(),
                clRfpProduct.isVirginGroup()
            ));
        }
        return result;
    }

    private List<ExtProductDto> createClientDefaultRfpProducts(Long clientId) {
        List<ExtProduct> allProducts = (List<ExtProduct>) extProductRepository.findAll();
        List<ClientRfpProduct> products = new ArrayList<>();
        for(ExtProduct ep : allProducts) {
            products.add(new ClientRfpProduct(clientId, ep, false));
        }
        products = clientRfpProductRepository.save(products);
        return mapToExtProductDto(products);
    }

    private List<ExtProductDto> updateClientRfpProducts(
        Long clientId, List<ExtProductDto> rfpProducts
    ) {
        List<ClientRfpProduct> products = clientRfpProductRepository.findByClientId(clientId);
        if(!products.isEmpty()) {
            // remove old selected client products
            clientRfpProductRepository.delete(products);
            clientRfpProductRepository.flush();
        }
        if(rfpProducts == null || rfpProducts.isEmpty()) {
            return rfpProducts;
        }
        List<ExtProduct> allProducts = (List<ExtProduct>) extProductRepository.findAll();
        Map<String, ExtProduct> extProductByName =
            allProducts.stream().collect(Collectors.toMap(p -> p.getName(), identity()));
        products = new ArrayList<>();
        for(ExtProductDto dto : rfpProducts) {
            ExtProduct ep = extProductByName.get(dto.getName());
            if(ep == null) {
                throw new BadRequestException("Incorrect ExtProduct name").withFields(
                    field("name", ep));
            }
            products.add(new ClientRfpProduct(clientId, ep, dto.isVirginGroup()));
        }
        products = clientRfpProductRepository.save(products);
        return mapToExtProductDto(products);
    }

    private void setArchivedFlag(Long clientId, boolean archived) {
        Optional<Client> optionalClient = ofNullable(clientRepository.findOne(clientId));
        Client client = optionalClient.orElseThrow(() -> new NotFoundException(
            String.format("Could not find client by client_id = %s", clientId)));
        client.setArchived(archived);
        clientRepository.save(client);
    }

    public void setAttribute(Client client, AttributeName name) {

        if(findAttributeByName(client, name) != null) {
            // already exists
            return;
        }

        attributeRepository.save(new ClientAttribute(client, name));

    }

    private ClientAttribute findAttributeByName(Client client, AttributeName name) {

        return client.
            getAttributes().
            stream().
            filter(a -> a.getName().equals(name)).
            findFirst().
            orElse(null);

    }

    public void removeAttributes(Long clientId, List<AttributeDto> attributes) {
        ofNullable(clientRepository.findOne(clientId)).orElseThrow(() ->
            new BaseException(String.format("Could not find client by client_id = %s", clientId)));
        for (AttributeDto attributeDto : attributes) {
            if (AttributeName.TOP_CLIENT.equals(attributeDto.getAttributeName())) {
                ClientAttribute attribute = attributeRepository.findClientAttributeByClientIdAndName(clientId, attributeDto.getAttributeName());
                if(attribute != null){
                    attributeRepository.delete(attribute);
                }
            }
        }
    }

    public List<AttributeDto> getClientAttributes(Long clientId) {
        Client client = clientRepository.findOne(clientId);
        if(client == null) {
            throw new NotFoundException("Client not found").withFields(field("client_id", clientId));
        }

        List<AttributeDto> result = new ArrayList<>();
        client.getAttributes().forEach(attr -> {
            AttributeDto q = new AttributeDto(attr.getName(), attr.getValue());
            result.add(q);
        });
        return result;
    }

    public void saveAttributes(Long clientId, List<AttributeDto> dtos) {
        Client client = ofNullable(clientRepository.findOne(clientId)).orElseThrow(() ->
            new BaseException(String.format("Could not find client by client_id = %s", clientId)));
        for (AttributeDto attributeDto : dtos) {
            if (equalsAny(attributeDto.getAttributeName().name(), CLSA_ZIP_CODE.name(),
                CLSA_AVG_AGE.name(), CLSA_NUM_ELIGIBLE.name(), TOP_CLIENT.name())) {
                ClientAttribute attribute = attributeRepository.findClientAttributeByClientIdAndName(clientId, attributeDto.getAttributeName());
                if(attribute == null){
                    attributeRepository.save(new ClientAttribute(client, attributeDto.getAttributeName(), attributeDto.getValue()));
                } else {
                    attribute.setValue(attributeDto.getValue());
                    attributeRepository.save(attribute);
                }
            }
        }
    }
}
