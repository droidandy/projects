package com.benrevo.data.persistence.entities;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "timeline")
public class Timeline {
	@Id @GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column	(name = "timeline_id")
	private Long timelineId;
	
	@Column	(name = "ref_num")
	private Long refNum;
	
	@Column	(name = "client_id")
	private Long clientId;
	
	@Column	(name = "carrier_id")
	private Long carrierId;
	
	@Column (name = "milestone")
	private String milestone;

	@Column (name = "assignee")
	private String assignee;

	@Column (name = "create_time")
	private Date createTime;

	@Column (name = "projected_time")
	private Date projectedTime;

	@Column (name = "completed")
	private boolean completed;

	@Column (name = "completed_time")
	private Date completedTime;

	@Column (name = "overdue_notification_time")
	private Date overdueNotificationTime;
	
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

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
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

	public Date getCompletedTime() {
		return completedTime;
	}

	public void setCompletedTime(Date completedTime) {
		this.completedTime = completedTime;
	}

	public Date getOverdueNotificationTime() {
		return overdueNotificationTime;
	}

	public void setOverdueNotificationTime(Date overdueNotificationTime) {
		this.overdueNotificationTime = overdueNotificationTime;
	}

}
