package com.benrevo.data.persistence.repository;

import com.benrevo.data.persistence.entities.RFP;
import org.springframework.data.repository.CrudRepository;
import java.util.List;

public interface RfpRepository extends CrudRepository<RFP, Long> {

    RFP findByClientClientIdAndProduct(Long clientId, String product);
    // FIXME why not findOne(rfp_id) ? Redundant clientId condition
    RFP findByClientClientIdAndRfpId(Long clientId, Long rfp_id);

    List<RFP> findByClientClientId(Long clientId);
    // FIXME why not findAll(rfpIds) ? Redundant clientId condition
    List<RFP> findByClientClientIdAndRfpIdIn(Long clientId, List<Long> rfpIds);
}
