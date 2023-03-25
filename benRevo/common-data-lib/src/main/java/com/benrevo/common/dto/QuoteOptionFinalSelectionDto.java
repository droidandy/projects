package com.benrevo.common.dto;

import java.util.ArrayList;
import java.util.List;

public class QuoteOptionFinalSelectionDto {
	
	private List<QuoteOptionPlanBriefDto> medicalPlans = new ArrayList<>();
	private Double medicalTotal = 0.0;
	private Double medicalWithoutKaiserTotal;
	private Long medicalQuoteOptionId;
	private String medicalQuoteOptionName;
	private List<QuoteOptionPlanBriefDto> dentalPlans = new ArrayList<>();
	private Double dentalTotal = 0.0;
	private Long dentalQuoteOptionId;
	private String dentalQuoteOptionName;
	private List<QuoteOptionPlanBriefDto> visionPlans = new ArrayList<>();
	private Double visionTotal = 0.0;
	private Long visionQuoteOptionId;
	private String visionQuoteOptionName;
	private Double total = 0.0;
	private Double dentalBundleDiscount;
	private Float dentalBundleDiscountPercent;
	private Boolean dentalBundleDiscountApplied;
	private Float dentalRenewalDiscountPenalty;
	private Double visionBundleDiscount;
	private Float visionBundleDiscountPercent;
	private Boolean visionBundleDiscountApplied;
	private Float visionRenewalDiscountPenalty;
	private Double summaryBundleDiscount;
	private String submittedDate;
	private List<ExtProductDto> externalProducts = new ArrayList<>();
	
	public QuoteOptionFinalSelectionDto() {
	}
	
	public List<QuoteOptionPlanBriefDto> getMedicalPlans() {
		return medicalPlans;
	}
	public void setMedicalPlans(List<QuoteOptionPlanBriefDto> medicalPlans) {
		this.medicalPlans = medicalPlans;
	}
	public Double getMedicalTotal() {
		return medicalTotal;
	}
	public void setMedicalTotal(Double medicalTotal) {
		this.medicalTotal = medicalTotal;
	}
	public Double getMedicalWithoutKaiserTotal() {
        return medicalWithoutKaiserTotal;
    }
    public void setMedicalWithoutKaiserTotal(Double medicalWithoutKaiserTotal) {
        this.medicalWithoutKaiserTotal = medicalWithoutKaiserTotal;
    }
    public List<QuoteOptionPlanBriefDto> getDentalPlans() {
		return dentalPlans;
	}
	public void setDentalPlans(List<QuoteOptionPlanBriefDto> dentalPlans) {
		this.dentalPlans = dentalPlans;
	}
	public Double getDentalTotal() {
		return dentalTotal;
	}
	public void setDentalTotal(Double dentalTotal) {
		this.dentalTotal = dentalTotal;
	}
	public List<QuoteOptionPlanBriefDto> getVisionPlans() {
		return visionPlans;
	}
	public void setVisionPlans(List<QuoteOptionPlanBriefDto> visionPlans) {
		this.visionPlans = visionPlans;
	}
	public Double getVisionTotal() {
		return visionTotal;
	}
	public void setVisionTotal(Double visionTotal) {
		this.visionTotal = visionTotal;
	}
	public Double getTotal() {
		return total;
	}
	public void setTotal(Double total) {
		this.total = total;
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
	public String getMedicalQuoteOptionName() {
		return medicalQuoteOptionName;
	}
	public void setMedicalQuoteOptionName(String medicalQuoteOptionName) {
		this.medicalQuoteOptionName = medicalQuoteOptionName;
	}
	public String getDentalQuoteOptionName() {
		return dentalQuoteOptionName;
	}
	public void setDentalQuoteOptionName(String dentalQuoteOptionName) {
		this.dentalQuoteOptionName = dentalQuoteOptionName;
	}
	public String getVisionQuoteOptionName() {
		return visionQuoteOptionName;
	}
	public void setVisionQuoteOptionName(String visionQuoteOptionName) {
		this.visionQuoteOptionName = visionQuoteOptionName;
	}
	public Double getDentalBundleDiscount() {
		return dentalBundleDiscount;
	}
	public void setDentalBundleDiscount(Double dentalBundleDiscount) {
		this.dentalBundleDiscount = dentalBundleDiscount;
	}
	public Double getVisionBundleDiscount() {
		return visionBundleDiscount;
	}
	public void setVisionBundleDiscount(Double visionBundleDiscount) {
		this.visionBundleDiscount = visionBundleDiscount;
	}
	public Double getSummaryBundleDiscount() {
		return summaryBundleDiscount;
	}
	public void setSummaryBundleDiscount(Double summaryBundleDiscount) {
		this.summaryBundleDiscount = summaryBundleDiscount;
	}

	public Float getDentalBundleDiscountPercent() {
		return dentalBundleDiscountPercent;
	}

	public void setDentalBundleDiscountPercent(Float dentalBundleDiscountPercent) {
		this.dentalBundleDiscountPercent = dentalBundleDiscountPercent;
	}

	public Boolean getDentalBundleDiscountApplied() {
		return dentalBundleDiscountApplied;
	}

	public void setDentalBundleDiscountApplied(Boolean dentalBundleDiscountApplied) {
		this.dentalBundleDiscountApplied = dentalBundleDiscountApplied;
	}

	public Float getDentalRenewalDiscountPenalty() {
		return dentalRenewalDiscountPenalty;
	}

	public void setDentalRenewalDiscountPenalty(Float dentalRenewalDiscountPenalty) {
		this.dentalRenewalDiscountPenalty = dentalRenewalDiscountPenalty;
	}

	public Float getVisionBundleDiscountPercent() {
		return visionBundleDiscountPercent;
	}

	public void setVisionBundleDiscountPercent(Float visionBundleDiscountPercent) {
		this.visionBundleDiscountPercent = visionBundleDiscountPercent;
	}

	public Boolean getVisionBundleDiscountApplied() {
		return visionBundleDiscountApplied;
	}

	public void setVisionBundleDiscountApplied(Boolean visionBundleDiscountApplied) {
		this.visionBundleDiscountApplied = visionBundleDiscountApplied;
	}

	public Float getVisionRenewalDiscountPenalty() {
		return visionRenewalDiscountPenalty;
	}

	public void setVisionRenewalDiscountPenalty(Float visionRenewalDiscountPenalty) {
		this.visionRenewalDiscountPenalty = visionRenewalDiscountPenalty;
	}

	public String getSubmittedDate() {
		return submittedDate;
	}

	public void setSubmittedDate(String submittedDate) {
		this.submittedDate = submittedDate;
	}

	public List<ExtProductDto> getExternalProducts() {
		return externalProducts;
	}

	public void setExternalProducts(List<ExtProductDto> externalProducts) {
		this.externalProducts = externalProducts;
	}
}
