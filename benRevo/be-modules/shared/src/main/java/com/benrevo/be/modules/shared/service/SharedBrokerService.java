package com.benrevo.be.modules.shared.service;

import static com.benrevo.common.Constants.BENREVO_SD_SUPPORT_EMAIL;
import static com.benrevo.common.util.MapBuilder.field;
import static java.lang.String.format;
import static java.util.Optional.ofNullable;
import static java.util.stream.Collectors.toList;
import static org.apache.commons.lang.StringUtils.isBlank;
import static org.apache.commons.lang3.StringUtils.containsIgnoreCase;

import com.benrevo.common.Constants;
import com.benrevo.common.dto.BrokerConfigDto;
import com.benrevo.common.dto.BrokerDto;
import com.benrevo.common.dto.CarrierToEmails;
import com.benrevo.common.dto.ClientMemberDto;
import com.benrevo.common.dto.MailDto;
import com.benrevo.common.dto.PersonDto;
import com.benrevo.common.enums.BrokerConfigType;
import com.benrevo.common.enums.PersonType;
import com.benrevo.common.exception.BadRequestException;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.NotAuthorizedException;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.common.mail.SMTPMailer;
import com.benrevo.common.security.AuthenticatedUser;
import com.benrevo.common.util.DateHelper;
import com.benrevo.common.util.JsonUtils;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.BrokerConfig;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.ExtBrokerageAccess;
import com.benrevo.data.persistence.entities.ExtClientAccess;
import com.benrevo.data.persistence.entities.Person;
import com.benrevo.data.persistence.repository.BrokerConfigRepository;
import com.benrevo.data.persistence.repository.BrokerRepository;
import com.benrevo.data.persistence.repository.CarrierRepository;
import com.benrevo.data.persistence.repository.ExtBrokerageAccessRepository;
import com.benrevo.data.persistence.repository.ExtClientAccessRepository;
import com.benrevo.data.persistence.repository.PersonRepository;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class SharedBrokerService {

    @Autowired
    private BrokerConfigRepository brokerConfigRepository;
    
    @Autowired
    protected BrokerRepository brokerRepository;
    
    @Autowired
    private Auth0Service auth0Service;
    
    @Autowired
    private CarrierRepository carrierRepository;
    
    @Autowired
    private SharedCarrierService sharedCarrierService;
    
    @Autowired
    private JsonUtils jsonUtils;
    
    @Autowired
    private ExtBrokerageAccessRepository extBrokerageAccessRepository;

    @Autowired
    private ExtClientAccessRepository extClientAccessRepository;

    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private SharedVelocityService sharedVelocityService;

    @Value("${app.env:local}")
    String appEnv;

    @Autowired
    private SMTPMailer smtpMailer;

    protected static String BENREVO_NEW_BROKERAGE_NOTIFICATION_TEMPLATE = "/templates/benrevo_new_brokerage_notification.vm";
    public static final String BENREVO_NEW_BROKERAGE_NOTIFICATION_SUBJECT = "ACTION REQUIRED:  New Brokerage Created -  %s";

    public Broker getById(Long brokerId) {
        Broker broker = brokerRepository.findOne(brokerId);
        if(broker == null) {
            throw new NotFoundException(
                format(
                    "Broker not found; broker_id=%s",
                    brokerId
                )
            );
        }
        return broker;
    }

    public Long getOriginalBrokerIdIfGeneralAgent(Long clientId, Long brokerId){
        Broker broker = getById(brokerId);
        if(broker.isGeneralAgent()){
            ExtClientAccess extClientAccess = extClientAccessRepository.findDistinctFirstByClientClientIdAndExtBrokerBrokerId(clientId, brokerId);
            if(extClientAccess == null){
                throw new NotFoundException("GA broker with brokerId="+ brokerId + " does not have access to client with clientId=" + clientId);
            }else{
                return extClientAccess.getClient().getBroker().getBrokerId();
            }
        }else{
            return brokerId;
        }
    }

    public BrokerDto create(BrokerDto brokerDto){
        Broker broker = new Broker();
        brokerRepository.save(broker);

        brokerDto.setId(broker.getBrokerId());
        Broker updatedBroker = update(broker, brokerDto);

        // send email notification to Benrevo team about new brokerage
        String emailTemplate = sharedVelocityService.getBenrevoBrokerageCreatedNotificationTemplate(BENREVO_NEW_BROKERAGE_NOTIFICATION_TEMPLATE,
            brokerDto);

        MailDto mailDto = new MailDto();
        List<String> recipientsList = new ArrayList<>();
        recipientsList.add(Constants.SITE_CONTACT_US_EMAIL);
        mailDto.setRecipients(recipientsList);
        mailDto.setCcRecipients(Arrays.asList(BENREVO_SD_SUPPORT_EMAIL));
        mailDto.setSubject(format(BENREVO_NEW_BROKERAGE_NOTIFICATION_SUBJECT, brokerDto.getName()));

        mailDto.setContent(emailTemplate);
        smtpMailer.send(mailDto);
        return updatedBroker.toBrokerDto();
    }

    public BrokerDto update(BrokerDto brokerDto) {
        Broker old = brokerRepository.findOne(brokerDto.getId());
        return update(old, brokerDto).toBrokerDto();
    }

    public Broker update(Broker old, BrokerDto brokerDto){
        if(old == null) {
            throw new NotFoundException("Broker not found").withFields(field("broker_id", brokerDto.getId()));
        }

        if(!isBlank(brokerDto.getName())) {
            old.setName(brokerDto.getName());
        }
        if(!isBlank(brokerDto.getAddress())) {
            old.setAddress(brokerDto.getAddress());
        }
        if(!isBlank(brokerDto.getCity())) {
            old.setCity(brokerDto.getCity());
        }
        if(!isBlank(brokerDto.getState())) {
            old.setState(brokerDto.getState());
        }
        if(!isBlank(brokerDto.getZip())) {
            old.setZip(brokerDto.getZip());
        }
        if(brokerDto.getLocale() != null) {
            old.setLocale(brokerDto.getLocale());
        }
        // backward compatibility
        if(brokerDto.getSalesId() != null && brokerDto.getSales() == null) {
            PersonDto dto = new PersonDto();
            dto.setPersonId(brokerDto.getSalesId());
            brokerDto.setSales(Collections.singletonList(dto));
        }
        if(brokerDto.getSales() != null) {
            List<Person> sales = new ArrayList<>();
            for(PersonDto salesDto : brokerDto.getSales()) {
                Person sale = personRepository.findOne(salesDto.getPersonId());
                if(sale == null) {
                    throw new NotFoundException("Sales person not found").withFields(field("sales_id", salesDto.getPersonId()));
                }   
                sales.add(sale);
            }
            old.setSales(sales);
        }
        // backward compatibility
        if(brokerDto.getPresalesId() != null && brokerDto.getPresales() == null) {
            PersonDto dto = new PersonDto();
            dto.setPersonId(brokerDto.getPresalesId());
            brokerDto.setPresales(Collections.singletonList(dto));
        }
        if(brokerDto.getPresales() != null) {
            List<Person> presales = new ArrayList<>();
            for(PersonDto presalesDto : brokerDto.getPresales()) {
                Person presale = personRepository.findOne(presalesDto.getPersonId());
                if(presale == null) {
                    throw new NotFoundException("Presales person not found").withFields(field("presales_id", presalesDto.getPersonId()));
                }
                presales.add(presale);
            }
            old.setPresales(presales); 
        }
        // backward compatibility
        if(brokerDto.getSpecialtyBrokerEmail() != null && brokerDto.getSpecialty() == null) {
            Carrier current = sharedCarrierService.getCurrentEnvCarrier();
            Person specialty = personRepository.findByCarrierIdAndTypeAndEmail(
                current.getCarrierId(), PersonType.SPECIALTY, brokerDto.getSpecialtyBrokerEmail());
            if(specialty == null) {
                throw new NotFoundException("Specialty person not found").withFields(field("specialty_broker_email", brokerDto.getSpecialtyBrokerEmail()));
            }
            old.setSpecialty(specialty);
        }
        if(brokerDto.getSpecialty() != null) {
            Person specialty = personRepository.findOne(brokerDto.getSpecialty().getPersonId());
            if(specialty == null) {
                throw new NotFoundException("Specialty person not found").withFields(field("person_id", brokerDto.getSpecialty().getPersonId()));
            }
            old.setSpecialty(specialty);
        }

        if(!isBlank(brokerDto.getProducer())) {
            old.setProducer(brokerDto.getProducer());
        }

        if(Constants.ENV_PROD.equalsIgnoreCase(appEnv) && !isBlank(brokerDto.getBcc())) {
            old.setBcc(brokerDto.getBcc());
        }

        return brokerRepository.save(old);
    }

    public String getBrokerLanguage(Long brokerId) {
        BrokerConfig brokerConfig = brokerConfigRepository
            .findByBrokerIdAndType(brokerId, BrokerConfigType.LANGUAGE);

        if (brokerConfig == null || brokerConfig.getData().isEmpty()) {
            return null;
        }

        return brokerConfig.getData();
    }
    
    public List<CarrierToEmails> getBrokerCarriers(Long brokerId) {
        List<CarrierToEmails> result = new ArrayList<>();
        BrokerConfig brokerConfig = brokerConfigRepository.findByBrokerIdAndType(brokerId, BrokerConfigType.CARRIER_EMAILS);
        if(brokerConfig == null) {
            return result; // approved carriers list not configured
        }
        CarrierToEmails[] emails = jsonUtils.fromJson(brokerConfig.getData(), CarrierToEmails[].class);
        return Arrays.asList(emails);
    }
    
    public List<BrokerConfigDto> getBrokerConfigs(BrokerConfigType type) {

        Broker broker = getCurrentContextBroker();
       
        List<BrokerConfigDto> result = new ArrayList<>();
        if(type == null) {
            List<BrokerConfig> brokerConfigs = brokerConfigRepository.findByBrokerBrokerId(broker.getBrokerId());
            for(BrokerConfig brokerConfig : brokerConfigs) {
                result.add(brokerConfig.toBrokerConfigDto());
            }
        } else {
            BrokerConfig brokerConfig = brokerConfigRepository.findByBrokerIdAndType(broker.getBrokerId(), type);
            if(brokerConfig != null) {
                result.add(brokerConfig.toBrokerConfigDto());
            } else {
                // add initial/default values
                if(type == BrokerConfigType.CARRIER_EMAILS) {
                    List<Carrier> allCarriers = carrierRepository.findAll();
                    List<CarrierToEmails> emails = new ArrayList<>(allCarriers.size());
                    for(Carrier carrier : allCarriers) {
                        CarrierToEmails c2e = new CarrierToEmails(carrier.getCarrierId());
                        c2e.setCarrierId(carrier.getCarrierId());
                        c2e.setCarrierDisplayName(carrier.getDisplayName());
                        emails.add(c2e);
                    }
                    BrokerConfigDto dto = new BrokerConfigDto();       
                    dto.setType(type);
                    dto.setData(jsonUtils.toJson(emails));
                    result.add(dto);
                }
            }
        }
        return result;
    }
    
    public void createOrUpdateBrokerConfigs(List<BrokerConfigDto> dtos) {

        AuthenticatedUser authentication = (AuthenticatedUser) SecurityContextHolder.getContext().getAuthentication();
        String userName = auth0Service.getUserName(authentication.getName());
        
        Broker broker = getCurrentContextBroker();

        for(BrokerConfigDto dto : dtos) {
            if(dto.getType() == null) {
                throw new BadRequestException("Missing required param: config type"); 
            }
            BrokerConfig brokerConfig = brokerConfigRepository.findByBrokerIdAndType(broker.getBrokerId(), dto.getType());
            if(brokerConfig == null) {
                brokerConfig = new BrokerConfig();
                brokerConfig.setBroker(broker);
            }
            validateConfigData(dto.getType(), dto.getData());
            brokerConfig.setType(dto.getType());
            brokerConfig.setData(dto.getData());
            brokerConfig.setModifyBy(userName);
            brokerConfig.setModifyDate(new Date());
            brokerConfigRepository.save(brokerConfig);
        }
    }
    
    private void validateConfigData(BrokerConfigType type, String data) {
        switch(type) {
            case CARRIER_EMAILS:
                if(StringUtils.isBlank(data)) {
                    throw new BaseException("Config data cannot be empty");
                }
                try {
                    CarrierToEmails[] emails = jsonUtils.fromJson(data, CarrierToEmails[].class);
                } catch(Exception e) {
                    throw new BaseException("Cannot parse CARRIER_EMAILS config data as JSON");
                }
                break;
            default:
                break;
        }
    }
    
    public Broker getCurrentContextBroker() {
        AuthenticatedUser authentication = (AuthenticatedUser) SecurityContextHolder.getContext().getAuthentication();
        if(authentication == null) {
            throw new NotAuthorizedException();
        }
        final Long id = (Long) authentication.getDetails();
        Optional<Broker> broker = Optional.ofNullable(brokerRepository.findOne(id));
        return broker.orElseThrow(() -> new NotFoundException("Broker not found").withFields(field("broker_id", id)));
    }

    public boolean getBrokerType(Long id) {
        AuthenticatedUser authentication = (AuthenticatedUser) SecurityContextHolder.getContext().getAuthentication();

        if(authentication == null) {
            throw new NotAuthorizedException();
        }

        return ofNullable(brokerRepository)
            .map(br -> br.findOne(id))
            .map(Broker::isGeneralAgent)
            .orElse(false);
    }

    public List<BrokerDto> getAllBrokersForGA(Long extBrokerId) {
        AuthenticatedUser authentication = (AuthenticatedUser) SecurityContextHolder.getContext().getAuthentication();

        if(authentication == null) {
            throw new NotAuthorizedException();
        }

        Broker broker = brokerRepository.findOne(extBrokerId);

        if(broker == null || !broker.isGeneralAgent()) {
            throw new NotAuthorizedException().withFields(field("broker_id", extBrokerId));
        }

        return ofNullable(extBrokerageAccessRepository)
          .map(eb -> eb.findAllByExtBrokerId(extBrokerId))
          .map(
              b -> b.stream()
                  .map(ExtBrokerageAccess::getBroker)
                  .map(
                      br -> new BrokerDto.Builder()
                          .withAddress(br.getAddress())
                          .withBrokerToken(br.getBrokerToken())
                          .withCity(br.getCity())
                          .withId(br.getBrokerId())
                          .withName(br.getName())
                          .withState(br.getState())
                          .withZip(br.getZip())
                          .withLocale(br.getLocale())
                          .build()
                  )
                  .collect(toList())
          )
          .orElse(null);
    }

    public List<BrokerDto> getBrokerages() {
        List<Broker> brokerages = brokerRepository.findByGeneralAgent(false);

        List<BrokerDto> result = new ArrayList<>();
        brokerages.forEach(broker -> {
            result.add(broker.toBrokerDto());
        });
        return result;
    }

    public List<BrokerDto> getGeneralAgents() {
        List<Broker> generalAgents = brokerRepository.findByGeneralAgent(true);

        List<BrokerDto> result = new ArrayList<>();
        generalAgents.forEach(broker -> {
            result.add(broker.toBrokerDto());
        });
        return result;
    }

    public List<ClientMemberDto> getAuth0Users(Long brokerId) {
        return auth0Service.getUsersIdForBrokerage(brokerId);
    }


    public boolean isCurrentContextBrokerABenrevoGA() {
        Broker currentContextBroker = getCurrentContextBroker();
        return containsIgnoreCase(currentContextBroker.getName(), "Benrevo GA");
    }
}
