package com.benrevo.common.dto;

import java.util.ArrayList;
import java.util.List;

public class AnthemCVPlanBriefDto {

    private List<QuoteNetworkDto> medical = new ArrayList<>();
    private List<QuoteNetworkDto> dental = new ArrayList<>();
    private List<QuoteNetworkDto> vision = new ArrayList<>();

    public List<QuoteNetworkDto> getMedical() {
        return medical;
    }

    public void setMedical(List<QuoteNetworkDto> medical) {
        this.medical = medical;
    }

    public List<QuoteNetworkDto> getDental() {
        return dental;
    }

    public void setDental(List<QuoteNetworkDto> dental) {
        this.dental = dental;
    }

    public List<QuoteNetworkDto> getVision() {
        return vision;
    }

    public void setVision(List<QuoteNetworkDto> vision) {
        this.vision = vision;
    }
}
