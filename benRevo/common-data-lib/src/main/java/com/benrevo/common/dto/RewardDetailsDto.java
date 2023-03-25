package com.benrevo.common.dto;

import java.util.Date;

public class RewardDetailsDto {
    private Long activityId;
    private Date created;
    private String participantId;
    private String firstName;
    private String lastName;
    private String email;
    private String brokerageName;
    private String address;
    private String city;
    private String state;
    private String zip;
    private Integer points;
    private boolean firstReward;
    
    public RewardDetailsDto() {
    }
    
    public Long getActivityId() {
        return activityId;
    }

    public void setActivityId(Long activityId) {
        this.activityId = activityId;
    }
    
    public Date getCreated() {
        return created;
    }
    
    public void setCreated(Date created) {
        this.created = created;
    }

    public String getParticipantId() {
        return participantId;
    }
    
    public void setParticipantId(String participantId) {
        this.participantId = participantId;
    }
    
    public String getFirstName() {
        return firstName;
    }
    
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    
    public String getLastName() {
        return lastName;
    }
    
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getBrokerageName() {
        return brokerageName;
    }
    
    public void setBrokerageName(String brokerageName) {
        this.brokerageName = brokerageName;
    }
    
    public String getAddress() {
        return address;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }
    
    public String getCity() {
        return city;
    }
    
    public void setCity(String city) {
        this.city = city;
    }
    
    public String getState() {
        return state;
    }
    
    public void setState(String state) {
        this.state = state;
    }
    
    public String getZip() {
        return zip;
    }
    
    public void setZip(String zip) {
        this.zip = zip;
    }

    public Integer getPoints() {
        return points;
    }

    public void setPoints(Integer points) {
        this.points = points;
    }
    
    public boolean isFirstReward() {
        return firstReward;
    }

    public void setFirstReward(boolean firstReward) {
        this.firstReward = firstReward;
    }  
}
