package com.benrevo.common.dto;

import java.util.List;

public class MedicalGroupDto {
    private Long medicalGroupId;
    private String decNumber;
    private String name;
    private String county;
    private String region;
    private String state;
    private List<NetworkDto> networks;

    public Long getMedicalGroupId() {
        return medicalGroupId;
    }

    public void setMedicalGroupId(Long medicalGroupId) {
        this.medicalGroupId = medicalGroupId;
    }

    public String getDecNumber() {
        return decNumber;
    }

    public void setDecNumber(String decNumber) {
        this.decNumber = decNumber;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCounty() {
        return county;
    }

    public void setCounty(String county) {
        this.county = county;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public List<NetworkDto> getNetworks() {
        return networks;
    }

    public void setNetworks(List<NetworkDto> networks) {
        this.networks = networks;
    }
}