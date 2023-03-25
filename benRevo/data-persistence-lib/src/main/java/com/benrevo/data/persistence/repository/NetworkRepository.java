/**
 * 
 */
package com.benrevo.data.persistence.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.entities.Network;

/**
 * @author Santosh
 *
 */

public interface NetworkRepository extends CrudRepository<Network, Long> {
	Network findByNameAndTypeAndCarrier(String name, String type, Carrier carrier);
	
	List<Network> findByTypeAndCarrier(String type, Carrier carrier);
	
	List<Network> findByCarrierCarrierId(Long carrierId);

}
