package com.benrevo.data.persistence.repository;

import com.benrevo.data.persistence.entities.RfpToPnn;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RfpToPnnRepository extends JpaRepository<RfpToPnn, Long> {

    List<RfpToPnn> findByRfpRfpIdAndPlanType(Long rfpId, String planType);

    List<RfpToPnn> findByRfpRfpId(Long rfpId);

    RfpToPnn findByRfpRfpIdAndOptionIdAndPlanType(Long rfpId, Long optionId, String planType);
}
