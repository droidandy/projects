package com.benrevo.common.dto;

public class SignupDto {

    private String firstName;
    private String lastName;
    private String brokerageFirmName;
    private String brokerageFirmZipCode;
    private String email;

    public SignupDto() {
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getBrokerageFirmName() {
        return brokerageFirmName;
    }

    public void setBrokerageFirmName(String brokerageFirmName) {
        this.brokerageFirmName = brokerageFirmName;
    }

    public String getBrokerageFirmZipCode() {
        return brokerageFirmZipCode;
    }

    public void setBrokerageFirmZipCode(String brokerageFirmZipCode) {
        this.brokerageFirmZipCode = brokerageFirmZipCode;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
