package com.benrevo.data.persistence.repository.ancillary;

import com.benrevo.data.persistence.entities.ancillary.AncillaryPlan;
import com.benrevo.data.persistence.entities.ancillary.ProgramToAncillaryPlan;
import java.util.List;
import org.springframework.data.repository.CrudRepository;

public interface ProgramToAncillaryPlanRepository extends CrudRepository<ProgramToAncillaryPlan, Long> {
    
    List<ProgramToAncillaryPlan> findByProgramId(Long programId);
    
    List<ProgramToAncillaryPlan> findByProgramIdAndAncillaryPlanPlanYear(Long programId, Integer planYear);

    ProgramToAncillaryPlan findByProgramIdAndAncillaryPlanPlanNameAndAncillaryPlanPlanYear(
    		Long programId, String planName, Integer planYear);

    boolean existsByAncillaryPlan(AncillaryPlan ancillaryPlan);
}

