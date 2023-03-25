package com.benrevo.data.persistence.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.benrevo.data.persistence.entities.Benefit;
import com.benrevo.data.persistence.entities.BenefitName;


public interface BenefitNameRepository extends JpaRepository<BenefitName, Long> {
	BenefitName findByName(String name);
}

