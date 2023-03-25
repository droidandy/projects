package com.benrevo.data.persistence.entities.deprecated;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

//@Entity
//@Table(name = "plan_category_info")
public class PlanCategoryInfo {
	@Id @GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column	(name = "plan_category_info_id")
	private Long planCategoryInfoId;
	
    @ManyToOne
    @JoinColumn(name="benefit_category_info_id", referencedColumnName="benefit_category_info_id", nullable=false)
	private BenefitCategoryInfo benefitCategoryInfo;
	
    @ManyToOne
    @JoinColumn(name="plan_info_id", referencedColumnName="plan_info_id", nullable=false)
	private PlanInfo planInfo;

	public Long getPlanCategoryInfoId() {
		return planCategoryInfoId;
	}

	public void setPlanCategoryInfoId(Long planCategoryInfoId) {
		this.planCategoryInfoId = planCategoryInfoId;
	}

	public BenefitCategoryInfo getBenefitCategory() {
		return benefitCategoryInfo;
	}

	public void setBenefitCategory(BenefitCategoryInfo benefitCategoryInfo) {
		this.benefitCategoryInfo = benefitCategoryInfo;
	}

	public PlanInfo getPlanInfo() {
		return planInfo;
	}

	public void setPlanInfo(PlanInfo planInfo) {
		this.planInfo = planInfo;
	}
	
}
