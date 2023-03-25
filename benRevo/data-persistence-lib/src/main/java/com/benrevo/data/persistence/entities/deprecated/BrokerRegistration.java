package com.benrevo.data.persistence.entities.deprecated;

import com.benrevo.data.persistence.entities.Broker;

import javax.persistence.*;

//@Entity
//@Table(name = "broker_registration")
public class BrokerRegistration {
	@Id @GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column	(name = "broker_registration_id")
	private Long brokerRegistrationId;

	@ManyToOne
	@JoinColumn(name="broker_id", referencedColumnName="broker_id", nullable=true)
	private Broker broker;
	
	@Column (name = "broker_name")
	private String brokerName;

	@Column (name = "contact_name")
	private String contactName;

	@Column (name = "contact_email")
	private String contactEmail;

	@Column (name = "registration_token")
	private String registrationToken;

	@Column (name = "email_sent_time")
	private String emailSentTime;

	public BrokerRegistration() { }
	
	public BrokerRegistration(String brokerName, String contactName, String contactEmail, String registrationToken) {
		this.brokerName = brokerName;
		this.contactName = contactName;
		this.contactEmail = contactEmail;
		this.registrationToken = registrationToken;
	}

	public Long getBrokerRegistrationId() {
		return brokerRegistrationId;
	}

	public void setBrokerRegistrationId(Long brokerRegistrationId) {
		this.brokerRegistrationId = brokerRegistrationId;
	}

	public Broker getBroker() {
		return broker;
	}

	public void setBroker(Broker broker) {
		this.broker = broker;
	}

	public String getBrokerName() {
		return brokerName;
	}

	public void setBrokerName(String brokerName) {
		this.brokerName = brokerName;
	}

	public String getContactName() {
		return contactName;
	}

	public void setContactName(String contactName) {
		this.contactName = contactName;
	}

	public String getContactEmail() {
		return contactEmail;
	}

	public void setContactEmail(String contactEmail) {
		this.contactEmail = contactEmail;
	}

	public String getRegistrationToken() {
		return registrationToken;
	}

	public void setRegistrationToken(String registrationToken) {
		this.registrationToken = registrationToken;
	}

	public String getEmailSentTime() {
		return emailSentTime;
	}

	public void setEmailSentTime(String emailSentTime) {
		this.emailSentTime = emailSentTime;
	}

}
