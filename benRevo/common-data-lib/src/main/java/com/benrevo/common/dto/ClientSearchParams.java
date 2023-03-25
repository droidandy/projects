package com.benrevo.common.dto;

import com.benrevo.common.enums.AttributeName;
import com.benrevo.common.enums.ClientState;
import java.util.List;

public class ClientSearchParams {
    
    private String product;
    private List<Long> brokerIds;
    private String clientName;
    private List<ClientState> clientStates;
    private String effectiveDateTo;
    private String effectiveDateFrom;
    private List<Long> carrierIds;
    private Boolean multipleCarriers;
    private List<Long> presaleIds; 
    private List<Long> saleIds; 
    private Integer employeeCountFrom;
    private Integer employeeCountTo;
    private Float diffPercentFrom;
    private Float diffPercentTo;
    private Float diffDollarFrom;
    private Float diffDollarTo;
    private String probability;
    private Float rateBankAmount;
    private String competitiveInfoCarrier;
    private List<AttributeName> clientAttributes;
    private List<AttributeName> excludeClientAttributes;

    public ClientSearchParams() {}

    public String getProduct() {
        return product;
    }

    public void setProduct(String product) {
        this.product = product;
    }

    public List<Long> getBrokerIds() {
        return brokerIds;
    }
    
    public void setBrokerIds(List<Long> brokerIds) {
        this.brokerIds = brokerIds;
    }

    public String getClientName() {
        return clientName;
    }

    public List<ClientState> getClientStates() {
        return clientStates;
    }

    public void setClientStates(List<ClientState> clientStates) {
        this.clientStates = clientStates;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public List<Long> getCarrierIds() {
        return carrierIds;
    }
    
    public void setCarrierIds(List<Long> carrierIds) {
        this.carrierIds = carrierIds;
    }
    
    public Boolean getMultipleCarriers() {
        return multipleCarriers;
    }
    
    public void setMultipleCarriers(Boolean multipleCarriers) {
        this.multipleCarriers = multipleCarriers;
    }

    public String getEffectiveDateFrom() {
        return effectiveDateFrom;
    }

    public void setEffectiveDateFrom(String effectiveDateFrom) {
        this.effectiveDateFrom = effectiveDateFrom;
    }

    public String getEffectiveDateTo() {
        return effectiveDateTo;
    }

    public void setEffectiveDateTo(String effectiveDateTo) {
        this.effectiveDateTo = effectiveDateTo;
    }
    
    public List<Long> getPresaleIds() {
        return presaleIds;
    }
    
    public void setPresaleIds(List<Long> presaleIds) {
        this.presaleIds = presaleIds;
    }
    
    public List<Long> getSaleIds() {
        return saleIds;
    }
    
    public void setSaleIds(List<Long> saleIds) {
        this.saleIds = saleIds;
    }

    public Integer getEmployeeCountFrom() {
        return employeeCountFrom;
    }

    public void setEmployeeCountFrom(Integer employeeCountFrom) {
        this.employeeCountFrom = employeeCountFrom;
    }

    public Integer getEmployeeCountTo() {
        return employeeCountTo;
    }

    public void setEmployeeCountTo(Integer employeeCountTo) {
        this.employeeCountTo = employeeCountTo;
    }

    public Float getDiffPercentFrom() {
        return diffPercentFrom;
    }

    public void setDiffPercentFrom(Float diffPercentFrom) {
        this.diffPercentFrom = diffPercentFrom;
    }

    public Float getDiffPercentTo() {
        return diffPercentTo;
    }

    public void setDiffPercentTo(Float diffPercentTo) {
        this.diffPercentTo = diffPercentTo;
    }
    
    public Float getDiffDollarFrom() {
        return diffDollarFrom;
    }
    
    public void setDiffDollarFrom(Float diffDollarFrom) {
        this.diffDollarFrom = diffDollarFrom;
    }
    
    public Float getDiffDollarTo() {
        return diffDollarTo;
    }
    
    public void setDiffDollarTo(Float diffDollarTo) {
        this.diffDollarTo = diffDollarTo;
    }

    public String getProbability() {
        return probability;
    }

    public void setProbability(String probability) {
        this.probability = probability;
    }

    public Float getRateBankAmount() {
        return rateBankAmount;
    }

    public void setRateBankAmount(Float rateBankAmount) {
        this.rateBankAmount = rateBankAmount;
    }

    public String getCompetitiveInfoCarrier() {
        return competitiveInfoCarrier;
    }

    public void setCompetitiveInfoCarrier(String competitiveInfoCarrier) {
        this.competitiveInfoCarrier = competitiveInfoCarrier;
    }

    public List<AttributeName> getClientAttributes() {
        return clientAttributes;
    }

    public void setClientAttributes(List<AttributeName> clientAttributes) {
        this.clientAttributes = clientAttributes;
    }

	public List<AttributeName> getExcludeClientAttributes() {
		return excludeClientAttributes;
	}

	public void setExcludeClientAttributes(List<AttributeName> excludeClientAttributes) {
		this.excludeClientAttributes = excludeClientAttributes;
	}
}
