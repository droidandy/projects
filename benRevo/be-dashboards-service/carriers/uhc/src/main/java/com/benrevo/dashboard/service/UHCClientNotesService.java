package com.benrevo.dashboard.service;

import static com.benrevo.common.enums.CarrierType.UHC;
import static com.benrevo.common.util.MapBuilder.field;
import java.util.Date;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.benrevo.common.annotation.AppCarrier;
import com.benrevo.common.dto.ClientNotesDto;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientNotes;
import com.benrevo.data.persistence.repository.ClientNotesRepository;
import com.benrevo.data.persistence.repository.ClientRepository;

@Service
@AppCarrier(UHC)
@Transactional
public class UHCClientNotesService {

    @Autowired
    private ClientNotesRepository clientNotesRepository;
    
    @Autowired
    private ClientRepository clientRepository;
    
    public ClientNotesDto getByClientId(Long clientId) {

        ClientNotesDto result = new ClientNotesDto();
        ClientNotes notes = clientNotesRepository.findByClientClientId(clientId);

        if(notes != null) {
            result.setNotes(notes.getNotes());
        }

        return result; 
    }

    public void createOrUpdate(Long clientId, ClientNotesDto dto) {
        
        ClientNotes notes = clientNotesRepository.findByClientClientId(clientId);
        if (notes != null) {
            // update
            notes.setNotes(dto.getNotes());
            notes.setUpdated(new Date());
        } else {
            // create
            notes = new ClientNotes();
            Client client = clientRepository.findOne(clientId);
            if (client == null) {
                throw new NotFoundException("Client not found");
            }
            notes.setClient(client);
            notes.setNotes(dto.getNotes());
            notes.setUpdated(new Date());
            clientNotesRepository.save(notes);
        }
    }

}
