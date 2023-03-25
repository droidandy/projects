package com.benrevo.data.persistence.entities.deprecated;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

//@Entity
//@Table(name = "benefit_info_client_data")
public class BenefitInfoClientData {
	@Id @GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column	(name = "benefit_info_client_data_id")
	private Long benefitInfoClientDataId;
	
	@Column	(name = "client_id")
	private Long clientId;
	
    @ManyToOne
    @JoinColumn(name="benefit_category_info_id", referencedColumnName="benefit_category_info_id", nullable=false)
	private BenefitCategoryInfo benefitCategoryInfo;
	
	@Column (name = "value")
	private String value;

	public Long getBenefitInfoClientDataId() {
		return benefitInfoClientDataId;
	}

	public void setBenefitInfoClientDataId(Long benefitInfoClientDataId) {
		this.benefitInfoClientDataId = benefitInfoClientDataId;
	}

	public Long getClientId() {
		return clientId;
	}

	public void setClientId(Long clientId) {
		this.clientId = clientId;
	}

	public BenefitCategoryInfo getBenefitCategoryInfo() {
		return benefitCategoryInfo;
	}

	public void setBenefitCategoryInfo(BenefitCategoryInfo benefitCategoryInfo) {
		this.benefitCategoryInfo = benefitCategoryInfo;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}
}
