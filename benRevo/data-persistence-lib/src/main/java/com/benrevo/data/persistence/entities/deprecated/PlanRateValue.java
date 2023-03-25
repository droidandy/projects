package com.benrevo.data.persistence.entities.deprecated;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

//@Entity
//@Table(name = "plan_rate_value")
public class PlanRateValue {
	@Id @GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column	(name = "plan_rate_value_id")
	private Long planRateValueId;
	
	@Column	(name = "client_id")
	private Long clientId;
	
	@Column (name = "plan")
	private String plan;

	@Column (name = "rate_type")
	private String rateType;

	@Column	(name = "position")
	private Long position;
	
	@Column (name = "position_label")
	private String positionLabel;

    @ManyToOne
    @JoinColumn(name="benefit_category_id", referencedColumnName="benefit_category_id", nullable=false)
	private BenefitCategory benefitCategory;
	
	@Column	(name = "value")
	private Float value;
	
	@Column	(name = "base_plan")
	private boolean basePlan;
	
	@Column	(name = "out_of_state")
	private boolean outOfState;
	
	@Column	(name = "`option`")
	private Long option;
	
	@Column	(name = "alt_bucket_id")
	private Long altBucketId;

	public Long getPlanRateValueId() {
		return planRateValueId;
	}

	public void setPlanRateValueId(Long planRateValueId) {
		this.planRateValueId = planRateValueId;
	}

	public Long getClientId() {
		return clientId;
	}

	public void setClientId(Long clientId) {
		this.clientId = clientId;
	}

	public String getPlan() {
		return plan;
	}

	public void setPlan(String plan) {
		this.plan = plan;
	}

	public String getRateType() {
		return rateType;
	}

	public void setRateType(String rateType) {
		this.rateType = rateType;
	}

	public Long getPosition() {
		return position;
	}

	public void setPosition(Long position) {
		this.position = position;
	}

	public String getPositionLabel() {
		return positionLabel;
	}

	public void setPositionLabel(String positionLabel) {
		this.positionLabel = positionLabel;
	}

	public BenefitCategory getBenefitCategory() {
		return benefitCategory;
	}

	public void setBenefitCategory(BenefitCategory benefitCategory) {
		this.benefitCategory = benefitCategory;
	}

	public Float getValue() {
		return value;
	}

	public void setValue(Float value) {
		this.value = value;
	}

	public boolean isBasePlan() {
		return basePlan;
	}

	public void setBasePlan(boolean basePlan) {
		this.basePlan = basePlan;
	}

	public boolean isOutOfState() {
		return outOfState;
	}

	public void setOutOfState(boolean outOfState) {
		this.outOfState = outOfState;
	}

	public Long getOption() {
		return option;
	}

	public void setOption(Long option) {
		this.option = option;
	}

	public Long getAltBucketId() {
		return altBucketId;
	}

	public void setAltBucketId(Long altBucketId) {
		this.altBucketId = altBucketId;
	}
	
}
