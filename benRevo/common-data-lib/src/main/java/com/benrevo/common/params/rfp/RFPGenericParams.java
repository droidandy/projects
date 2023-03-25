package com.benrevo.common.params.rfp;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;

public class RFPGenericParams {
	
    @JsonProperty("benefit_data_id")
	private Long benefitDataId;
    @JsonProperty("benefit_data_ids")
	private List<Long> benefitDataIds;

	public Long getBenefitDataId() {
		return benefitDataId;
	}

	public void setBenefitDataId(Long benefitDataId) {
		this.benefitDataId = benefitDataId;
	}

	public List<Long> getBenefitDataIds() {
		return benefitDataIds;
	}

	public void setBenefitDataIds(List<Long> benefitDataIds) {
		this.benefitDataIds = benefitDataIds;
	}	
}
