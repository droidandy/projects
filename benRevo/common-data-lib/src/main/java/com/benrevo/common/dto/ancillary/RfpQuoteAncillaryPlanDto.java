package com.benrevo.common.dto.ancillary;

public class RfpQuoteAncillaryPlanDto extends AncillaryPlanDto {

    private Long rfpQuoteAncillaryPlanId;
    private Long rfpQuoteAncillaryOptionId; // only if selected
    private Long rfpQuoteId;
    private boolean matchPlan = false;
    private Boolean selected = false;
    private Boolean selectedSecond = false;
    private String type; // current/matchPlan/alternative
    private Float percentDifference;
    
    public RfpQuoteAncillaryPlanDto() {
        super();
	}

    public Long getRfpQuoteAncillaryPlanId() {
        return rfpQuoteAncillaryPlanId;
    }

    public void setRfpQuoteAncillaryPlanId(Long rfpQuoteAncillaryPlanId) {
        this.rfpQuoteAncillaryPlanId = rfpQuoteAncillaryPlanId;
    }

    public Long getRfpQuoteId() {
        return rfpQuoteId;
    }

    public void setRfpQuoteId(Long rfpQuoteId) {
        this.rfpQuoteId = rfpQuoteId;
    }

    public boolean isMatchPlan() {
        return matchPlan;
    }
  
    public void setMatchPlan(boolean matchPlan) {
        this.matchPlan = matchPlan;
    }

    public Boolean getSelected() {
        return selected;
    }

    public void setSelected(Boolean selected) {
        this.selected = selected;
    }
    
    public Boolean getSelectedSecond() {
		return selectedSecond;
	}
	
	public void setSelectedSecond(Boolean selectedSecond) {
		this.selectedSecond = selectedSecond;
	}
    public Float getPercentDifference() {
        return percentDifference;
    }

    public void setPercentDifference(Float percentDifference) {
        this.percentDifference = percentDifference;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

	public Long getRfpQuoteAncillaryOptionId() {
		return rfpQuoteAncillaryOptionId;
	}

	public void setRfpQuoteAncillaryOptionId(Long rfpQuoteAncillaryOptionId) {
		this.rfpQuoteAncillaryOptionId = rfpQuoteAncillaryOptionId;
	}
}
