package com.benrevo.common.dto.ancillary;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;

@XmlAccessorType(XmlAccessType.FIELD)
public class LifeClassDto extends AncillaryClassDto {

    private String waiverOfPremium;
    private String deathBenefit;
    private String conversion;
    private String portability;
    // looks like not used
    private String percentage; 
    private String employeeBenefitAmount;
    private String employeeMaxBenefit;
    private String employeeGuaranteeIssue;
    // age reduction schedule (reduced by %)
    private String age65reduction;
    private String age70reduction;
    private String age75reduction;
    private String age80reduction;

    private String spouseBenefitAmount;
    private String spouseMaxBenefit;
    private String spouseGuaranteeIssue;
    private String childBenefitAmount;
    private String childMaxBenefit;
    private String childGuaranteeIssue;

    public LifeClassDto() {
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
}
