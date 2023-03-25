package com.benrevo.common.dto.ancillary;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlTransient;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "javaclass")
@JsonSubTypes({
		@JsonSubTypes.Type(value = BasicRateDto.class),
		@JsonSubTypes.Type(value = VoluntaryRateDto.class)
})
@XmlAccessorType(XmlAccessType.FIELD)
public abstract class AncillaryRateDto {
    @XmlTransient
	private Long ancillaryRateId;

	private double volume = 0.0;
	
	private double monthlyCost = 0.0;
	
	private String rateGuarantee;

    public AncillaryRateDto() {
	}

	public double getVolume() {
		return volume;
	}

	public void setVolume(double volume) {
		this.volume = volume;
	}

	public double getMonthlyCost() {
		return monthlyCost;
	}

	public void setMonthlyCost(double monthlyCost) {
		this.monthlyCost = monthlyCost;
	}
	
    public Long getAncillaryRateId() {
        return ancillaryRateId;
    }

    public void setAncillaryRateId(Long ancillaryRateId) {
        this.ancillaryRateId = ancillaryRateId;
    }
    
    public String getRateGuarantee() {
        return rateGuarantee;
    }

    public void setRateGuarantee(String rateGuarantee) {
        this.rateGuarantee = rateGuarantee;
    }
}
