package com.benrevo.common.dto;

import java.util.ArrayList;
import java.util.List;

public class CarrierByProductDto {

    List<CarrierDto> medical = new ArrayList<>();
    List<CarrierDto> vision = new ArrayList<>();
    List<CarrierDto> dental = new ArrayList<>();
    List<CarrierDto> life = new ArrayList<>();
    List<CarrierDto> std = new ArrayList<>();
    List<CarrierDto> ltd = new ArrayList<>();

    public List<CarrierDto> getMedical() {
        return medical;
    }

    public void setMedical(List<CarrierDto> medical) {
        this.medical = medical;
    }

    public List<CarrierDto> getVision() {
        return vision;
    }

    public void setVision(List<CarrierDto> vision) {
        this.vision = vision;
    }

    public List<CarrierDto> getDental() {
        return dental;
    }

    public void setDental(List<CarrierDto> dental) {
        this.dental = dental;
    }

    public List<CarrierDto> getLife() {
        return life;
    }

    public void setLife(List<CarrierDto> life) {
        this.life = life;
    }

    public List<CarrierDto> getStd() {
        return std;
    }

    public void setStd(List<CarrierDto> std) {
        this.std = std;
    }

    public List<CarrierDto> getLtd() {
        return ltd;
    }

    public void setLtd(List<CarrierDto> ltd) {
        this.ltd = ltd;
    }
}