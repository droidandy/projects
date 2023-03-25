package com.benrevo.common.dto;

import java.util.List;

public class QuoteOptionListDto {
	private String category;
	private QuoteOptionBriefDto currentOption;
	private List<QuoteOptionBriefDto> options;
	
	public QuoteOptionListDto() {
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public QuoteOptionBriefDto getCurrentOption() {
		return currentOption;
	}

	public void setCurrentOption(QuoteOptionBriefDto currentOption) {
		this.currentOption = currentOption;
	}

	public List<QuoteOptionBriefDto> getOptions() {
		return options;
	}

	public void setOptions(List<QuoteOptionBriefDto> options) {
		this.options = options;
	}
}
