package com.benrevo.common.dto;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.benrevo.common.enums.OptionType;
import com.benrevo.common.enums.QuoteState;
import com.benrevo.common.enums.QuoteType;

public class QuoteOptionBriefDto {
	private Long id;
	private String name;
	private String displayName;
	private String carrier;
	private Float totalAnnualPremium;
	private Float percentDifference;
	private List<String> planTypes;
	private List<PlanBriefDto> plans;
	private boolean selected;
	private QuoteType quoteType;
	private QuoteState quoteState;
	private OptionType optionType;
	private Boolean complete;
	private String category;
	private List carriers = new ArrayList();
	
    // plans information for option pop-up (list of included plan names and types)
    public static class PlanBriefDto {

        public String name;
        public String type;

        public PlanBriefDto() {}

        public PlanBriefDto(String name, String type) {
            this.name = name;
            this.type = type;
        }
    }
	
	public QuoteOptionBriefDto() {
	}
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getCarrier() {
		return carrier;
	}

	public void setCarrier(String carrier) {
		this.carrier = carrier;
	}

	public Float getTotalAnnualPremium() {
		return totalAnnualPremium;
	}

	public void setTotalAnnualPremium(Float totalAnnualPremium) {
		this.totalAnnualPremium = totalAnnualPremium;
	}

	public Float getPercentDifference() {
		return percentDifference;
	}

	public void setPercentDifference(Float percentDifference) {
		this.percentDifference = percentDifference;
	}

	public List<String> getPlanTypes() {
		return planTypes;
	}

    public List<PlanBriefDto> getPlans() {
        // to prevent getPlans().add() (see the setPlans() below) 
        return plans != null ? Collections.unmodifiableList(plans) : null;
    }

    public void setPlans(List<PlanBriefDto> plans) {
        this.plans = plans;
        if(plans == null) {
            planTypes = null;
            return;
        }
        planTypes = new ArrayList<>();
        for(PlanBriefDto planBriefDto : plans) {
            planTypes.add(planBriefDto.type);
        }
    }

	public boolean isSelected() {
		return selected;
	}

	public void setSelected(boolean selected) {
		this.selected = selected;
	}

	public QuoteType getQuoteType() {
		return quoteType;
	}

	public void setQuoteType(QuoteType quoteType) {
		this.quoteType = quoteType;
	}

	public QuoteState getQuoteState() {
		return quoteState;
	}

	public void setQuoteState(QuoteState quoteState) {
		this.quoteState = quoteState;
	}

	public OptionType getOptionType() {
		return optionType;
	}

	public void setOptionType(OptionType optionType) {
		this.optionType = optionType;
	}

    public Boolean getComplete() {
        return complete;
    }

    public void setComplete(Boolean complete) {
        this.complete = complete;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public List getCarriers() {
        return carriers;
    }

    public void setCarriers(List carriers) {
        this.carriers = carriers;
    }
}