package com.benrevo.common.dto;

import java.util.Date;

public class RfpSubmissionStatusDto {
    private String disqualificationReason;
    private boolean rfpSubmittedSuccessfully;
    private String type;
    private String product;
    private Date submissionDate;
    private String carrierName;
    private Long carrierId;
    private Long programId;

    public RfpSubmissionStatusDto() {}

    public RfpSubmissionStatusDto(boolean rfpSubmittedSuccessfully, Date submissionDate, Long carrierId,
        String carrierName, String product) {
        this.disqualificationReason = null;
        this.rfpSubmittedSuccessfully = rfpSubmittedSuccessfully;
        this.type = null;
        this.product = product;
        this.submissionDate = submissionDate;
        this.carrierName = carrierName;
        this.carrierId = carrierId;
    }

    public Long getCarrierId() {
        return carrierId;
    }

    public void setCarrierId(Long carrierId) {
        this.carrierId = carrierId;
    }

    public Long getProgramId() {
        return programId;
    }

    public void setProgramId(Long programId) {
        this.programId = programId;
    }

    public String getDisqualificationReason() {
        return disqualificationReason;
    }

    public void setDisqualificationReason(String disqualificationReason) {
        this.disqualificationReason = disqualificationReason;
    }

    public boolean isRfpSubmittedSuccessfully() {
        return rfpSubmittedSuccessfully;
    }

    public void setRfpSubmittedSuccessfully(boolean rfpSubmittedSuccessfully) {
        this.rfpSubmittedSuccessfully = rfpSubmittedSuccessfully;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Date getSubmissionDate() {
        return submissionDate;
    }

    public void setSubmissionDate(Date submissionDate) {
        this.submissionDate = submissionDate;
    }

    public String getProduct() {
        return product;
    }

    public void setProduct(String product) {
        this.product = product;
    }

    public String getCarrierName() {
        return carrierName;
    }

    public void setCarrierName(String carrierName) {
        this.carrierName = carrierName;
    }
}
