package com.benrevo.common.dto;

import java.util.ArrayList;
import java.util.List;

public class AnthemCVCalculatedPlanDetails {

    private List<AnthemCVPlan> medical = new ArrayList<>();
    private List<AnthemCVPlan> dental = new ArrayList<>();
    private List<AnthemCVPlan> vision = new ArrayList<>();

    public List<AnthemCVPlan> getMedical() {
        return medical;
    }

    public void setMedical(List<AnthemCVPlan> medical) {
        this.medical = medical;
    }

    public List<AnthemCVPlan> getDental() {
        return dental;
    }

    public void setDental(List<AnthemCVPlan> dental) {
        this.dental = dental;
    }

    public List<AnthemCVPlan> getVision() {
        return vision;
    }

    public void setVision(List<AnthemCVPlan> vision) {
        this.vision = vision;
    }


}
