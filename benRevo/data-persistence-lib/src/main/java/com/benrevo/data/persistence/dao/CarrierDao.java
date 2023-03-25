package com.benrevo.data.persistence.dao;

import java.util.List;

import javax.persistence.NoResultException;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.benrevo.data.persistence.entities.Carrier;
import com.benrevo.data.persistence.helper.HibernateHelper;

@Repository
@Transactional
public class CarrierDao extends BaseDao {

	private static Logger logger = LogManager.getLogger(CarrierDao.class);

	private final SessionFactory sessionFactory;

	public CarrierDao() {
		sessionFactory = HibernateHelper.getSessionFactory();
	}

	//TODO: This belongs to the RFP section, needs to be refactored once code is ported.
	public List<Carrier> getAllCarriers(String category) {
		Session session = sessionFactory.getCurrentSession();
		session.beginTransaction();
		String sql = "SELECT rc.carrier FROM RfpCarrier rc WHERE rc.category = :category";
		Query q = session.createQuery(sql).setParameter("category", category);
		session.getTransaction().commit();
		return q.getResultList();
	}

	//TODO: rename method to getCarrierById
	//Done
	public Carrier getCarrier(long carrierId) {
		Carrier carrier = null;

		Session session = sessionFactory.getCurrentSession();
		session.beginTransaction();
		try {
			String sql = "SELECT c FROM Carrier c WHERE c.carrierId = :carrierId";
			Query q = session.createQuery(sql);
			q.setParameter("carrierId", carrierId);
			carrier = (Carrier) q.getSingleResult();
		} catch (NoResultException e) {
			logger.info("No result found for carrier lookup with id=" + carrierId);
		}
		session.getTransaction().commit();
		return carrier;
	}

	public Carrier getCarrierByName(String name) {
		Carrier carrier = null;
		try {
			String sql = "SELECT c FROM Carrier c WHERE c.name = :name";
			Query q = getEntityManager().createQuery(sql);
			q.setParameter("name", name);
			carrier = (Carrier) q.getSingleResult();
		} catch (NoResultException e) {
			logger.info("No result found for carrier lookup with name=" + name);
		}
        return carrier;
	}
}
