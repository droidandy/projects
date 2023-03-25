package com.benrevo.data.persistence.repository;

import com.benrevo.data.persistence.entities.MarketingList;
import java.util.List;
import org.springframework.data.repository.CrudRepository;

public interface MarketingListRepository extends CrudRepository<MarketingList, Long> {
    
    List<MarketingList> findByClientClientId(Long clientId);

}

