package com.benrevo.data.persistence.repository;

import com.benrevo.data.persistence.entities.Program;
import com.benrevo.data.persistence.entities.RfpCarrier;
import java.util.List;
import org.springframework.data.repository.CrudRepository;

public interface ProgramRepository extends CrudRepository<Program, Long> {

    Program findByRfpCarrierAndName(RfpCarrier rfpCarrier, String name);
    
    List<Program> findByName(String name);
}

