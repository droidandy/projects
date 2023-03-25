/**
 * 
 */
package com.benrevo.data.persistence.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.benrevo.data.persistence.entities.User;

/**
 * @author Santosh
 *
 */

public interface UserRepository extends CrudRepository<User, Long> {
	List<User> findByEmail(String email);

	List<User> findByEmailAndPassword(String email, String password);

	List<User> findByBrokerBrokerId(Long brokerId);

	List<User> findByBrokerBrokerIdAndAdmin(Long brokerId, boolean admin);
	
	
}