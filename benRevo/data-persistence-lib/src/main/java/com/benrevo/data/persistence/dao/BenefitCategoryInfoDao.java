package com.benrevo.data.persistence.dao;

import org.hibernate.query.Query;

import com.benrevo.data.persistence.entities.deprecated.BenefitCategoryInfo;

public class BenefitCategoryInfoDao extends BaseDao {
	
	public BenefitCategoryInfo getBenefitCarrierInfo(String category, String code, String group) {
		String sql = "SELECT bci FROM BenefitCategoryInfo bci WHERE benefitCategory.name = :category "
				+ "AND code = :code "
				+ "AND group = :group ";
		Query q = getEntityManager().createQuery(sql);
		q.setParameter("category", category);
		q.setParameter("code", code);
		q.setParameter("group", group);
		return (BenefitCategoryInfo) q.getSingleResult();
	}
}
