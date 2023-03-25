package com.benrevo.common.dto;

public class AnthemCVProductQualificationDto {
    private boolean qualifiedForMedical = true;
    private boolean qualifiedForDental = true;
    private boolean qualifiedForVision = true;

    private String disqualificationReason;

    public boolean isQualifiedForMedical() {
        return qualifiedForMedical;
    }

    public void setQualifiedForMedical(boolean qualifiedForMedical) {
        this.qualifiedForMedical = qualifiedForMedical;
    }

    public boolean isQualifiedForDental() {
        return qualifiedForDental;
    }

    public void setQualifiedForDental(boolean qualifiedForDental) {
        this.qualifiedForDental = qualifiedForDental;
    }

    public boolean isQualifiedForVision() {
        return qualifiedForVision;
    }

    public void setQualifiedForVision(boolean qualifiedForVision) {
        this.qualifiedForVision = qualifiedForVision;
    }

    public String getDisqualificationReason() {
        return disqualificationReason;
    }

    public void setDisqualificationReason(String disqualificationReason) {
        this.disqualificationReason = disqualificationReason;
    }

    public boolean isPartiallyQualified(){
        return this.qualifiedForMedical || this.qualifiedForDental || this.qualifiedForVision;
    }

    public boolean isFullyQualified(){
        return this.qualifiedForMedical && this.qualifiedForDental && this.qualifiedForVision;
    }
}
