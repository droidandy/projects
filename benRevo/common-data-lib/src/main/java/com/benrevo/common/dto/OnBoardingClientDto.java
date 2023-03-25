package com.benrevo.common.dto;

import com.benrevo.common.enums.ClientState;
import java.util.Date;
import java.util.Objects;

public class OnBoardingClientDto {

    private Long id;
    private String clientName;
    private ClientState clientState;
    private Date effectiveDate;
    private Date completedDate;
    private Integer progressPercent;
    private String salesRepName;
    private boolean timelineEnabled;

    public OnBoardingClientDto() {}
    
    public OnBoardingClientDto(Long clientId, String clientName, ClientState clientState, Date effectiveDate, 
            String salesRepName, Integer progressPercent, Date completedDate, boolean timelineEnabled) {
        this.id = clientId;
        this.clientName = clientName;
        this.clientState = clientState;
        this.effectiveDate = effectiveDate;
        this.completedDate = completedDate;
        this.salesRepName = salesRepName;
        this.progressPercent = progressPercent; 
        this.timelineEnabled = timelineEnabled;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public ClientState getClientState() {
        return clientState;
    }

    public void setClientState(ClientState clientState) {
        this.clientState = clientState;
    }

    public Date getEffectiveDate() {
        return effectiveDate;
    }

    public void setEffectiveDate(Date effectiveDate) {
        this.effectiveDate = effectiveDate;
    }

    public Date getCompletedDate() {
        return completedDate;
    }
    
    public void setCompletedDate(Date completedDate) {
        this.completedDate = completedDate;
    }

    public Integer getProgressPercent() {
        return progressPercent;
    }

    public void setProgressPercent(Integer progressPercent) {
        this.progressPercent = progressPercent;
    }

    public String getSalesRepName() {
        return salesRepName;
    }

    public void setSalesRepName(String salesRepName) {
        this.salesRepName = salesRepName;
    }

    public boolean isTimelineEnabled() {
        return timelineEnabled;
    }

    public void setTimelineEnabled(boolean timelineEnabled) {
        this.timelineEnabled = timelineEnabled;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;

        OnBoardingClientDto that = (OnBoardingClientDto) o;

        return Objects.equals(this.id, that.id) 
                && Objects.equals(this.clientName, that.clientName)
                && Objects.equals(this.clientState, that.clientState)
                && Objects.equals(this.effectiveDate, that.effectiveDate)
                && Objects.equals(this.completedDate, that.completedDate)
                && Objects.equals(this.progressPercent, that.progressPercent)
                && Objects.equals(this.salesRepName, that.salesRepName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, clientName, clientState, completedDate, effectiveDate, progressPercent, salesRepName);
    }
}
