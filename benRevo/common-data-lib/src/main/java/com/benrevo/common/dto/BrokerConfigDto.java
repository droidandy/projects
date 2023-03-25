package com.benrevo.common.dto;

import com.benrevo.common.enums.BrokerConfigType;

public class BrokerConfigDto {

    private BrokerConfigType type;
    private String data;
    private String modifyBy;
    private String modifyDate;
    
    public BrokerConfigType getType() {
        return type;
    }
    public void setType(BrokerConfigType type) {
        this.type = type;
    }
    public String getData() {
        return data;
    }
    public void setData(String data) {
        this.data = data;
    }
    public String getModifyBy() {
        return modifyBy;
    }
    public void setModifyBy(String modifyBy) {
        this.modifyBy = modifyBy;
    }
    public String getModifyDate() {
        return modifyDate;
    }
    public void setModifyDate(String modifyDate) {
        this.modifyDate = modifyDate;
    }
    
}
