package com.benrevo.data.persistence.repository;

import javax.persistence.EntityManager;

public interface CustomRepository {
    EntityManager getEntityManager();
}