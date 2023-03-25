package com.benrevo.common.dto;

import com.benrevo.common.dto.QuoteOptionAltPlanDto.Benefit;
import com.benrevo.common.dto.QuoteOptionAltPlanDto.Cost;
import com.benrevo.common.dto.QuoteOptionAltPlanDto.Rx;
import com.benrevo.common.enums.QuoteType;
import java.util.ArrayList;
import java.util.List;

public class QuoteOptionPlanBriefDto { 
	private Long planId;
	private String carrier;
	private Long carrierId;
	private Long rfpCarrierId;
	private String label;
	private String name;
	private String type;
	private Float employer;
	private Float employee;
	private Float total;

	private Float tier1Rate;
	private Float tier2Rate;
	private Float tier3Rate;
	private Float tier4Rate;
	
	private QuoteType quoteType;

	private List<Rx> rx = new ArrayList<>();
    private List<Benefit> benefits = new ArrayList<>();
    private List<Cost> cost = new ArrayList<>();

    private boolean selected = false;
    private Boolean isDollarPlan;

	public QuoteOptionPlanBriefDto() {
	}

	public String getCarrier() {
		return carrier;
	}

	public void setCarrier(String carrier) {
		this.carrier = carrier;
	}

    public Long getRfpCarrierId() {
        return rfpCarrierId;
    }

    public void setRfpCarrierId(Long rfpCarrierId) {
        this.rfpCarrierId = rfpCarrierId;
    }

	public Long getCarrierId() {
		return carrierId;
	}

	public void setCarrierId(Long carrierId) {
		this.carrierId = carrierId;
	}

	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Float getEmployer() {
		return employer;
	}

	public void setEmployer(Float employer) {
		this.employer = employer;
	}

	public Float getEmployee() {
		return employee;
	}

	public void setEmployee(Float employee) {
		this.employee = employee;
	}

	public Float getTotal() {
		return total;
	}

	public void setTotal(Float total) {
		this.total = total;
	}

	public Long getPlanId() {
		return planId;
	}

	public void setPlanId(Long planId) {
		this.planId = planId;
	}

	public Float getTier1Rate() {
		return tier1Rate;
	}

	public void setTier1Rate(Float tier1Rate) {
		this.tier1Rate = tier1Rate;
	}

	public Float getTier2Rate() {
		return tier2Rate;
	}

	public void setTier2Rate(Float tier2Rate) {
		this.tier2Rate = tier2Rate;
	}

	public Float getTier3Rate() {
		return tier3Rate;
	}

	public void setTier3Rate(Float tier3Rate) {
		this.tier3Rate = tier3Rate;
	}

	public Float getTier4Rate() {
		return tier4Rate;
	}

	public void setTier4Rate(Float tier4Rate) {
		this.tier4Rate = tier4Rate;
	}

	public QuoteType getQuoteType() {
		return quoteType;
	}

	public void setQuoteType(QuoteType quoteType) {
		this.quoteType = quoteType;
	}

    public List<Rx> getRx() {
        return rx;
    }

    public void setRx(List<Rx> rx) {
        this.rx = rx;
    }

    public List<Benefit> getBenefits() {
        return benefits;
    }

    public void setBenefits(List<Benefit> benefits) {
        this.benefits = benefits;
    }

    public List<Cost> getCost() {
        return cost;
    }

    public void setCost(List<Cost> cost) {
        this.cost = cost;
    }

    public boolean isSelected() {
        return selected;
    }

    public void setSelected(boolean selected) {
        this.selected = selected;
    }

    public Boolean getIsDollarPlan() {
        return isDollarPlan;
    }

    public void setIsDollarPlan(Boolean isDollarPlan) {
        this.isDollarPlan = isDollarPlan;
    }

}
