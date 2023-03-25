/**
 * 
 */
package com.benrevo.data.persistence.repository;

import com.benrevo.data.persistence.entities.RfpCarrier;
import java.util.List;
import org.springframework.data.repository.CrudRepository;

public interface RfpCarrierRepository extends CrudRepository<RfpCarrier, Long> {

    List<RfpCarrier> findByCarrierCarrierId(Long carrierId);
    
    List<RfpCarrier> findByCategoryOrderByCarrierDisplayNameAsc(String category);

    RfpCarrier findByCarrierNameAndCategory(String name, String category);
    
    RfpCarrier findByCarrierCarrierIdAndCategory(Long carrierId, String category);
}
