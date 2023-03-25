package com.benrevo.common.dto;

import com.benrevo.common.enums.MarketingStatus;

public class MarketingStatusDto {
    
    private Long marketingStatusId;
    private String product;
    private Long clientId;
    private Long carrierId;
    private String carrierName;
    private String carrierDisplayName; 
    private String carrierLogoUrl;
    private MarketingStatus status;

    public MarketingStatusDto() {}

    public Long getMarketingStatusId() {
        return marketingStatusId;
    }

    public void setMarketingStatusId(Long marketingStatusId) {
        this.marketingStatusId = marketingStatusId;
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

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
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

    public String getCarrierLogoUrl() {
        return carrierLogoUrl;
    }

    public void setCarrierLogoUrl(String carrierLogoUrl) {
        this.carrierLogoUrl = carrierLogoUrl;
    }

    public MarketingStatus getStatus() {
        return status;
    }

    public void setStatus(MarketingStatus status) {
        this.status = status;
    }
}
