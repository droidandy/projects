package com.benrevo.common.dto;

import com.benrevo.common.enums.ClientFileType;

public class CensusInfoDto {
    private ClientFileType type;
    private String email;
    private String subject;
    private String sampleUrl;
    private Integer censusLevel;

    public ClientFileType getType() {
        return type;
    }

    public void setType(ClientFileType type) {
        this.type = type;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getSampleUrl() {
        return sampleUrl;
    }

    public void setSampleUrl(String sampleUrl) {
        this.sampleUrl = sampleUrl;
    }

	public Integer getCensusLevel() {
		return censusLevel;
	}

	public void setCensusLevel(Integer censusLevel) {
		this.censusLevel = censusLevel;
	}
}