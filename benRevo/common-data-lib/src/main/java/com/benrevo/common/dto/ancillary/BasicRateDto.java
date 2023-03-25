package com.benrevo.common.dto.ancillary;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;

@XmlAccessorType(XmlAccessType.FIELD)
public class BasicRateDto extends AncillaryRateDto {

    private float currentLife = 0f;
    private float renewalLife = 0f;
    private float currentADD = 0f;
    private float renewalADD = 0f;
    private float currentSL = 0f;
    private float renewalSL = 0f;

    public BasicRateDto() {
    }

    public float getCurrentLife() {
        return currentLife;
    }

    public void setCurrentLife(float currentLife) {
        this.currentLife = currentLife;
    }

    public float getRenewalLife() {
        return renewalLife;
    }

    public void setRenewalLife(float renewalLife) {
        this.renewalLife = renewalLife;
    }

    public float getCurrentADD() {
        return currentADD;
    }

    public void setCurrentADD(float currentADD) {
        this.currentADD = currentADD;
    }

    public float getRenewalADD() {
        return renewalADD;
    }

    public void setRenewalADD(float renewalADD) {
        this.renewalADD = renewalADD;
    }

    public float getCurrentSL() {
        return currentSL;
    }

    public void setCurrentSL(float currentSL) {
        this.currentSL = currentSL;
    }

    public float getRenewalSL() {
        return renewalSL;
    }

    public void setRenewalSL(float renewalSL) {
        this.renewalSL = renewalSL;
    }
}
