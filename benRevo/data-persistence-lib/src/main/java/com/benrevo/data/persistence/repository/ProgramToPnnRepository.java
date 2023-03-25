package com.benrevo.data.persistence.repository;

import com.benrevo.data.persistence.entities.PlanNameByNetwork;
import com.benrevo.data.persistence.entities.ProgramToPnn;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface ProgramToPnnRepository extends CrudRepository<ProgramToPnn, Long> {
    
    @Query("select ptp.pnn from ProgramToPnn ptp where ptp.programId = :programId "
        + "order by ptp.pnn.planType, ptp.pnn.name")
    List<PlanNameByNetwork> findPnnsByProgramId(@Param("programId") Long programId);

    List<ProgramToPnn> findByProgramId(Long programId);

    boolean existsByPnn(PlanNameByNetwork pnn);

    ProgramToPnn findByProgramIdAndPnn(Long programId, PlanNameByNetwork pnn);
}

