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

@Entity
@Table(name = "rfp_status")
public class RfpStatus {
	@Id @GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column	(name = "rfp_status_id")
	private Long rfpStatusId;
	
	@Column	(name = "client_id")
	private Long clientId;
	
    @ManyToOne
    @JoinColumn(name="rfp_carrier_id", referencedColumnName="rfp_carrier_id", nullable=false)
	private RfpCarrier rfpCarrier;
	
	@Column (name = "status")
	private String status;

	@Column (name = "created")
	private Date created;

	@Column (name = "updated")
	private Date updated;

	public Long getRfpStatusId() {
		return rfpStatusId;
	}

	public void setRfpStatusId(Long rfpStatusId) {
		this.rfpStatusId = rfpStatusId;
	}

	public Long getClientId() {
		return clientId;
	}

	public void setClientId(Long clientId) {
		this.clientId = clientId;
	}

	public RfpCarrier getRfpCarrier() {
		return rfpCarrier;
	}

	public void setRfpCarrier(RfpCarrier rfpCarrier) {
		this.rfpCarrier = rfpCarrier;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Date getCreated() {
		return created;
	}

	public void setCreated(Date created) {
		this.created = created;
	}

	public Date getUpdated() {
		return updated;
	}

	public void setUpdated(Date updated) {
		this.updated = updated;
	}
}
