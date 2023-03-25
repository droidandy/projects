package com.benrevo.data.persistence.dao;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;

import com.benrevo.data.persistence.entities.deprecated.PlanCategoryInfo;
import com.benrevo.data.persistence.helper.HibernateHelper;

public class PlanCategoryInfoDao {

	private final SessionFactory sessionFactory;

	public PlanCategoryInfoDao() {
		sessionFactory = HibernateHelper.getSessionFactory();
	}

	public PlanCategoryInfo getPlanCategoryInfo(String category, String code) {
		Session session = sessionFactory.getCurrentSession();
		session.beginTransaction();

		String sql = "SELECT pci FROM PlanCategoryInfo pci WHERE benefitCategoryInfo.benefitCategory.name = :category and planInfo.code = :code";
		Query q = session.createQuery(sql).setParameter("category", category).setParameter("code", code);
		session.getTransaction().commit();
		return (PlanCategoryInfo) q.getSingleResult();
	}
}
