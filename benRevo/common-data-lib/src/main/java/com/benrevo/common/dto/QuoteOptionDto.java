package com.benrevo.common.dto;

public class QuoteOptionDto {
	
	private Long rfpQuoteOptionId;
	
	private Long rfpQuoteAncillaryOptionId;

	private boolean matchesOrigRfpOption;
	
	private String rfpQuoteOptionName;

    private String displayName;
	
	private Long rfpQuoteId;

	private Long rfpQuoteVersionId;

	public QuoteOptionDto() {
	}

	public Long getRfpQuoteOptionId() {
		return rfpQuoteOptionId;
	}

	public void setRfpQuoteOptionId(Long rfpQuoteOptionId) {
		this.rfpQuoteOptionId = rfpQuoteOptionId;
	}

	public Long getRfpQuoteAncillaryOptionId() {
		return rfpQuoteAncillaryOptionId;
	}

	public void setRfpQuoteAncillaryOptionId(Long rfpQuoteAncillaryOptionId) {
		this.rfpQuoteAncillaryOptionId = rfpQuoteAncillaryOptionId;
	}

	public boolean isMatchesOrigRfpOption() {
		return matchesOrigRfpOption;
	}

	public void setMatchesOrigRfpOption(boolean matchesOrigRfpOption) {
		this.matchesOrigRfpOption = matchesOrigRfpOption;
	}

	public String getRfpQuoteOptionName() {
		return rfpQuoteOptionName;
	}

	public void setRfpQuoteOptionName(String rfpQuoteOptionName) {
		this.rfpQuoteOptionName = rfpQuoteOptionName;
	}

	public Long getRfpQuoteId() {
		return rfpQuoteId;
	}

	public void setRfpQuoteId(Long rfpQuoteId) {
		this.rfpQuoteId = rfpQuoteId;
	}

	public Long getRfpQuoteVersionId() {
		return rfpQuoteVersionId;
	}

	public void setRfpQuoteVersionId(Long rfpQuoteVersionId) {
		this.rfpQuoteVersionId = rfpQuoteVersionId;
	}

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }
}
