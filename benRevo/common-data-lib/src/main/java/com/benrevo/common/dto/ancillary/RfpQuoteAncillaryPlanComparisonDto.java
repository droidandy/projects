package com.benrevo.common.dto.ancillary;

public class RfpQuoteAncillaryPlanComparisonDto extends RfpQuoteAncillaryPlanDto {

    private String optionName; 
    
    public RfpQuoteAncillaryPlanComparisonDto() {
        super();
	}

    public String getOptionName() {
        return optionName;
    }

    public void setOptionName(String optionName) {
        this.optionName = optionName;
    }
}
