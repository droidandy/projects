package com.benrevo.common.dto;

public class ActivityClientTeamDto {
    private Long clientTeamId;
    private String name;
    private boolean selected;
    
    public ActivityClientTeamDto() {
    }

    public ActivityClientTeamDto(Long clientTeamId, String name, boolean selected) {
        this.clientTeamId = clientTeamId;
        this.name = name;
        this.selected = selected;
    }

    public Long getClientTeamId() {
        return clientTeamId;
    }
    public void setClientTeamId(Long clientTeamId) {
        this.clientTeamId = clientTeamId;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public boolean isSelected() {
        return selected;
    }
    public void setSelected(boolean selected) {
        this.selected = selected;
    }
    
}

