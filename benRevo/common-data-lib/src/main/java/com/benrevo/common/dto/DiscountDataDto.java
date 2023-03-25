package com.benrevo.common.dto;

import java.util.ArrayList;
import java.util.List;

public class DiscountDataDto {

    public static class SalesPersonDto {
        private String name;
        private float discounts;
        private int discountsPercent;
        
        public SalesPersonDto() {
        }
        public SalesPersonDto(String name, float discounts) {
            this.name = name;
            this.discounts = discounts;
        }
        public String getName() {
            return name;
        }
        public void setName(String name) {
            this.name = name;
        }
        public float getDiscounts() {
            return discounts;
        }
        public void setDiscounts(float discounts) {
            this.discounts = discounts;
        }
        public int getDiscountsPercent() {
            return discountsPercent;
        }
        public void setDiscountsPercent(int discountsPercent) {
            this.discountsPercent = discountsPercent;
        }
        
    }
    
    private long closedGroupCount;
    private long pendingGroupCount;
    private long totalGroupCount;
    private long closedGroupEmployeeCount;
    private long pendingGroupEmployeeCount;
    private long totalGroupEmployeeCount;
    private float closedGroupDiscounts;
    private float pendingGroupDiscounts;
    private float totalGroupDiscounts;
    private List<SalesPersonDto> salesPersons = new ArrayList<>();
    public long getClosedGroupCount() {
        return closedGroupCount;
    }
    public void setClosedGroupCount(long closedGroupCount) {
        this.closedGroupCount = closedGroupCount;
    }
    public long getPendingGroupCount() {
        return pendingGroupCount;
    }
    public void setPendingGroupCount(long pendingGroupCount) {
        this.pendingGroupCount = pendingGroupCount;
    }
    public long getTotalGroupCount() {
        return totalGroupCount;
    }
    public void setTotalGroupCount(long totalGroupCount) {
        this.totalGroupCount = totalGroupCount;
    }
    public long getClosedGroupEmployeeCount() {
        return closedGroupEmployeeCount;
    }
    public void setClosedGroupEmployeeCount(long closedGroupEmployeeCount) {
        this.closedGroupEmployeeCount = closedGroupEmployeeCount;
    }
    public long getPendingGroupEmployeeCount() {
        return pendingGroupEmployeeCount;
    }
    public void setPendingGroupEmployeeCount(long pendingGroupEmployeeCount) {
        this.pendingGroupEmployeeCount = pendingGroupEmployeeCount;
    }
    public long getTotalGroupEmployeeCount() {
        return totalGroupEmployeeCount;
    }
    public void setTotalGroupEmployeeCount(long totalGroupEmployeeCount) {
        this.totalGroupEmployeeCount = totalGroupEmployeeCount;
    }
    public float getClosedGroupDiscounts() {
        return closedGroupDiscounts;
    }
    public void setClosedGroupDiscounts(float closedGroupDiscounts) {
        this.closedGroupDiscounts = closedGroupDiscounts;
    }
    public float getPendingGroupDiscounts() {
        return pendingGroupDiscounts;
    }
    public void setPendingGroupDiscounts(float pendingGroupDiscounts) {
        this.pendingGroupDiscounts = pendingGroupDiscounts;
    }
    public float getTotalGroupDiscounts() {
        return totalGroupDiscounts;
    }
    public void setTotalGroupDiscounts(float totalGroupDiscounts) {
        this.totalGroupDiscounts = totalGroupDiscounts;
    }
    public List<SalesPersonDto> getSalesPersons() {
        return salesPersons;
    }
    public void setSalesPersons(List<SalesPersonDto> salesPersons) {
        this.salesPersons = salesPersons;
    }
    
    
}
