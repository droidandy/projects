package com.benrevo.common.dto;

import com.benrevo.common.enums.QuoteType;
import java.util.ArrayList;
import java.util.List;


public class PlanDifferenceDto {

    public static class DifferenceItem {

        public DifferenceItem() {}

        private String currentPlanName;
        private String matchPlanName;
        private Float dollarDifference;
        private Float percentDifference;

        public String getCurrentPlanName() {
            return currentPlanName;
        }

        public void setCurrentPlanName(String currentPlanName) {
            this.currentPlanName = currentPlanName;
        }

        public String getMatchPlanName() {
            return matchPlanName;
        }

        public void setMatchPlanName(String matchPlanName) {
            this.matchPlanName = matchPlanName;
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
    }

    private String carrier;
    private String product;
    private QuoteType quoteType;
    private List<DifferenceItem> plans = new ArrayList<>();
    private Float totalDollarDifference;
    private Float totalPercentDifference;

    public PlanDifferenceDto() {
    }

    public String getCarrier() {
        return carrier;
    }

    public void setCarrier(String carrier) {
        this.carrier = carrier;
    }

    public String getProduct() {
        return product;
    }

    public void setProduct(String product) {
        this.product = product;
    }

    public QuoteType getQuoteType() {
        return quoteType;
    }

    public void setQuoteType(QuoteType quoteType) {
        this.quoteType = quoteType;
    }

    public List<DifferenceItem> getPlans() {
        return plans;
    }

    public void setPlans(List<DifferenceItem> plans) {
        this.plans = plans;
    }

    public Float getTotalDollarDifference() {
        return totalDollarDifference;
    }

    public void setTotalDollarDifference(Float totalDollarDifference) {
        this.totalDollarDifference = totalDollarDifference;
    }

    public Float getTotalPercentDifference() {
        return totalPercentDifference;
    }

    public void setTotalPercentDifference(Float totalPercentDifference) {
        this.totalPercentDifference = totalPercentDifference;
    }
}
