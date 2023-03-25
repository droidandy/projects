package com.benrevo.common.dto;

public class Account {

    private long brokerId;
    private String token;
    private String email;
    private int verified;
    private int active;
    private int notified;
    private String name;

    public Account() {
    }

    public long getBrokerId() {
        return brokerId;
    }

    public void setBrokerId(long brokerId) {
        this.brokerId = brokerId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public int getVerified() {
        return verified;
    }

    public boolean isVerified() {
        return verified == 1 ? true : false;
    }

    public void setVerified(int verified) {
        this.verified = verified;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public int getActive() {
        return active;
    }

    public void setActive(int active) {
        this.active = active;
    }

    public int getNotified() {
        return notified;
    }

    public void setNotified(int notified) {
        this.notified = notified;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
