package com.benrevo.common.dto;

import java.util.ArrayList;
import java.util.List;
import javax.validation.constraints.NotNull;
import com.benrevo.common.enums.QuoteType;

public class PresentationAlternativeDto {

    private String name;
    private String presentationOptionId;
    private List<PresentationAlternativeOption> productsOptions = new ArrayList<>();
    private List<PresentationAlternativeBundlingDiscount> bundlingDiscounts = new ArrayList<>();
    private Float total;
    private Float percentage;

    public static class PresentationAlternativeOption {

        @NotNull
        private Long rfpQuoteOptionId;

        @NotNull
        private String product;

        private Float total;
        private Float percentage;
        private Long carrierId;
        private String carrierName;
        
        private QuoteType quoteType;


        public Long getRfpQuoteOptionId() {
            return rfpQuoteOptionId;
        }

        public void setRfpQuoteOptionId(Long rfpQuoteOptionId) {
            this.rfpQuoteOptionId = rfpQuoteOptionId;
        }

        public Float getTotal() {
            return total;
        }

        public void setTotal(Float total) {
            this.total = total;
        }

        public Float getPercentage() {
            return percentage;
        }

        public void setPercentage(Float percentage) {
            this.percentage = percentage;
        }

        public Long getCarrierId() {
            return carrierId;
        }

        public void setCarrierId(Long carrierId) {
            this.carrierId = carrierId;
        }

        public String getCarrierName() {
            return carrierName;
        }

        public void setCarrierName(String carrierName) {
            this.carrierName = carrierName;
        }

        public QuoteType getQuoteType() {
            return quoteType;
        }

        public void setQuoteType(QuoteType quoteType) {
            this.quoteType = quoteType;
        }

        public String getProduct() {
            return product;
        }

        public void setProduct(String product) {
            this.product = product;
        }
    }

    public static class PresentationAlternativeBundlingDiscount {

        private String product;
        private Float discount;

        public PresentationAlternativeBundlingDiscount() {
        }

        public PresentationAlternativeBundlingDiscount(String product, Float discount) {
            this.product = product;
            this.discount = discount;
        }

        public String getProduct() {
            return product;
        }

        public void setProduct(String product) {
            this.product = product;
        }

        public Float getDiscount() {
            return discount;
        }

        public void setDiscount(Float discount) {
            this.discount = discount;
        }

    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPresentationOptionId() {
        return presentationOptionId;
    }

    public void setPresentationOptionId(String presentationOptionId) {
        this.presentationOptionId = presentationOptionId;
    }

    public List<PresentationAlternativeOption> getProductsOptions() {
        return productsOptions;
    }

    public void setProductsOptions(
        List<PresentationAlternativeOption> productsOptions) {
        this.productsOptions = productsOptions;
    }

    public List<PresentationAlternativeBundlingDiscount> getBundlingDiscounts() {
        return bundlingDiscounts;
    }

    public void setBundlingDiscounts(
        List<PresentationAlternativeBundlingDiscount> bundlingDiscounts) {
        this.bundlingDiscounts = bundlingDiscounts;
    }

    public Float getTotal() {
        return total;
    }

    public void setTotal(Float total) {
        this.total = total;
    }

    public Float getPercentage() {
        return percentage;
    }

    public void setPercentage(Float percentage) {
        this.percentage = percentage;
    }
}
