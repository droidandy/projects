/**
 * 
 */
package com.benrevo.data.persistence.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.benrevo.data.persistence.entities.Carrier;


/**
 * @author Santosh
 *
 */

public interface CarrierRepository extends JpaRepository<Carrier, Long> {
	List<Carrier> findByCarrierId(String carrierId);
  
	Carrier findByName(String carrierName);

	Carrier findByNameIgnoreCase(String carrierName);

	Carrier findByNameOrDisplayNameIgnoreCase(String name, String displayName);
}

