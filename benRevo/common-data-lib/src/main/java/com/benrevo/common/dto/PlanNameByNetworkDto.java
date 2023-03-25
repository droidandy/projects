package com.benrevo.common.dto;

public class PlanNameByNetworkDto {

    private Long pnnId;
    
    private String name;
    private String planType;
    
    private Long networkId;
    private String networkName;

    public PlanNameByNetworkDto() {
    }
    
    public Long getPnnId() {
        return pnnId;
    }
  
    public void setPnnId(Long pnnId) {
        this.pnnId = pnnId;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
  
    public String getPlanType() {
        return planType;
    }
    
    public void setPlanType(String planType) {
        this.planType = planType;
    }
    
    public Long getNetworkId() {
        return networkId;
    }
    
    public void setNetworkId(Long networkId) {
        this.networkId = networkId;
    }
    
    public String getNetworkName() {
        return networkName;
    }

    public void setNetworkName(String networkName) {
        this.networkName = networkName;
    }
}
