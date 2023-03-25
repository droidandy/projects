package com.benrevo.be.modules.shared.service.pptx;

import com.benrevo.data.persistence.entities.ancillary.AncillaryPlan;


class PrepPlan {
    String name;
    String carrierName;
    float total1 = 0f;
    float total2 = 0f;
    float total3 = 0f;
    float total4 = 0f;
    float rate1 = 0f;
    float rate2 = 0f;
    float rate3 = 0f;
    float rate4 = 0f;
    double total = 0.0;
    float employer1 = 0f;
    float employer2 = 0f;
    float employer3 = 0f;
    float employer4 = 0f;
    float employer = 0f;
    long enrollment1 = 0L;
    long enrollment2 = 0L;
    long enrollment3 = 0L;
    long enrollment4 = 0L;
    long enrollment = 0L;
    Object[] benefits;
    boolean twoColumnFlag;
    public AncillaryPlan ancillary;
}
