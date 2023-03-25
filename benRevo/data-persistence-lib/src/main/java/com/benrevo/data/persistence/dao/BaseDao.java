package com.benrevo.data.persistence.dao;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.hibernate.Session;
import org.hibernate.SessionFactory;

import com.benrevo.data.persistence.helper.HibernateHelper;

public class BaseDao {

	protected Logger logger = LogManager.getLogger(BaseDao.class.getName());

	private static SessionFactory factory; 
	private static Session session;
	
	static {
		if (factory == null) {
			synchronized (BaseDao.class) {
				factory = HibernateHelper.getSessionFactory();
				session = factory.openSession();
			}
		}
	}

	public static Session getEntityManager() {
		return session;
	}

	public static void beginTransaction() {
		session.getTransaction().begin();
	}

	public static void persist(Object o) {
		session.persist(o);
	}

	public static void flush() {
		session.flush();
	}
	
	public static void commit() {
		session.getTransaction().commit();
	}

	public static void rollback() {
		session.getTransaction().rollback();
	}

	public static void flushAndClose() {
		session.flush();
		session.close();
	}
}
