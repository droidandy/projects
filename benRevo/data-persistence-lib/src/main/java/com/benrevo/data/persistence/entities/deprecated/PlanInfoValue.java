package com.benrevo.data.persistence.entities.deprecated;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

//@Entity
//@Table(name = "plan_info_value")
public class PlanInfoValue {
	@Id @GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column	(name = "plan_info_value_id")
	private Long planInfoValueId;
	
    @ManyToOne
    @JoinColumn(name="plan_info_client_data_id", referencedColumnName="plan_info_client_data_id", nullable=false)
	private PlanInfoClientData planInfoClientData;
	
	@Column (name = "plan")
	private String plan;

	@Column (name = "optional")
	private boolean optional;

	@Column (name = "alternative")
	private boolean alternative;

	@Column	(name = "`option`")
	private Long option;
	
	@Column (name = "value")
	private String value;

	public Long getPlanInfoValueId() {
		return planInfoValueId;
	}

	public void setPlanInfoValueId(Long planInfoValueId) {
		this.planInfoValueId = planInfoValueId;
	}

	public PlanInfoClientData getPlanInfoClientData() {
		return planInfoClientData;
	}

	public void setPlanInfoClientData(PlanInfoClientData planInfoClientData) {
		this.planInfoClientData = planInfoClientData;
	}

	public String getPlan() {
		return plan;
	}

	public void setPlan(String plan) {
		this.plan = plan;
	}

	public boolean isOptional() {
		return optional;
	}

	public void setOptional(boolean optional) {
		this.optional = optional;
	}

	public boolean isAlternative() {
		return alternative;
	}

	public void setAlternative(boolean alternative) {
		this.alternative = alternative;
	}

	public Long getOption() {
		return option;
	}

	public void setOption(Long option) {
		this.option = option;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}
}
