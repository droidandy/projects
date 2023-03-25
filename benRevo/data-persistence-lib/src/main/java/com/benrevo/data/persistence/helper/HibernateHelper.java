package com.benrevo.data.persistence.helper;

import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

public class HibernateHelper {

	private static final SessionFactory sessionFactory = new Configuration().configure().buildSessionFactory();

	/*static {
		sessionFactory = new Configuration().configure().buildSessionFactory();
	}*/

	public static SessionFactory getSessionFactory() {
		return sessionFactory;
	}

}
