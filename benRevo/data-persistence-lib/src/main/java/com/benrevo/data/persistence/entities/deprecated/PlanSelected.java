package com.benrevo.data.persistence.entities.deprecated;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

//@Entity
//@Table(name = "plan_selected")
public class PlanSelected {
	@Id @GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column	(name = "plan_selected_id")
	private Long planSelectedId;
	
	@Column	(name = "client_id")
	private Long clientId;
	
	@Column	(name = "pnn_id")
	private Long pnnId;

	public Long getPlanSelectedId() {
		return planSelectedId;
	}

	public void setPlanSelectedId(Long planSelectedId) {
		this.planSelectedId = planSelectedId;
	}

	public Long getClientId() {
		return clientId;
	}

	public void setClientId(Long clientId) {
		this.clientId = clientId;
	}

	public Long getPnnId() {
		return pnnId;
	}

	public void setPnnId(Long pnnId) {
		this.pnnId = pnnId;
	}
	
}
