package com.benrevo.data.persistence.dao;

import org.hibernate.query.Query;

import com.benrevo.data.persistence.entities.deprecated.BenefitCategory;

public class BenefitCategoryDao extends BaseDao {
	
	public BenefitCategory getBenefitCategory(String category) {
		String sql = "SELECT bc FROM BenefitCategory bc WHERE name = :category";
		Query q = getEntityManager().createQuery(sql).setParameter("category", category);
		return (BenefitCategory) q.getSingleResult();
	}
}
