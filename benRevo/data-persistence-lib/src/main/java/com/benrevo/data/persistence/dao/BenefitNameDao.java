package com.benrevo.data.persistence.dao;

import java.util.List;

import org.hibernate.query.Query;

import com.benrevo.data.persistence.entities.BenefitName;

public class BenefitNameDao extends BaseDao {
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public List<BenefitName> getAllBenefitNames() {
		String sql = "SELECT bn FROM BenefitName bn";
		Query q = getEntityManager().createQuery(sql);
		return q.getResultList();
	}
}
