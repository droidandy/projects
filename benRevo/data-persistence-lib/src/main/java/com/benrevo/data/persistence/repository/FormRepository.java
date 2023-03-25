package com.benrevo.data.persistence.repository;

import com.benrevo.data.persistence.entities.Form;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FormRepository extends JpaRepository<Form, Long> {
    List<Form> findByNameIn(String... names);

    Form findByName(String name);
}