package com.benrevo.common.params;

public class CreateAccountParams {

    //used for User creation
    private String name;
    private String email;
    private String password;
    private String role;
    private boolean admin;
    private String phone;
    private String status;
    private String token;

    //used for Broker creation
    private String companyName;
    private String address;
    private String city;
    private String state;
    private String zip;


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
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

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public boolean isAdmin() {
        return admin;
    }

    public void setAdmin(boolean admin) {
        this.admin = admin;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public boolean validateUserData() {
        boolean valid = true;

        // TODO: Improve this without the try catch block
        try {
            this.getName().isEmpty();
            this.getEmail().isEmpty();
            this.getPassword().isEmpty();
            this.getToken().isEmpty();
            this.getZip().isEmpty();
        } catch (Exception e) {
            valid = false;
        }

        return valid;
    }

    public boolean validateBrokerData() {
        boolean valid = true;

        // TODO: Improve this without the try catch block
        try {
            this.getCompanyName().isEmpty();
            this.getAddress().isEmpty();
            this.getCity().isEmpty();
            this.getState().isEmpty();
            this.getZip().isEmpty();
        } catch (Exception e) {
            valid = false;
        }

        return valid;
    }
}
