package com.benrevo.common.params;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import com.fasterxml.jackson.annotation.JsonProperty;

import static com.benrevo.common.Constants.MDY_SLASH_DATE_FORMAT;

public class ClientParams {

    private int id;
    @JsonProperty("broker_id")
    private int brokerId;
    @JsonProperty("group_name")
    private String clientName;
    @JsonProperty("employee_count")
    private int employeeCount;
    @JsonProperty("participating_employees")
    private int participatingEmployees;
    @JsonProperty("sic_code")
    private String sicCode;
    private String address;
    @JsonProperty("complementary_address")
    private String complementaryAddress;
    private String city;
    private String state;
    private String zip;
    private String image;
    private String website;
    @JsonProperty("minimum_hours")
    private Integer minimumHours;
    @JsonProperty("effective_date")
    private String effectiveDate = "08/20/2016";
    @JsonProperty("domestic_partner")
    private String domesticPartner;
    @JsonProperty("due_date")
    private String dueDate = "08/01/2016";

    @JsonProperty("policy_number")
    private String policyNumber;
    @JsonProperty("date_questionnaire_completed")
    private String dateQuestionnaireCompleted;
    @JsonProperty("contact_name")
    private String contactName;
    @JsonProperty("contact_title")
    private String contactTitle;
    @JsonProperty("contact_address")
    private String contactAddress;
    @JsonProperty("contact_city")
    private String contactCity;
    @JsonProperty("contact_state")
    private String contactState;
    @JsonProperty("contact_zip")
    private String contactZip;
    @JsonProperty("contact_phone")
    private String contactPhone;
    @JsonProperty("contact_fax")
    private String contactFax;
    @JsonProperty("contact_email")
    private String contactEmail;
    @JsonProperty("business_type")
    private String businessType;
    @JsonProperty("org_type")
    private String orgType;
    @JsonProperty("fed_tax_id")
    private String fedTaxId;
    @JsonProperty("situs_state")
    private String situsState;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getBrokerId() {
        return brokerId;
    }

    public void setBrokerId(int brokerId) {
        this.brokerId = brokerId;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public int getEmployeeCount() {
        return employeeCount;
    }

    public void setEmployeeCount(int employeeCount) {
        this.employeeCount = employeeCount;
    }

    public String getSicCode() {
        return sicCode;
    }

    public void setSicCode(String sicCode) {
        this.sicCode = sicCode;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getComplementaryAddress() {
        return complementaryAddress;
    }

    public void setComplementaryAddress(String complementaryAddress) {
        this.complementaryAddress = complementaryAddress;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getZip() {
        return zip;
    }

    public void setZip(String zip) {
        this.zip = zip;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public Date getEffectiveDate() {
        DateFormat dateFormat = new SimpleDateFormat(MDY_SLASH_DATE_FORMAT);
        Date date = null;
        try {
            date = dateFormat.parse(effectiveDate);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return date;
    }

    public void setEffectiveDate(String effectiveDate) {
        this.effectiveDate = effectiveDate;
    }

    public Date getDueDate() {
        DateFormat dateFormat = new SimpleDateFormat("MM/dd/yyyy");
        Date date = null;
        try {
            date = dateFormat.parse(dueDate);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return date;
    }

    public void setDueDate(String dueDate) {
        this.dueDate = dueDate;
    }

    public Integer getMinimumHours() {
        return minimumHours != null ? minimumHours : 0;
    }

    public void setMinimumHours(Integer minimumHours) {
        this.minimumHours = minimumHours;
    }

    public int getParticipatingEmployees() {
        return participatingEmployees;
    }

    public void setParticipatingEmployees(int participatingEmployees) {
        this.participatingEmployees = participatingEmployees;
    }

    public String getDomesticPartner() {
        return domesticPartner;
    }

    public void setDomesticPartner(String domesticPartner) {
        this.domesticPartner = domesticPartner;
    }

    public String getPolicyNumber() {
        return policyNumber;
    }

    public void setPolicyNumber(String policyNumber) {
        this.policyNumber = policyNumber;
    }

    public String getDateQuestionnaireCompleted() {
        return dateQuestionnaireCompleted;
    }

    public void setDateQuestionnaireCompleted(String dateQuestionnaireCompleted) {
        this.dateQuestionnaireCompleted = dateQuestionnaireCompleted;
    }

    public String getContactName() {
        return contactName;
    }

    public void setContactName(String contactName) {
        this.contactName = contactName;
    }

    public String getContactTitle() {
        return contactTitle;
    }

    public void setContactTitle(String contactTitle) {
        this.contactTitle = contactTitle;
    }

    public String getContactAddress() {
        return contactAddress;
    }

    public void setContactAddress(String contactAddress) {
        this.contactAddress = contactAddress;
    }

    public String getContactCity() {
        return contactCity;
    }

    public void setContactCity(String contactCity) {
        this.contactCity = contactCity;
    }

    public String getContactState() {
        return contactState;
    }

    public void setContactState(String contactState) {
        this.contactState = contactState;
    }

    public String getContactZip() {
        return contactZip;
    }

    public void setContactZip(String contactZip) {
        this.contactZip = contactZip;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }

    public String getContactFax() {
        return contactFax;
    }

    public void setContactFax(String contactFax) {
        this.contactFax = contactFax;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public String getBusinessType() {
        return businessType;
    }

    public void setBusinessType(String businessType) {
        this.businessType = businessType;
    }

    public String getOrgType() {
        return orgType;
    }

    public void setOrgType(String orgType) {
        this.orgType = orgType;
    }

    public String getFedTaxId() {
        return fedTaxId;
    }

    public void setFedTaxId(String fedTaxId) {
        this.fedTaxId = fedTaxId;
    }

    public String getSitusState() {
        return situsState;
    }

    public void setSitusState(String situsState) {
        this.situsState = situsState;
    }

}
