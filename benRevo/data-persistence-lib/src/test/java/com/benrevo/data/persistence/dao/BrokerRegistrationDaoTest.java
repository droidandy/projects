package com.benrevo.data.persistence.dao;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;

import java.security.NoSuchAlgorithmException;

import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;

import com.benrevo.common.util.DateHelper;
import com.benrevo.common.util.StringHelper;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.deprecated.BrokerRegistration;

/**
 * Created by ojas.sitapara on 1/9/17.
 */
@Ignore
public class BrokerRegistrationDaoTest {

	private String BROKER_NAME = null;
	private String CONTACT_NAME = null;
	private String CONTACT_EMAIL = null;

	private String registrationToken = null;
	private BrokerRegistrationDao brokerRegistration = new BrokerRegistrationDao();

	@Before
	private void createRegistrationToken() throws NoSuchAlgorithmException {
		this.BROKER_NAME = "Broker Name_" + DateHelper.getFormatedTimestampForDB();
		this.CONTACT_NAME = "Contact Name_" + DateHelper.getFormatedTimestampForDB();
		this.CONTACT_EMAIL = "test.email" + DateHelper.getFormatedTimestampForDB() + "@benrevo.com";
		this.registrationToken = StringHelper.generateToken(BROKER_NAME);
	}

	@Test
	public void saveRegistrationTest() {
		BrokerRegistration newRegistration = brokerRegistration.saveBrokerRegistration(BROKER_NAME, CONTACT_NAME,
				CONTACT_EMAIL, registrationToken);

		assertEquals(null, newRegistration.getBroker());
		assertEquals(BROKER_NAME, newRegistration.getBrokerName());
		assertEquals(CONTACT_NAME, newRegistration.getContactName());
		assertEquals(CONTACT_EMAIL, newRegistration.getContactEmail());
		assertEquals(registrationToken, newRegistration.getRegistrationToken());
	}

	@Test(expected = IllegalArgumentException.class)
	public void saveDuplicateBrokerNameAndContactEmailTest() {
		String brokerName = "DupeBroker";
		String brokerEmail = "DupeEmail";
		brokerRegistration.saveBrokerRegistration(brokerName, CONTACT_NAME + "diff", brokerEmail,
				registrationToken + "diff");
		brokerRegistration.saveBrokerRegistration(brokerName, CONTACT_NAME + "diff", brokerEmail,
				registrationToken + "diff");
		fail("Duplicate Broker name and email being used, this should throw an exception due table constraints.");
	}

	@Test(expected = IllegalArgumentException.class)
	public void saveDuplicateRegistrationTest() {
		brokerRegistration.saveBrokerRegistration("broker A", "contact A", "email A", registrationToken);
		brokerRegistration.saveBrokerRegistration("broker B", "contact B", "email B", registrationToken);
		fail("Duplicate registration token used, this should throw an exception due table constraints.");
	}

	@Test
	public void getRegistrationTest() {
		//get the new created registration from database
		String brokerName = "brokerD";
		String contactName = "contactD";
		String contactEmail = "contactDEmail";
		brokerRegistration.saveBrokerRegistration(brokerName, contactName, contactEmail, registrationToken);
		BrokerRegistration fromDBRegistration = brokerRegistration.getBrokerRegistration(registrationToken);

		//both registrations should be the same
		assertEquals(null, fromDBRegistration.getBroker());
		assertEquals(brokerName, fromDBRegistration.getBrokerName());
		assertEquals(contactName, fromDBRegistration.getContactName());
		assertEquals(contactEmail, fromDBRegistration.getContactEmail());
		assertEquals(registrationToken, fromDBRegistration.getRegistrationToken());
	}

	@Test(expected = IllegalArgumentException.class)
	public void updateRegistrationWithInvalidBrokerIdTest() throws Exception {
		Broker broker = new Broker();
		broker.setBrokerId(new Long(-1));
		String brokerName = "brokerC";
		String contactName = "contactC";
		String contactEmail = "contactCEmail";
		brokerRegistration.saveBrokerRegistration(brokerName, contactName, contactEmail, registrationToken);
		brokerRegistration.updateBrokerRegistration(broker, registrationToken);
		fail("Invalid brokerId being used -1, this should throw an exception due table constraints");
	}

	@Test
	public void updateRegistrationWithBrokerIdTest() {
		try {
			Broker broker = new Broker();
			broker.setBrokerId(new Long(1));
			brokerRegistration.updateBrokerRegistration(broker, registrationToken);
		} catch (Exception e) {
			fail("Registration update with valid brokerId should not fail. The broker table could be empty and thus causing a constraint violation");
		}

		//get the new created registration from database
		BrokerRegistration fromDBRegistration = brokerRegistration.getBrokerRegistration(registrationToken);
		assertEquals("The broker table could be empty and thus causing a constraint violation", new Long(1),
				fromDBRegistration.getBroker().getBrokerId());
	}
}