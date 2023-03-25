package com.benrevo.common.dto;

import com.benrevo.common.dto.QuoteOptionAltPlanDto.Benefit;
import com.benrevo.common.dto.QuoteOptionAltPlanDto.Rx;
import java.util.ArrayList;
import java.util.List;

public class PlanNameByNetworkDetailsDto extends PlanNameByNetworkDto {
    
    private List<Benefit> benefits = new ArrayList<>();
    private List<Rx> rx = new ArrayList<>();

    public PlanNameByNetworkDetailsDto() {
        super();
    }
    
    public List<Benefit> getBenefits() {
        return benefits;
    }
    
    public void setBenefits(List<Benefit> benefits) {
        this.benefits = benefits;
    }

    public List<Rx> getRx() {
        return rx;
    }
    
    public void setRx(List<Rx> rx) {
        this.rx = rx;
    }
}
