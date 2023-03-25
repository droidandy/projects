package com.benrevo.common.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ClientCarrier {

    private long id;
    private String category;
    private String name;
    @JsonProperty("display_name")
    private String displayName;
    private String status;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = null == status ? "NONE" : status;
    }
}
