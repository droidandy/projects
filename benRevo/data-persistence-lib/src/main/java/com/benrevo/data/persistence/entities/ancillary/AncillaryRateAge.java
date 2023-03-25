package com.benrevo.data.persistence.entities.ancillary;

import org.springframework.beans.BeanUtils;

import javax.persistence.*;

@Entity
@Table(name = "ancillary_rate_age")
public class AncillaryRateAge {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ancillary_rate_age_id")
    private Long ancillaryRateAgeId;

    @Column(name = "range_from")
 	private Integer from;
    
    @Column(name = "range_to")
 	private Integer to;
    
    @Column(name = "current_emp")
 	private float currentEmp = 0f;
    
    @Column(name = "current_emp_t")
 	private float currentEmpTobacco = 0f;
    
    @Column(name = "current_spouse")
 	private float currentSpouse = 0f;
    
    @Column(name = "renewal_emp")
 	private float renewalEmp = 0f;
    
    @Column(name = "renewal_emp_t")
 	private float renewalEmpTobacco = 0f;
    
    @Column(name = "renewal_spouse")
 	private float renewalSpouse = 0f;
    
    @ManyToOne
	@JoinColumn(name = "ancillary_rate_id", referencedColumnName = "ancillary_rate_id", nullable = false)
    private VoluntaryRate ancillaryRate;
	
    public AncillaryRateAge() {
	}

    public Long getAncillaryRateAgeId() {
        return ancillaryRateAgeId;
    }
    
    public void setAncillaryRateAgeId(Long ancillaryRateAgeId) {
        this.ancillaryRateAgeId = ancillaryRateAgeId;
    }
    
    public VoluntaryRate getAncillaryRate() {
        return ancillaryRate;
    }
    
    public void setAncillaryRate(VoluntaryRate ancillaryRate) {
        this.ancillaryRate = ancillaryRate;
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

	public float getCurrentEmpTobacco() {
		return currentEmpTobacco;
	}

	public void setCurrentEmpTobacco(float currentEmpTobacco) {
		this.currentEmpTobacco = currentEmpTobacco;
	}

	public float getCurrentSpouse() {
		return currentSpouse;
	}

	public void setCurrentSpouse(float currentSpouse) {
		this.currentSpouse = currentSpouse;
	}

	public float getRenewalEmp() {
		return renewalEmp;
	}

	public void setRenewalEmp(float renewalEmp) {
		this.renewalEmp = renewalEmp;
	}

	public float getRenewalEmpTobacco() {
		return renewalEmpTobacco;
	}

	public void setRenewalEmpTobacco(float renewalEmpTobacco) {
		this.renewalEmpTobacco = renewalEmpTobacco;
	}

	public float getRenewalSpouse() {
		return renewalSpouse;
	}

	public void setRenewalSpouse(float renewalSpouse) {
		this.renewalSpouse = renewalSpouse;
	}

	@Override
	public int hashCode() {
		return new org.apache.commons.lang3.builder.HashCodeBuilder(1, 31)
			.append(getAncillaryRateAgeId())
			.append(getCurrentEmp())
			.append(getCurrentEmpTobacco())
			.append(getCurrentSpouse())
			.append(getFrom())
			.append(getRenewalEmp())
			.append(getRenewalEmpTobacco())
			.append(getRenewalSpouse())
			.append(getTo())
            .toHashCode();
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj) {
			return true;
		}
		if (obj == null || getClass() != obj.getClass()) {
			return false;
		}
		AncillaryRateAge other = (AncillaryRateAge) obj;
		
		return new org.apache.commons.lang3.builder.EqualsBuilder()
			.append(getAncillaryRateAgeId(), other.getAncillaryRateAgeId())
			.append(getCurrentEmp(), other.getCurrentEmp())
			.append(getCurrentEmpTobacco(), other.getCurrentEmpTobacco())
			.append(getCurrentSpouse(), other.getCurrentSpouse())
			.append(getFrom(), other.getFrom())
			.append(getRenewalEmp(), other.getRenewalEmp())
			.append(getRenewalEmpTobacco(), other.getRenewalEmpTobacco())
			.append(getRenewalSpouse(), other.getRenewalSpouse())
			.append(getTo(), other.getTo())
			.isEquals();
	}
	
	public AncillaryRateAge copy() {
	    AncillaryRateAge copy = new AncillaryRateAge();
      BeanUtils.copyProperties(this, copy, "ancillaryRateAgeId");
      return copy;
    }
}