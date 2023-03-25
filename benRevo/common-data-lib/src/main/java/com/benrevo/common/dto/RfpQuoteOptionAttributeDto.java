package com.benrevo.common.dto;

import com.benrevo.common.enums.ClientState;

public class RfpQuoteOptionAttributeDto {

    private Long clientId;
    private ClientState clientState;
    private Long employeeCount;
    private Long optionId;
    private String value;
    
    public RfpQuoteOptionAttributeDto() {}

    public RfpQuoteOptionAttributeDto(Long clientId, ClientState clientState, Long employeeCount, 
            Long optionId, String value) {
        this.clientId = clientId;
        this.clientState = clientState;
        this.employeeCount = employeeCount;
        this.optionId = optionId;
        this.value = value;
    }


    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }

    public ClientState getClientState() {
        return clientState;
    }

    public void setClientState(ClientState clientState) {
        this.clientState = clientState;
    }

    public Long getEmployeeCount() {
        return employeeCount;
    }

    public void setEmployeeCount(Long employeeCount) {
        this.employeeCount = employeeCount;
    }

    public Long getOptionId() {
        return optionId;
    }

    public void setOptionId(Long optionId) {
        this.optionId = optionId;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
    
    
}
