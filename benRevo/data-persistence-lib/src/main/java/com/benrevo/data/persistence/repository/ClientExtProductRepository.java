package com.benrevo.data.persistence.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.benrevo.data.persistence.entities.ClientExtProduct;


public interface ClientExtProductRepository extends JpaRepository<ClientExtProduct, Long> {

	List<ClientExtProduct> findByClientId(Long clientId);	
}


