package com.benrevo.common.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class RenewalOption {

    private long id;
    private String cmd;
    @JsonProperty("groupId")
    private long clientId;
    private String name;
    private long bucket;
    private Contributions cost;
    private RenewalOptionDetails renew;
    private boolean exchange;

    public long getClientId() {
        return clientId;
    }

    public void setClientId(long clientId) {
        this.clientId = clientId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Contributions getCost() {
        return cost;
    }

    public void setCost(Contributions cost) {
        this.cost = cost;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getCmd() {
        return cmd;
    }

    public void setCmd(String cmd) {
        this.cmd = cmd;
    }

    public boolean isExchange() {
        return exchange;
    }

    public void setExchange(boolean exchange) {
        this.exchange = exchange;
    }

    public long getBucket() {
        return bucket;
    }

    public void setBucket(long bucket) {
        this.bucket = bucket;
    }

    public RenewalOptionDetails getRenew() {
        return renew;
    }

    public void setRenew(RenewalOptionDetails renew) {
        this.renew = renew;
    }
}
