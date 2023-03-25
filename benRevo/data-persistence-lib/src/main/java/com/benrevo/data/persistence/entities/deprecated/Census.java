package com.benrevo.data.persistence.entities.deprecated;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.benrevo.common.dto.CensusDto;
import com.benrevo.data.persistence.entities.Client;

//@Entity
//@Table(name = "census")
public class Census {
	@Id @GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column	(name = "census_id")
	private Long censusId;
	
    @OneToOne
    @JoinColumn(name="client_id")
	private Client client;
	
	@Column (name = "tier1")
	private Long tier1;
	
	@Column (name = "tier2")
	private Long tier2;
	
	@Column (name = "tier3")
	private Long tier3;
	
	@Column (name = "tier4")
	private Long tier4;

	public Long getCensusId() {
		return censusId;
	}

	public void setCensusId(Long censusId) {
		this.censusId = censusId;
	}

	public Client getClient() {
		return client;
	}

	public void setClient(Client client) {
		this.client = client;
	}

	public Long getTier1() {
		return tier1;
	}

	public void setTier1(Long tier1) {
		this.tier1 = tier1;
	}

	public Long getTier2() {
		return tier2;
	}

	public void setTier2(Long tier2) {
		this.tier2 = tier2;
	}

	public Long getTier3() {
		return tier3;
	}

	public void setTier3(Long tier3) {
		this.tier3 = tier3;
	}

	public Long getTier4() {
		return tier4;
	}

	public void setTier4(Long tier4) {
		this.tier4 = tier4;
	}

	public CensusDto toCensusDto() {
		CensusDto result = new CensusDto();
		result.setId(this.getCensusId());
		result.setName(this.getClient().getClientName());
		result.setTier1(this.getTier1());
		result.setTier2(this.getTier2());
		result.setTier3(this.getTier3());
		result.setTier4(this.getTier4());
		return result;
	}
}
