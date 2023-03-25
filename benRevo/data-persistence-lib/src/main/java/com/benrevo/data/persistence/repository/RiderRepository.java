package com.benrevo.data.persistence.repository;

import com.benrevo.data.persistence.entities.Rider;
import com.benrevo.data.persistence.entities.RiderMeta;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RiderRepository extends JpaRepository<Rider, Long> {
    
    List<Rider> findByRiderMetaCategory(String category);
    
    List<Rider> findByRiderMeta(RiderMeta riderMeta);
}
