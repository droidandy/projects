package com.benrevo.data.persistence.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.benrevo.data.persistence.entities.ClientRfpProduct;

public interface ClientRfpProductRepository extends JpaRepository<ClientRfpProduct, Long> {

	List<ClientRfpProduct> findByClientId(Long clientId);

    ClientRfpProduct findByClientIdAndExtProductNameAndVirginGroupIsTrue(Long clientId, String name);
}
