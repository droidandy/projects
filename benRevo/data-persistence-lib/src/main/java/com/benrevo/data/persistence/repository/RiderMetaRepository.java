package com.benrevo.data.persistence.repository;

import com.benrevo.data.persistence.entities.RiderMeta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RiderMetaRepository extends JpaRepository<RiderMeta, Long> {

    List<RiderMeta> findByCode(List<String> code);

    List<RiderMeta> findByCodeAndPlanType(String code, String planType);
    
    List<RiderMeta> findByCodeAndTypeAndTypeValue(String code, String type, String typeValue);
    
    List<RiderMeta> findByPlanTypeAndTypeAndTypeValueAndType2AndTypeValue2(String planType, 
        String type, String typeValue, String type2, String typeValue2);  
}
