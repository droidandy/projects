package com.benrevo.common.dto.ancillary;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;

@XmlAccessorType(XmlAccessType.FIELD)
public class VoluntaryRateDto extends AncillaryRateDto {

    private List<AncillaryRateAgeDto> ages = new ArrayList<>();

    private Boolean employee;
    private Boolean employeeTobacco;
    private Boolean spouse;
    private String spouseBased;
    private float rateEmpADD = 0f;
    private float rateSpouseADD = 0f;
    private float rateChildLife = 0f;
    private float rateChildADD = 0f;

    public VoluntaryRateDto() {
    }

    public List<AncillaryRateAgeDto> getAges() {
        return ages;
    }

    public void setAges(List<AncillaryRateAgeDto> ages) {
        this.ages = ages;
    }

    public Boolean getEmployee() {
        return employee;
    }

    public void setEmployee(Boolean employee) {
        this.employee = employee;
    }

    public Boolean getEmployeeTobacco() {
        return employeeTobacco;
    }

    public void setEmployeeTobacco(Boolean employeeTobacco) {
        this.employeeTobacco = employeeTobacco;
    }

    public Boolean getSpouse() {
        return spouse;
    }

    public void setSpouse(Boolean spouse) {
        this.spouse = spouse;
    }

    public String getSpouseBased() {
        return spouseBased;
    }

    public void setSpouseBased(String spouseBased) {
        this.spouseBased = spouseBased;
    }

    public float getRateEmpADD() {
        return rateEmpADD;
    }

    public void setRateEmpADD(float rateEmpADD) {
        this.rateEmpADD = rateEmpADD;
    }

    public float getRateSpouseADD() {
        return rateSpouseADD;
    }

    public void setRateSpouseADD(float rateSpouseADD) {
        this.rateSpouseADD = rateSpouseADD;
    }

    public float getRateChildLife() {
        return rateChildLife;
    }

    public void setRateChildLife(float rateChildLife) {
        this.rateChildLife = rateChildLife;
    }

    public float getRateChildADD() {
        return rateChildADD;
    }

    public void setRateChildADD(float rateChildADD) {
        this.rateChildADD = rateChildADD;
    }
}
