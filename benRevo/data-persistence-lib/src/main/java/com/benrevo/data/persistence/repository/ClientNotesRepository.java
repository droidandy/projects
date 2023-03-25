package com.benrevo.data.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.benrevo.data.persistence.entities.ClientNotes;

public interface ClientNotesRepository extends JpaRepository<ClientNotes, Long> {
    ClientNotes findByClientClientId(Long clientId);
}