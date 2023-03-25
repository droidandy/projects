package com.benrevo.data.persistence.dao;

import com.benrevo.common.util.DateHelper;
import com.benrevo.common.util.StringHelper;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.User;
import com.benrevo.data.persistence.helper.TestHelper;

import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;

/**
 * Created by ojas.sitapara on 1/11/17.
 */
@Ignore
public class AccountDaoTest {

	private AccountDao dao = new AccountDao();

	private final String EMAIL_PREFIX = "test_";
	private final String DOMAIN = "@benrevo.com";

	private Broker BROKER;
	private String BROKER_NAME = "Test Broker";
	private String USER_NAME = "Test User";
	private String EMAIL;
	private String PASSWORD = "xxClearPasswordxx";
	private String ADDRESS = "12345 Some Address";
	private String CITY = "San Diego";
	private String STATE = "CA";
	private String ZIP = "92101";
	private String PHONE = "6191112222";
	private String TOKEN;

	@Before
	private void setupConsts() {
		this.BROKER = null;//TestHelper.createBroker();
		this.TOKEN = this.BROKER.getBrokerToken();
		this.EMAIL = TestHelper.getEmail(this.TOKEN);
	}

	/***************************************
	 * Broker
	 ***************************************/

	@Test(expected = IllegalArgumentException.class)
	public void createBrokerDuplicateNameTest() {
		String dbDate = DateHelper.getFormatedTimestampForDB();
		String brokerName = BROKER_NAME + dbDate;
		String newToken = StringHelper.generateToken(dbDate);

		/*Broker newBroker =*/
		dao.createBroker(brokerName, ADDRESS, CITY, STATE, ZIP, newToken);
		/*Broker dupNameBroker =*/
		dao.createBroker(brokerName, ADDRESS, CITY, STATE, ZIP, newToken + "x");

		fail("Creating a Broker with the same 'name' should throw an exception.");
	}

	@Test(expected = IllegalArgumentException.class)
	public void createBrokerDuplicateTokenTest() {
		String dbDate = DateHelper.getFormatedTimestampForDB();
		String brokerName = BROKER_NAME + dbDate;
		String newToken = StringHelper.generateToken(dbDate);

		/*Broker newBroker =*/ dao.createBroker(brokerName, ADDRESS, CITY, STATE, ZIP, newToken);
		/*Broker dupTokenBroker =*/ dao.createBroker(brokerName + "x", ADDRESS, CITY, STATE, ZIP, newToken);
		fail("Creating a Broker with the same 'broker token' should throw an exception.");
	}

	@Test
	public void findBrokerByUserIdTest() {
		String newEmail = EMAIL_PREFIX + DateHelper.getFormatedTimestampForDB() + DOMAIN;

		//values to compare
		Long brokerId = BROKER.getBrokerId();
		String brokerToken = BROKER.getBrokerToken();

		//create new user
		boolean isAdmin = false;
		User newUser = dao.createUser(USER_NAME, PASSWORD, newEmail, User.ROLE_ACCOUNT_MANAGER, PHONE,
				User.STATUS_PENDING, isAdmin, BROKER);

		Broker dbBroker = dao.findBrokerByUserId(newUser.getUserId(), isAdmin);
		assertEquals(brokerId, dbBroker.getBrokerId());
		assertEquals(brokerToken, dbBroker.getBrokerToken());
	}

	/***************************************
	 * User
	 ***************************************/
	@Test
	public void createUserTest() {
		User newUser = dao.createUser(USER_NAME, PASSWORD, EMAIL, User.ROLE_ACCOUNT_MANAGER, PHONE, User.STATUS_PENDING,
				false, BROKER);

		//get the new user from DB
		User dbUser = dao.findUser(EMAIL);
		assertEquals(newUser, dbUser);
	}

	@Test(expected = IllegalArgumentException.class)
	public void createUserWithoutBrokerTest() {
		/*User newUser = */
		dao.createUser(USER_NAME, PASSWORD, EMAIL, User.ROLE_ACCOUNT_MANAGER, PHONE, User.STATUS_PENDING, false, null);
		fail("Creating a user without a broker to link to should throw an exception.");
	}

	@Test(expected = IllegalArgumentException.class)
	public void createUserDuplicateEmailTest() {
		String email = "duplicateEmail";
		dao.createUser(USER_NAME, PASSWORD, email, User.ROLE_ACCOUNT_MANAGER, PHONE, User.STATUS_PENDING, false,
				BROKER);
		dao.createUser(USER_NAME, PASSWORD, email, User.ROLE_ACCOUNT_MANAGER, PHONE, User.STATUS_PENDING, false,
				BROKER);
		fail("Creating a user with an email that already exists should throw an exception.");
	}

	@Test
	public void verifyUserTest() {
		String newEmail = TestHelper.getEmail();
		dao.createUser(USER_NAME, PASSWORD, newEmail, User.ROLE_ACCOUNT_MANAGER, PHONE, User.STATUS_PENDING, false,
				BROKER);
		boolean verified = dao.verifyUser(newEmail);
		assertEquals(verified, true);

		User user = dao.findUser(newEmail);
		assertEquals(user.isVerified(), true);
	}

}