package com.benrevo.common.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ClientImage {

    @JsonProperty("client_id")
    private int clientId;
    @JsonProperty("file_name")
    private String fileName;
    private String link;

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

    public int getClientId() {
        return clientId;
    }

    public void setClientId(int clientId) {
        this.clientId = clientId;
    }
}
