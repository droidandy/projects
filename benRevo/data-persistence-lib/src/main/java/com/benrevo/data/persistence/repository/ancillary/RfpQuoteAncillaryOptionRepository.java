package com.benrevo.data.persistence.repository.ancillary;

import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.ancillary.RfpQuoteAncillaryOption;
import com.benrevo.data.persistence.entities.ancillary.RfpQuoteAncillaryPlan;
import java.util.List;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface RfpQuoteAncillaryOptionRepository extends CrudRepository<RfpQuoteAncillaryOption, Long> {
    
    List<RfpQuoteAncillaryOption> findByRfpQuote(RfpQuote rfpQuote);
    
    @Modifying
    @Query("update RfpQuoteAncillaryOption opt set opt.secondRfpQuoteAncillaryPlan = ?1 where opt.rfpQuoteAncillaryOptionId = ?2")
    void setSelectedSecondPlan(RfpQuoteAncillaryPlan plan, Long rfpQuoteAncillaryOptionId);
    
    @Modifying
    @Query("update RfpQuoteAncillaryOption opt set opt.rfpQuoteAncillaryPlan = ?1 where opt.rfpQuoteAncillaryOptionId = ?2")
    void setSelectedPlan(RfpQuoteAncillaryPlan plan, Long rfpQuoteAncillaryOptionId);
}
