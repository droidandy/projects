package com.benrevo.common.dto;

import java.util.Date;
import com.benrevo.common.enums.ClientState;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

@JsonInclude(Include.NON_NULL)
public class ClientRenewalDto {

    private Long clientId;
    private String clientName;
    private Date effectiveDate;
    private String probability;
    private ClientState clientState;
    private String status;
    
    public ClientRenewalDto() {
    }

    public ClientRenewalDto(Long clientId, String clientName, Date effectiveDate,
            String probability) {
        this.clientId = clientId;
        this.clientName = clientName;
        this.effectiveDate = effectiveDate;
        this.probability = probability;
    }

    public ClientRenewalDto(Long clientId, String clientName, Date effectiveDate,
            ClientState clientState) {
        this.clientId = clientId;
        this.clientName = clientName;
        this.effectiveDate = effectiveDate;
        this.clientState = clientState;
    }

    public ClientRenewalDto(Long clientId, String clientName, Date effectiveDate) {
        this.clientId = clientId;
        this.clientName = clientName;
        this.effectiveDate = effectiveDate;
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
    public Date getEffectiveDate() {
        return effectiveDate;
    }
    public void setEffectiveDate(Date effectiveDate) {
        this.effectiveDate = effectiveDate;
    }
    public String getProbability() {
        return probability;
    }
    public void setProbability(String probability) {
        this.probability = probability;
    }

    public ClientRenewalDto clientState(ClientState clientState) {
        this.clientState = clientState;
        return this;
    }
    
    public ClientState getClientState() {
        return clientState;
    }

    public void setClientState(ClientState clientState) {
        this.clientState = clientState;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
    
}
