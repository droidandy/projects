package com.benrevo.common.dto;

import java.util.List;
import com.benrevo.common.enums.QuoteType;

public class RfpQuoteDto {
    private Long rfpQuoteId;
    private Long rfpCarrierId;
    private QuoteType quoteType;
    private String category;
    private Integer ratingTiers;
    private String fileName;
    private List<GetOption1Dto> currentPlans;
    private List<QuoteNetworkDto> rfpQuoteNetworks;

    public RfpQuoteDto() {
    }

    public RfpQuoteDto(Long rfpQuoteId, Long rfpCarrierId, QuoteType quoteType, Integer ratingTiers) {
        this.rfpQuoteId = rfpQuoteId;
        this.rfpCarrierId = rfpCarrierId;
        this.quoteType = quoteType;
        this.ratingTiers = ratingTiers;
    }

    public RfpQuoteDto(Long rfpQuoteId, String category, QuoteType quoteType, Integer ratingTiers) {
        this.rfpQuoteId = rfpQuoteId;
        this.category = category;
        this.quoteType = quoteType;
        this.ratingTiers = ratingTiers;
    }
    
    public Long getRfpQuoteId() {
        return rfpQuoteId;
    }

    public void setRfpQuoteId(Long rfpQuoteId) {
        this.rfpQuoteId = rfpQuoteId;
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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getRatingTiers() {
        return ratingTiers;
    }

    public void setRatingTiers(Integer ratingTiers) {
        this.ratingTiers = ratingTiers;
    }

    public List<GetOption1Dto> getCurrentPlans() {
        return currentPlans;
    }

    public void setCurrentPlans(List<GetOption1Dto> currentPlans) {
        this.currentPlans = currentPlans;
    }

    public List<QuoteNetworkDto> getRfpQuoteNetworks() {
        return rfpQuoteNetworks;
    }

    public void setRfpQuoteNetworks(List<QuoteNetworkDto> rfpQuoteNetworks) {
        this.rfpQuoteNetworks = rfpQuoteNetworks;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
}
