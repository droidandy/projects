package com.benrevo.be.modules.shared.controller;

import static org.apache.commons.lang3.ArrayUtils.toArray;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.benrevo.be.modules.shared.access.AccountRole;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.BrokerDto;
import com.benrevo.common.dto.PersonDto;
import com.benrevo.common.dto.RelationDto;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.PersonType;
import com.benrevo.common.util.ObjectMapperUtils;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Person;
import com.benrevo.data.persistence.entities.PersonRelation;
import com.benrevo.data.persistence.repository.BrokerRepository;
import com.benrevo.data.persistence.repository.PersonRelationRepository;
import com.benrevo.data.persistence.repository.PersonRepository;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import java.util.Collections;

public class PersonControllerTest extends AbstractControllerTest {

    @Autowired
    private PersonController personController;
    
    @Autowired
    private BrokerRepository brokerRepository;
    
    @Autowired
    private PersonRelationRepository personRelationRepository;

    @Autowired
    private PersonRepository personRepository;
    
    @Before
    @Override
    public void init() {
        initController(personController);
        token = authenticationService.createTokenForBroker(TEST_BROKERAGE_ID, testAuthId, toArray(AccountRole.ADMINISTRATOR.getValue()), appCarrier);
    }
    
    @Test
    public void getByTypeAndCarrier() throws Exception {
        Broker broker = testEntityHelper.createTestBroker("findSalesPersonBroker");
        
        // select SALES for current carrier
        MvcResult result = performGetAndAssertResult((Object) null, "/v1/persons/find", "type", PersonType.SALES);
        PersonDto[] persons = jsonUtils.fromJson(result.getResponse().getContentAsString(), PersonDto[].class);

        assertThat(broker.getSales()).hasSize(1);
        PersonDto salesPersonFromAPI = findPerson(broker.getSalesFullName(), persons);
        assertThat(salesPersonFromAPI.getPersonId()).isEqualTo(broker.getSales().get(0).getPersonId());
        assertThat(salesPersonFromAPI.getBrokerageList())
            .extracting(BrokerDto::getId).contains(broker.getBrokerId());

        // select PRESALES for current carrier
        result = performGetAndAssertResult((Object) null, "/v1/persons/find", "type", PersonType.PRESALES);
        persons = jsonUtils.fromJson(result.getResponse().getContentAsString(), PersonDto[].class);

        assertThat(broker.getPresales()).hasSize(1);
        PersonDto presalesPersonFromAPI = findPerson(broker.getPresalesFullName(), persons);
        assertThat(presalesPersonFromAPI.getPersonId()).isEqualTo(broker.getPresales().get(0).getPersonId());
        assertThat(presalesPersonFromAPI.getBrokerageList())
            .extracting(BrokerDto::getId).contains(broker.getBrokerId());
    }

    private PersonDto findPerson(String name, PersonDto[] persons) {
        PersonDto p = null;
        for(PersonDto personDto : persons){
            if(personDto.getFullName().equalsIgnoreCase(name)){
                p = personDto;
                break;
            }
        }
        return p;
    }


    @Test
    public void testPersonCRUD() throws Exception {
        PersonDto created = testCreate();
        PersonDto updated = testUpdate(created);
        PersonDto found = testFindById(updated);
        testDelete(found);
    }
    
    @Test
    public void testPersonRelationCRUD() throws Exception {
        Person parent = testEntityHelper.createTestPerson(PersonType.CARRIER_MANAGER, 
            "testParent", "tesParentEmail@benrevo.com", appCarrier[0]);

        Person child = testEntityHelper.createTestPerson(PersonType.PRESALES, 
            "testChild", "testChildEmail@benrevo.com", appCarrier[0]);

        RelationDto params = new RelationDto(parent.getPersonId(), child.getPersonId());
        
        MvcResult result = performPostAndAssertResult(jsonUtils.toJson(params), null, "/v1/persons/addChild");
        
        // read created relation
        
        result = performGetAndAssertResult((Object) null, "/v1/persons/children", "parentPersonId", parent.getPersonId());
        
        PersonDto[] found = jsonUtils.fromJson(result.getResponse().getContentAsString(), PersonDto[].class);
        assertThat(found).hasSize(1);
        
        PersonDto childDto = ObjectMapperUtils.map(found[0], PersonDto.class);
        assertThat(found[0]).isEqualToComparingFieldByField(childDto);
        
        // delete created relation

        performDeleteAndAssertResult(jsonUtils.toJson(params), "/v1/persons/deleteChild");
        
        PersonRelation relation = personRelationRepository.findChild(parent.getPersonId(), child.getPersonId());
        assertThat(relation).isNull();
        // check that removed only relation, not persons
        assertThat(personRepository.exists(parent.getPersonId())).isTrue();
        assertThat(personRepository.exists(child.getPersonId())).isTrue(); 
    }
    
    private PersonDto testCreate() throws Exception {
        PersonDto person = new PersonDto();
        Carrier carrier = testEntityHelper.createTestCarrier(CarrierType.OTHER.name(), CarrierType.OTHER.name());
        person.setCarrierId(carrier.getCarrierId());
        person.setEmail("email");
        person.setFirstName("firstName");
        person.setLastName("lastName");
        person.setType(PersonType.SALES);
        person.setFullName("fullName");
        
        MvcResult result = performPostAndAssertResult(jsonUtils.toJson(person), null, "/v1/persons/create");
        
        PersonDto created = jsonUtils.fromJson(result.getResponse().getContentAsString(), PersonDto.class);
        
        assertThat(created.getPersonId()).isNotNull();
        assertThat(created).isEqualToIgnoringGivenFields(person, "personId", "brokerageList");
        return created;
    }

    @Test
    public void testCreateAndGetPersonByEmail() throws Exception {

        Carrier carrier = testEntityHelper.createTestCarrier(CarrierType.OTHER.name(), CarrierType.OTHER.name());

        PersonDto person = new PersonDto();
        person.setCarrierId(carrier.getCarrierId());
        person.setEmail("email");
        person.setFirstName("fn");
        person.setLastName("ln");
        person.setType(PersonType.SALES);
        person.setFullName("fn");

        /* Create broker and associate with person's email, not person's name */
        Broker broker = testEntityHelper.createTestBroker();
        broker.setName("brokerageName");
        assertThat(broker.getSales()).hasSize(1);
        broker.getSales().get(0).setFirstName("differentName");
        broker.getSales().get(0).setLastName("differentName");
        broker.getSales().get(0).setEmail(person.getEmail());
        personRepository.save(broker.getSales());

        /* Create Person */
        MvcResult result = performPostAndAssertResult(jsonUtils.toJson(person), null, "/v1/persons/create");
        person = jsonUtils.fromJson(result.getResponse().getContentAsString(), PersonDto.class);

        /* Assert created person has associated brokerage */
        assertThat(person.getBrokerageList()).hasSize(1);
        assertThat(person.getBrokerageList().get(0).getId()).isEqualTo(broker.getBrokerId());

        /* Get Person */
        result = performGetAndAssertResult(null, "/v1/persons/{id}", person.getPersonId());
        person = jsonUtils.fromJson(result.getResponse().getContentAsString(), PersonDto.class);

        /* Assert fetched person has associated brokerage */
        assertThat(person.getBrokerageList()).hasSize(1);
        assertThat(person.getBrokerageList().get(0).getId()).isEqualTo(broker.getBrokerId());
    }

    @Test
    public void testCreateAndGetManagerByEmail() throws Exception {

        Carrier carrier = testEntityHelper.createTestCarrier(CarrierType.OTHER.name(), CarrierType.OTHER.name());

        PersonDto person = new PersonDto();
        person.setCarrierId(carrier.getCarrierId());
        person.setEmail("managerEmail");
        person.setFirstName("fn");
        person.setLastName("ln");
        person.setType(PersonType.CARRIER_MANAGER);
        person.setFullName("fn");

        Broker broker = testEntityHelper.createTestBroker();
        broker.setName("brokerageName");
        assertThat(broker.getSales()).hasSize(1);
        broker.getSales().get(0).setFirstName("differentName");
        broker.getSales().get(0).setLastName("differentName");
        broker.getSales().get(0).setEmail(person.getEmail());
        personRepository.save(broker.getSales());

        /* Create Person */
        MvcResult result = performPostAndAssertResult(jsonUtils.toJson(person), null, "/v1/persons/create");
        person = jsonUtils.fromJson(result.getResponse().getContentAsString(), PersonDto.class);

        /* Assert created person has associated brokerage */
        assertThat(person.getBrokerageList()).hasSize(1);
        assertThat(person.getBrokerageList().get(0).getId()).isEqualTo(broker.getBrokerId());

        /* Get Person */
        result = performGetAndAssertResult(null, "/v1/persons/{id}", person.getPersonId());
        person = jsonUtils.fromJson(result.getResponse().getContentAsString(), PersonDto.class);

        /* Assert fetched person has associated brokerage */
        assertThat(person.getBrokerageList()).hasSize(1);
        assertThat(person.getBrokerageList().get(0).getId()).isEqualTo(broker.getBrokerId());

    }
    
    private PersonDto testUpdate(PersonDto created) throws Exception {

        PersonDto toUpdate = ObjectMapperUtils.map(created, PersonDto.class);
        toUpdate.setFirstName("new_firstName");
        toUpdate.setLastName("new_lastName");
        
        MvcResult result = performPutAndAssertResult(jsonUtils.toJson(toUpdate), null, "/v1/persons/update");
        
        PersonDto updated = jsonUtils.fromJson(result.getResponse().getContentAsString(), PersonDto.class);
        
        assertThat(updated).isEqualToIgnoringGivenFields(toUpdate, "brokerageList");
        
        flushAndClear();

        return updated;

    }
    
    private PersonDto testFindById(PersonDto created) throws Exception {

        MvcResult result = performGetAndAssertResult(null, "/v1/persons/{id}", created.getPersonId());
        
        PersonDto found = jsonUtils.fromJson(result.getResponse().getContentAsString(), PersonDto.class);
        
        assertThat(found).isEqualToIgnoringGivenFields(created, "brokerageList");
        
        return found;
    }
    
    private void testDelete(PersonDto created) throws Exception {

        PersonDto toDelete = new PersonDto();
        toDelete.setPersonId(created.getPersonId());
        
        performDeleteAndAssertResult(jsonUtils.toJson(toDelete), "/v1/persons/delete");
        
        // check for 404
        mockMvc.perform(MockMvcRequestBuilders.get("/v1/persons/{id}", toDelete.getPersonId())
            .header(HttpHeaders.AUTHORIZATION, AUTHORIZATION_HEADER_BEARER + " " + token)
            .contentType(MediaType.APPLICATION_JSON_UTF8)
            .accept(MediaType.APPLICATION_JSON_UTF8))
            .andExpect(status().isNotFound())
            .andReturn();
    }

    @Test
    public void testUpdateSalesToMgrSuccess() throws Exception {
        PersonDto created = testCreate();

        PersonDto toUpdate = ObjectMapperUtils.map(created, PersonDto.class);
        toUpdate.setType(PersonType.CARRIER_MANAGER);

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.put("/v1/persons/update")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(jsonUtils.toJson(toUpdate))
                .accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andReturn();

        PersonDto updated = jsonUtils.fromJson(result.getResponse().getContentAsString(), PersonDto.class);

        assertThat(updated).isEqualToIgnoringGivenFields(toUpdate, "brokerageList");

    }

    @Test
    public void testUpdateSalesToMgrFailure() throws Exception {
        PersonDto created = testCreate();

        Person sales = personRepository.findOne(created.getPersonId());
        assertThat(sales).isNotNull();
        
        Broker broker = testEntityHelper.buildTestBroker("personUpdateBroker");
        broker.setSales(sales);
        brokerRepository.save(broker);

        PersonDto toUpdate = ObjectMapperUtils.map(created, PersonDto.class);
        toUpdate.setType(PersonType.CARRIER_MANAGER);

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.put("/v1/persons/update")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON_UTF8)
                .content(jsonUtils.toJson(toUpdate))
                .accept(MediaType.APPLICATION_JSON_UTF8))
                .andExpect(status().is5xxServerError())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8))
                .andReturn();

        String response = result.getResponse().getContentAsString();
        assertThat(response).contains("Cannot move person from sales/presales type to manager type if person is associated with brokerages");
    }
}
