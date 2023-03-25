package com.benrevo.common.dto.ancillary;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlTransient;

@XmlAccessorType(XmlAccessType.FIELD)
public class AncillaryRateAgeDto {
    @XmlTransient
	private Long ancillaryRateAgeId;
	private Integer from;
	private Integer to;
	private float currentEmp = 0f;
	private float renewalEmp = 0f;
	private float currentEmpTobacco = 0f;
	private float renewalEmpTobacco = 0f;
	private float currentSpouse = 0f;
	private float renewalSpouse = 0f;
	
	public AncillaryRateAgeDto() {
	}
	
    public Long getAncillaryRateAgeId() {
        return ancillaryRateAgeId;
    }

    public void setAncillaryRateAgeId(Long ancillaryRateAgeId) {
        this.ancillaryRateAgeId = ancillaryRateAgeId;
    }

    public Integer getFrom() {
		return from;
	}

	public void setFrom(Integer from) {
		this.from = from;
	}

	public Integer getTo() {
		return to;
	}

	public void setTo(Integer to) {
		this.to = to;
	}

	public float getCurrentEmp() {
		return currentEmp;
	}

	public void setCurrentEmp(float currentEmp) {
		this.currentEmp = currentEmp;
	}

	public float getRenewalEmp() {
		return renewalEmp;
	}

	public void setRenewalEmp(float renewalEmp) {
		this.renewalEmp = renewalEmp;
	}

	public float getCurrentEmpTobacco() {
		return currentEmpTobacco;
	}

	public void setCurrentEmpTobacco(float currentEmpTobacco) {
		this.currentEmpTobacco = currentEmpTobacco;
	}

	public float getRenewalEmpTobacco() {
		return renewalEmpTobacco;
	}

	public void setRenewalEmpTobacco(float renewalEmpTobacco) {
		this.renewalEmpTobacco = renewalEmpTobacco;
	}

	public float getCurrentSpouse() {
		return currentSpouse;
	}

	public void setCurrentSpouse(float currentSpouse) {
		this.currentSpouse = currentSpouse;
	}

	public float getRenewalSpouse() {
		return renewalSpouse;
	}

	public void setRenewalSpouse(float renewalSpouse) {
		this.renewalSpouse = renewalSpouse;
	}
}
