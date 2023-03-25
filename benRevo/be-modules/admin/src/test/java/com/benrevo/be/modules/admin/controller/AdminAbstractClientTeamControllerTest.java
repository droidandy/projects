package com.benrevo.be.modules.admin.controller;

import com.auth0.client.mgmt.filter.UserFilter;
import com.auth0.exception.Auth0Exception;
import com.auth0.json.mgmt.users.User;
import com.auth0.json.mgmt.users.UsersPage;
import com.benrevo.common.dto.ClientMemberDto;

import java.util.*;

import com.benrevo.common.dto.MailDto;
import com.benrevo.data.persistence.entities.*;
import com.benrevo.data.persistence.mapper.ClientMemberMapper;
import com.benrevo.data.persistence.repository.BrokerRepository;
import com.benrevo.data.persistence.repository.ClientTeamRepository;
import com.benrevo.data.persistence.repository.ExtClientAccessRepository;
import com.benrevo.data.persistence.repository.ExtBrokerageAccessRepository;
import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static com.benrevo.common.util.MapBuilder.build;
import static com.benrevo.common.util.MapBuilder.entry;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.when;


public abstract class AdminAbstractClientTeamControllerTest extends AdminAbstractControllerTest {

    @Autowired
    private AdminClientTeamController controller;

    @Autowired
    private ClientTeamRepository clientTeamRepository;

    @Autowired
    private BrokerRepository brokerRepository;

    @Autowired
    private ExtClientAccessRepository extClientAccessRepository;

    @Autowired
    private ExtBrokerageAccessRepository extBrokerageAccessRepository;

    private Client client;
    private UsersPage usersPage;
    private User user1;
    private ClientMemberDto dto;

    @Override
    @Before
    public void init() throws Auth0Exception {
        initController(controller);

        client = testEntityHelper.createTestClient();

        user1 = new User("test");
        user1.setEmail("user1@domain.test");
        user1.setUserMetadata(build(
                entry("first_name", "FirstName"),
                entry("last_name", "LastName")));
        user1.setAppMetadata(build(
                entry("brokerageRole", "user"),
                entry("brokerageId", client.getBroker().getBrokerToken())));

        User user2 = new User("test");
        user2.setEmail("user2@domain.test");
        user2.setUserMetadata(build(
                entry("first_name", "FirstName"),
                entry("last_name", "LastName")));

        List<User> users = new ArrayList<>();
        users.add(user1);
        users.add(user2);
        usersPage = new UsersPage(users);
        when(mgmtAPI.users().list(any(UserFilter.class)).execute()).thenReturn(usersPage);

        dto = new ClientMemberDto();
        dto.setFirstName("firstName");
        dto.setLastName("lastName");
        dto.setEmail("user1@domain.test");
    }

    @Test
    public void getMembersFromClientById() throws Exception {

        Client client = testEntityHelper.createTestClient();
        testEntityHelper.createClientTeam(client.getBroker(), client);

        Broker broker1 = client.getBroker();
        broker1.setName("Test Broker 1");
        broker1.setGeneralAgent(false);

        Broker gaBroker1 = testEntityHelper.createTestBroker("Test GA Broker 1");
        gaBroker1.setGeneralAgent(true);
        testEntityHelper.createClientTeam(gaBroker1,client);

        List<ClientTeam> clientTeamList = clientTeamRepository.findByClientClientId(client.getClientId());

        token = createToken(client.getBroker().getBrokerToken());
        mockMvc
                .perform(MockMvcRequestBuilders
                        .get("/admin/clients/{id}/members", client.getClientId())
                        .header("Authorization", "Bearer " + token)
                        .header("Content-Type", "application/json")
                        .contentType(MediaType.parseMediaType("application/json;charset=UTF-8"))
                        .accept(MediaType.parseMediaType("application/json;charset=UTF-8")))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json;charset=UTF-8"))
                .andExpect(MockMvcResultMatchers.content().json(jsonUtils.toJson(ClientMemberMapper.toDtos(clientTeamList)), true))
                .andReturn();
    }

    @Test
    public void addToTeam() throws Exception {

        token = createToken(client.getBroker().getBrokerToken());
        MvcResult result = mockMvc
                .perform(MockMvcRequestBuilders
                        .post("/admin/clients/{id}/members/{brokerId}", client.getClientId(), client.getBroker().getBrokerId())
                        .header("Authorization", "Bearer " + token)
                        .header("Content-Type", "application/json")
                        .contentType(MediaType.parseMediaType("application/json;charset=UTF-8"))
                        .content("[" + jsonUtils.toJson(dto) + "]")
                        .accept(MediaType.parseMediaType("application/json;charset=UTF-8")))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json;charset=UTF-8"))
                .andReturn();
        ClientMemberDto[] response = jsonUtils.fromJson(
                result.getResponse().getContentAsString(),
                ClientMemberDto[].class);
        assertThat(response).isNotEmpty();
        assertThat(response).hasSize(1);
        assertThat(response[0].getBrokerageId()).isEqualTo(client.getBroker().getBrokerId());
        assertThat(response[0].getEmail()).isEqualTo(dto.getEmail());
    }

    @Test
    public void addToTeamGa() throws Exception{
        Broker gaBroker = testEntityHelper.createTestBroker("Test GA Broker 1");
        gaBroker.setGeneralAgent(true);
        brokerRepository.save(gaBroker);
        testEntityHelper.createClientTeam(gaBroker,client);

        ExtBrokerageAccess extBrokerageAccess = new ExtBrokerageAccess();
        extBrokerageAccess.setBroker(client.getBroker());
        extBrokerageAccess.setExtBroker(gaBroker);
        ExtClientAccess extClientAccess = new ExtClientAccess();
        extClientAccess.setClient(client);
        extClientAccess.setExtBroker(gaBroker);
        extBrokerageAccessRepository.save(extBrokerageAccess);
        extClientAccessRepository.save(extClientAccess);

        user1.setAppMetadata(build(
                entry("brokerageRole", "user"),
                entry("brokerageId", gaBroker.getBrokerToken())));
        when(mgmtAPI.users().list(any(UserFilter.class)).execute()).thenReturn(usersPage);

        token = createToken(client.getBroker().getBrokerToken());
        MvcResult result = mockMvc
                .perform(MockMvcRequestBuilders
                        .post("/admin/clients/{id}/members/{brokerId}", client.getClientId(), gaBroker.getBrokerId())
                        .header("Authorization", "Bearer " + token)
                        .header("Content-Type", "application/json")
                        .contentType(MediaType.parseMediaType("application/json;charset=UTF-8"))
                        .content("[" + jsonUtils.toJson(dto) + "]")
                        .accept(MediaType.parseMediaType("application/json;charset=UTF-8")))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json;charset=UTF-8"))
                .andReturn();
        ClientMemberDto[] response = jsonUtils.fromJson(
                result.getResponse().getContentAsString(),
                ClientMemberDto[].class);
        assertThat(response).isNotEmpty();
        assertThat(response).hasSize(1);
        assertThat(response[0].getBrokerageId()).isEqualTo(gaBroker.getBrokerId());
        assertThat(response[0].getEmail()).isEqualTo(dto.getEmail());
    }

    @Test
    public void addToTeamGaAuth0Mismatch() throws Exception{

        Broker gaBroker1 = testEntityHelper.createTestBroker("Test GA Broker 1");
        gaBroker1.setGeneralAgent(true);
        brokerRepository.save(gaBroker1);
        testEntityHelper.createClientTeam(gaBroker1,client);

        ExtBrokerageAccess extBrokerageAccess = new ExtBrokerageAccess();
        extBrokerageAccess.setBroker(client.getBroker());
        extBrokerageAccess.setExtBroker(gaBroker1);
        ExtClientAccess extClientAccess = new ExtClientAccess();
        extClientAccess.setClient(client);
        extClientAccess.setExtBroker(gaBroker1);
        extBrokerageAccessRepository.save(extBrokerageAccess);
        extClientAccessRepository.save(extClientAccess);

        token = createToken(client.getBroker().getBrokerToken());
        MvcResult result = mockMvc
                .perform(MockMvcRequestBuilders
                        .post("/admin/clients/{id}/members/{brokerId}", client.getClientId(), gaBroker1.getBrokerId())
                        .header("Authorization", "Bearer " + token)
                        .header("Content-Type", "application/json")
                        .contentType(MediaType.parseMediaType("application/json;charset=UTF-8"))
                        .content("[" + jsonUtils.toJson(dto) + "]")
                        .accept(MediaType.parseMediaType("application/json;charset=UTF-8")))
                .andExpect(status().isInternalServerError())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json;charset=UTF-8"))
                .andReturn();
        assertThat(result.getResponse().getContentAsString().contains("Users exists in Auth0 with different brokerage"));
    }

    @Test
    public void addToTeamGaNotAssociated() throws Exception{

        Broker gaBroker = testEntityHelper.createTestBroker("Test GA Broker 2");
        gaBroker.setGeneralAgent(true);
        brokerRepository.save(gaBroker);
        testEntityHelper.createClientTeam(gaBroker,client);

        token = createToken(client.getBroker().getBrokerToken());
        MvcResult result = mockMvc
                .perform(MockMvcRequestBuilders
                        .post("/admin/clients/{id}/members/{brokerId}", client.getClientId(), gaBroker.getBrokerId())
                        .header("Authorization", "Bearer " + token)
                        .header("Content-Type", "application/json")
                        .contentType(MediaType.parseMediaType("application/json;charset=UTF-8"))
                        .content("[" + jsonUtils.toJson(dto) + "]")
                        .accept(MediaType.parseMediaType("application/json;charset=UTF-8")))
                .andExpect(status().isNotFound())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json;charset=UTF-8"))
                .andReturn();
        assertThat(result.getResponse().getContentAsString().contains("GA broker not associated with client or the immediate broker"));
    }


    @Test
    public void deleteMembersFromClientById() throws Exception {

        Client client = testEntityHelper.createTestClient();
        ClientTeam clientTeam = testEntityHelper.createClientTeam(client.getBroker(), client);

        List<ClientTeam> clientTeamList =
                clientTeamRepository.findByClientClientId(client.getClientId());
        assertThat(clientTeamList).hasSize(1);
        token = createToken(client.getBroker().getBrokerToken());
        mockMvc.perform(MockMvcRequestBuilders
                .delete("/admin/clients/{id}/members", clientTeam.getClient().getClientId())
                .header("Authorization", "Bearer " + token)
                .header("Content-Type", "application/json")
                .contentType(MediaType.parseMediaType("application/json;charset=UTF-8"))
                .content(jsonUtils.toJson(ClientMemberMapper.toDtos(clientTeamList)))
                .accept(MediaType.parseMediaType("application/json;charset=UTF-8")))
                .andExpect(status().isOk()).andReturn();

        clientTeamList = clientTeamRepository.findByClientClientId(client.getClientId());
        assertThat(clientTeamList).hasSize(0);
    }
    
    
    public MailDto creatingUsersFromClientTeam() throws Exception {

        List<User> users = new ArrayList<>();
        UsersPage usersPage = new UsersPage(users);
        when(mgmtAPI.users().list(any(UserFilter.class)).execute()).thenReturn(usersPage);

        Client client = testEntityHelper.createTestClient();

        ClientTeam clientTeam1 = testEntityHelper.createClientTeam(client.getBroker(), client);
        clientTeam1.setEmail("test1@mail.domain");
        ClientTeam clientTeam2 = testEntityHelper.createClientTeam(client.getBroker(), client);
        clientTeam2.setEmail("test2@mail.domain");
        clientTeam2.setAuthId(null);

        User user = new User("test");
        user.setEmail("test2@mail.domain");
        user.setAppMetadata(build(
                entry("brokerageRole", "user"),
                entry("brokerageId", client.getBroker().getBrokerToken()) ));
        when(mgmtAPI.users().create(any(User.class)).execute()).thenReturn(user);

        token = createToken(client.getBroker().getBrokerToken());
        MvcResult result = mockMvc
                .perform(MockMvcRequestBuilders
                        .post("/admin/clients/{id}/createUsers", client.getClientId())
                        .header("Authorization", "Bearer " + token)
                        .header("Content-Type", "application/json")
                        .contentType(MediaType.parseMediaType("application/json;charset=UTF-8"))
                        .accept(MediaType.parseMediaType("application/json;charset=UTF-8")))
                .andExpect(status().isOk()).andExpect(MockMvcResultMatchers.content()
                        .contentType("application/json;charset=UTF-8"))
                .andReturn();

        ClientMemberDto[] response = jsonUtils.fromJson(result.getResponse().getContentAsString(),
                ClientMemberDto[].class);

        assertThat(response).isNotEmpty();
        assertThat(response).hasSize(1);

        assertThat(response[0].getBrokerageId()).isEqualTo(client.getBroker().getBrokerId());
        assertThat(response[0].getEmail()).isEqualTo("test2@mail.domain");
        
        // test welcome email was send 
        ArgumentCaptor<MailDto> mailCaptor = ArgumentCaptor.forClass(MailDto.class);
        Mockito.verify(smtpMailer, Mockito.times(1)).send(mailCaptor.capture());
        
        MailDto mailDto = mailCaptor.getValue();
        
        assertThat(mailDto.getContent())
            .containsIgnoringCase("welcome");

        assertThat(mailDto.getSubject()).contains("Introducing our new online platform");
        assertThat(mailDto.getContent()).contains("salesFirstName salesLastName");
        
        // uncomment for manual testing
        //File html = new File("testCreatingUsersFromClientTeam-welcome.html");
        //FileUtils.writeByteArrayToFile(html, mailDto.getContent().getBytes());
        
        return mailDto;
        
    }

}
