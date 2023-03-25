package com.benrevo.data.persistence.entities;

import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import com.benrevo.common.enums.ActivityType;

@Entity
@Table(name = "activity")
public class Activity {
	
    @Id 
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column	(name = "activity_id")
	private Long activityId;

    @Column (name = "client_id")
    private Long clientId;

    @Column (name = "created")
    private Date created;

    @Column (name = "updated")
    private Date updated;

    @Column (name = "`type`")
    @Enumerated(EnumType.STRING)
    private ActivityType type;

    @Column (name = "`option`")
    private String option;

    @Column (name = "`value`")
    private String value;

    @Column (name = "notes")
    private String notes;

    @Column (name = "carrier_id")
    private Long carrierId;

    @Column(name = "product")
    private String product;

    @Column(name = "completed")
    private Date completed;

    @Column(name = "latest")
    private Boolean latest;

    protected Activity() { }
    
    public Activity(Long clientId, ActivityType type, String value, String notes) {
        this.clientId = clientId;
        this.type = type;
        this.value = value;
        this.notes = notes;
        this.created = new Date();
        this.latest = true;
    }

    public Activity created(Date created) {
        this.created = created;
        return this;
    }
    
    public Activity option(String option) {
        this.option = option;
        return this;
    }
    
    public Activity product(String product) {
        this.product = product;
        return this;
    }

    public Activity carrierId(Long carrierId) {
        this.carrierId = carrierId;
        return this;
    }

    public Long getActivityId() {
        return activityId;
    }

    public void setActivityId(Long activityId) {
        this.activityId = activityId;
    }

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public Date getCreated() {
        return created;
    }

    public void setCreated(Date created) {
        this.created = created;
    }

    public Date getUpdated() {
        return updated;
    }

    public void setUpdated(Date updated) {
        this.updated = updated;
    }

    public ActivityType getType() {
        return type;
    }

    public void setType(ActivityType type) {
        this.type = type;
    }

    public String getOption() {
        return option;
    }

    public void setOption(String option) {
        this.option = option;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Long getCarrierId() {
        return carrierId;
    }

    public void setCarrierId(Long carrierId) {
        this.carrierId = carrierId;
    }

    public String getProduct() {
        return product;
    }

    public void setProduct(String product) {
        this.product = product;
    }

    public Date getCompleted() {
        return completed;
    }

    public void setCompleted(Date completed) {
        this.completed = completed;
    }

    public Boolean getLatest() {
        return latest;
    }

    public void setLatest(Boolean latest) {
        this.latest = latest;
    }


}
