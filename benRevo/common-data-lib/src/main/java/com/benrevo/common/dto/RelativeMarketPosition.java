package com.benrevo.common.dto;

public class RelativeMarketPosition {

    private Long carrierId;
    private String carrierName;
    private String carrierDisplayName;
    private String logoUrl;
    private Integer groups;
    private Float avgDiffPercent;
    private Float medianDiffPercent;

    public RelativeMarketPosition() {}

    public String getCarrierName() {
        return carrierName;
    }

    public Long getCarrierId() {
        return carrierId;
    }

    public void setCarrierId(Long carrierId) {
        this.carrierId = carrierId;
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

    public String getLogoUrl() {
        return logoUrl;
    }
    
    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }

    public Integer getGroups() {
        return groups;
    }

    public void setGroups(Integer groups) {
        this.groups = groups;
    }

    public Float getAvgDiffPercent() {
        return avgDiffPercent;
    }

    public void setAvgDiffPercent(Float avgDiffPercent) {
        this.avgDiffPercent = avgDiffPercent;
    }

    public Float getMedianDiffPercent() {
        return medianDiffPercent;
    }

    public void setMedianDiffPercent(Float medianDiffPercent) {
        this.medianDiffPercent = medianDiffPercent;
    }
  
}
