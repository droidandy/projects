/**
 * 
 */
package com.benrevo.data.persistence.repository;

import com.benrevo.data.persistence.entities.PlanHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PlanHistoryRepository extends JpaRepository<PlanHistory, Long> {

    @Query("SELECT DISTINCT a.batchNumber FROM PlanHistory a ORDER BY a.batchNumber DESC")
    List<Long> findMaxBatchNumber();

    List<PlanHistory> findByPlanName(String planName);

    List<PlanHistory> findByPlanNameAndBatchNumber(String planName, Long batchNumber);
}
