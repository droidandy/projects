package com.benrevo.data.persistence.dao;

import java.util.List;
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
import com.benrevo.common.dto.Account;
import com.benrevo.common.util.Secure;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.User;
import com.benrevo.data.persistence.helper.HibernateHelper;

@Repository
@Transactional
public class AccountDao extends BaseDao {

	private static Logger logger = LogManager.getLogger(AccountDao.class);

	private final SessionFactory sessionFactory;

	public AccountDao() {
		sessionFactory = HibernateHelper.getSessionFactory();
	}

	/**************************************************************
	 * Broker
	 **************************************************************/

	public Broker createBroker(String name, String address, String city, String state, String zip, String brokerToken) {
		Broker newBroker = new Broker(name, address, city, state, zip, brokerToken);
		try {
			getEntityManager().persist(newBroker);
		} catch (Exception c) {

			if (c.getCause() instanceof ConstraintViolationException) {
				logger.error("Broker with provided name already exists, must be unique.");
				throw new IllegalArgumentException("Broker with provided name already exists, must be unique.", c);
			}
			logger.error("Issue persisting Broker to database", c);
			return null;
		}
		return newBroker;
	}

	public Broker findBrokerByBrokerToken(String brokerToken) {
		Broker broker = null;
		Session session = sessionFactory.getCurrentSession();
		session.beginTransaction();
		try {
			String sql = "SELECT b FROM Broker b WHERE b.brokerToken = :brokerToken";
			Query q = session.createQuery(sql);
			q.setParameter("brokerToken", brokerToken);
			broker = (Broker) q.getSingleResult();
		} catch (NoResultException e) {
			return null;
		}
		session.getTransaction().commit();
		return broker;
	}

	/***************************************
	 * User
	 ***************************************/

	public User createUser(String name, String hashedPassword, String email, String role, String phone, String status,
			boolean admin, Broker broker) throws IllegalArgumentException {
		//validate required parameters
		if (null == broker) {
			throw new IllegalArgumentException("Broker parameter must reference a valid broker account.");
		}

		Session session = sessionFactory.getCurrentSession();

		User newUser = new User(name, hashedPassword, email, role, phone, status, admin, broker);
		try {
			session.beginTransaction();
			session.persist(newUser);
			session.getTransaction().commit();
		} catch (PersistenceException c) {
			session.getTransaction().rollback();

			if (c.getCause() instanceof ConstraintViolationException) {
				logger.error("User with provided email address already exists.");
				throw new IllegalArgumentException("User with provided email address already exists.", c);
			}
			logger.error("Issue persisting User to database", c);
			return null;
		}
		return newUser;
	}

	public User findUser(String email) {
		User user = null;
		Session session = sessionFactory.getCurrentSession();
		session.beginTransaction();
		try {
			String sql = "SELECT u FROM User u WHERE u.email = :email";
			Query q = session.createQuery(sql);
			q.setParameter("email", email);
			user = (User) q.getSingleResult();
			session.getTransaction().commit();
		} catch (NoResultException e) {
			session.getTransaction().rollback();
		}

		return user;
	}

	public User findUserWithEmailPassword(String email, String password) {
		User user = null;
		// Use salt and md5 encryption to make them hard to crack
		String hashedPassword = Secure.md5Salt(password);
		Session session = sessionFactory.getCurrentSession();
		try {
			session.beginTransaction();
			String sql = "SELECT u FROM User u WHERE u.email = :email and u.password = :password";
			Query q = session.createQuery(sql);
			q.setParameter("email", email);
			q.setParameter("password", hashedPassword);
			user = (User) q.getSingleResult();
			session.getTransaction().commit();
		} catch (NoResultException n) {
			session.getTransaction().commit();
			logger.info("No user found with email=" + email + " and password provided.");
		} catch (Exception e) {
			session.getTransaction().commit();
			logger.error("Error looking up user with email=" + email, e);
		}

		return user;
	}

	/**************************************************************
	 * Not Tested
	 **************************************************************/

	public Account findAccount(String email) {
		User user = null;
		Account account = null;
		Session session = sessionFactory.getCurrentSession();
		try {
			session.beginTransaction();
			String sql = "SELECT u FROM User u WHERE u.email = :email";
			Query q = session.createQuery(sql);
			q.setParameter("email", email);
			List<User> resultList = q.getResultList();
			if (resultList.size() > 0) {
				user = resultList.get(0);
				account = user.toAccount();
			}
			session.getTransaction().commit();
		} catch (NoResultException e) {
			session.getTransaction().rollback();
		}

		return account;
	}

	public List<Client> getClientByBrokerId(long brokerId) {
		List<Client> clients = null;
		Session session = sessionFactory.getCurrentSession();
		try {
			session.beginTransaction();
			String sql = "SELECT gi FROM Client gi WHERE gi.broker.brokerId = :brokerId";
			Query<Client> q = session.createQuery(sql);
			q.setParameter("brokerId", brokerId);
			clients = q.getResultList();
			session.getTransaction().commit();
		} catch (NoResultException e) {
			session.getTransaction().commit();
		}
		return clients;
	}

	public Client getClientByNameAndBrokerId(String name, long brokerId) {
		Client client = null;

		Session session = sessionFactory.getCurrentSession();
		session.beginTransaction();
		try {
			String sql = "SELECT gi FROM Client gi WHERE gi.clientName = :name and gi.broker.brokerId = :brokerId";
			Query q = session.createQuery(sql);
			q.setParameter("name", name);
			q.setParameter("brokerId", brokerId);
			List<Client> rs = q.getResultList();
			if (rs.size() > 0) {
				client = (Client) q.getSingleResult();
			}
		} catch (NoResultException e) {
		}
		session.getTransaction().commit();
		return client;

	}

	public Broker findBrokerByUserId(long userId, boolean isAdmin) {
		Broker broker = null;

		Session session = sessionFactory.getCurrentSession();
		session.beginTransaction();
		try {
			String sql = "SELECT u.broker FROM User u WHERE u.userId = :userId" + (isAdmin ? " and u.admin = 1 " : "");
			Query q = session.createQuery(sql);
			q.setParameter("userId", userId);
			broker = (Broker) q.getSingleResult();
		} catch (NoResultException e) {
		}
		session.getTransaction().commit();
		return broker;
	}

	public List<User> findBrokerUsersByUserId(long userId, boolean mustBeAdmin) {
		Broker broker = findBrokerByUserId(userId, mustBeAdmin);
		return findBrokerUsersByBrokerId(broker.getBrokerId());
	}

	public List<User> findBrokerUsersByBrokerId(long brokerId) {
		List<User> results = null;
		if (brokerId > 0) {
			Session session = sessionFactory.getCurrentSession();
			session.beginTransaction();
			try {
				String sql = "SELECT u FROM User u WHERE u.broker.brokerId = :brokerId";
				Query q = session.createQuery(sql);
				q.setParameter("brokerId", brokerId);
				results = q.getResultList();
			} catch (NoResultException e) {
			}
			session.getTransaction().commit();
		}
		return results;
	}

	public UserWithOperationStatus updateBrokerUserByUserId(long championId, long userId, String userStatus) {
		UserWithOperationStatus result = new UserWithOperationStatus();

		Broker champion = findBrokerByUserId(championId, true);
		if (champion == null) {
			result.setOperationStatus(UserWithOperationStatus.OPERATION_RESULT_CHAMPION_NOT_FOUND);
			return result;
		}

		Session session = sessionFactory.getCurrentSession();
		session.beginTransaction();
		User user = session.find(User.class, userId);
		session.getTransaction().commit();
		if (user == null) {
			result.setOperationStatus(UserWithOperationStatus.OPERATION_RESULT_USER_NOT_FOUND);
		} else {
			user.setStatus(userStatus);
			result.setUser(user);
			result.setOperationStatus(UserWithOperationStatus.OPERATION_RESULT_SUCCESS);
		}
		return result;
	}

	/*
	public AccessToken getUserAccessToken(String token, long userId) {
		AccessToken accessToken = null;

		Session session = sessionFactory.getCurrentSession();
		session.beginTransaction();
		try {
			String sql = "SELECT a FROM OauthAccessToken a WHERE a.accessToken = :accessToken and a.userId = :userId";
			Query q = session.createQuery(sql);
			q.setParameter("accessToken", token);
			q.setParameter("userId", userId);
			List<OauthAccessToken> rs = q.getResultList();
			if (rs.size() > 0) {
				accessToken = rs.get(0).toAccessToken();
			}
		} catch (NoResultException e) {
		}
		session.getTransaction().commit();
		return accessToken;
	}

	public AccessToken getUserAccessToken(CredentialsParams params) {
		AccessToken accessToken = null;
		Session session = sessionFactory.getCurrentSession();
		session.beginTransaction();
		try {
			User user = findUserWithEmailPassword(params.getEmail(), params.getPassword());
			if (user != null) {
				String sql = "SELECT a FROM OauthAccessToken a WHERE a.userId = :userId";
				Query q = session.createQuery(sql);
				q.setParameter("userId", user.getUserId());
				List<OauthAccessToken> rs = q.getResultList();
				if (rs.size() > 0) {
					accessToken = rs.get(0).toAccessToken();
				}
			}
		} catch (NoResultException e) {
		}
		session.getTransaction().commit();
		return accessToken;
	}
	*/

	/**
	 * Update the users account to be verified.
	 *
	 * @param email
	 *            email for the account
	 * @return true is the verify was updated successfully
	 */
	public boolean verifyUser(String email) {
		if (null != email) {
			User user = findUser(email);
			if (null != user) {
				user.setVerified(true);
				return true;
			}
		}
		return false;
	}
}