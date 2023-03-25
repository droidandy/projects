package com.benrevo.data.persistence.repository;

import com.benrevo.data.persistence.entities.RfpQuoteSummary;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RfpQuoteSummaryRepository extends JpaRepository<RfpQuoteSummary, Long> {
    RfpQuoteSummary findByClientClientId(Long clientId);
}