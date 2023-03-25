package com.benrevo.data.persistence.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "rfp_carrier")
public class RfpCarrier {
	@Id @GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column	(name = "rfp_carrier_id")
	private Long rfpCarrierId;
	
    @ManyToOne
    @JoinColumn(name="carrier_id", referencedColumnName="carrier_id", nullable=false)
	private Carrier carrier;
	
	@Column (name = "category")
	private String category;

	@Column (name = "endpoint")
	private String endpoint;

	public Long getRfpCarrierId() {
		return rfpCarrierId;
	}

	public void setRfpCarrierId(Long rfpCarrierId) {
		this.rfpCarrierId = rfpCarrierId;
	}

	public Carrier getCarrier() {
		return carrier;
	}

	public void setCarrier(Carrier carrier) {
		this.carrier = carrier;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public String getEndpoint() {
		return endpoint;
	}

	public void setEndpoint(String endpoint) {
		this.endpoint = endpoint;
	}
/*
	public RfpCarrierDto toRFPCarrierDto() {
		RfpCarrierDto dto = new RFPCarrierDto(rfpCarrierId, carrier.getCarrierId(), category, endpoint);
		dto.setCarrier(carrier.toCarrierDto());
		return dto;
	}*/

}
