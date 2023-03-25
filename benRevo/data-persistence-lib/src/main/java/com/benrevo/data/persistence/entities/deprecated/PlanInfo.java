package com.benrevo.data.persistence.entities.deprecated;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

//@Entity
//@Table(name = "plan_info")
public class PlanInfo {
	@Id @GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column	(name = "plan_info_id")
	private Long planInfoId;
	
	@Column (name = "code")
	private String code;

	@Column (name = "text")
	private String text;

	@Column (name = "data_type")
	private String data_type;

	@Column (name = "multivalue")
	private boolean multivalue;

	@Column	(name = "`limit`")
	private Long limit;

	public Long getPlanInfoId() {
		return planInfoId;
	}

	public void setPlanInfoId(Long planInfoId) {
		this.planInfoId = planInfoId;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public String getData_type() {
		return data_type;
	}

	public void setData_type(String data_type) {
		this.data_type = data_type;
	}

	public boolean isMultivalue() {
		return multivalue;
	}

	public void setMultivalue(boolean multivalue) {
		this.multivalue = multivalue;
	}

	public Long getLimit() {
		return limit;
	}

	public void setLimit(Long limit) {
		this.limit = limit;
	}
	
}
