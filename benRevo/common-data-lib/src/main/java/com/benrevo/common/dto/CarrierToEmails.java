package com.benrevo.common.dto;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class CarrierToEmails {

    private List<String> emails;
    private Long carrierId;
    private String carrierDisplayName;
    private boolean approved = true; // if carrier saved to config, it most likely approved

    public CarrierToEmails() {}

    public CarrierToEmails(Long carrierId, String... emails) {
        this.emails = Arrays.asList(emails);
        this.carrierId = carrierId;
    }
    
    public CarrierToEmails(Long carrierId) {
        this.emails = new ArrayList<>();
        this.carrierId = carrierId;
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
    
    public String getCarrierDisplayName() {
        return carrierDisplayName;
    }
    
    public void setCarrierDisplayName(String carrierDisplayName) {
        this.carrierDisplayName = carrierDisplayName;
    }

    
    public boolean isApproved() {
        return approved;
    }

    public void setApproved(boolean approved) {
        this.approved = approved;
    }

}
