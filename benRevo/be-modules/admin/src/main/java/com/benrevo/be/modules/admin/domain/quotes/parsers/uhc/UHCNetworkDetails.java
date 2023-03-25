package com.benrevo.be.modules.admin.domain.quotes.parsers.uhc;


import java.util.ArrayList;
import java.util.List;
import com.benrevo.be.modules.admin.domain.plans.GenericPlanDetails;
import com.benrevo.common.enums.QuotePlanAttributeName;
import com.benrevo.data.persistence.entities.QuotePlanAttribute;

public class UHCNetworkDetails {
    private String networkName;
    // Plan Section
    private String fullPlanName;
    private String shortPlanName;
    private String currentPlanName;
    private String currentRxPlanName;
    private String product;
    private String option;
    private String planOffering;
    private String multipleOptionWith;

    private String commission;
    
    private String networkType;

    private String tierInfo;
    // first plan in each UHC Medical Network should have this property set to true
    private boolean isMatch;

    // renewal
    private boolean isRenewalRateAvailable;

    // Benefits Section
    private String officeCopay;
    private String hospitalCopay;
    private String majorDiagnosisCopay;
    private String otherBenefits;
    private String benefitsDeductible;
    private String benefitsCoInsurance;
    private String benefitsOutOfPocket;
    private String pharmacy;
    private String benefitOutOfNetworkDeductible;
    private String benefitOutOfNetworkCoInsurance;
    private String benefitOutOfNetworkOutOfPocket;

    //Enrollment or Census Section
    private String tier1Census; // employee
    private String tier2Census; // Employee + Spouse
    private String tier3Census; // Employee + Child(ren)
    private String tier4Census; // Employee + Family
    private String censusTotal = "0";

    // Rates
    private String tier1Rate;
    private String tier2Rate;
    private String tier3Rate;
    private String tier4Rate;

    private String tier1CurrentRate; // incumbent rates
    private String tier2CurrentRate;
    private String tier3CurrentRate;
    private String tier4CurrentRate;

    private String monthlyCost;
    private String annualCost;

    private String legalEntityName;
    private String planOptionContribution;
    private String planOptionProductType;
    private String planOptionNetworkType;
    private String planOptionExamCopayInNetwork;
    private String planOptionExamCopayOutNetwork;
    private String planOptionMaterialCopayInNetwork;
    private String planOptionMaterialCopayOutNetwork;

    private String serviceFrequenceyExams; //includes Exams/ Lenses/ Frames/Contacts

    private String eyeExamInNetwork;
    private String eyeExamOutNetwork;

    private String lensesSingleVisionInNetwork;
    private String lensesSingleVisionOutNetwork;

    private String lensesLinedBifocalInNetwork;
    private String lensesLinedBifocalOutNetwork;

    private String lensesLinedTrifocalInNetwork;
    private String lensesLinedTrifocalOutNetwork;

    private String lensesLenticularInNetwork;
    private String lensesLenticularOutNetwork;

    private String framesRetailFrameAllowanceInNetwork;
    private String framesRetailFrameAllowanceOutNetwork;

    private String framesDiscountInNetwork;
    private String framesDiscountOutNetwork;
    
    private boolean voluntary = false;

    private ArrayList<UHCNetworkDetails> alternatives = new ArrayList<UHCNetworkDetails>();
    
    // For use in generic way when needing to create a plan on the fly when reading a quote.
    // Currently only used for UHC Dental quotes
    private GenericPlanDetails genericPlanDetails = new GenericPlanDetails();

    private boolean isLinkedWithAlternativePlanAlready = false;
    private boolean processed = false;

    private List<QuotePlanAttribute> attributes = new ArrayList<>();
    
    public boolean isLinkedWithAlternativePlanAlready() {
        return isLinkedWithAlternativePlanAlready;
    }

    public void setLinkedWithAlternativePlanAlready(boolean linkedWithAlternativePlanAlready) {
        isLinkedWithAlternativePlanAlready = linkedWithAlternativePlanAlready;
    }

    public String getNetworkName() {
        return networkName;
    }

    public void setNetworkName(String networkName) {
        this.networkName = networkName;
    }

    public String getFullPlanName() {
        return fullPlanName;
    }

    public void setFullPlanName(String fullPlanName) {
        this.fullPlanName = fullPlanName;
    }

    public String getShortPlanName() {
        return shortPlanName;
    }

    public void setShortPlanName(String shortPlanName) {
        this.shortPlanName = shortPlanName;
    }

    public String getCurrentPlanName() {
        return currentPlanName;
    }

    public void setCurrentPlanName(String currentPlanName) {
        this.currentPlanName = currentPlanName;
    }

    public String getProduct() {
        return product;
    }

    public void setProduct(String product) {
        this.product = product;
    }

    public String getOption() {
        return option;
    }

    public void setOption(String option) {
        this.option = option;
    }

    public String getPlanOffering() {
        return planOffering;
    }

    public void setPlanOffering(String planOffering) {
        this.planOffering = planOffering;
    }

    public String getMultipleOptionWith() {
        return multipleOptionWith;
    }

    public void setMultipleOptionWith(String multipleOptionWith) {
        this.multipleOptionWith = multipleOptionWith;
    }

    public String getNetworkType() {
        return networkType;
    }

    public void setNetworkType(String networkType) {
        this.networkType = networkType;
    }

    public String getOfficeCopay() {
        return officeCopay;
    }

    public void setOfficeCopay(String officeCopay) {
        this.officeCopay = officeCopay;
    }

    public String getHospitalCopay() {
        return hospitalCopay;
    }

    public void setHospitalCopay(String hospitalCopay) {
        this.hospitalCopay = hospitalCopay;
    }

    public String getMajorDiagnosisCopay() {
        return majorDiagnosisCopay;
    }

    public void setMajorDiagnosisCopay(String majorDiagnosisCopay) {
        this.majorDiagnosisCopay = majorDiagnosisCopay;
    }

    public String getOtherBenefits() {
        return otherBenefits;
    }

    public void setOtherBenefits(String otherBenefits) {
        this.otherBenefits = otherBenefits;
    }

    public String getBenefitsDeductible() {
        return benefitsDeductible;
    }

    public void setBenefitsDeductible(String benefitsDeductible) {
        this.benefitsDeductible = benefitsDeductible;
    }

    public String getBenefitsCoInsurance() {
        return benefitsCoInsurance;
    }

    public void setBenefitsCoInsurance(String benefitsCoInsurance) {
        this.benefitsCoInsurance = benefitsCoInsurance;
    }

    public String getBenefitsOutOfPocket() {
        return benefitsOutOfPocket;
    }

    public void setBenefitsOutOfPocket(String benefitsOutOfPocket) {
        this.benefitsOutOfPocket = benefitsOutOfPocket;
    }

    public String getPharmacy() {
        return pharmacy;
    }

    public void setPharmacy(String pharmacy) {
        this.pharmacy = pharmacy;
    }

    public String getBenefitOutOfNetworkDeductible() {
        return benefitOutOfNetworkDeductible;
    }

    public void setBenefitOutOfNetworkDeductible(String benefitOutOfNetworkDeductible) {
        this.benefitOutOfNetworkDeductible = benefitOutOfNetworkDeductible;
    }

    public String getBenefitOutOfNetworkCoInsurance() {
        return benefitOutOfNetworkCoInsurance;
    }

    public void setBenefitOutOfNetworkCoInsurance(String benefitOutOfNetworkCoInsurance) {
        this.benefitOutOfNetworkCoInsurance = benefitOutOfNetworkCoInsurance;
    }

    public String getBenefitOutOfNetworkOutOfPocket() {
        return benefitOutOfNetworkOutOfPocket;
    }

    public void setBenefitOutOfNetworkOutOfPocket(String benefitOutOfNetworkOutOfPocket) {
        this.benefitOutOfNetworkOutOfPocket = benefitOutOfNetworkOutOfPocket;
    }

    public String getTier1Census() {
        return tier1Census;
    }

    public void setTier1Census(String tier1Census) {
        this.tier1Census = tier1Census;
    }

    public String getTier2Census() {
        return tier2Census;
    }

    public void setTier2Census(String tier2Census) {
        this.tier2Census = tier2Census;
    }

    public String getTier3Census() {
        return tier3Census;
    }

    public void setTier3Census(String tier3Census) {
        this.tier3Census = tier3Census;
    }

    public String getTier4Census() {
        return tier4Census;
    }

    public void setTier4Census(String tier4Census) {
        this.tier4Census = tier4Census;
    }

    public String getCensusTotal() {
        return censusTotal;
    }

    public void setCensusTotal(String censusTotal) {
        this.censusTotal = censusTotal;
    }

    public String getTier1Rate() {
        return tier1Rate;
    }

    public void setTier1Rate(String tier1Rate) {
        this.tier1Rate = tier1Rate;
    }

    public String getTier2Rate() {
        return tier2Rate;
    }

    public void setTier2Rate(String tier2Rate) {
        this.tier2Rate = tier2Rate;
    }

    public String getTier3Rate() {
        return tier3Rate;
    }

    public void setTier3Rate(String tier3Rate) {
        this.tier3Rate = tier3Rate;
    }

    public String getTier4Rate() {
        return tier4Rate;
    }

    public void setTier4Rate(String tier4Rate) {
        this.tier4Rate = tier4Rate;
    }

    public String getMonthlyCost() {
        return monthlyCost;
    }

    public void setMonthlyCost(String monthlyCost) {
        this.monthlyCost = monthlyCost;
    }

    public String getAnnualCost() {
        return annualCost;
    }

    public void setAnnualCost(String annualCost) {
        this.annualCost = annualCost;
    }

    public ArrayList<UHCNetworkDetails> getAlternatives(){return alternatives;}

    public void setAlternatives(ArrayList<UHCNetworkDetails> alternatives){this.alternatives = alternatives;}

    public String getPlanOptionContribution() {
        return planOptionContribution;
    }

    public void setPlanOptionContribution(String planOptionContribution) {
        this.planOptionContribution = planOptionContribution;
    }

    public String getPlanOptionProductType() {
        return planOptionProductType;
    }

    public void setPlanOptionProductType(String planOptionProductType) {
        this.planOptionProductType = planOptionProductType;
    }

    public String getPlanOptionNetworkType() {
        return planOptionNetworkType;
    }

    public void setPlanOptionNetworkType(String planOptionNetworkType) {
        this.planOptionNetworkType = planOptionNetworkType;
    }

    public String getPlanOptionExamCopayInNetwork() {
        return planOptionExamCopayInNetwork;
    }

    public void setPlanOptionExamCopayInNetwork(String planOptionExamCopayInNetwork) {
        this.planOptionExamCopayInNetwork = planOptionExamCopayInNetwork;
    }

    public String getPlanOptionExamCopayOutNetwork() {
        return planOptionExamCopayOutNetwork;
    }

    public void setPlanOptionExamCopayOutNetwork(String planOptionExamCopayOutNetwork) {
        this.planOptionExamCopayOutNetwork = planOptionExamCopayOutNetwork;
    }

    public String getPlanOptionMaterialCopayInNetwork() {
        return planOptionMaterialCopayInNetwork;
    }

    public void setPlanOptionMaterialCopayInNetwork(String planOptionMaterialCopayInNetwork) {
        this.planOptionMaterialCopayInNetwork = planOptionMaterialCopayInNetwork;
    }

    public String getPlanOptionMaterialCopayOutNetwork() {
        return planOptionMaterialCopayOutNetwork;
    }

    public void setPlanOptionMaterialCopayOutNetwork(String planOptionMaterialCopayOutNetwork) {
        this.planOptionMaterialCopayOutNetwork = planOptionMaterialCopayOutNetwork;
    }

    public String getServiceFrequenceyExams() {
        return serviceFrequenceyExams;
    }

    public void setServiceFrequenceyExams(String serviceFrequenceyExams) {
        this.serviceFrequenceyExams = serviceFrequenceyExams;
    }

    public String getEyeExamInNetwork() {
        return eyeExamInNetwork;
    }

    public void setEyeExamInNetwork(String eyeExamInNetwork) {
        this.eyeExamInNetwork = eyeExamInNetwork;
    }

    public String getEyeExamOutNetwork() {
        return eyeExamOutNetwork;
    }

    public void setEyeExamOutNetwork(String eyeExamOutNetwork) {
        this.eyeExamOutNetwork = eyeExamOutNetwork;
    }

    public String getLensesSingleVisionInNetwork() {
        return lensesSingleVisionInNetwork;
    }

    public void setLensesSingleVisionInNetwork(String lensesSingleVisionInNetwork) {
        this.lensesSingleVisionInNetwork = lensesSingleVisionInNetwork;
    }

    public String getLensesSingleVisionOutNetwork() {
        return lensesSingleVisionOutNetwork;
    }

    public void setLensesSingleVisionOutNetwork(String lensesSingleVisionOutNetwork) {
        this.lensesSingleVisionOutNetwork = lensesSingleVisionOutNetwork;
    }

    public String getLensesLinedBifocalInNetwork() {
        return lensesLinedBifocalInNetwork;
    }

    public void setLensesLinedBifocalInNetwork(String lensesLinedBifocalInNetwork) {
        this.lensesLinedBifocalInNetwork = lensesLinedBifocalInNetwork;
    }

    public String getLensesLinedBifocalOutNetwork() {
        return lensesLinedBifocalOutNetwork;
    }

    public void setLensesLinedBifocalOutNetwork(String lensesLinedBifocalOutNetwork) {
        this.lensesLinedBifocalOutNetwork = lensesLinedBifocalOutNetwork;
    }

    public String getLensesLinedTrifocalInNetwork() {
        return lensesLinedTrifocalInNetwork;
    }

    public void setLensesLinedTrifocalInNetwork(String lensesLinedTrifocalInNetwork) {
        this.lensesLinedTrifocalInNetwork = lensesLinedTrifocalInNetwork;
    }

    public String getLensesLinedTrifocalOutNetwork() {
        return lensesLinedTrifocalOutNetwork;
    }

    public void setLensesLinedTrifocalOutNetwork(String lensesLinedTrifocalOutNetwork) {
        this.lensesLinedTrifocalOutNetwork = lensesLinedTrifocalOutNetwork;
    }

    public String getLensesLenticularInNetwork() {
        return lensesLenticularInNetwork;
    }

    public void setLensesLenticularInNetwork(String lensesLenticularInNetwork) {
        this.lensesLenticularInNetwork = lensesLenticularInNetwork;
    }

    public String getLensesLenticularOutNetwork() {
        return lensesLenticularOutNetwork;
    }

    public void setLensesLenticularOutNetwork(String lensesLenticularOutNetwork) {
        this.lensesLenticularOutNetwork = lensesLenticularOutNetwork;
    }

    public String getFramesRetailFrameAllowanceInNetwork() {
        return framesRetailFrameAllowanceInNetwork;
    }

    public void setFramesRetailFrameAllowanceInNetwork(String framesRetailFrameAllowanceInNetwork) {
        this.framesRetailFrameAllowanceInNetwork = framesRetailFrameAllowanceInNetwork;
    }

    public String getFramesRetailFrameAllowanceOutNetwork() {
        return framesRetailFrameAllowanceOutNetwork;
    }

    public void setFramesRetailFrameAllowanceOutNetwork(String framesRetailFrameAllowanceOutNetwork) {
        this.framesRetailFrameAllowanceOutNetwork = framesRetailFrameAllowanceOutNetwork;
    }

    public String getFramesDiscountInNetwork() {
        return framesDiscountInNetwork;
    }

    public void setFramesDiscountInNetwork(String framesDiscountInNetwork) {
        this.framesDiscountInNetwork = framesDiscountInNetwork;
    }

    public String getFramesDiscountOutNetwork() {
        return framesDiscountOutNetwork;
    }

    public void setFramesDiscountOutNetwork(String framesDiscountOutNetwork) {
        this.framesDiscountOutNetwork = framesDiscountOutNetwork;
    }

    public String getLegalEntityName() {
        return legalEntityName;
    }

    public void setLegalEntityName(String legalEntityName) {
        this.legalEntityName = legalEntityName;
    }

    public boolean isMatch() {
        return isMatch;
    }

    public void setMatch(boolean match) {
        isMatch = match;
    }

	public GenericPlanDetails getGenericPlanDetails() {
		return genericPlanDetails;
	}

	public void setGenericPlanDetails(GenericPlanDetails genericPlanDetails) {
		this.genericPlanDetails = genericPlanDetails;
	}

	public List<QuotePlanAttribute> getAttributes() {
		return attributes;
	}

	public void setAttributes(List<QuotePlanAttribute> attributes) {
		this.attributes = attributes;
	}
	
	public boolean isVoluntary() {
        return voluntary;
    }

    public void setVoluntary(boolean voluntary) {
        this.voluntary = voluntary;
    }

    public void addAttribute(QuotePlanAttributeName name, String value) {
		attributes.add(new QuotePlanAttribute(name,value));
	}

    public boolean isProcessed() {
        return processed;
    }

    public void setProcessed(boolean processed) {
        this.processed = processed;
    }

    public boolean isRenewalRateAvailable() {
        return isRenewalRateAvailable;
    }

    public void setRenewalRateAvailable(boolean renewalRateAvailable) {
        isRenewalRateAvailable = renewalRateAvailable;
    }

    public String getTier1CurrentRate() {
        return tier1CurrentRate;
    }

    public void setTier1CurrentRate(String tier1CurrentRate) {
        this.tier1CurrentRate = tier1CurrentRate;
    }

    public String getTier2CurrentRate() {
        return tier2CurrentRate;
    }

    public void setTier2CurrentRate(String tier2CurrentRate) {
        this.tier2CurrentRate = tier2CurrentRate;
    }

    public String getTier3CurrentRate() {
        return tier3CurrentRate;
    }

    public void setTier3CurrentRate(String tier3CurrentRate) {
        this.tier3CurrentRate = tier3CurrentRate;
    }

    public String getTier4CurrentRate() {
        return tier4CurrentRate;
    }

    public void setTier4CurrentRate(String tier4CurrentRate) {
        this.tier4CurrentRate = tier4CurrentRate;
    }

    public String getTierInfo() {
        return tierInfo;
    }

    public void setTierInfo(String tierInfo) {
        this.tierInfo = tierInfo;
    }

    public String getCurrentRxPlanName() {
        return currentRxPlanName;
    }

    public void setCurrentRxPlanName(String currentRxPlanName) {
        this.currentRxPlanName = currentRxPlanName;
    }

    public String getCommission() {
        return commission;
    }

    public void setCommission(String commission) {
        this.commission = commission;
    }
}
