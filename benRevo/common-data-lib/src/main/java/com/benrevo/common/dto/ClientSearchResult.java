package com.benrevo.common.dto;

import com.benrevo.common.enums.AttributeName;
import com.benrevo.common.enums.ClientState;
import java.util.Date;
import java.util.List;

public class ClientSearchResult {

    private List<String> quotedProducts;
    private Long clientId;
    private String clientName;
    private Long brokerId;
    private String brokerName;
    private Date effectiveDate;
    private Long carrierId;
    private String carrierName;
    private String carrierDisplayName;
    private String carrierLogoUrl;
    private Long presalesId;
    private String presalesName;
    private Long salesId;
    private String salesName;
    private Integer employeeCount;
    private Float diffPercent;
    private Float diffDollar;
    private Long option1Id;
    private Long renewal1Id;
    private String quoteType;
    private String probability;
    private Float competitiveVsCurrent;
    private Float rateBankAmount;
    private ClientState clientState;
    private List<AttributeName> clientAttributes;
    private String startingRenewalIncrease;
    private String currentRenewalIncrease;

    public ClientSearchResult() {}

    public List<String> getQuotedProducts() {
        return quotedProducts;
    }

    public void setQuotedProducts(List<String> quotedProducts) {
        this.quotedProducts = quotedProducts;
    }

    public String getBrokerName() {
        return brokerName;
    }

    public void setBrokerName(String brokerName) {
        this.brokerName = brokerName;
    }

    public Long getBrokerId() {
        return brokerId;
    }
    
    public void setBrokerId(Long brokerId) {
        this.brokerId = brokerId;
    }

    public Date getEffectiveDate() {
        return effectiveDate;
    }

    public void setEffectiveDate(Date effectiveDate) {
        this.effectiveDate = effectiveDate;
    }

    public String getCarrierName() {
        return carrierName;
    }

    public void setCarrierName(String carrierName) {
        this.carrierName = carrierName;
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

    public String getCarrierLogoUrl() {
        return carrierLogoUrl;
    }
    
    public void setCarrierLogoUrl(String carrierLogoUrl) {
        this.carrierLogoUrl = carrierLogoUrl;
    }

    public String getPresalesName() {
        return presalesName;
    }

    public void setPresalesName(String presalesName) {
        this.presalesName = presalesName;
    }

    public Long getPresalesId() {
        return presalesId;
    }
    
    public void setPresalesId(Long presalesId) {
        this.presalesId = presalesId;
    }

    public String getSalesName() {
        return salesName;
    }

    public void setSalesName(String salesName) {
        this.salesName = salesName;
    }
    
    public Long getSalesId() {
        return salesId;
    }
    
    public void setSalesId(Long salesId) {
        this.salesId = salesId;
    }

    public Integer getEmployeeCount() {
        return employeeCount;
    }

    public void setEmployeeCount(Integer employeeCount) {
        this.employeeCount = employeeCount;
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

    public Long getOption1Id() {
        return option1Id;
    }
    
    public void setOption1Id(Long option1Id) {
        this.option1Id = option1Id;
    }

    public Long getRenewal1Id() {
        return renewal1Id;
    }

    public void setRenewal1Id(Long renewal1Id) {
        this.renewal1Id = renewal1Id;
    }

    public String getQuoteType() {
        return quoteType;
    }
    
    public void setQuoteType(String quoteType) {
        this.quoteType = quoteType;
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

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }
 
    public Float getCompetitiveVsCurrent() {
        return competitiveVsCurrent;
    }
    
    public void setCompetitiveVsCurrent(Float competitiveVsCurrent) {
        this.competitiveVsCurrent = competitiveVsCurrent;
    }

    public ClientState getClientState() {
        return clientState;
    }

    public void setClientState(ClientState clientState) {
        this.clientState = clientState;
    }

    public List<AttributeName> getClientAttributes() {
        return clientAttributes;
    }

    public void setClientAttributes(List<AttributeName> clientAttributes) {
        this.clientAttributes = clientAttributes;
    }

    public String getStartingRenewalIncrease() {
        return startingRenewalIncrease;
    }

    public void setStartingRenewalIncrease(String startingRenewalIncrease) {
        this.startingRenewalIncrease = startingRenewalIncrease;
    }

    public String getCurrentRenewalIncrease() {
        return currentRenewalIncrease;
    }

    public void setCurrentRenewalIncrease(String currentRenewalIncrease) {
        this.currentRenewalIncrease = currentRenewalIncrease;
    }

    
}
