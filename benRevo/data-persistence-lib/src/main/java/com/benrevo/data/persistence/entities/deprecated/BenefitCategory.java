package com.benrevo.data.persistence.entities.deprecated;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

//@Entity
//@Table(name = "benefit_category")
public class BenefitCategory {
	@Id @GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column	(name = "benefit_category_id")
	private Long benefitCategoryId;
	
	@Column (name = "name")
	private String name;

	public Long getBenefitCategoryId() {
		return benefitCategoryId;
	}

	public void setBenefitCategoryId(Long benefitCategoryId) {
		this.benefitCategoryId = benefitCategoryId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
}
