package com.benrevo.data.persistence.entities.deprecated;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

//@Entity
//@Table(name = "benefit_category_info")
public class BenefitCategoryInfo {
	@Id @GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column	(name = "benefit_category_info_id", columnDefinition = "bigint(20)")
	private Long benefitCategoryInfoId;
	
    @ManyToOne
    @JoinColumn(name="benefit_category_id", referencedColumnName="benefit_category_id", nullable=false)
	private BenefitCategory benefitCategory;
	
	@Column (name = "code")
	private String code;

	@Column (name = "`group`")
	private String group;

	@Column (name = "sub_group")
	private String subGroup;

	@Column (name = "name")
	private String name;

	@Column (name = "data_type")
	private String dataType;

	@Column (name = "multivalue")
	private boolean multivalue;
	
	@Column	(name = "`limit`")
	private Long limit;

	public Long getBenefitCategoryInfoId() {
		return benefitCategoryInfoId;
	}

	public void setBenefitCategoryInfoId(Long benefitCategoryInfoId) {
		this.benefitCategoryInfoId = benefitCategoryInfoId;
	}

	public BenefitCategory getBenefitCategory() {
		return benefitCategory;
	}

	public void setBenefitCategory(BenefitCategory benefitCategory) {
		this.benefitCategory = benefitCategory;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getGroup() {
		return group;
	}

	public void setGroup(String group) {
		this.group = group;
	}

	public String getSubGroup() {
		return subGroup;
	}

	public void setSubGroup(String subGroup) {
		this.subGroup = subGroup;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDataType() {
		return dataType;
	}

	public void setDataType(String dataType) {
		this.dataType = dataType;
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
