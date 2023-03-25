/**
 *
 */
package com.benrevo.data.persistence.repository;

import com.benrevo.data.persistence.entities.ExtBrokerageAccess;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * @author Akorchak
 */
public interface ExtBrokerageAccessRepository extends JpaRepository<ExtBrokerageAccess, Long> {

  @Query("select eba from ExtBrokerageAccess eba where eba.extBroker.brokerId = :extBrokerId and eba.broker.brokerId = :brokerId")
  ExtBrokerageAccess findByExtBrokerIdAndBrokerId(@Param("extBrokerId") Long extBrokerId,
      @Param("brokerId") Long brokerId);

  @Query("select eba from ExtBrokerageAccess eba where eba.extBroker.brokerId = :extBrokerId")
  List<ExtBrokerageAccess> findAllByExtBrokerId(@Param("extBrokerId") Long extBrokerId);
}
