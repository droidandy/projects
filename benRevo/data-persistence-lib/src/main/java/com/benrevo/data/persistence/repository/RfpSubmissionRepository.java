package com.benrevo.data.persistence.repository;

import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.Program;
import com.benrevo.data.persistence.entities.RfpCarrier;
import com.benrevo.data.persistence.entities.RfpSubmission;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface RfpSubmissionRepository extends CrudRepository<RfpSubmission, Long> {

    RfpSubmission findByRfpCarrierAndClient(RfpCarrier rfpCarrier, Client client);
    
    RfpSubmission findByProgramAndClient(Program program, Client client);

    List<RfpSubmission> findByClient(Client client);
    
    List<RfpSubmission> findByClientAndRfpCarrierCategory(Client client, String category);

}
