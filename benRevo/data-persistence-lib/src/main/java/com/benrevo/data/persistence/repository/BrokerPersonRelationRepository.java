package com.benrevo.data.persistence.repository;

import com.benrevo.data.persistence.entities.BrokerPersonRelation;
import com.benrevo.data.persistence.entities.Person;
import com.benrevo.data.persistence.entities.PersonRelation;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface BrokerPersonRelationRepository extends JpaRepository<BrokerPersonRelation, Long> {

}
