package com.benrevo.common.dto;

import java.util.Date;
import java.util.List;
import com.benrevo.common.enums.ActivityType;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

@JsonInclude(Include.NON_NULL)
public class ActivityDto {

    public static class Option {
        private String name;
        private String DisplayName;
        private boolean selected;
        
        public Option() {
        }
        
        public Option(String name, String displayName, boolean selected) {
            this.name = name;
            DisplayName = displayName;
            this.selected = selected;
        }

        public String getName() {
            return name;
        }
        public void setName(String name) {
            this.name = name;
        }
        public String getDisplayName() {
            return DisplayName;
        }
        public void setDisplayName(String displayName) {
            DisplayName = displayName;
        }
        public boolean isSelected() {
            return selected;
        }
        public void setSelected(boolean selected) {
            this.selected = selected;
        }
        
    }
    
    private Long activityId;
    private Long clientId;
    private Date created;
    private ActivityType type;
    private String option;
    private List<Option> options;
    private String value;
    private Long carrierId;
    private String notes;
    private String product;
    private List<ActivityClientTeamDto> clientTeams;
    private List<Long> clientTeamIds;
    private Boolean completed;
    private String text;
    
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
    public List<Option> getOptions() {
        return options;
    }
    public void setOptions(List<Option> options) {
        this.options = options;
    }
    public String getValue() {
        return value;
    }
    public void setValue(String value) {
        this.value = value;
    }
    public Long getCarrierId() {
        return carrierId;
    }
    public void setCarrierId(Long carrierId) {
        this.carrierId = carrierId;
    }
    public String getNotes() {
        return notes;
    }
    public void setNotes(String notes) {
        this.notes = notes;
    }
    public String getProduct() {
        return product;
    }
    public void setProduct(String product) {
        this.product = product;
    }
    public List<ActivityClientTeamDto> getClientTeams() {
        return clientTeams;
    }
    public void setClientTeams(List<ActivityClientTeamDto> clientTeams) {
        this.clientTeams = clientTeams;
    }
    public List<Long> getClientTeamIds() {
        return clientTeamIds;
    }
    public void setClientTeamIds(List<Long> clientTeamIds) {
        this.clientTeamIds = clientTeamIds;
    }
    public Boolean getCompleted() {
        return completed;
    }
    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }
    public String getText() {
        return text;
    }
    public void setText(String text) {
        this.text = text;
    }
    
}
