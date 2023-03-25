package com.benrevo.common.dto;

import java.util.Date;

public class RewardsInfoDto {
    private String recipientName;
    private String clientName;
    private Long clientId;
    private Date requestDate;
    private Integer pointsTotal;
    private boolean sent;
    
    public RewardsInfoDto() {
    }

    public RewardsInfoDto(String recipientName, String clientName, Long clientId, Date requestDate, Integer pointsTotal, boolean sent) {
        this.recipientName = recipientName;
        this.clientName = clientName;
        this.clientId = clientId;
        this.requestDate = requestDate;
        this.pointsTotal = pointsTotal;
        this.sent = sent;
    }

    public String getRecipientName() {
        return recipientName;
    }

    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
    }

    public String getClientName() {
        return clientName;
    }
    
    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public Long getClientId() {
        return clientId;
    }
 
    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public Date getRequestDate() {
        return requestDate;
    }

    public void setRequestDate(Date requestDate) {
        this.requestDate = requestDate;
    }

    public Integer getPointsTotal() {
        return pointsTotal;
    }

    public void setPointsTotal(Integer pointsTotal) {
        this.pointsTotal = pointsTotal;
    }

    public boolean isSent() {
        return sent;
    }

    public void setSent(boolean sent) {
        this.sent = sent;
    }
    
}
