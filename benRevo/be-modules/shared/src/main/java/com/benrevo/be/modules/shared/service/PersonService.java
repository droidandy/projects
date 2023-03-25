package com.benrevo.be.modules.shared.service;

import com.benrevo.common.dto.BrokerDto;
import com.benrevo.common.dto.PersonDto;
import com.benrevo.common.enums.PersonType;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.ClientException;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.common.util.ObjectMapperUtils;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Person;
import com.benrevo.data.persistence.entities.PersonRelation;
import com.benrevo.data.persistence.repository.BrokerRepository;
import com.benrevo.data.persistence.repository.PersonRelationRepository;
import com.benrevo.data.persistence.repository.PersonRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.benrevo.common.util.MapBuilder.field;

@Service
@Transactional
public class PersonService {

    @Autowired
    private PersonRepository personRepository;
    
    @Autowired
    private PersonRelationRepository personRelationRepository;
    
    @Autowired
    private BrokerRepository brokerRepository;

    @Autowired
    private SharedCarrierService sharedCarrierService;
    
    @Value("${app.env:local}")
    private String appEnv;

    private Long getOrDefaultCarrierId(Long carrierId) {
        return carrierId != null ? carrierId :  sharedCarrierService.getCurrentEnvCarrier().getCarrierId();
    }
    public List<PersonDto> getByTypeAndCarrier(PersonType type, Long carrierId) {
        List<Person> persons = personRepository.findByCarrierIdAndType(
            getOrDefaultCarrierId(carrierId), type);

        persons = filterTestPersons(persons);

        List<PersonDto> personDtos = ObjectMapperUtils.mapAll(persons, PersonDto.class);

        for(PersonDto personDto : personDtos) {
            addBrokeragesPersonIsLinkedTo(personDto);
        }

        return personDtos;
    }

    private void addBrokeragesPersonIsLinkedTo(PersonDto personDto) {
        List<BrokerDto> result = new ArrayList<>();

        List<Broker> brokersPersonIsAttachedTo = null;

        String personEmail = personDto.getEmail();
        PersonType personType = personDto.getType();

        if(personType != null) {
            switch(personType) {
                case SALES:
                case SALES_RENEWAL:
                    brokersPersonIsAttachedTo = brokerRepository.findBySales_EmailIgnoreCase(personEmail);
                    break;
                case PRESALES:
                    brokersPersonIsAttachedTo = brokerRepository.findByPresales_EmailIgnoreCase(personEmail);
                    break;
                case CARRIER_MANAGER:
                case CARRIER_MANAGER_RENEWAL:
                    brokersPersonIsAttachedTo = brokerRepository.findByPresales_EmailOrSales_EmailAllIgnoreCase(personEmail, personEmail);
                    break;
                case RATER:
                case SPECIALTY:
                case SPECIALTY_RENEWAL:
                    brokersPersonIsAttachedTo = null;
                    break;
                default:
                    throw new BaseException("PersonType not valid").withFields(field("person_type", personDto));
            }
        }

        if(brokersPersonIsAttachedTo != null) {
            brokersPersonIsAttachedTo.forEach(broker -> result.add(broker.toBrokerDto()));
        }

        personDto.setBrokerageList(result);
    }
    
    public List<PersonDto> getByCarrier(Long carrierId) {
        List<Person> persons = personRepository.findByCarrierId(carrierId);
        persons = filterTestPersons(persons);
        return ObjectMapperUtils.mapAll(persons, PersonDto.class);
    }

    public List<PersonDto> getByType(PersonType type) {
        return getByTypeAndCarrier(type, null);
    }
    
    public PersonDto getById(Long personId) {
        Person person = personRepository.findOne(personId);
        if(person == null) {
            throw new NotFoundException("Person not found").withFields(field("person_id", personId));
        }
        PersonDto personDto = ObjectMapperUtils.map(person, PersonDto.class);
        addBrokeragesPersonIsLinkedTo(personDto);

        return personDto;
    }
    
    public PersonDto create(PersonDto personDto) {
        checkForDuplicates(personDto);
        return save(personDto);
    }

    public List<PersonDto> create(List<PersonDto> personDtos) {
        List<PersonDto> createdList = new ArrayList<>();
        for(PersonDto p : personDtos) {
            checkForDuplicates(p);
            createdList.add(save(p));
        }
        return createdList;
    }
    
    public PersonDto update(PersonDto personDto) {
        Person old = personRepository.findOne(personDto.getPersonId());
        if(old == null) {
            throw new NotFoundException("Person not found").withFields(field("person_id", personDto.getPersonId()));
        }
        
        handlePromotion(old, personDto);

        checkForDuplicates(personDto);

        PersonDto updated = save(personDto);

        return updated;
    }
    
    public List<PersonDto> getChildren(Long personId) {
        List<Person> children = personRelationRepository.findChildren(personId);
       
        children = filterTestPersons(children);
        
        return ObjectMapperUtils.mapAll(children, PersonDto.class);
    }
    
    public void addChild(Long parentPersonId, Long childPersonId) {
        Person parent = personRepository.findOne(parentPersonId);
        if(parent == null) {
            throw new NotFoundException("Parent person no found").withFields(field("person_id", parentPersonId));
        }
        Person child = personRepository.findOne(childPersonId);
        if(child == null) {
            throw new NotFoundException("Child person no found").withFields(field("person_id", childPersonId));
        }
        PersonRelation relation = personRelationRepository.findChild(parentPersonId, childPersonId);
        if(relation != null) {
            throw new ClientException("Child person already exist");
        }
        personRelationRepository.save(new PersonRelation(parent, child));
    }
    
    public void deleteChild(Long parentPersonId, Long childPersonId) {
        PersonRelation relation = personRelationRepository.findChild(parentPersonId, childPersonId);
        if(relation == null) {
            throw new ClientException("Person relation not found")
            .withFields(field("parent_id", parentPersonId), field("child_id", childPersonId));
        }
        personRelationRepository.delete(relation.getId());
    }

    private void checkForDuplicates(PersonDto personDto) {
        List<Person> old = personRepository.findByCarrierIdAndTypeAndFirstNameAndLastName(
            personDto.getCarrierId(), personDto.getType(), personDto.getFirstName(), personDto.getLastName());
        if(!old.isEmpty()) {
            if(old.size() == 1 && old.get(0).getPersonId().equals(personDto.getPersonId())) {
                // updating person, for example email
                return;
            }
            throw new BaseException("Person already exist")
                .withFields(field("person_id", old.get(0).getPersonId()));
        }
    }

    private PersonDto save(PersonDto personDto) {
        Person person = ObjectMapperUtils.map(personDto, Person.class);
        person = personRepository.save(person);

        PersonDto resultPersonDto = ObjectMapperUtils.map(person, PersonDto.class);
        addBrokeragesPersonIsLinkedTo(resultPersonDto);

        return resultPersonDto;
    }
    
    public void delete(Long id) {
        personRepository.delete(id);
    }
    // NOTE return only test persons (@benrevo.com) on dev/local environment
    private List<Person> filterTestPersons(List<Person> persons) {
        if(!"prod".equalsIgnoreCase(appEnv)) {
            return persons.stream().filter(p -> {
                return p.getEmail() != null && p.getEmail().endsWith("@benrevo.com");
            }).collect(Collectors.toList());
        } 
        return persons;
    }

    private void handlePromotion(Person old, PersonDto personDto){
        if(personDto.getType().equals(PersonType.CARRIER_MANAGER) && !old.getType().equals(PersonType.CARRIER_MANAGER)){
            List<Broker> associatedBrokers;
            switch(old.getType()){
                case SALES:
                    associatedBrokers = brokerRepository.findBySales_EmailIgnoreCase(old.getEmail());
                    break;
                case PRESALES:
                    associatedBrokers = brokerRepository.findByPresales_EmailIgnoreCase(old.getEmail());
                    break;
                default:
                    throw new NotFoundException("Person type is not valid").withFields(field("person_type",personDto.getType()));
            }

            if(!associatedBrokers.isEmpty()){
                throw new BaseException("Cannot move person from sales/presales type to manager type if person is associated with brokerages")
                        .withFields(field("person_id", old.getPersonId()));
            }
        }
    }

}
