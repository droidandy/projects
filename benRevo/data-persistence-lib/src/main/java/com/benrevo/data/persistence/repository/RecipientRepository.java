package com.benrevo.data.persistence.repository;

import com.benrevo.common.enums.EmailType;
import com.benrevo.data.persistence.entities.Recipient;
import java.util.List;
import org.springframework.data.repository.CrudRepository;

public interface RecipientRepository extends CrudRepository<Recipient, Long> {
    
    List<Recipient> findByEmailTypeAndCarrierId(EmailType emailType, Long carrierId);
}

