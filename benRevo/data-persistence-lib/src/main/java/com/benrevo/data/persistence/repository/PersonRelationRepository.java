package com.benrevo.data.persistence.repository;

import com.benrevo.data.persistence.entities.Person;
import com.benrevo.data.persistence.entities.PersonRelation;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface PersonRelationRepository extends JpaRepository<PersonRelation, Long> {

  @Query("select pr.person from PersonRelation pr where pr.parent.personId = :parentId")
  List<Person> findChildren(@Param("parentId") Long parentId);

  @Query("select pr.parent from PersonRelation pr where pr.person.personId = :childId")
  List<Person> findParent(@Param("childId") Long childId);
  
  @Query("select pr from PersonRelation pr where pr.parent.personId = :parentId and pr.person.personId = :childId")
  PersonRelation findChild(@Param("parentId") Long parentId, @Param("childId") Long childId);
  
}
