package com.benrevo.common.dto;

import java.util.ArrayList;
import java.util.List;

public class QuoteChangesDto {

    private List<PlanChangesDto> changedPlans = new ArrayList<>();

    private List<PlanChangesDto> newPlans = new ArrayList<>();

    private List<PlanChangesDto> removedPlans = new ArrayList<>();

    public List<PlanChangesDto> getChangedPlans() {
        return changedPlans;
    }

    public void setChangedPlans(List<PlanChangesDto> changedPlans) {
        this.changedPlans = changedPlans;
    }

    public List<PlanChangesDto> getNewPlans() {
        return newPlans;
    }

    public void setNewPlans(List<PlanChangesDto> newPlans) {
        this.newPlans = newPlans;
    }

    public List<PlanChangesDto> getRemovedPlans() {
        return removedPlans;
    }

    public void setRemovedPlans(List<PlanChangesDto> removedPlans) {
        this.removedPlans = removedPlans;
    }

    public void addChangedPlan(PlanChangesDto dto) {
        changedPlans.add(dto);
    }

    public void addNewPlan(PlanChangesDto dto) {
        newPlans.add(dto);
    }

    public void addRemovedPlan(PlanChangesDto dto) {
        removedPlans.add(dto);
    }
}
