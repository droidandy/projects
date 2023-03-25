package com.benrevo.common.dto;

import java.util.ArrayList;
import java.util.List;
import com.benrevo.common.enums.QuoteType;

public class ClientRateBankDto {

    private Float wellnessBudget;
    private Float communicationBudget;
    private Float implementationBudget;

    private Float PEPY;
    private Float rateBankAmountRequested;
    private Float totalPremium;
    private Float costVsCurrent;
    private Float costVsCurrentPercentage;
    private Float costVsRenewal;
    private Float costVsRenewalPercentage;
    private Float totalDollarDifference;
    private Float totalRenewalDollarDifference;
    private String carrierName = "";
    private int enrollment = 0;
    private boolean isEligibleForDiscount = false;
    private QuoteType quoteType;

    private List<RateBankPlanDto> plans = new ArrayList<>();

    public static class RateBankPlanDto{
        private String planType;
        private String networkName;
        private Float networkRateBank;
        private boolean rateBankApplied = false;
        private String planName;
        private boolean kaiserNetwork;
        private boolean outOfState;
        private Long rfpQuoteNetworkPlanId;

        private Long enrollment;
        private Float dollarDifference;
        private Float percentDifference;
        private Float renewalDollarDifference;
        private Float renewalPercentDifference;


        public boolean isRateBankApplied() {
            return rateBankApplied;
        }

        public void setRateBankApplied(boolean rateBankApplied) {
            this.rateBankApplied = rateBankApplied;
        }

        public String getPlanType() {
            return planType;
        }

        public void setPlanType(String planType) {
            this.planType = planType;
        }

        public String getNetworkName() {
            return networkName;
        }

        public void setNetworkName(String networkName) {
            this.networkName = networkName;
        }

        public String getPlanName() {
            return planName;
        }

        public void setPlanName(String planName) {
            this.planName = planName;
        }

        public Long getEnrollment() {
            return enrollment;
        }

        public void setEnrollment(Long enrollment) {
            this.enrollment = enrollment;
        }

        public boolean isOutOfState() {
            return outOfState;
        }

        public void setOutOfState(boolean outOfState) {
            this.outOfState = outOfState;
        }

        public boolean isKaiserNetwork() {
            return kaiserNetwork;
        }

        public void setKaiserNetwork(boolean kaiserNetwork) {
            this.kaiserNetwork = kaiserNetwork;
        }

        public Float getDollarDifference() {
            return dollarDifference;
        }

        public void setDollarDifference(Float dollarDifference) {
            this.dollarDifference = dollarDifference;
        }

        public Float getPercentDifference() {
            return percentDifference;
        }

        public void setPercentDifference(Float percentDifference) {
            this.percentDifference = percentDifference;
        }

        public Float getRenewalDollarDifference() {
            return renewalDollarDifference;
        }

        public void setRenewalDollarDifference(Float renewalDollarDifference) {
            this.renewalDollarDifference = renewalDollarDifference;
        }

        public Float getRenewalPercentDifference() {
            return renewalPercentDifference;
        }

        public void setRenewalPercentDifference(Float renewalPercentDifference) {
            this.renewalPercentDifference = renewalPercentDifference;
        }

        public Float getNetworkRateBank() {
            return networkRateBank;
        }

        public void setNetworkRateBank(Float networkRateBank) {
            this.networkRateBank = networkRateBank;
        }

        public Long getRfpQuoteNetworkPlanId() {
            return rfpQuoteNetworkPlanId;
        }

        public void setRfpQuoteNetworkPlanId(Long rfpQuoteNetworkPlanId) {
            this.rfpQuoteNetworkPlanId = rfpQuoteNetworkPlanId;
        }
    }


    public Float getWellnessBudget() {
        return wellnessBudget;
    }

    public void setWellnessBudget(Float wellnessBudget) {
        this.wellnessBudget = wellnessBudget;
    }

    public Float getCommunicationBudget() {
        return communicationBudget;
    }

    public void setCommunicationBudget(Float communicationBudget) {
        this.communicationBudget = communicationBudget;
    }

    public Float getImplementationBudget() {
        return implementationBudget;
    }

    public void setImplementationBudget(Float implementationBudget) {
        this.implementationBudget = implementationBudget;
    }

    public Float getPEPY() {
        return PEPY;
    }

    public void setPEPY(Float PEPY) {
        this.PEPY = PEPY;
    }

    public Float getRateBankAmountRequested() {
        return rateBankAmountRequested;
    }

    public void setRateBankAmountRequested(Float rateBankAmountRequested) {
        this.rateBankAmountRequested = rateBankAmountRequested;
    }

    public Float getCostVsCurrent() {
        return costVsCurrent;
    }

    public void setCostVsCurrent(Float costVsCurrent) {
        this.costVsCurrent = costVsCurrent;
    }

    public Float getCostVsRenewal() {
        return costVsRenewal;
    }

    public void setCostVsRenewal(Float costVsRenewal) {
        this.costVsRenewal = costVsRenewal;
    }

    public List<RateBankPlanDto> getPlans() {
        return plans;
    }

    public void setPlans(List<RateBankPlanDto> plans) {
        this.plans = plans;
    }

    public Float getCostVsCurrentPercentage() {
        return costVsCurrentPercentage;
    }

    public void setCostVsCurrentPercentage(Float costVsCurrentPercentage) {
        this.costVsCurrentPercentage = costVsCurrentPercentage;
    }

    public Float getCostVsRenewalPercentage() {
        return costVsRenewalPercentage;
    }

    public void setCostVsRenewalPercentage(Float costVsRenewalPercentage) {
        this.costVsRenewalPercentage = costVsRenewalPercentage;
    }

    public Float getTotalDollarDifference() {
        return totalDollarDifference;
    }

    public void setTotalDollarDifference(Float totalDollarDifference) {
        this.totalDollarDifference = totalDollarDifference;
    }

    public Float getTotalRenewalDollarDifference() {
        return totalRenewalDollarDifference;
    }

    public void setTotalRenewalDollarDifference(Float totalRenewalDollarDifference) {
        this.totalRenewalDollarDifference = totalRenewalDollarDifference;
    }

    public Float getTotalPremium() {
        return totalPremium;
    }

    public void setTotalPremium(Float totalPremium) {
        this.totalPremium = totalPremium;
    }

    public String getCarrierName() {
        return carrierName;
    }

    public void setCarrierName(String carrierName) {
        this.carrierName = carrierName;
    }

    public int getEnrollment() {
        return enrollment;
    }

    public void setEnrollment(int enrollment) {
        this.enrollment = enrollment;
    }

    public boolean isEligibleForDiscount() {
        return isEligibleForDiscount;
    }

    public void setEligibleForDiscount(boolean isEligibleForDiscount) {
        this.isEligibleForDiscount = isEligibleForDiscount;
    }

    public QuoteType getQuoteType() {
        return quoteType;
    }

    public void setQuoteType(QuoteType quoteType) {
        this.quoteType = quoteType;
    }
    
    
}
