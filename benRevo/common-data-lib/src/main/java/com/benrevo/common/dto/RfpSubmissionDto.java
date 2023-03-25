package com.benrevo.common.dto;

import java.util.List;

public class RfpSubmissionDto {

    private List<Long> rfpIds;
    private List<String> emails;
    private Long carrierId;
    private String programName; // optional: required one from carrierId/programName

    public List<Long> getRfpIds() {
        return rfpIds;
    }

    public void setRfpIds(List<Long> rfpIds) {
        this.rfpIds = rfpIds;
    }
 
    public List<String> getEmails() {
        return emails;
    }

    public void setEmails(List<String> emails) {
        this.emails = emails;
    }

    public Long getCarrierId() {
        return carrierId;
    }

    public void setCarrierId(Long carrierId) {
        this.carrierId = carrierId;
    }

    public String getProgramName() {
        return programName;
    }

    public void setProgramName(String programName) {
        this.programName = programName;
    }
}
