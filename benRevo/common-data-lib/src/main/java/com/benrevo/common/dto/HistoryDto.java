package com.benrevo.common.dto;

/**
 * Created by lemdy on 6/18/17.
 */
public class HistoryDto {
    String name;
    String date;
    String type;
    String fileName;

    public HistoryDto() {
    }

    public HistoryDto(String name, String date) {
        this.name = name;
        this.date = date;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
}
