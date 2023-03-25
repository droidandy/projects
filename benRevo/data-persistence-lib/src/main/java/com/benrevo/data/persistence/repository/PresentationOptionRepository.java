/**
 * 
 */
package com.benrevo.data.persistence.repository;

import com.benrevo.data.persistence.entities.PresentationOption;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface PresentationOptionRepository extends CrudRepository<PresentationOption, Long> {
    
    List<PresentationOption> findByClientClientId(Long clientId);
    
    @Query("select po from PresentationOption po "
        + "where po.medicalRfpQuoteOption.rfpQuoteOptionId = :rfpQuoteOptionId "
        + "or po.dentalRfpQuoteOption.rfpQuoteOptionId = :rfpQuoteOptionId "
        + "or po.visionRfpQuoteOption.rfpQuoteOptionId = :rfpQuoteOptionId")
    List<PresentationOption> findByRfpQuoteOptionId(@Param("rfpQuoteOptionId") Long rfpQuoteOptionId);
    
    @Query("select po from PresentationOption po "
        + "where po.lifeRfpQuoteAncillaryOption.rfpQuoteAncillaryOptionId = :rfpQuoteAncillaryOptionId "
        + "or po.stdRfpQuoteAncillaryOption.rfpQuoteAncillaryOptionId = :rfpQuoteAncillaryOptionId "
        + "or po.ltdRfpQuoteAncillaryOption.rfpQuoteAncillaryOptionId = :rfpQuoteAncillaryOptionId")
    List<PresentationOption> findByRfpQuoteAncillaryOptionId(@Param("rfpQuoteAncillaryOptionId") Long rfpQuoteAncillaryOptionId);
}