package com.benrevo.be.modules.admin.service;

import com.benrevo.be.modules.shared.access.AccountRole;
import com.benrevo.be.modules.shared.access.BrokerageRole;
import com.benrevo.be.modules.shared.service.Auth0Service;
import com.benrevo.be.modules.shared.service.PersonService;
import com.benrevo.be.modules.shared.service.SharedCarrierService;
import com.benrevo.common.dto.AccountRequestDto;
import com.benrevo.common.dto.AccountRequestVerificationDto;
import com.benrevo.common.dto.ClientMemberDto;
import com.benrevo.common.dto.PersonDto;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.PersonType;
import com.benrevo.common.exception.BadRequestException;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.common.security.AuthenticatedUser;
import com.benrevo.data.persistence.entities.AccountRequest;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.ExtBrokerageAccess;
import com.benrevo.data.persistence.entities.Person;
import com.benrevo.data.persistence.repository.AccountRequestRepository;
import com.benrevo.data.persistence.repository.BrokerRepository;
import com.benrevo.data.persistence.repository.ExtBrokerageAccessRepository;
import com.benrevo.data.persistence.repository.PersonRepository;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.benrevo.common.util.MapBuilder.field;


@Service
@Transactional
public class BaseAccountRequestService {

	@Autowired
	private Auth0Service auth0Service;

	@Autowired
	private AccountRequestRepository accountRequestRepository;

    @Autowired
    private ExtBrokerageAccessRepository extBrokerageAccessRepository;

	@Autowired
	private BrokerRepository brokerRepository;

	@Autowired
    private BaseAdminEmailService emailService;
	
	@Autowired
    private PersonService personService;
	
	@Autowired
    private PersonRepository personRepository;
    
    @Autowired
    private SharedCarrierService sharedCarrierService;

	public void approve(AccountRequestVerificationDto accReqVerificationDto) {
		Long accountRequestId = accReqVerificationDto.getAccountRequestId();

		final AccountRequest accReq = accountRequestRepository.findOne(accountRequestId);

		// Create Brokerage if not exist
		Broker brokerage = null;
		if (accReq.getBrokerId() == null) {
			brokerage = brokerRepository.findByName(accReq.getBrokerName());
			if (brokerage == null) {
				brokerage = new Broker();
				brokerage.setGeneralAgent(false);
				brokerage.setName(accReq.getBrokerName());
				brokerage.setAddress(accReq.getBrokerAddress());
				brokerage.setCity(accReq.getBrokerCity());
				brokerage.setZip(accReq.getBrokerZip());
				brokerage.setState(accReq.getBrokerState());
				brokerage.setBrokerToken(UUID.randomUUID().toString().toLowerCase());
				if(StringUtils.isNotEmpty(accReq.getBrokerSpecialtyEmail())) {
				    Carrier carrier = sharedCarrierService.getCurrentEnvCarrier();
				    Person specialtyPerson = personRepository
                        .findByCarrierIdAndTypeAndEmail(carrier.getCarrierId(), PersonType.SPECIALTY, accReq.getBrokerSpecialtyEmail());
				    if(specialtyPerson == null) {
	                    throw new NotFoundException("Specialty person not found").withFields(field("broker_specialty_email", accReq.getBrokerSpecialtyEmail()));
	                }
				    brokerage.setSpecialty(specialtyPerson);
	            }   

				/* not actual, new task requirements
				if (equalsAny(ANTHEM_BLUE_CROSS.name(), appCarrier) 
				        && accReq.getBrokerPresaleName() == null
				        && accReq.getBrokerSalesName() == null
				        && accReq.getBrokerRegion() != null) {
				    
				    Pair<String, String> brokerRegion = ANTHEM_BROKER_REGIONS.get(accReq.getBrokerRegion());
				    if (brokerRegion != null) {
				        accReq.setBrokerSalesName(brokerRegion.getLeft());
				        String[] names = split(brokerRegion.getLeft(),' ');
		                        brokerage.setSalesFirstName(names[0]);
		                        brokerage.setSalesLastName(names[1]);
		                        accReq.setBrokerPresaleName(brokerRegion.getRight());
		                        names = split(brokerRegion.getRight(),' ');
		                        brokerage.setPresalesFirstName(names[0]);
		                        brokerage.setPresalesLastName(names[1]);

				    }
		            
		        }*/
				verifyBcc(accReqVerificationDto);
				brokerage.setBcc(accReqVerificationDto.getBcc());

				brokerage = brokerRepository.save(brokerage);
			}
		}else{
			brokerage = brokerRepository.findOne(accReq.getBrokerId());
		}

		updateBrokerSalesInfo(brokerage, accReq.getBrokerPresaleName(), accReq.getBrokerSalesName());

		// Create Broker Auth0 account if not exist
		List<ClientMemberDto> brokers = auth0Service.getUsersIdForBrokerage(brokerage.getBrokerId());
		brokers = brokers.stream() // filter by email
				.filter(c -> c.getEmail().equals(accReq.getBrokerEmail()))
				.collect(Collectors.toList());
		if (brokers.isEmpty()) {
			auth0Service.createUserIfNotExists(
			        accReq.getBrokerEmail(), 
			        brokerage.getBrokerId(), 
			        BrokerageRole.USER.getValue(),
			        new String[] {AccountRole.BROKER.getValue()});
		}

		// Create General Agent if not exist
		Broker generalAgent = null;
		if (accReq.getGaId() == null) {
			generalAgent = brokerRepository.findByName(accReq.getGaName());
			if (generalAgent == null) {
				generalAgent = new Broker();
				generalAgent.setGeneralAgent(true);
				generalAgent.setName(accReq.getGaName());
				generalAgent.setAddress(accReq.getGaAddress());
				generalAgent.setCity(accReq.getGaCity());
				generalAgent.setZip(accReq.getGaZip());
				generalAgent.setState(accReq.getGaState());
				generalAgent.setBrokerToken(UUID.randomUUID().toString().toLowerCase());

				generalAgent = brokerRepository.save(generalAgent);
			}
		} else{
			generalAgent = brokerRepository.findOne(accReq.getGaId());
		}

		// Create Agent Auth0 account if not exist
		List<ClientMemberDto> agents = auth0Service.getUsersIdForBrokerage(generalAgent.getBrokerId());
		agents = agents.stream() // filter by email
				.filter(c -> c.getEmail().equals(accReq.getAgentEmail()))
				.collect(Collectors.toList());
		if (agents.isEmpty()) {
			auth0Service.createUserIfNotExists(
			        accReq.getAgentEmail(), 
			        generalAgent.getBrokerId(), 
			        BrokerageRole.USER.getValue(), 
			        new String[] {AccountRole.BROKER.getValue()});
		}

		// Create relationship with Brokerage and General Agent
		generalAgent = brokerRepository.save(generalAgent);
        ExtBrokerageAccess brokerageAccess = extBrokerageAccessRepository.findByExtBrokerIdAndBrokerId(generalAgent.getBrokerId(), brokerage.getBrokerId());

        if(brokerageAccess == null){
            extBrokerageAccessRepository.save(new ExtBrokerageAccess(generalAgent, brokerage));
        }

		// Record who executed action
		AuthenticatedUser currentUser = (AuthenticatedUser) SecurityContextHolder.getContext().getAuthentication();
		accReq.setActionBy(currentUser.getBrokerName());

		accReq.setApprove(true);
		accReq.setDeny(false);
		accReq.setDenyReason(null);
		accReq.setBrokerId(brokerage.getBrokerId());
		accountRequestRepository.save(accReq);

		// Send email to agent_email about approval
		emailService.sendAccountRequestApproveEmail(accReq.getBrokerName(), accReq.getAgentName(), accReq.getAgentEmail());

		// Send to broker
		String salesFullName = brokerage.getSalesFirstName();
		emailService.sendWelcomeEmail(salesFullName, accReq.getBrokerEmail(), accReq.getAgentName(), accReq.getGaName());
	}

	private void updateBrokerSalesInfo(Broker broker, String presalesName, String salesName) {
		if(CollectionUtils.isEmpty(broker.getPresales()) && presalesName != null) {
		    Person presalesPerson = getPresales(presalesName);
			if(presalesPerson == null) {
				throw new BaseException("Brokerage pre-sales not found")
					.withFields(field("Pre-sales Name", presalesName));
			} else {
			    broker.setPresales(presalesPerson);
			}
		}
		if(CollectionUtils.isEmpty(broker.getSales()) && salesName != null) {	
            Person salesPerson = getSales(salesName);
			if(salesPerson == null) {
				throw new BaseException("Brokerage sales email not found")
					.withFields(field("Sales Name", salesName));
			} else {
			    broker.setSales(salesPerson);
			}
		}
	}

	public void deny(Long accountRequestId, String denyReason) {

		AccountRequest accReq = accountRequestRepository.findOne(accountRequestId);

		// Send email to agent_email deny reason
		emailService.sendAccountRequestDenyEmail(accReq.getAgentName(), accReq.getAgentEmail(), denyReason);

		// Record who executed action
		AuthenticatedUser currentUser = (AuthenticatedUser) SecurityContextHolder.getContext().getAuthentication();
		accReq.setActionBy(currentUser.getBrokerName());

		accReq.setApprove(false);
		accReq.setDeny(true);
		accReq.setDenyReason(denyReason);

		accReq = accountRequestRepository.save(accReq);
	}

	public List<AccountRequestDto> getAccountRequests() {

	    List<AccountRequest> requests = accountRequestRepository.findAllByApproveIsFalseAndDenyIsFalse();
    	List<AccountRequestDto> result = new ArrayList<>();
    	requests.forEach(acc -> {
            result.add(acc.toAccountRequestDto());
        });
        return result;
    }

	public AccountRequestDto update(AccountRequestDto accountRequestDto) {
		if (accountRequestDto.getId() == null) {
   		 	throw new BadRequestException("AccountRequest id cannot be null");
		}

		if(accountRequestDto.getAgentEmail() != null){
			accountRequestDto.setAgentEmail(StringUtils.lowerCase(accountRequestDto.getAgentEmail()));
		}
		if(accountRequestDto.getBrokerEmail() != null){
			accountRequestDto.setBrokerEmail(StringUtils.lowerCase(accountRequestDto.getBrokerEmail()));
		}
		if(accountRequestDto.getBrokerSpecialtyEmail() != null){
            accountRequestDto.setBrokerSpecialtyEmail(StringUtils.lowerCase(accountRequestDto.getBrokerSpecialtyEmail()));
        }

		AccountRequest request = accountRequestRepository.findOne(accountRequestDto.getId());
    	if (request == null) {
    		 throw new NotFoundException("AccountRequest not found").withFields(field("account_request_id", accountRequestDto.getId()));
    	}
    	if (request.getBrokerId() != null && !brokerRepository.exists(request.getBrokerId())) {
    		throw new NotFoundException("Broker not found").withFields(field("broker_id", request.getBrokerId()));
    	}
    	if (request.getGaId() != null && !brokerRepository.exists(request.getGaId())) {
   		 	throw new NotFoundException("General Agent not found").withFields(field("broker_id", request.getGaId()));
    	}
    	request.fromAccountRequestDto(accountRequestDto);
    	request = accountRequestRepository.save(request);
        return request.toAccountRequestDto();
    }

    protected Person getPresales(String presalesName){
        throw new UnsupportedOperationException("Not implemented");
    }


    protected Person getSales(String salesName){
        throw new UnsupportedOperationException("Not implemented");
    }

    public Map<String, List<String>> getContacts() {
        throw new UnsupportedOperationException("Not implemented");
    }
    
    protected Map<String, List<String>> getContacts(CarrierType carrierType) {
        final Set<String> sales = new HashSet<>();
        final Set<String> presales = new HashSet<>();
        final Set<String> specialtyEmails = new HashSet<>();
        List<PersonDto> persons = personService.getByCarrier(sharedCarrierService.findByName(carrierType).getCarrierId());

        for(PersonDto person : persons) {
            if(person.getType().equals(PersonType.SALES)) {
                sales.add(person.getFullName());
            } else if(person.getType().equals(PersonType.PRESALES)) {
                presales.add(person.getFullName());
            } else if(person.getType().equals(PersonType.SPECIALTY)) {
                specialtyEmails.add(person.getEmail());
            }
        }

        Map<String, List<String>> result = new HashMap<>();
        result.put("sales", new ArrayList<>(sales));
        result.put("presales", new ArrayList<>(presales));
        result.put("specialtyEmails", new ArrayList<>(specialtyEmails));

        return result;
    }

    protected Person getPerson(CarrierType carrierType, PersonType personType, String name){
        return (name == null) ? null : personService
                .getByTypeAndCarrier(personType, sharedCarrierService.findByName(carrierType).getCarrierId())
                .stream()
                .filter(p -> name.equalsIgnoreCase(p.getFullName()))
                .findFirst()
                .map(p -> personRepository.findOne(p.getPersonId()))
                .orElse(null);
    }

    public void verifyBcc(AccountRequestVerificationDto accReqVerificationDto){
		throw new UnsupportedOperationException("Not implemented");
	}
}
