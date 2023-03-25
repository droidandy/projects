package com.benrevo.data.persistence.entities;

import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "network")
public class Network {
	@Id @GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column	(name = "network_id")
	private Long networkId;
	
    @ManyToOne
    @JoinColumn(name="carrier_id", referencedColumnName="carrier_id", nullable=false)
	private Carrier carrier;
	
	@Column (name = "name")
	private String name;

	@Column (name = "type")
	private String type;

	@Column (name = "tier")
	private String tier;

	@Column (name = "created")
	private Date created;
	
	@Column (name = "updated")
	private Date updated;

	@OneToMany(mappedBy = "network", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	private List<NetworkMedicalGroup> networkMedicalGroups;

	public Long getNetworkId() {
		return networkId;
	}

	public void setNetworkId(Long networkId) {
		this.networkId = networkId;
	}

	public Carrier getCarrier() {
		return carrier;
	}

	public void setCarrier(Carrier carrier) {
		this.carrier = carrier;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getTier() {
		return tier;
	}

	public void setTier(String tier) {
		this.tier = tier;
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

	public List<NetworkMedicalGroup> getNetworkMedicalGroups() {
		return networkMedicalGroups;
	}

	public void setNetworkMedicalGroups(List<NetworkMedicalGroup> networkMedicalGroups) {
		this.networkMedicalGroups = networkMedicalGroups;
	}
}