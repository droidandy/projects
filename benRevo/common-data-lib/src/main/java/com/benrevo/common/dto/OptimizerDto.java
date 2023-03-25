package com.benrevo.common.dto;

import java.util.ArrayList;
import java.util.List;

public class OptimizerDto {

    private BrokerDto brokerage;
    private BrokerDto gaBrokerage;
    private ClientDto client;
    private boolean overrideClient;
    private String newClientName;
    private List<OptimizerProduct> products = new ArrayList<>();
    private List<String> errors;


    public static class OptimizerProduct {
        private String category;
        private boolean renewal;

        public OptimizerProduct(){}

        public OptimizerProduct(String category) {
            this.category = category;
        }

        public OptimizerProduct(String category, boolean renewal) {
            this.category = category;
            this.renewal = renewal;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }

        public boolean isRenewal() {
            return renewal;
        }

        public void setRenewal(boolean renewal) {
            this.renewal = renewal;
        }
    }

    public BrokerDto getBrokerage() {
        return brokerage;
    }

    public void setBrokerage(BrokerDto brokerage) {
        this.brokerage = brokerage;
    }

    public BrokerDto getGaBrokerage() {
        return gaBrokerage;
    }

    public void setGaBrokerage(BrokerDto gaBrokerage) {
        this.gaBrokerage = gaBrokerage;
    }

    public ClientDto getClient() {
        return client;
    }

    public void setClient(ClientDto client) {
        this.client = client;
    }

    public List<String> getErrors() {
        return errors;
    }

    public void setErrors(List<String> errors) {
        this.errors = errors;
    }

    public boolean isOverrideClient() {
        return overrideClient;
    }

    public void setOverrideClient(boolean overrideClient) {
        this.overrideClient = overrideClient;
    }

    public String getNewClientName() {
        return newClientName;
    }

    public void setNewClientName(String newClientName) {
        this.newClientName = newClientName;
    }

    public List<OptimizerProduct> getProducts() {
        return products;
    }

    public void setProducts(List<OptimizerProduct> products) {
        this.products = products;
    }

}
