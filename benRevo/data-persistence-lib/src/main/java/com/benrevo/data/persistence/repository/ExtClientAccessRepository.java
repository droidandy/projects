/**
 *
 */
package com.benrevo.data.persistence.repository;

import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ExtClientAccess;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


/**
 * @author Akorchak
 */
public interface ExtClientAccessRepository extends JpaRepository<ExtClientAccess, Long> {

    @Query("select eca.client from ExtClientAccess eca where eca.extBroker.brokerId = :extBrokerId")
    List<Client> findClientsByBrokerId(@Param("extBrokerId") Long extBrokerId);

    ExtClientAccess findDistinctFirstByClientClientIdAndExtBrokerBrokerId(
        Long clientId, Long brokerId
    );

    List<ExtClientAccess> findByClient(Client client);
}
