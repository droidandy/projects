package com.benrevo.data.persistence.entities.deprecated;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

//@Entity
//@Table(name = "renewal")
public class Renewal {
	@Id @GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column	(name = "renewal_id")
	private Long renewalId;
	
	@Column	(name = "client_id")
	private Long clientId;
	
	@Column	(name = "bucket")
	private Long bucket;
	
	@Column (name = "name")
	private String name;

	@Column (name = "renewal")
	private String renewal;

	@Column (name = "exchange")
	private boolean exchange;

	public Long getRenewalId() {
		return renewalId;
	}

	public void setRenewalId(Long renewalId) {
		this.renewalId = renewalId;
	}

	public Long getClientId() {
		return clientId;
	}

	public void setClientId(Long clientId) {
		this.clientId = clientId;
	}

	public Long getBucket() {
		return bucket;
	}

	public void setBucket(Long bucket) {
		this.bucket = bucket;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getRenewal() {
		return renewal;
	}

	public void setRenewal(String renewal) {
		this.renewal = renewal;
	}

	public boolean isExchange() {
		return exchange;
	}

	public void setExchange(boolean exchange) {
		this.exchange = exchange;
	}
	
}
