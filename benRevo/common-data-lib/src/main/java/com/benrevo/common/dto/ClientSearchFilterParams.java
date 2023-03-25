package com.benrevo.common.dto;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public class ClientSearchFilterParams {
    private String product;
    // 2-key map: {"id" : 1000L, "name" : "ClientSearchBroker"}
    // see DashboardClientService.getClientFilterParams() for details
    private Set<Map<String, Object>> brokerages = new HashSet<>(); 
    private Set<Map<String, Object>> incumbentCarriers = new HashSet<>(); 
    private Set<Map<String, Object>> presales = new HashSet<>(); 
    private Set<Map<String, Object>> sales = new HashSet<>(); 
    private Float diffPercentFrom;
    private Float diffPercentTo;
    private Integer clientsTotalCount;

    public ClientSearchFilterParams() {}

    public String getProduct() {
        return product;
    }
    public void setProduct(String product) {
        this.product = product;
    }
    
    public Set<Map<String, Object>> getBrokerages() {
        return brokerages;
    }
    
    public void setBrokerages(Set<Map<String, Object>> brokerages) {
        this.brokerages = brokerages;
    }
    
    public Set<Map<String, Object>> getIncumbentCarriers() {
        return incumbentCarriers;
    }
    
    public void setIncumbentCarriers(Set<Map<String, Object>> incumbentCarriers) {
        this.incumbentCarriers = incumbentCarriers;
    }
    
    public Set<Map<String, Object>> getPresales() {
        return presales;
    }
    
    public void setPresales(Set<Map<String, Object>> presales) {
        this.presales = presales;
    }
    
    public Set<Map<String, Object>> getSales() {
        return sales;
    }
    
    public void setSales(Set<Map<String, Object>> sales) {
        this.sales = sales;
    }
    
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

    public Integer getClientsTotalCount() {
        return clientsTotalCount;
    }

    public void setClientsTotalCount(Integer clientsTotalCount) {
        this.clientsTotalCount = clientsTotalCount;
    }
}
