package com.benrevo.data.persistence.entities;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.benrevo.common.dto.Account;

@Entity
@Table(name = "user")
public class User {
	public static String STATUS_ACCEPTED = "Approved";
	public static String STATUS_PENDING = "Pending Approval";
	public static String STATUS_DENIED = "Denied";

	public static String ROLE_ACCOUNT_MANAGER = "Account Manager";
	public static String ROLE_BENEFIT_ANALYST= "Benefit Analyst";


	@Id @GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column	(name = "user_id")
	private Long userId;
	
	@Column (name = "name")
	private String name;

	@Column (name = "email")
	private String email;

	@Column (name = "password")
	private String password;

	@Column (name = "phone")
	private String phone;
	
    @ManyToOne
    @JoinColumn(name="broker_id", referencedColumnName="broker_id", nullable=false)
	private Broker broker;
	
	@Column (name = "role")
	private String role;

	@Column (name = "admin")
	private boolean admin;

	@Column (name = "status")
	private String status;

	@Column (name = "verified")
	private boolean verified;

	@Column (name = "active")
	private boolean active;

	@Column (name = "notified")
	private boolean notified;

	@Column (name = "created_on")
	private Date createdOn = new Date();

	@Column (name = "last_login")
	private Date lastLogin;

	public User() {} 
	
	public User(String name, String password, String email, String role, String phone, String status, boolean admin, Broker broker) {
		this.name = name;
		this.password = password;
		this.email = email;
		this.role = role;
		this.phone = phone;
		this.status = status;
		this.admin = admin;
		this.broker = broker;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public Broker getBroker() {
		return broker;
	}

	public void setBroker(Broker broker) {
		this.broker = broker;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public boolean isAdmin() {
		return admin;
	}

	public void setAdmin(boolean admin) {
		this.admin = admin;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public boolean isVerified() {
		return verified;
	}

	public void setVerified(boolean verified) {
		this.verified = verified;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	public boolean isNotified() {
		return notified;
	}

	public void setNotified(boolean notified) {
		this.notified = notified;
	}

	public Date getCreatedOn() {
		return createdOn;
	}

	public void setCreatedOn(Date createdOn) {
		this.createdOn = createdOn;
	}

	public Date getLastLogin() {
		return lastLogin;
	}

	public void setLastLogin(Date lastLogin) {
		this.lastLogin = lastLogin;
	}

	public Account toAccount() {
		Account result = new Account();
		result.setBrokerId(this.getBroker().getBrokerId());
		result.setVerified(this.isVerified() ? 1 : 0);
		result.setEmail(this.getEmail());
		result.setActive(this.isActive() ? 1 : 0);
		result.setNotified(this.isNotified() ? 1 : 0);
		result.setName(this.getName());
		return result;
	}
}
