package com.benrevo.common.dto;

import javax.validation.constraints.NotNull;

public class QuoteOptionSubmissionDto {

	@NotNull
 	private Long clientId;

	private Long medicalQuoteOptionId;
	private Long dentalQuoteOptionId;
	private Long visionQuoteOptionId;
	boolean submissionSuccessful;
	private String errorMessage;

	public QuoteOptionSubmissionDto() {
	}

	public Long getClientId() {
		return clientId;
	}

	public void setClientId(Long clientId) {
		this.clientId = clientId;
	}

	public Long getMedicalQuoteOptionId() {
		return medicalQuoteOptionId;
	}
	public void setMedicalQuoteOptionId(Long medicalQuoteOptionId) {
		this.medicalQuoteOptionId = medicalQuoteOptionId;
	}
	public Long getDentalQuoteOptionId() {
		return dentalQuoteOptionId;
	}
	public void setDentalQuoteOptionId(Long dentalQuoteOptionId) {
		this.dentalQuoteOptionId = dentalQuoteOptionId;
	}
	public Long getVisionQuoteOptionId() {
		return visionQuoteOptionId;
	}
	public void setVisionQuoteOptionId(Long visionQuoteOptionId) {
		this.visionQuoteOptionId = visionQuoteOptionId;
	}

	public boolean isSubmissionSuccessful() {
		return submissionSuccessful;
	}

	public void setSubmissionSuccessful(boolean submissionSuccessful) {
		this.submissionSuccessful = submissionSuccessful;
	}

	public String getErrorMessage() {
		return errorMessage;
	}

	public void setErrorMessage(String errorMessage) {
		this.errorMessage = errorMessage;
	}
}
