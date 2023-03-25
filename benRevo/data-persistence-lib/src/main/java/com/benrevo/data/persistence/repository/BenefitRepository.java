package com.benrevo.data.persistence.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.benrevo.data.persistence.entities.Benefit;


public interface BenefitRepository extends JpaRepository<Benefit, Long> {

	@Query(value = "select b from Benefit b "
			+ "inner join b.benefitName bn "
			+ "where b.plan.planId = :planId "
			+ "order by b.benefitName.ordinal, b.inOutNetwork asc")
	List<Benefit> findByPlanId(@Param("planId") Long planId);	
}

