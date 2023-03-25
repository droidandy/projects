package com.benrevo.data.persistence.repository;

import com.benrevo.data.persistence.entities.Variant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VariantRepository extends JpaRepository<Variant, Long> {
}