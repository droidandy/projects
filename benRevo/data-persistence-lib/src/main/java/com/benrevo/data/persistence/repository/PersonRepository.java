package com.benrevo.data.persistence.repository;

import com.benrevo.common.enums.PersonType;
import com.benrevo.data.persistence.entities.Person;
import java.util.List;
import org.springframework.data.repository.CrudRepository;


public interface PersonRepository extends CrudRepository<Person, Long> {
    
	List<Person> findByCarrierId(Long carrierId);
	
	List<Person> findByCarrierIdAndType(Long carrierId, PersonType type);
	
	List<Person> findByCarrierIdAndTypeAndFirstNameAndLastName(Long carrierId, PersonType type, 
	    String firstName, String lastName);
	
	Person findByCarrierIdAndTypeAndEmail(Long carrierId, PersonType type, String email);
}

