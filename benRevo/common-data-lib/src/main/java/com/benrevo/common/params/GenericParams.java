package com.benrevo.common.params;

import com.fasterxml.jackson.annotation.JsonProperty;

public class GenericParams {

    private long id;
    @JsonProperty("client_id")
    private long clientId;
    private long bucket;
    private long brokerId;
    private String category;
    @JsonProperty("groupInfoId")
    private long clientId2;
    private long carrierId;
    private long timelineRefNum;
    @JsonProperty("broker_token")
    private String brokerToken;
    @JsonProperty("user_status")
    private String userStatus;
    @JsonProperty("user_id")
    private long userId;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getBucket() {
        return bucket;
    }

    public void setBucket(long bucket) {
        this.bucket = bucket;
    }

    public long getBrokerId() {
        return brokerId;
    }

    public void setBrokerId(long brokerId) {
        this.brokerId = brokerId;
    }

    public long getClientId() {
        return clientId;
    }

    public void setClientId(long clientId) {
        this.clientId = clientId;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public long getClientId2() {
        return clientId2;
    }

    public void setClientId2(long clientId2) {
        this.clientId2 = clientId2;
    }

    public long getCarrierId() {
        return carrierId;
    }

    public void setCarrierId(long carrierId) {
        this.carrierId = carrierId;
    }

    public long getTimelineRefNum() {
        return timelineRefNum;
    }

    public void setTimelineRefNum(long timelineRefNum) {
        this.timelineRefNum = timelineRefNum;
    }

    public String getBrokerToken() {
        return brokerToken;
    }

    public void setBrokerToken(String brokerToken) {
        this.brokerToken = brokerToken;
    }

    public String getUserStatus() {
        return userStatus;
    }

    public void setUserStatus(String userStatus) {
        this.userStatus = userStatus;
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }
}
