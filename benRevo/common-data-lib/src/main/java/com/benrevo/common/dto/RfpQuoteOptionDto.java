package com.benrevo.common.dto;

import com.benrevo.common.enums.OptionType;
import com.benrevo.common.enums.QuoteType;
import java.util.ArrayList;
import java.util.List;
import javax.validation.constraints.NotNull;

public class RfpQuoteOptionDto {

    private Long rfpQuoteOptionId;
    
	private Long clientId;
	
	private Integer ratingTiers;
	
	private List<OptionPlanDto> optionPlans = new ArrayList<>();

	private QuoteType quoteType;
	
	private OptionType optionType;
	
    private String optionName;
    
    private String product;
    
    private Long carrierId;
    
    private String carrierDisplayName;
	
	public RfpQuoteOptionDto() {}
	
	public Long getClientId() {
		return clientId;
	}
	
	public void setClientId(Long clientId) {
		this.clientId = clientId;
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
    
    public Long getRfpQuoteOptionId() {
        return rfpQuoteOptionId;
    }
    
    public void setRfpQuoteOptionId(Long rfpQuoteOptionId) {
        this.rfpQuoteOptionId = rfpQuoteOptionId;
    }
    
    public List<OptionPlanDto> getOptionPlans() {
        return optionPlans;
    }
    
    public void setOptionPlans(List<OptionPlanDto> optionPlans) {
        this.optionPlans = optionPlans;
    }
 
    public String getOptionName() {
        return optionName;
    }

    public void setOptionName(String optionName) {
        this.optionName = optionName;
    }
    
    public String getProduct() {
        return product;
    }

    public void setProduct(String product) {
        this.product = product;
    }

    public Long getCarrierId() {
        return carrierId;
    }

    public void setCarrierId(Long carrierId) {
        this.carrierId = carrierId;
    }

    public String getCarrierDisplayName() {
        return carrierDisplayName;
    }

    public void setCarrierDisplayName(String carrierDisplayName) {
        this.carrierDisplayName = carrierDisplayName;
    }
    
    public Integer getRatingTiers() {
        return ratingTiers;
    }

    public void setRatingTiers(Integer ratingTiers) {
        this.ratingTiers = ratingTiers;
    }
}