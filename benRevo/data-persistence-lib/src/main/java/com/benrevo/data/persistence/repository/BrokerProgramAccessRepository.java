package com.benrevo.data.persistence.repository;

import com.benrevo.data.persistence.entities.BrokerProgramAccess;
import com.benrevo.data.persistence.entities.Program;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BrokerProgramAccessRepository extends JpaRepository<BrokerProgramAccess, Long> {

    @Query("select bpa.program from BrokerProgramAccess bpa where bpa.broker.brokerId = :brokerId")
    List<Program> findProgramsByBrokerId(@Param("brokerId") Long brokerId);
}
