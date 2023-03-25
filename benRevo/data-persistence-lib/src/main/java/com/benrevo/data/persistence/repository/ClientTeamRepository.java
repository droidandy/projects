package com.benrevo.data.persistence.repository;

import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientTeam;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ClientTeamRepository extends CrudRepository<ClientTeam, Long> {

    List<ClientTeam> findByClientClientId(Long clientId);
    
    List<ClientTeam> findByAuthId(String authId);
    
    @Query("select ct.client from ClientTeam ct where ct.authId = :authId")
    List<Client> findClientsByAuthId(@Param("authId") String authId);

    boolean existsByClientClientIdAndAuthId(Long clientId, String authId);

}
