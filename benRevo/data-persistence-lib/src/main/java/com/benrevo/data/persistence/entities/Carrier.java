package com.benrevo.data.persistence.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.benrevo.common.dto.CarrierDto;

@Entity
@Table(name = "carrier")
public class Carrier {
	@Id @GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column	(name = "carrier_id", columnDefinition = "BIGINT(20)")
	private Long carrierId;
	
	@Column (name = "name")
	private String name;

	@Column (name = "display_name")
	private String displayName;
	
	@Column (name = "am_best_rating")
    private String amBestRating;

	public Long getCarrierId() {
		return carrierId;
	}

	public void setCarrierId(Long carrierId) {
		this.carrierId = carrierId;
	}
	
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDisplayName() {
		return displayName;
	}

	public void setDisplayName(String displayName) {
		this.displayName = displayName;
	}

    
    public String getAmBestRating() {
        return amBestRating;
    }

    public void setAmBestRating(String amBestRating) {
        this.amBestRating = amBestRating;
    }
	
/*
	public CarrierDto toCarrierDto() {
		CarrierDto dto = new CarrierDto();
		dto.setId(carrierId);
		dto.setName(name);
		dto.setDisplayName(displayName);
		return dto;
	}*/
}