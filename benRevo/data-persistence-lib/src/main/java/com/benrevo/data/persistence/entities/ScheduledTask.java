package com.benrevo.data.persistence.entities;

import com.benrevo.common.enums.SchedulerTaskRateUnit;
import com.benrevo.common.enums.SchedulerTaskType;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "scheduled_task")
public class ScheduledTask {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "scheduled_task_id")
    private Long scheduledTaskId;

    @Column(name = "task_type")
    @Enumerated(EnumType.STRING)
    private SchedulerTaskType taskType;
    
    @Column(name = "rate")
    private String rate;
    
    @Column(name = "rate_unit")
    @Enumerated(EnumType.STRING)
    private SchedulerTaskRateUnit rateUnit;
    
    @Column(name = "last_executed")
    private Date lastExecuted;

    @Column(name = "enabled")
    private boolean enabled;

    public Long getScheduledTaskId() {
        return scheduledTaskId;
    }
    
    public void setScheduledTaskId(Long scheduledTaskId) {
        this.scheduledTaskId = scheduledTaskId;
    }
    
    public SchedulerTaskType getTaskType() {
        return taskType;
    }
    
    public void setTaskType(SchedulerTaskType taskType) {
        this.taskType = taskType;
    }
    
    public String getRate() {
        return rate;
    }
    
    public void setRate(String rate) {
        this.rate = rate;
    }
    
    public SchedulerTaskRateUnit getRateUnit() {
        return rateUnit;
    }
    
    public void setRateUnit(SchedulerTaskRateUnit rateUnit) {
        this.rateUnit = rateUnit;
    }
    
    public Date getLastExecuted() {
        return lastExecuted;
    }
    
    public void setLastExecuted(Date lastExecuted) {
        this.lastExecuted = lastExecuted;
    }
    
    public boolean isEnabled() {
        return enabled;
    }
    
    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }
}
