package com.benrevo.common.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by ebrandell on 4/18/18 at 10:36 AM.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class PlanInfoPageContainerDto {

    private List<PlanInfoDto> plans = new ArrayList<>();
    private int currentElements;
    private int totalPages;
    private long totalElements;

    public PlanInfoPageContainerDto() {}

    public List<PlanInfoDto> getPlans() {
        return plans;
    }

    public void setPlans(List<PlanInfoDto> plans) {
        this.plans = plans;
    }

    public int getCurrentElements() {
        return currentElements;
    }

    public void setCurrentElements(int currentElements) {
        this.currentElements = currentElements;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }

    public long getTotalElements() {
        return totalElements;
    }

    public void setTotalElements(long totalElements) {
        this.totalElements = totalElements;
    }
}
