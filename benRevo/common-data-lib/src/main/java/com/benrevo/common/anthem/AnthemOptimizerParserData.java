package com.benrevo.common.anthem;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class AnthemOptimizerParserData {

    private String clientName;
    private String sicCode;
    private Long eligibleEmployees;
    private Long participatingEmployees;
    private Date effectiveDate;
    private Date dueDate;
    
    private String brokerName;
    private String brokerEmail;
    private String salesPerson;
    private String preSalesPerson;
    private String AgentName;
    private String AgentEmail;
    private String dentalCarrier;
    private int medicalTierRates;
    private int dentalTierRates;
    private int visionTierRates;
    private String medicalCommission;
    private String dentalCommission;
    private String visionCommission;
    private String medicalContributionType;
    private String dentalContributionType;
    private String visionContributionType;
    private boolean hasMedical;
    private boolean hasDental;
    private boolean hasVision;
    private boolean foundVision;
    private Float dentalEeContribution;
    private Float dentalDepContribution;
    private Float visionEeContribution;
    private Float visionDepContribution;
    private List<AnthemOptimizerPlanDetails> medicalPlans = new ArrayList<>();
    private List<AnthemOptimizerPlanDetails> dentalPlans = new ArrayList<>();
    private List<AnthemOptimizerPlanDetails> visionPlans = new ArrayList<>();
    private List<String> errors;
    private boolean parseMedical;
    private boolean parseDental;
    private boolean parseVision;
    private boolean parseAll;
    
    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public String getSicCode() {
        return sicCode;
    }

    public void setSicCode(String sicCode) {
        this.sicCode = sicCode;
    }

    public Long getEligibleEmployees() {
        return eligibleEmployees;
    }

    public void setEligibleEmployees(Long eligibleEmployees) {
        this.eligibleEmployees = eligibleEmployees;
    }

    public Long getParticipatingEmployees() {
        return participatingEmployees;
    }

    public void setParticipatingEmployees(Long participatingEmployees) {
        this.participatingEmployees = participatingEmployees;
    }

    public Date getEffectiveDate() {
        return effectiveDate;
    }

    public void setEffectiveDate(Date effectiveDate) {
        this.effectiveDate = effectiveDate;
    }

    public Date getDueDate() {
        return dueDate;
    }

    public void setDueDate(Date dueDate) {
        this.dueDate = dueDate;
    }

    public String getBrokerEmail() {
        return brokerEmail;
    }

    public void setBrokerEmail(String brokerEmail) {
        this.brokerEmail = brokerEmail;
    }

    public String getSalesPerson() {
        return salesPerson;
    }

    public void setSalesPerson(String salesPerson) {
        this.salesPerson = salesPerson;
    }

    public String getPreSalesPerson() {
        return preSalesPerson;
    }

    public void setPreSalesPerson(String preSalesPerson) {
        this.preSalesPerson = preSalesPerson;
    }

    public String getAgentName() {
        return AgentName;
    }

    public void setAgentName(String agentName) {
        AgentName = agentName;
    }

    public String getAgentEmail() {
        return AgentEmail;
    }

    public void setAgentEmail(String agentEmail) {
        AgentEmail = agentEmail;
    }

    public String getBrokerName() {
        return brokerName;
    }

    public void setBrokerName(String brokerName) {
        this.brokerName = brokerName;
    }

    public String getDentalCarrier() {
        return dentalCarrier;
    }

    public void setDentalCarrier(String dentalCarrier) {
        this.dentalCarrier = dentalCarrier;
    }

    public int getMedicalTierRates() {
        return medicalTierRates;
    }

    public void setMedicalTierRates(int medicalTierRates) {
        this.medicalTierRates = medicalTierRates;
    }

    public Float getDentalEeContribution() {
        return dentalEeContribution;
    }

    public void setDentalEeContribution(Float dentalEeContribution) {
        this.dentalEeContribution = dentalEeContribution;
    }

    public Float getDentalDepContribution() {
        return dentalDepContribution;
    }

    public void setDentalDepContribution(Float dentalDepContribution) {
        this.dentalDepContribution = dentalDepContribution;
    }

    public Float getVisionEeContribution() {
        return visionEeContribution;
    }

    public void setVisionEeContribution(Float visionEeContribution) {
        this.visionEeContribution = visionEeContribution;
    }

    public Float getVisionDepContribution() {
        return visionDepContribution;
    }

    public void setVisionDepContribution(Float visionDepContribution) {
        this.visionDepContribution = visionDepContribution;
    }

    public boolean isFoundVision() {
        return foundVision;
    }

    public void setFoundVision(boolean foundVision) {
        this.foundVision = foundVision;
    }
    public int getDentalTierRates() {
        return dentalTierRates;
    }

    public void setDentalTierRates(int dentalTierRates) {
        this.dentalTierRates = dentalTierRates;
    }

    public int getVisionTierRates() {
        return visionTierRates;
    }

    public void setVisionTierRates(int visionTierRates) {
        this.visionTierRates = visionTierRates;
    }

    public String getMedicalCommission() {
        return medicalCommission;
    }

    public void setMedicalCommission(String medicalCommission) {
        this.medicalCommission = medicalCommission;
    }

    public String getDentalCommission() {
        return dentalCommission;
    }

    public void setDentalCommission(String dentalCommission) {
        this.dentalCommission = dentalCommission;
    }

    public String getVisionCommission() {
        return visionCommission;
    }

    public void setVisionCommission(String visionCommission) {
        this.visionCommission = visionCommission;
    }

    public boolean isHasDental() {
        return hasDental;
    }

    public void setHasDental(boolean hasDental) {
        this.hasDental = hasDental;
    }

    public boolean isHasVision() {
        return hasVision;
    }

    public void setHasVision(boolean hasVision) {
        this.hasVision = hasVision;
    }

    public List<String> getErrors() {
        return errors;
    }

    public void setErrors(List<String> errors) {
        this.errors = errors;
    }

    public boolean isParseMedical() {
        return parseMedical;
    }

    public void setParseMedical(boolean parseMedical) {
        this.parseMedical = parseMedical;
    }

    public boolean isParseDental() {
        return parseDental;
    }

    public void setParseDental(boolean parseDental) {
        this.parseDental = parseDental;
    }

    public boolean isParseVision() {
        return parseVision;
    }

    public void setParseVision(boolean parseVision) {
        this.parseVision = parseVision;
    }

    public boolean isParseAll() {
        return parseAll;
    }

    public void setParseAll(boolean parseAll) {
        this.parseAll = parseAll;
    }

    public String getMedicalContributionType() {
        return medicalContributionType;
    }

    public void setMedicalContributionType(String medicalContributionType) {
        this.medicalContributionType = medicalContributionType;
    }

    public String getDentalContributionType() {
        return dentalContributionType;
    }

    public void setDentalContributionType(String dentalContributionType) {
        this.dentalContributionType = dentalContributionType;
    }

    public String getVisionContributionType() {
        return visionContributionType;
    }

    public void setVisionContributionType(String visionContributionType) {
        this.visionContributionType = visionContributionType;
    }

    public boolean isHasMedical() {
        return hasMedical;
    }

    public void setHasMedical(boolean hasMedical) {
        this.hasMedical = hasMedical;
    }

    public List<AnthemOptimizerPlanDetails> getMedicalPlans() {
        return medicalPlans;
    }

    public void setMedicalPlans(List<AnthemOptimizerPlanDetails> medicalPlans) {
        this.medicalPlans = medicalPlans;
    }

    public List<AnthemOptimizerPlanDetails> getDentalPlans() {
        return dentalPlans;
    }

    public void setDentalPlans(List<AnthemOptimizerPlanDetails> dentalPlans) {
        this.dentalPlans = dentalPlans;
    }

    public List<AnthemOptimizerPlanDetails> getVisionPlans() {
        return visionPlans;
    }

    public void setVisionPlans(List<AnthemOptimizerPlanDetails> visionPlans) {
        this.visionPlans = visionPlans;
    }
}
