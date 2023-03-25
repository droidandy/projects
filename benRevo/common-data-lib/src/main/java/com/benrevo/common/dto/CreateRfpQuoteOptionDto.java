package com.benrevo.common.dto;

import javax.validation.constraints.NotNull;

import com.benrevo.common.enums.OptionType;
import com.benrevo.common.enums.QuoteType;

public class CreateRfpQuoteOptionDto {
	
	@NotNull
	private Long clientId;
	@NotNull
	private Long rfpCarrierId;

	private OptionType optionType;

	private QuoteType quoteType;

	private String displayName;
	
	public CreateRfpQuoteOptionDto() {
	}
	
	public Long getClientId() {
		return clientId;
	}
	
	public void setClientId(Long clientId) {
		this.clientId = clientId;
	}

	public Long getRfpCarrierId() {
		return rfpCarrierId;
	}

	public void setRfpCarrierId(Long rfpCarrierId) {
		this.rfpCarrierId = rfpCarrierId;
	}

	public QuoteType getQuoteType() {
		return quoteType;
	}

	public void setQuoteType(QuoteType quoteType) {
		this.quoteType = quoteType;
	}

	public OptionType getOptionType() {
		return optionType;
	}

	public void setOptionType(OptionType optionType) {
		this.optionType = optionType;
	}

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }
}