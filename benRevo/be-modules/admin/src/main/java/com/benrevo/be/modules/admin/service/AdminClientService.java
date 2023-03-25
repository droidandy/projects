package com.benrevo.be.modules.admin.service;

import com.benrevo.be.modules.client.service.ClientService;
import com.benrevo.be.modules.salesforce.dto.SFOpportunity;
import com.benrevo.be.modules.salesforce.event.SalesforceEvent;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.ClientDto;
import com.benrevo.common.dto.UpdateStatusDto;
import com.benrevo.common.enums.ClientState;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.common.logging.CustomLogger;
import com.benrevo.common.security.AuthenticatedUser;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientTeam;
import com.benrevo.data.persistence.entities.ExtClientAccess;
import com.benrevo.data.persistence.entities.Person;
import com.benrevo.data.persistence.mapper.ClientMapper;
import com.benrevo.data.persistence.repository.*;
import io.vavr.control.Try;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.benrevo.be.modules.salesforce.enums.OpportunityType.NewBusiness;
import static com.benrevo.be.modules.salesforce.enums.StageType.fromClientState;
import static com.benrevo.common.enums.CarrierType.carrierMatches;
import static com.benrevo.common.enums.CarrierType.fromStrings;
import static java.lang.String.format;
import static org.apache.commons.lang3.StringUtils.equalsIgnoreCase;

@Service
@Transactional
public class AdminClientService extends ClientService {

    @Autowired
    private CustomLogger logger;

    @Autowired
    private ApplicationEventPublisher publisher;

    @Autowired
    private ClientRepository clientRepository;
    
    @Autowired
    private BaseTimelineService timelineService;

    @Autowired
    private BrokerRepository brokerRepository;

    @Autowired
    private ExtClientAccessRepository extClientAccessRepository;

    @Autowired
    private ClientTeamRepository clientTeamRepository;

    @Autowired
    private ExtBrokerageAccessRepository extBrokerageAccessRepository;

    @Value("${app.carrier}")
    private String[] appCarrier;

    @Value("${app.env}")
    private String appEnv;

    private final String BENREVO_BROKER_GA_NAME = "Benrevo GA";

    public void delete(Long clientId){
        Client client = clientRepository.findOne(clientId);

        if(client != null){
            delete(client);
        }
    }

    public List<ClientDto> getClientsBenrevoHasAccessTo(){
        Broker benrevoGABroker = brokerRepository.findByName(BENREVO_BROKER_GA_NAME);
        if(benrevoGABroker == null){
            throw new NotFoundException(
                format(
                    "Benrevo broker not found; broker_name=%s",
                    BENREVO_BROKER_GA_NAME
                )
            );
        }

        try{
           List<Client> clients = extClientAccessRepository.findClientsByBrokerId(benrevoGABroker.getBrokerId());

            if(clients == null || clients.size() == 0) {
                throw new NotFoundException(
                    format(
                        "Client(s) not found; broker_id=%s",
                        benrevoGABroker.getBrokerId()
                    )
                );
            }

            return ClientMapper.clientsToDTOs(clients);
        } catch(NotFoundException e){
            return new ArrayList<>();
        }
    }

    private void validateClient(Long id, Client client) {
        if(client == null) {
            throw new NotFoundException(
                format(
                    "Client not found; client_id=%s",
                    id
                )
            );
        }
    }

    /* TODO use BaseSchedulerService after merge PR:
     * https://github.com/BenRevo/be-modules/pull/27/files#diff-99ee321ab26bdee4d848a2d193dcc416
     */
    @Scheduled(cron = "0 0 1 * * *", zone="America/Los_Angeles") // at 01:00:00 every day
    public void updateClientStateToClosed() {
        clientRepository.updateClientStateToClosed();
    }
    
    public void updateStatus(Long clientId, UpdateStatusDto updateStatusDto) {
        Client client = clientRepository.findOne(clientId);
        validateClient(clientId, client);
        validateStatus(updateStatusDto);
        validateClientStateMove(client, updateStatusDto);

        // if back to "presentation" (QUOTE) 
        ClientState currentClientState = client.getClientState();
        if(updateStatusDto.getClientState().equals(ClientState.QUOTED)
            && (currentClientState.equals(ClientState.PENDING_APPROVAL)
                || currentClientState.equals(ClientState.ON_BOARDING)
                || currentClientState.equals(ClientState.SOLD))) {
        	 client.setDateQuoteOptionSubmitted(null);
        	 
            if(carrierMatches(Constants.ANTHEM_CARRIER, appCarrier)) {
                timelineService.removeTimelinesByClientId(clientId);
            }
        }
        client.setClientState(updateStatusDto.getClientState());

        // Salesforce
        Try.run(
            () -> publisher.publishEvent(
                new SalesforceEvent.Builder()
                    .withObject(
                        new SFOpportunity.Builder()
                            .withBrokerageFirm(client.getBroker().getName())
                            .withName(client.getClientName())
                            .withCarrier(fromStrings(appCarrier))
                            .withTest(!equalsIgnoreCase(appEnv, "prod"))
                            .withType(NewBusiness)
                            .withStageName(fromClientState(client.getClientState()))
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

        clientRepository.save(client);
    }

    private void validateClientStateMove(Client client, UpdateStatusDto updateStatusDto) {
        ClientState currentClientState = client.getClientState();
        ClientState newClientState = updateStatusDto.getClientState();
        int order = newClientState.compareTo(currentClientState);
        if(order < 0){
            boolean isGoingFromPendingOrOnboardingOrSoldToQuoted = newClientState.equals(ClientState.QUOTED) && (Arrays.asList(ClientState.PENDING_APPROVAL,ClientState.ON_BOARDING,ClientState.SOLD).contains(currentClientState));
            boolean isGoingFromCloseToSold = currentClientState.equals(ClientState.CLOSED) && newClientState.equals(ClientState.SOLD);
            if (!isGoingFromPendingOrOnboardingOrSoldToQuoted && !isGoingFromCloseToSold){
                throw new BaseException(
                        format("Client State cannot be changed backwards. Contact Dev to help; from_client_state=%s, to_client_state=%s",
                                currentClientState,
                                newClientState
                        )
                );
            }
        }
    }

    private void validateStatus(UpdateStatusDto updateStatusDto) {
        if (updateStatusDto == null || updateStatusDto.getClientState() == null) {
            throw new NotFoundException("Client State not found");
        }
        boolean valid = false;
        for (ClientState state : ClientState.values() ){
            if(state.name().equalsIgnoreCase(updateStatusDto.getClientState().name())){
                valid = true;
            }
        }

        if(!valid){
            throw new NotFoundException(
                format("Client State not found; client_state=%s",
                    updateStatusDto.getClientState()
                )
            );
        }
    }

    public void moveClientFromOneBrokerageToAnother(Long fromBrokerId, Long toBrokerId,
        Long clientId) {


        Client client = clientRepository.findOne(clientId);
        if(client == null){
            throw new NotFoundException(
                format("Client not found; client_id=%s", clientId)
            );
        }

        Broker fromBroker = brokerRepository.findOne(fromBrokerId);
        if(fromBroker == null){
            throw new NotFoundException(
                format("Broker not found; fromBroker_id=%s", fromBroker)
            );
        }

        Broker toBroker = brokerRepository.findOne(toBrokerId);
        if(toBroker == null){
            throw new NotFoundException(
                format("Broker not found; toBroker_id=%s", toBroker)
            );
        }

        if(client.getBroker().getBrokerId() != fromBroker.getBrokerId()){
            throw new BaseException(format("Client's brokerId does not match fromBroker Id;"));
        }

        client.setBroker(toBroker);
        clientRepository.save(client);

        // delete the client team
        List<ClientTeam> clientTeams = clientTeamRepository.findByClientClientId(clientId);
        for(ClientTeam clientTeam : clientTeams){
            clientTeamRepository.delete(clientTeam);
        }

        // delete client access table should GA have access to client
        List<ExtClientAccess> extClientAccesses = extClientAccessRepository.
            findByClient(client);

        for(ExtClientAccess extClientAccess : extClientAccesses){
            extClientAccessRepository.delete(extClientAccess);
        }
    }

    public List<ClientDto> searchByClientName(String clientName) {
        if(StringUtils.isEmpty(clientName)){
            return new ArrayList<>();
        }
        List<Client> clients = clientRepository.findByClientNameIgnoreCaseContainingAndCarrierOwnedIsFalse(clientName);
        if(clients == null || clients.isEmpty()) {
            return new ArrayList<>();
        }
        return ClientMapper.clientsToDTOs(clients);
    }
}
