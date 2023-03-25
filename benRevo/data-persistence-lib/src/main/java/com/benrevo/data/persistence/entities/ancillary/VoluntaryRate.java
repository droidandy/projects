package com.benrevo.data.persistence.entities.ancillary;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "voluntary_rate")
@Inheritance(strategy = InheritanceType.JOINED)
public class VoluntaryRate extends AncillaryRate {

    @Column(name = "monthly_cost")
    private double monthlyCost = 0.0;

    @Column(name = "employee")
    private Boolean employee;

    @Column(name = "employee_tobacco")
    private Boolean employeeTobacco;

    @Column(name = "spouse")
    private Boolean spouse;

    @Column(name = "spouse_based")
    private String spouseBased;

    @Column(name = "rate_emp_add")
    private float rateEmpADD = 0f;

    @Column(name = "rate_spouse_add")
    private float rateSpouseADD = 0f;

    @Column(name = "rate_child_life")
    private float rateChildLife = 0f;

    @Column(name = "rate_child_add")
    private float rateChildADD = 0f;

    @OrderBy("from ASC")
    @OneToMany(mappedBy = "ancillaryRate",
            fetch = FetchType.LAZY,
            cascade = CascadeType.ALL,
            orphanRemoval = true)
    private List<AncillaryRateAge> ages;

    public VoluntaryRate() {
    }

    @Override
    public AncillaryRate copy() {
        VoluntaryRate copy = (VoluntaryRate) super.copy();
        if (ages != null) {
            copy.setAges(new ArrayList<>());
            for (AncillaryRateAge age : ages) {
                AncillaryRateAge ageCopy = age.copy();
                ageCopy.setAncillaryRate(copy);
                copy.getAges().add(ageCopy);
            }
        }
        return copy;
    }

    @Override
    public AncillaryRate newInstance() {
        return new VoluntaryRate();
    }

    @Override
    public int hashCode() {
        return new org.apache.commons.lang3.builder.HashCodeBuilder(1, 31)
                .append(getAncillaryRateId())
                .append(getVolume())
                .append(monthlyCost)
                .append(getRateGuarantee())
                .append(employee)
                .append(employeeTobacco)
                .append(spouse)
                .append(spouseBased)
                .append(rateEmpADD)
                .append(rateSpouseADD)
                .append(rateChildLife)
                .append(rateChildADD)
                .toHashCode();
    }

    public double getMonthlyCost() {
        return monthlyCost;
    }

    public void setMonthlyCost(double monthlyCost) {
        this.monthlyCost = monthlyCost;
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

    public List<AncillaryRateAge> getAges() {
        return ages;
    }

    public void setAges(List<AncillaryRateAge> ages) {
        this.ages = ages;
    }
}
