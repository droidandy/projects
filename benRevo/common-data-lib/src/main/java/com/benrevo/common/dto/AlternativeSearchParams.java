package com.benrevo.common.dto;

import org.springframework.web.bind.annotation.RequestParam;

public class AlternativeSearchParams {

    private Float diffPercentFrom;
    private Float diffPercentTo;
    private Float copayFrom;
    private Float copayTo;
    private Float deductibleFrom;
    private Float deductibleTo;
    private Float coinsuranceFrom;
    private Float coinsuranceTo;
    private Boolean favorite;

    public AlternativeSearchParams(){}

    public Float getDiffPercentFrom() {
        return diffPercentFrom;
    }

    public void setDiffPercentFrom(Float diffPercentFrom) {
        this.diffPercentFrom = diffPercentFrom;
    }

    public Float getDiffPercentTo() {
        return diffPercentTo;
    }

    public void setDiffPercentTo(Float diffPercentTo) {
        this.diffPercentTo = diffPercentTo;
    }

    public Float getCopayFrom() {
        return copayFrom;
    }

    public void setCopayFrom(Float copayFrom) {
        this.copayFrom = copayFrom;
    }

    public Float getCopayTo() {
        return copayTo;
    }

    public void setCopayTo(Float copayTo) {
        this.copayTo = copayTo;
    }

    public Float getDeductibleFrom() {
        return deductibleFrom;
    }

    public void setDeductibleFrom(Float deductibleFrom) {
        this.deductibleFrom = deductibleFrom;
    }

    public Float getDeductibleTo() {
        return deductibleTo;
    }

    public void setDeductibleTo(Float deductibleTo) {
        this.deductibleTo = deductibleTo;
    }

    public Float getCoinsuranceFrom() {
        return coinsuranceFrom;
    }

    public void setCoinsuranceFrom(Float coinsuranceFrom) {
        this.coinsuranceFrom = coinsuranceFrom;
    }

    public Float getCoinsuranceTo() {
        return coinsuranceTo;
    }

    public void setCoinsuranceTo(Float coinsuranceTo) {
        this.coinsuranceTo = coinsuranceTo;
    }

    public Boolean getFavorite() {
        return favorite;
    }

    public void setFavorite(Boolean favorite) {
        this.favorite = favorite;
    }

    public static final class Builder {

        private Float diffPercentFrom;
        private Float diffPercentTo;
        private Float copayFrom;
        private Float copayTo;
        private Float deductibleFrom;
        private Float deductibleTo;
        private Float coinsuranceFrom;
        private Float coinsuranceTo;
        private Boolean favorite;

        private Builder() {
        }

        public static Builder anAlternativeSearchParams() {
            return new Builder();
        }

        public Builder withDiffPercentFrom(Float diffPercentFrom) {
            this.diffPercentFrom = diffPercentFrom;
            return this;
        }

        public Builder withDiffPercentTo(Float diffPercentTo) {
            this.diffPercentTo = diffPercentTo;
            return this;
        }

        public Builder withCopayFrom(Float copayFrom) {
            this.copayFrom = copayFrom;
            return this;
        }

        public Builder withCopayTo(Float copayTo) {
            this.copayTo = copayTo;
            return this;
        }

        public Builder withDeductibleFrom(Float deductibleFrom) {
            this.deductibleFrom = deductibleFrom;
            return this;
        }

        public Builder withDeductibleTo(Float deductibleTo) {
            this.deductibleTo = deductibleTo;
            return this;
        }

        public Builder withCoinsuranceFrom(Float coinsuranceFrom) {
            this.coinsuranceFrom = coinsuranceFrom;
            return this;
        }

        public Builder withCoinsuranceTo(Float coinsuranceTo) {
            this.coinsuranceTo = coinsuranceTo;
            return this;
        }

        public Builder withFavorite(Boolean favorite) {
            this.favorite = favorite;
            return this;
        }

        public AlternativeSearchParams build() {
            AlternativeSearchParams alternativeSearchParams = new AlternativeSearchParams();
            alternativeSearchParams.setDiffPercentFrom(diffPercentFrom);
            alternativeSearchParams.setDiffPercentTo(diffPercentTo);
            alternativeSearchParams.setCopayFrom(copayFrom);
            alternativeSearchParams.setCopayTo(copayTo);
            alternativeSearchParams.setDeductibleFrom(deductibleFrom);
            alternativeSearchParams.setDeductibleTo(deductibleTo);
            alternativeSearchParams.setCoinsuranceFrom(coinsuranceFrom);
            alternativeSearchParams.setCoinsuranceTo(coinsuranceTo);
            alternativeSearchParams.setFavorite(favorite);
            return alternativeSearchParams;
        }
    }
}
