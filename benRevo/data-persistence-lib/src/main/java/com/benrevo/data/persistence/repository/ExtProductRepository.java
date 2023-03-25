package com.benrevo.data.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.benrevo.data.persistence.entities.ExtProduct;


public interface ExtProductRepository extends JpaRepository<ExtProduct, Long> {
	
	ExtProduct findByName(String name);
}

