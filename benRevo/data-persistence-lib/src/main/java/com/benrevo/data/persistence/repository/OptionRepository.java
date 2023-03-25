package com.benrevo.data.persistence.repository;

import com.benrevo.data.persistence.entities.Option;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface OptionRepository extends CrudRepository<Option, Long> {

    List<Option> findByRfpRfpId(Long rfpId);

}
