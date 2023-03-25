package com.benrevo.data.persistence.repository;

import com.benrevo.data.persistence.entities.Question;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepository extends JpaRepository<Question, Long> {
}