package com.benrevo.data.persistence.entities.ancillary;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "life_class")
public class LifeClass extends AncillaryClass {

    @Column(name = "waiver_of_premium")
    private String waiverOfPremium;

    @Column(name = "death_benefit")
    private String deathBenefit;

    @Column(name = "conversion")
    private String conversion;

    @Column(name = "portability")
    private String portability;

    @Column(name = "percentage")
    private String percentage;

    @Column(name = "employee_benefit_amount")
    private String employeeBenefitAmount;

    @Column(name = "employee_max_benefit")
    private String employeeMaxBenefit;

    @Column(name = "employee_guarantee_issue")
    private String employeeGuaranteeIssue;

    @Column(name = "age65_reduction")
    private String age65reduction;

    @Column(name = "age70_reduction")
    private String age70reduction;

    @Column(name = "age75_reduction")
    private String age75reduction;

    @Column(name = "age80_reduction")
    private String age80reduction;

    @Column(name = "spouse_benefit_amount")
    private String spouseBenefitAmount;

    @Column(name = "spouse_max_benefit")
    private String spouseMaxBenefit;

    @Column(name = "spouse_guarantee_issue")
    private String spouseGuaranteeIssue;

    @Column(name = "child_benefit_amount")
    private String childBenefitAmount;

    @Column(name = "child_max_benefit")
    private String childMaxBenefit;

    @Column(name = "child_guarantee_issue")
    private String childGuaranteeIssue;

    @Override
    public int hashCode() {
        return new org.apache.commons.lang3.builder.HashCodeBuilder(1, 31)
                .append(getAncillaryClassId())
                .append(getConversion())
                .append(getDeathBenefit())
                .append(getName())
                .append(getPercentage())
                .append(getPortability())
                .append(getWaiverOfPremium())
                .append(getEmployeeBenefitAmount())
                .append(getEmployeeMaxBenefit())
                .append(getEmployeeGuaranteeIssue())
                .append(getAge65reduction())
                .append(getAge70reduction())
                .append(getAge80reduction())
                .append(getSpouseBenefitAmount())
                .append(getSpouseMaxBenefit())
                .append(getSpouseGuaranteeIssue())
                .append(getChildBenefitAmount())
                .append(getChildMaxBenefit())
                .append(getChildGuaranteeIssue())
                .toHashCode();
    }

    public String getWaiverOfPremium() {
        return waiverOfPremium;
    }

    public void setWaiverOfPremium(String waiverOfPremium) {
        this.waiverOfPremium = waiverOfPremium;
    }

    public String getDeathBenefit() {
        return deathBenefit;
    }

    public void setDeathBenefit(String deathBenefit) {
        this.deathBenefit = deathBenefit;
    }

    public String getConversion() {
        return conversion;
    }

    public void setConversion(String conversion) {
        this.conversion = conversion;
    }

    public String getPortability() {
        return portability;
    }

    public void setPortability(String portability) {
        this.portability = portability;
    }

    public String getPercentage() {
        return percentage;
    }

    public void setPercentage(String percentage) {
        this.percentage = percentage;
    }

    public String getEmployeeBenefitAmount() {
        return employeeBenefitAmount;
    }

    public void setEmployeeBenefitAmount(String employeeBenefitAmount) {
        this.employeeBenefitAmount = employeeBenefitAmount;
    }

    public String getEmployeeMaxBenefit() {
        return employeeMaxBenefit;
    }

    public void setEmployeeMaxBenefit(String employeeMaxBenefit) {
        this.employeeMaxBenefit = employeeMaxBenefit;
    }

    public String getEmployeeGuaranteeIssue() {
        return employeeGuaranteeIssue;
    }

    public void setEmployeeGuaranteeIssue(String employeeGuaranteeIssue) {
        this.employeeGuaranteeIssue = employeeGuaranteeIssue;
    }

    public String getAge65reduction() {
        return age65reduction;
    }

    public void setAge65reduction(String age65reduction) {
        this.age65reduction = age65reduction;
    }

    public String getAge70reduction() {
        return age70reduction;
    }

    public void setAge70reduction(String age70reduction) {
        this.age70reduction = age70reduction;
    }

    public String getAge75reduction() {
        return age75reduction;
    }

    public void setAge75reduction(String age75reduction) {
        this.age75reduction = age75reduction;
    }

    public String getAge80reduction() {
        return age80reduction;
    }

    public void setAge80reduction(String age80reduction) {
        this.age80reduction = age80reduction;
    }

    public String getSpouseBenefitAmount() {
        return spouseBenefitAmount;
    }

    public void setSpouseBenefitAmount(String spouseBenefitAmount) {
        this.spouseBenefitAmount = spouseBenefitAmount;
    }

    public String getSpouseMaxBenefit() {
        return spouseMaxBenefit;
    }

    public void setSpouseMaxBenefit(String spouseMaxBenefit) {
        this.spouseMaxBenefit = spouseMaxBenefit;
    }

    public String getSpouseGuaranteeIssue() {
        return spouseGuaranteeIssue;
    }

    public void setSpouseGuaranteeIssue(String spouseGuaranteeIssue) {
        this.spouseGuaranteeIssue = spouseGuaranteeIssue;
    }

    public String getChildBenefitAmount() {
        return childBenefitAmount;
    }

    public void setChildBenefitAmount(String childBenefitAmount) {
        this.childBenefitAmount = childBenefitAmount;
    }

    public String getChildMaxBenefit() {
        return childMaxBenefit;
    }

    public void setChildMaxBenefit(String childMaxBenefit) {
        this.childMaxBenefit = childMaxBenefit;
    }

    public String getChildGuaranteeIssue() {
        return childGuaranteeIssue;
    }

    public void setChildGuaranteeIssue(String childGuaranteeIssue) {
        this.childGuaranteeIssue = childGuaranteeIssue;
    }

    @Override
    public AncillaryClass newInstance() {
        return new LifeClass();
    }
}
