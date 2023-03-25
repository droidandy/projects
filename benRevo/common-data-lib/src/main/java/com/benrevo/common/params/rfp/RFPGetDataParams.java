package com.benrevo.common.params.rfp;

import java.util.List;

import com.benrevo.common.dto.BenefitClientData;
import com.fasterxml.jackson.annotation.JsonProperty;

public class RFPGetDataParams {

    @JsonProperty("benefit_category")
	private String benefitCategory;
    @JsonProperty("client_id")
	private long clientId;
    @JsonProperty("questions_group")
	private String questionsGroup;
    @JsonProperty("benefit_info")
	private List<BenefitClientData> benefitInfo;
	
	public String getBenefitCategory() {
		return benefitCategory;
	}
	
	public void setBenefitCategory(String benefitCategory) {
		this.benefitCategory = benefitCategory;
	}

	public long getClientId() {
		return clientId;
	}

	public void setClientId(long clientId) {
		this.clientId = clientId;
	}

	public String getQuestionsGroup() {
		return questionsGroup;
	}

	public void setQuestionsGroup(String questionsGroup) {
		this.questionsGroup = questionsGroup;
	}

	public List<BenefitClientData> getBenefitInfo() {
		return benefitInfo;
	}

	public void setBenefitInfo(List<BenefitClientData> benefitInfo) {
		this.benefitInfo = benefitInfo;
	}
	
	public String getBenefitInfoCodes() {
		String values = "(";
		int size = this.benefitInfo.size();
		for (BenefitClientData benefitClientData : this.benefitInfo) {
			values = values.concat("'");
			values = values.concat(benefitClientData.getCode());
			values = values.concat("'");
			if (--size > 0) {
				values = values.concat(",");
			}			
		}	
		values = values.concat(")");
		return values;
	}
}
