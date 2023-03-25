package com.benrevo.be.modules.shared.access;

import com.benrevo.be.modules.shared.service.Auth0Service;
import com.benrevo.be.modules.shared.service.SharedCarrierService;
import com.benrevo.common.enums.PersonType;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.NotAuthorizedException;
import com.benrevo.common.security.AuthenticatedUser;
import com.benrevo.data.persistence.entities.*;
import com.benrevo.data.persistence.repository.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.benrevo.be.modules.shared.access.AccountRole.*;
import static com.benrevo.common.Constants.IMPLEMENTATION_MANAGER_ACCESSIBLE_CLIENT_STATES;
import static com.benrevo.common.util.MapBuilder.field;
import static org.apache.http.HttpStatus.SC_FORBIDDEN;

@Service
@Transactional
public class CheckAccess {
    
    public static final AccountRole[] CLIENT_MODULE_ACCESS_ROLES = new AccountRole[] {
        ADMINISTRATOR, USER, BROKER, CARRIER_MANAGER, CARRIER_MANAGER_RENEWAL,
        CARRIER_SALES, CARRIER_SALES_RENEWAL, CARRIER_PRESALE, IMPLEMENTATION_MANAGER
    };
    public static final AccountRole[] RFP_MODULE_ACCESS_ROLES = new AccountRole[] {
        ADMINISTRATOR, USER, BROKER, CARRIER_MANAGER, CARRIER_MANAGER_RENEWAL, CARRIER_SALES,
        CARRIER_SALES_RENEWAL, CARRIER_PRESALE
    };
    public static final AccountRole[] PRESENTATION_MODULE_ACCESS_ROLES = new AccountRole[] {
        ADMINISTRATOR, USER, BROKER, CLIENT, CARRIER_MANAGER, CARRIER_MANAGER_RENEWAL,
        CARRIER_SALES, CARRIER_SALES_RENEWAL, CARRIER_PRESALE
    };
    public static final AccountRole[] ADMIN_MODULE_ACCESS_ROLES = new AccountRole[] {
        ADMINISTRATOR, CARRIER_MANAGER, CARRIER_MANAGER_RENEWAL, CARRIER_SALES,
        CARRIER_SALES_RENEWAL, CARRIER_PRESALE
    };
    public static final AccountRole[] ONBOARDING_MODULE_ACCESS_ROLES = new AccountRole[] {
        ADMINISTRATOR, USER, BROKER, CLIENT, IMPLEMENTATION_MANAGER
    };

    @Autowired
    private ClientRepository clientRepository; 
    
    @Autowired
    private BrokerRepository brokerRepository;

    @Autowired
    private ExtBrokerageAccessRepository extBrokerageAccessRepository;

    @Autowired
    private ExtClientAccessRepository extClientAccessRepository;

    @Autowired
    private ClientTeamRepository clientTeamRepository;
    
    @Autowired
    private PersonRelationRepository personRelationRepository;
    
    @Autowired
    private PersonRepository personRepository;
    
    @Autowired
    private SharedCarrierService sharedCarrierService;
    
    @Autowired
    private BrokerProgramAccessRepository brokerProgramAccessRepository;

    @Autowired
    private Auth0Service auth0Service;
    
    public boolean hasRole(AccountRole... roles) {
        AuthenticatedUser currentUser = (AuthenticatedUser) SecurityContextHolder.getContext().getAuthentication();
        if(currentUser.getRoles().isEmpty()) {
            // roles - required account attribute
            // if account has no any role - deny access
            return false;
        }
        if(roles.length == 0) {
            // no special roles on module/API
            return true;
        }
        for(AccountRole role : roles) {
            if(currentUser.getRoles().contains(role.getValue())) {
                return true;
            }
        }
        return false;
    }
    
    public boolean checkImplManagerAccess(Long clientId) {
        AuthenticatedUser currentUser = (AuthenticatedUser) SecurityContextHolder.getContext().getAuthentication();
        Long currentBrokerId = (Long) currentUser.getDetails();
        Client client = clientRepository.findOne(clientId);
        if(currentUser.getRoles().contains(IMPLEMENTATION_MANAGER.getValue())) {
            if(!IMPLEMENTATION_MANAGER_ACCESSIBLE_CLIENT_STATES.contains(client.getClientState())) {
                return false;
            }
        } else if(!currentBrokerId.equals(client.getBroker().getBrokerId())) {
            return false;
        }
        return true;
    }

    public boolean checkBrokerage(Long clientId, AccountRole... roles) {
        
        // always check roles
        if(!hasRole(roles)) {
            return false;
        }
        
        AuthenticatedUser currentUser = (AuthenticatedUser) SecurityContextHolder.getContext().getAuthentication();

        if (BrokerageRole.SUPERADMIN.getValue().equals(currentUser.getBrokerRole()) 
                || currentUser.getRoles().contains(CARRIER_MANAGER.getValue())
                || currentUser.getRoles().contains(CARRIER_MANAGER_RENEWAL.getValue())
                || currentUser.getRoles().contains(CARRIER_SALES.getValue())
                || currentUser.getRoles().contains(CARRIER_SALES_RENEWAL.getValue())
                || currentUser.getRoles().contains(CARRIER_PRESALE.getValue())) {
            // skip brokerage check for superadmin and carrier rep (carrier_manager/carrier_sales/carrier_presale)
            return true;
        }
        
        if(clientId == null) {
            throw new IllegalArgumentException("ClientId not found");
        }
        Client client = clientRepository.findOne(clientId);
        if(client == null) {
            throw new BaseException("Client not found by id").withFields(field("client_id", clientId));
        }
       
        Long currentBrokerId = (Long) currentUser.getDetails();
        Broker currentBroker = brokerRepository.findOne(currentBrokerId);

        if(currentBroker == null) {
            throw new NotAuthorizedException("Forbidden", SC_FORBIDDEN)
                .withFields(field("broker_id", currentBrokerId));
        }

        if(!currentBroker.isGeneralAgent()) {
            // broker
            if(!currentBrokerId.equals(client.getBroker().getBrokerId())) {
                throw new NotAuthorizedException("Forbidden", SC_FORBIDDEN);
            }
        } else {
            // agent
            ExtBrokerageAccess extBrokerageAccess = extBrokerageAccessRepository
                .findByExtBrokerIdAndBrokerId(currentBrokerId, client.getBroker().getBrokerId());

            // agent has broker access
            if(extBrokerageAccess == null) {
                throw new NotAuthorizedException("Forbidden", SC_FORBIDDEN)
                    .withFields(field("ext_broker_id", currentBrokerId), field("broker_id", client.getBroker().getBrokerId()));
            }

            ExtClientAccess extClientAccess = extClientAccessRepository.findDistinctFirstByClientClientIdAndExtBrokerBrokerId(clientId, currentBrokerId);

            // agent has client access inside of broker
            if(extClientAccess == null) {
                throw new NotAuthorizedException("Forbidden", SC_FORBIDDEN)
                    .withFields(field("client_id", clientId), field("ext_broker_id", currentBrokerId), field("broker_id", client.getBroker().getBrokerId()));
            }

            // if user doesn't have full access, check client team
            if(!BrokerageRole.FULL_CLIENT_ACCESS.getValue().equals(currentUser.getBrokerRole())) {
                if(!clientTeamRepository.existsByClientClientIdAndAuthId(clientId, currentUser.getName())) {
                    throw new NotAuthorizedException("Forbidden", SC_FORBIDDEN)
                        .withFields(field("client_id", clientId), field("auth_id", currentUser.getName()));
                }
            }
        }
        return true;
    }
    
    public boolean isBrokerageRestrictedByRole() {
        AuthenticatedUser currentUser = (AuthenticatedUser) SecurityContextHolder.getContext().getAuthentication();
        return (currentUser.getRoles().contains(CARRIER_MANAGER.getValue())
            || currentUser.getRoles().contains(CARRIER_MANAGER_RENEWAL.getValue())
            || currentUser.getRoles().contains(CARRIER_SALES.getValue())
            || currentUser.getRoles().contains(CARRIER_SALES_RENEWAL.getValue())
            || currentUser.getRoles().contains(CARRIER_PRESALE.getValue())
        );
    }
    
    public List<Program> findAvailablePrograms(String programName) {
        Long brokerId = (Long) SecurityContextHolder.getContext().getAuthentication().getDetails();
        Broker loggedInBroker = brokerRepository.findOne(brokerId);
        List<Program> availablePrograms = brokerProgramAccessRepository.findProgramsByBrokerId(loggedInBroker.getBrokerId());
        if(programName == null) {
            return availablePrograms;
        } else {
            return availablePrograms.stream()
                .filter(p -> p.getName().equals(programName))
                .collect(Collectors.toList());
        }
    }
    
    public List<Broker> findAvailableBrokers() {
        AuthenticatedUser currentUser = (AuthenticatedUser) SecurityContextHolder.getContext().getAuthentication();
        List<Broker> availableBrokers = new ArrayList<>();
        String userEmail = auth0Service.getUserEmail(currentUser.getName());
        
        if(currentUser.getRoles().contains(CARRIER_MANAGER.getValue()) || currentUser.getRoles().contains(CARRIER_MANAGER_RENEWAL.getValue())) {
            Carrier current = sharedCarrierService.getCurrentEnvCarrier();
            Person carrierManager = personRepository.findByCarrierIdAndTypeAndEmail(current.getCarrierId(), PersonType.CARRIER_MANAGER, userEmail);

            if(carrierManager == null) {
                carrierManager = personRepository.findByCarrierIdAndTypeAndEmail(current.getCarrierId(), PersonType.CARRIER_MANAGER_RENEWAL, userEmail);

                if(carrierManager == null) {
                    // TODO return empty list instead of exception?
                    throw new BaseException("Cannot find carrier manager or carrier manager renewal person")
                        .withFields(field(
                            "email",
                            userEmail
                        ));
                }
            }

            List<Person> childPersons = personRelationRepository.findChildren(carrierManager.getPersonId());

            childPersons.forEach(p -> {
                switch(p.getType()) {
                    case PRESALES:
                    case SALES:
                    case SALES_RENEWAL:
                        availableBrokers.addAll(brokerRepository.findByPerson(p.getPersonId()));
                }
            });
        }

        if(currentUser.getRoles().contains(CARRIER_SALES.getValue()) || currentUser.getRoles().contains(CARRIER_SALES_RENEWAL.getValue())) {
            availableBrokers.addAll(brokerRepository.findBySales_EmailIgnoreCase(userEmail));
        }

        if(currentUser.getRoles().contains(CARRIER_PRESALE.getValue())) {
            availableBrokers.addAll(brokerRepository.findByPresales_EmailIgnoreCase(userEmail));
        }
        return availableBrokers;
    }
}
