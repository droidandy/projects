package com.benrevo.data.persistence.dao;

import javax.persistence.NoResultException;
import javax.persistence.PersistenceException;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.exception.ConstraintViolationException;
import org.hibernate.query.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.deprecated.BrokerRegistration;
import com.benrevo.data.persistence.helper.HibernateHelper;

@Repository
@Transactional
public class BrokerRegistrationDao {

	private static Logger logger = LogManager.getLogger(BrokerRegistrationDao.class);

	private final SessionFactory sessionFactory;

	public BrokerRegistrationDao() {
		sessionFactory = HibernateHelper.getSessionFactory();
	}

	public BrokerRegistration saveBrokerRegistration(String brokerName, String contactName, String contactEmail,
			String registrationToken) throws IllegalArgumentException {
		Session session = sessionFactory.getCurrentSession();
		session.beginTransaction();
		BrokerRegistration br = new BrokerRegistration(brokerName, contactName, contactEmail, registrationToken);
		try {
			session.persist(br);
		} catch (PersistenceException c) {
			session.getTransaction().rollback();

			if (c.getCause() instanceof ConstraintViolationException) {
				logger.error("Broker registration attempted with information that already exists.");
				throw new IllegalArgumentException(
						"Broker registration attempted with information that already exists.", c);
			}
			logger.error("Issue persisting Broker Registration to database", c);
			return null;
		}
		session.getTransaction().commit();
		return br;
	}
    //Done
	public BrokerRegistration getBrokerRegistration(String registrationToken) {
		BrokerRegistration result = null;

		Session session = sessionFactory.getCurrentSession();
		session.beginTransaction();
		try {
			String sql = "SELECT br FROM broker_registration as br WHERE br.registrationToken = :registrationToken";

			Query q = session.createQuery(sql).setParameter("registrationToken", registrationToken);
			result = (BrokerRegistration) q.getSingleResult();
		} catch (NoResultException e) {
			// This is ok, possibly no results
			logger.info("Did not find broker registration for token=" + registrationToken);
		}
		session.getTransaction().commit();
		return result;
	}

	public void updateBrokerRegistration(Broker brokerId, String registrationToken) throws IllegalArgumentException {
		Session session = sessionFactory.getCurrentSession();
		session.beginTransaction();
		try {
			String sql = "UPDATE broker_registration set broker_id = :brokerId where registration_token = :registrationToken";
			Query q = session.createNativeQuery(sql).setParameter("brokerId", brokerId)
					.setParameter("registrationToken", registrationToken);
			q.executeUpdate();
		} catch (ConstraintViolationException c) {
			session.getTransaction().rollback();
			logger.error("Error: invalid broker id=" + brokerId.getBrokerId() + " used to update Broker Registration.");
			throw new IllegalArgumentException("Broker id provided is invalid:", c);
		} catch (Exception e) {
			session.getTransaction().rollback();
			logger.error("Error updating broker id on Broker Registration.", e);
		}
		session.getTransaction().commit();
	}
}
