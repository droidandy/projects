package com.benrevo.data.persistence.entities.ancillary;

import org.springframework.beans.BeanUtils;

import javax.persistence.*;

@Entity
@Table(name = "ancillary_rate")
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class AncillaryRate {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ancillary_rate_id")
    private Long ancillaryRateId;

	@Column(name = "volume")
    private double volume = 0.0;
	
	@Column(name = "rate_guarantee")
	private String rateGuarantee;

    @ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "ancillary_plan_id", referencedColumnName = "ancillary_plan_id", nullable = false)
    private AncillaryPlan ancillaryPlan;
    
    public AncillaryRate() {
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj) {
			return true;
		}
		if (obj == null || getClass() != obj.getClass()) {
			return false;
		}
		return new org.apache.commons.lang3.builder.EqualsBuilder()
				.reflectionAppend(this, obj)
				.setExcludeFields("ancillaryPlan")
				.isEquals();
	}
	
	public AncillaryRate copy() {
	    AncillaryRate copy = newInstance();
      BeanUtils.copyProperties(this, copy, "ancillaryRateId");
      return copy;
    }

    public abstract AncillaryRate newInstance();

    public Long getAncillaryRateId() {
        return ancillaryRateId;
    }

    public void setAncillaryRateId(Long ancillaryRateId) {
        this.ancillaryRateId = ancillaryRateId;
    }

    public double getVolume() {
		return volume;
	}

	public void setVolume(double volume) {
		this.volume = volume;
	}

    public AncillaryPlan getAncillaryPlan() {
        return ancillaryPlan;
    }

    public void setAncillaryPlan(AncillaryPlan ancillaryPlan) {
        this.ancillaryPlan = ancillaryPlan;
    } 
    
    public String getRateGuarantee() {
        return rateGuarantee;
    }

    public void setRateGuarantee(String rateGuarantee) {
        this.rateGuarantee = rateGuarantee;
    }
}