package com.benrevo.data.persistence.entities.ancillary;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "basic_rate")
public class BasicRate extends AncillaryRate {

    @Column(name = "current_life")
    private float currentLife = 0f;

    @Column(name = "renewal_life")
    private float renewalLife = 0f;

    @Column(name = "current_add")
    private float currentADD = 0f;

    @Column(name = "renewal_add")
    private float renewalADD = 0f;

    @Column(name = "current_sl")
    private float currentSL = 0f;

    @Column(name = "renewal_sl")
    private float renewalSL = 0f;

    public BasicRate() {
    }

    @Override
    public int hashCode() {
        return new org.apache.commons.lang3.builder.HashCodeBuilder(1, 31)
                .append(getAncillaryRateId())
                .append(getVolume())
                .append(getRateGuarantee())
                .append(currentLife)
                .append(renewalLife)
                .append(currentADD)
                .append(renewalADD)
                .append(currentSL)
                .append(renewalSL)
                .toHashCode();
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
    
    @Override
    public AncillaryRate newInstance() {
        return new BasicRate();
    }
}
