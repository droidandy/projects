package com.benrevo.data.persistence.repository;

import com.benrevo.data.persistence.entities.CarrierHistory;
import com.benrevo.data.persistence.entities.RFP;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CarrierHistoryRepository extends JpaRepository<CarrierHistory, Long> {

    List<CarrierHistory> findByRfpRfpIdAndCurrent(Long rfpId, boolean current);
}
