package com.benrevo.common.dto;

import static com.benrevo.common.Constants.MDY_SLASH_DATE_FORMAT;
import java.util.Date;

public class TimelineDto {
    private Long timelineId;
    private Long refNum;
    private Long clientId;
    private transient Long carrierId;
    private String milestone;
    private String assignee;
    private transient Date createTime;
    private Date projectedTime;
    private boolean completed;
    private Date completedTime;
    private Boolean shouldSendNotification;

    public TimelineDto() {
	}

    public TimelineDto(long refNum, long clientId, long carrierId, String milestone, String assignee, Date projectedTime) {
        this(refNum, clientId, carrierId, milestone, assignee, null, projectedTime, false, null);
    }
    
	public TimelineDto(Long refNum, Long clientId, Long carrierId, String milestone, String assignee, Date createTime,
			Date projectedTime, boolean completed, Date completedTime) {
		this.refNum = refNum;
		this.clientId = clientId;
		this.carrierId = carrierId;
		this.milestone = milestone;
		this.assignee = assignee;
		this.createTime = createTime;
		this.projectedTime = projectedTime;
		this.completed = completed;
		this.completedTime = completedTime;
	}

	public Long getTimelineId() {
        return timelineId;
    }

    public void setTimelineId(Long timelineId) {
        this.timelineId = timelineId;
    }

    public Long getRefNum() {
        return refNum;
    }

    public void setRefNum(Long refNum) {
        this.refNum = refNum;
    }

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public Long getCarrierId() {
        return carrierId;
    }

    public void setCarrierId(Long carrierId) {
        this.carrierId = carrierId;
    }

    public String getMilestone() {
        return milestone;
    }

    public void setMilestone(String milestone) {
        this.milestone = milestone;
    }

    public String getAssignee() {
        return assignee;
    }

    public void setAssignee(String assignee) {
        this.assignee = assignee;
    }

    public Date getProjectedTime() {
        return projectedTime;
    }

    public void setProjectedTime(Date projectedTime) {
        this.projectedTime = projectedTime;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Date getCompletedTime() {
        return completedTime;
    }

    public void setCompletedTime(Date completedTime) {
        this.completedTime = completedTime;
    }

    public Boolean isShouldSendNotification() {
        return shouldSendNotification;
    }

    public void setShouldSendNotification(Boolean shouldSendNotification) {
        this.shouldSendNotification = shouldSendNotification;
    }
}
