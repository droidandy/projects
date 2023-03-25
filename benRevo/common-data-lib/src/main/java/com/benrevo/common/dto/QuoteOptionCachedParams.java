package com.benrevo.common.dto;

import java.util.Objects;

public class QuoteOptionCachedParams {
	private Float diffPercent;
	private Float diffDollar;
	private Float optionTotal;
	private Long carrierId;
	private String carrierName;
	private String carrierDisplayName;
	
	public QuoteOptionCachedParams() {}

    public QuoteOptionCachedParams(Float diffPercent, Float diffDollar, Long carrierId, String carrierName, String carrierDisplayName) {
        this.diffPercent = diffPercent;
        this.diffDollar = diffDollar;
        this.carrierId = carrierId;
        this.carrierName = carrierName;
        this.carrierDisplayName = carrierDisplayName;
    }
    
    public Float getDiffPercent() {
        return diffPercent;
    }
    
    public void setDiffPercent(Float diffPercent) {
        this.diffPercent = diffPercent;
    }
    
    public Float getDiffDollar() {
        return diffDollar;
    }
    
    public void setDiffDollar(Float diffDollar) {
        this.diffDollar = diffDollar;
    }
    
    public Long getCarrierId() {
        return carrierId;
    }
    
    public void setCarrierId(Long carrierId) {
        this.carrierId = carrierId;
    }

    public String getCarrierName() {
        return carrierName;
    }
    
    public void setCarrierName(String carrierName) {
        this.carrierName = carrierName;
    }
    
    public String getCarrierDisplayName() {
        return carrierDisplayName;
    }
    
    public void setCarrierDisplayName(String carrierDisplayName) {
        this.carrierDisplayName = carrierDisplayName;
    }
    
    public Float getOptionTotal() {
        return optionTotal;
    }

    public void setOptionTotal(Float optionTotal) {
        this.optionTotal = optionTotal;
    }

    @Override
    public int hashCode() {
        return Objects.hash(diffDollar, diffPercent, optionTotal, carrierId, carrierName, carrierDisplayName);
    }

    @Override
    public boolean equals(Object obj) {
        if(obj == this) {
            return true;
        }
        if(!(obj instanceof QuoteOptionCachedParams)) {
            return false;
        }
        QuoteOptionCachedParams other = (QuoteOptionCachedParams) obj;

        return Objects.equals(diffDollar, other.diffDollar) 
            && Objects.equals(diffPercent, other.diffPercent)
            && Objects.equals(optionTotal, other.optionTotal)
            && Objects.equals(carrierId, other.carrierId)
            && Objects.equals(carrierName, other.carrierName)
            && Objects.equals(carrierDisplayName, other.carrierDisplayName);
    }
}
