package com.benrevo.data.persistence.entities.deprecated;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

//@Entity
//@Table(name = "plan_info_client_data")
public class PlanInfoClientData {
	@Id @GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column	(name = "plan_info_client_data_id")
	private Long planInfoClientDataId;
	
	@Column	(name = "client_id")
	private Long clientId;
	
    @ManyToOne
    @JoinColumn(name="plan_category_info_id", referencedColumnName="plan_category_info_id", nullable=false)
	private PlanCategoryInfo planCategoryInfo;
	
	public Long getPlanInfoClientDataId() {
		return planInfoClientDataId;
	}

	public void setPlanInfoClientDataId(Long planInfoClientDataId) {
		this.planInfoClientDataId = planInfoClientDataId;
	}

	public Long getClientId() {
		return clientId;
	}

	public void setClientId(Long clientId) {
		this.clientId = clientId;
	}

	public PlanCategoryInfo getPlanCategoryInfo() {
		return planCategoryInfo;
	}

	public void setPlanCategoryInfo(PlanCategoryInfo planCategoryInfo) {
		this.planCategoryInfo = planCategoryInfo;
	}
	
}
