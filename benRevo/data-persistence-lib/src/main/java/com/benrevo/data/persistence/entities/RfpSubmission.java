package com.benrevo.data.persistence.entities;

import javax.persistence.*;
import org.springframework.beans.BeanUtils;
import java.util.ArrayList;
import java.util.Date;

@Entity
@Table(name = "rfp_submission")
public class RfpSubmission {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rfp_submission_id")
    private Long rfpSubmissionId;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @ManyToOne
    @JoinColumn(name = "rfp_carrier_id", nullable = false)
    private RfpCarrier rfpCarrier;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "program_id")
    private Program program;

    @Column(name = "salesforce_id")
    private String salesforceId;

    @Column(name = "request_json")
    @Lob
    private byte[] requestJson;

    @Column(name = "created")
    private String created;

    @Column(name = "updated")
    private String updated;

    @Column(name = "submitted_by")
    private String submittedBy;

    @Column(name = "submitted_date")
    private Date submittedDate;

    @Column(name = "disqualification_reason")
    private String disqualificationReason;

    public Long getRfpSubmissionId() {
        return rfpSubmissionId;
    }

    public void setRfpSubmissionId(Long rfpSubmissionId) {
        this.rfpSubmissionId = rfpSubmissionId;
    }

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public RfpCarrier getRfpCarrier() {
        return rfpCarrier;
    }

    public void setRfpCarrier(RfpCarrier rfpCarrier) {
        this.rfpCarrier = rfpCarrier;
    }

    public Program getProgram() {
        return program;
    }

    public void setProgram(Program program) {
        this.program = program;
    }

    public String getSalesforceId() {
        return salesforceId;
    }

    public void setSalesforceId(String salesforceId) {
        this.salesforceId = salesforceId;
    }

    public byte[] getRequestJson() {
        return requestJson;
    }

    public void setRequestJson(byte[] requestJson) {
        this.requestJson = requestJson;
    }

    public String getCreated() {
        return created;
    }

    public void setCreated(String created) {
        this.created = created;
    }

    public String getUpdated() {
        return updated;
    }

    public void setUpdated(String updated) {
        this.updated = updated;
    }

    public String getSubmittedBy() {
        return submittedBy;
    }

    public void setSubmittedBy(String submittedBy) {
        this.submittedBy = submittedBy;
    }

    public Date getSubmittedDate() {
        return submittedDate;
    }

    public void setSubmittedDate(Date submittedDate) {
        this.submittedDate = submittedDate;
    }

    public String getDisqualificationReason() {
        return disqualificationReason;
    }

    public void setDisqualificationReason(String disqualificationReason) {
        this.disqualificationReason = disqualificationReason;
    }
    
    public RfpSubmission copy() {
      RfpSubmission copy = new RfpSubmission();
      BeanUtils.copyProperties(this, copy, "rfpSubmissionId");
      return copy; 
    }
}