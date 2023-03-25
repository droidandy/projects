package com.benrevo.data.persistence.repository.ancillary;

import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.ancillary.RfpQuoteAncillaryPlan;
import java.util.List;
import org.springframework.data.repository.CrudRepository;

public interface RfpQuoteAncillaryPlanRepository extends CrudRepository<RfpQuoteAncillaryPlan, Long> {
    
    List<RfpQuoteAncillaryPlan> findByRfpQuote(RfpQuote rfpQuote);
}
