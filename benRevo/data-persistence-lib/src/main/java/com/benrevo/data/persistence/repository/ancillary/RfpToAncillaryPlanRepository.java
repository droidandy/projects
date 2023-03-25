package com.benrevo.data.persistence.repository.ancillary;

import com.benrevo.data.persistence.entities.ancillary.RfpToAncillaryPlan;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RfpToAncillaryPlanRepository extends JpaRepository<RfpToAncillaryPlan, Long> {

    List<RfpToAncillaryPlan> findByRfp_RfpId(Long rfpId);

}
