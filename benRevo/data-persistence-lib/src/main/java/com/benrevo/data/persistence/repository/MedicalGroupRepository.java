package com.benrevo.data.persistence.repository;

import com.benrevo.data.persistence.entities.MedicalGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MedicalGroupRepository extends JpaRepository<MedicalGroup, Long> {

    @Query("SELECT mg FROM MedicalGroup mg WHERE mg.carrier.carrierId = :carrierId")
    List<MedicalGroup> findMedicalGroupsByCarrierId(@Param("carrierId") Long carrierId);
}
