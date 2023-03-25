package com.benrevo.common.dto;

import java.util.Date;
import java.util.List;
import com.benrevo.common.enums.ClientState;
import com.benrevo.common.enums.QuoteType;

public class ClientDetailsDto {

    private Long clientId;
    private Long carrierOwnedClientId;
    private String clientToken;
    private String clientName;
    private String brokerName;
    private String salesName;
    private String gaName;
    private Date effectiveDate;
    private Long employeeCount;
    private ClientState clientState;
    private Date dateUploaded;
    private QuoteType quoteType;
    private String probability;
    private String currentCarrierName;
    private List<ActivityDto> differences;
    private List<QuoteOptionBriefDto> options;

    public ClientDetailsDto() {}

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

    public String getBrokerName() {
        return brokerName;
    }

    public void setBrokerName(String brokerName) {
        this.brokerName = brokerName;
    }

    public String getSalesName() {
        return salesName;
    }

    public void setSalesName(String salesName) {
        this.salesName = salesName;
    }

    public String getGaName() {
        return gaName;
    }

    public void setGaName(String gaName) {
        this.gaName = gaName;
    }

    public Date getEffectiveDate() {
        return effectiveDate;
    }

    public void setEffectiveDate(Date effectiveDate) {
        this.effectiveDate = effectiveDate;
    }

    public Long getEmployeeCount() {
        return employeeCount;
    }

    public void setEmployeeCount(Long employeeCount) {
        this.employeeCount = employeeCount;
    }

    public ClientState getClientState() {
        return clientState;
    }

    public void setClientState(ClientState clientState) {
        this.clientState = clientState;
    }

    public Date getDateUploaded() {
        return dateUploaded;
    }

    public void setDateUploaded(Date dateUploaded) {
        this.dateUploaded = dateUploaded;
    }

    public QuoteType getQuoteType() {
        return quoteType;
    }

    public void setQuoteType(QuoteType quoteType) {
        this.quoteType = quoteType;
    }

    public String getProbability() {
        return probability;
    }

    public void setProbability(String probability) {
        this.probability = probability;
    }

    public String getCurrentCarrierName() {
        return currentCarrierName;
    }

    public void setCurrentCarrierName(String currentCarrierName) {
        this.currentCarrierName = currentCarrierName;
    }

    public List<ActivityDto> getDifferences() {
        return differences;
    }

    public void setDifferences(List<ActivityDto> differences) {
        this.differences = differences;
    }

    public List<QuoteOptionBriefDto> getOptions() {
        return options;
    }

    public void setOptions(List<QuoteOptionBriefDto> options) {
        this.options = options;
    }

    public Long getCarrierOwnedClientId() {
        return carrierOwnedClientId;
    }

    public void setCarrierOwnedClientId(Long carrierOwnedClientId) {
        this.carrierOwnedClientId = carrierOwnedClientId;
    }

    public String getClientToken() {
        return clientToken;
    }

    public void setClientToken(String clientToken) {
        this.clientToken = clientToken;
    }
}
