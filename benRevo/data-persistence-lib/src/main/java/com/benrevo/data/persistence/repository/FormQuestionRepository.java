package com.benrevo.data.persistence.repository;

import com.benrevo.data.persistence.entities.FormQuestion;
import org.springframework.data.repository.CrudRepository;

public interface FormQuestionRepository extends CrudRepository<FormQuestion, Long> {
}