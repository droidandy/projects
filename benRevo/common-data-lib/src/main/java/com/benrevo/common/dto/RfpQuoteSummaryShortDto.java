package com.benrevo.common.dto;

import java.util.Date;

public class RfpQuoteSummaryShortDto {
    private String medicalNotes;
    private String medicalWithKaiserNotes;
    private String dentalNotes;
    private String visionNotes;
    private String lifeNotes;
    private Float dentalBundleDiscountPercent;
    private Float visionBundleDiscountPercent;
    private Date fileUpdated;

    public String getMedicalNotes() {
        return medicalNotes;
    }

    public void setMedicalNotes(String medicalNotes) {
        this.medicalNotes = medicalNotes;
    }

    public String getDentalNotes() {
        return dentalNotes;
    }

    public void setDentalNotes(String dentalNotes) {
        this.dentalNotes = dentalNotes;
    }

    public String getVisionNotes() {
        return visionNotes;
    }

    public void setVisionNotes(String visionNotes) {
        this.visionNotes = visionNotes;
    }

    public String getMedicalWithKaiserNotes() {
        return medicalWithKaiserNotes;
    }

    public void setMedicalWithKaiserNotes(String medicalWithKaiserNotes) {
        this.medicalWithKaiserNotes = medicalWithKaiserNotes;
    }

    public String getLifeNotes() {
        return lifeNotes;
    }

    public void setLifeNotes(String lifeNotes) {
        this.lifeNotes = lifeNotes;
    }

    public Float getDentalBundleDiscountPercent() {
        return dentalBundleDiscountPercent;
    }

    public void setDentalBundleDiscountPercent(Float dentalBundleDiscountPercent) {
        this.dentalBundleDiscountPercent = dentalBundleDiscountPercent;
    }

    public Float getVisionBundleDiscountPercent() {
        return visionBundleDiscountPercent;
    }

    public void setVisionBundleDiscountPercent(Float visionBundleDiscountPercent) {
        this.visionBundleDiscountPercent = visionBundleDiscountPercent;
    }

    public Date getFileUpdated() {
        return fileUpdated;
    }

    public void setFileUpdated(Date fileUpdated) {
        this.fileUpdated = fileUpdated;
    }
}
