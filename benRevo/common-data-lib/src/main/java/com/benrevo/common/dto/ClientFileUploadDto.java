package com.benrevo.common.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ClientFileUploadDto {
    private long id;
    @JsonProperty("set_id")
    private long infoValueId;
    @JsonProperty("file_name")
    private String fileName;
    private String link;
    private Long size;
    @JsonProperty("plan")
    private String value;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getInfoValueId() {
        return infoValueId;
    }

    public void setInfoValueId(long infoValueId) {
        this.infoValueId = infoValueId;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public Long getSize() {
        return size;
    }

    public void setSize(Long size) {
        this.size = size;
    }
}
