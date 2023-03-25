package com.benrevo.data.persistence.repository;

import org.springframework.data.repository.CrudRepository;

import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpQuoteOption;
import com.benrevo.data.persistence.entities.RfpQuoteVersion;

public interface RfpQuoteVersionRepository extends CrudRepository<RfpQuoteVersion, Long> {

}
