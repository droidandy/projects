package com.benrevo.common.dto;

import java.util.Date;
import com.benrevo.common.enums.ClientState;

public class ClientPreQuotedDto {

    private Long clientId;
    private String clientName;
    private String presalesName;
    private String brokerName;
    private Date effectiveDate;
    private ClientState clientState;
    private boolean isNew;

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

    public ClientState getClientState() {
        return clientState;
    }

    public void setClientState(ClientState clientState) {
        this.clientState = clientState;
    }

    public String getPresalesName() {
        return presalesName;
    }

    public void setPresalesName(String presalesName) {
        this.presalesName = presalesName;
    }

    public Date getEffectiveDate() {
        return effectiveDate;
    }

    public void setEffectiveDate(Date effectiveDate) {
        this.effectiveDate = effectiveDate;
    }

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public boolean isNew() {
        return isNew;
    }

    public void setNew(boolean isNew) {
        this.isNew = isNew;
    }

}
