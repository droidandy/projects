package com.benrevo.dashboard.controller;


import static org.assertj.core.api.Assertions.assertThat;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MvcResult;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.common.dto.ClientNotesDto;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientNotes;
import com.benrevo.data.persistence.repository.ClientNotesRepository;

public class UHCClientNotesControllerTest extends AbstractControllerTest {
    
    private static final String CLIENT_NOTES_ENDPOINT_URI = "/dashboard/clients/{id}/clientNotes";

    @Autowired
    private UHCClientNotesController controller;

    @Autowired
    private ClientNotesRepository clientNotesRepository;

    @Before
    @Override
    public void init() {
        initController(controller);
    }

    @Test
    public void testGetClientNotesByClientId() throws Exception {
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        ClientNotes notes = new ClientNotes();
        notes.setClient(client);
        notes.setNotes("Test client history");
        clientNotesRepository.save(notes);

        MvcResult result = performGetAndAssertResult(null, CLIENT_NOTES_ENDPOINT_URI, client.getClientId());
        
        ClientNotesDto dto = jsonUtils.fromJson(result.getResponse().getContentAsString(), ClientNotesDto.class);

        assertThat(dto).isNotNull();
        assertThat(dto.getNotes()).isEqualTo(notes.getNotes());
    }

    @Test
    public void testUpdateClientNotesByClientId() throws Exception {
        
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());

        ClientNotes notes = new ClientNotes();
        notes.setClient(client);
        notes.setNotes("Test client history");
        clientNotesRepository.save(notes);

        ClientNotesDto dto = new ClientNotesDto();
        dto.setNotes("Updated client history");
        
        performPostAndAssertResult(jsonUtils.toJson(dto), null, CLIENT_NOTES_ENDPOINT_URI, client.getClientId());
        
        ClientNotes createdNotes = clientNotesRepository.findByClientClientId(client.getClientId());
        assertThat(createdNotes).isNotNull();
        assertThat(createdNotes.getNotes()).isEqualTo(dto.getNotes());
        
    }

    @Test
    public void testCreateClientNotesByClientId() throws Exception {
        
        Client client = testEntityHelper.createTestClient();
        token = createToken(client.getBroker().getBrokerToken());
        ClientNotesDto dto = new ClientNotesDto();
        dto.setNotes("Test client history");
        
        performPostAndAssertResult(jsonUtils.toJson(dto), null, CLIENT_NOTES_ENDPOINT_URI, client.getClientId());
        
        ClientNotes createdNotes = clientNotesRepository.findByClientClientId(client.getClientId());
        assertThat(createdNotes).isNotNull();
        assertThat(createdNotes.getNotes()).isEqualTo(dto.getNotes());
        
    }

}
