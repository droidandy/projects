package com.benrevo.common.dto;

import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;

public class QuoteOptionAltPlanDto {

	public static final String ALTERNATIVE_PLAN_TYPE_CURRENT = "current";
    public static final String ALTERNATIVE_PLAN_TYPE_ALTERNATIVE = "alternative";
	public static final String ALTERNATIVE_PLAN_TYPE_MATCH_PLAN = "matchPlan";
	public static final String ALTERNATIVE_PLAN_TYPE_PRIMARY_PLAN = "primaryPlan";
	
	public static class Census {
		public String name;
		public Long value;
		public Census() {}
		public Census(String name, Long value) {
			this.name = name;
			this.value = value;
		}
	}
	
	public static class Cost {
		public String sysName;
		public String name;
		public String value;
		public String type;

		public Cost() {}
		public Cost(String name, String value, String type) {
			this.name = name;
			this.value = value;
			this.type = type;
		}
		public Cost(String sysName, String name, String value, String type) {
			this.name = name;
			this.value = value;
			this.type = type;
			this.sysName = sysName;
		}
	}

	@JsonInclude(Include.NON_NULL)
	public static class Benefit extends Cost {
		public String valueIn;
		public String valueOut;
		public String typeIn;
		public String typeOut;
		public int ordinal;
		@JsonIgnore
		public String highlightType;
		public String highlight;
		public String highlightIn;
		public String highlightOut;
		
		public String discountType;
		public String originalValue;
		public String discountValue;
		public String discountTypeIn;
		public String originalValueIn;
		public String discountValueIn;
		public String discountTypeOut;
		public String originalValueOut;
		public String discountValueOut;
		public String restriction;

		public Benefit() { 
			super(); 
		}
		public Benefit(String sysName, String name, String value, String type) {
			super(sysName, name, value, type);
		}
		public Benefit(String sysName, String name, String valueIn, String valueOut, String typeIn, String typeOut) {
			super(sysName, name, null, null);
			this.valueIn = valueIn;
			this.valueOut = valueOut;
			this.typeIn = typeIn;
			this.typeOut = typeOut;
		}
	}

	public static class Attribute {
		public String sysName;
		public String name;
		public String value;
		public Attribute() {}
		public Attribute(String sysName, String name, String string) {
			this.sysName = sysName;
			this.name = name;
			this.value = string;
		}
	}
	
	public static class Rx extends Cost {
		public Rx() {
			super();
		}
		public Rx(String sysName, String name, String value, String type) {
			super(sysName, name, value, type);
		}
		public Rx(String sysName, String name) {
			super(sysName, name, null, null);
		}
	}

	private Long rfpQuoteNetworkPlanId;
	private Long clientPlanId;
	private String name;
	private String type; // current | primaryPlan | alternative
	private boolean selected = false;
    private boolean selectedSecond = false;
    private String carrier;
	private String networkName;
	private List<Benefit> benefits = new ArrayList<>();
	private List<Cost> cost = new ArrayList<>();
	private List<Census> census = new ArrayList<>();
	private List<Rx> rx = new ArrayList<>();
	private List<RiderDto> riders = new ArrayList<>();
	private Float total;
	private Float percentDifference;
	private Float employerFund;
	private Float administrativeFee;
	private String summaryFileLink;
	private Boolean favorite;
	private List<Attribute> attributes = new ArrayList<>();
	
	public QuoteOptionAltPlanDto() {
	}
	
	public Long getRfpQuoteNetworkPlanId() {
		return rfpQuoteNetworkPlanId;
	}

	public void setRfpQuoteNetworkPlanId(Long rfpQuoteNetworkPlanId) {
		this.rfpQuoteNetworkPlanId = rfpQuoteNetworkPlanId;
	}

	public Long getClientPlanId() {
		return clientPlanId;
	}

	public void setClientPlanId(Long clientPlanId) {
		this.clientPlanId = clientPlanId;
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

	public String getCarrier() {
		return carrier;
	}

	public void setCarrier(String carrier) {
		this.carrier = carrier;
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

	public List<Census> getCensus() {
		return census;
	}

	public void setCensus(List<Census> census) {
		this.census = census;
	}

	public List<Rx> getRx() {
		return rx;
	}

	public void setRx(List<Rx> rx) {
		this.rx = rx;
	}

    public List<RiderDto> getRiders() {
        return riders;
    }

    public void setRiders(List<RiderDto> riders) {
        this.riders = riders;
    }

    public Float getTotal() {
        return total;
    }

	public void setTotal(Float total) {
		this.total = total;
	}

	/*
	 * TODO: percentDifference looks to be obsolete. In RfpQuoteServiceImpl.findCosts(), the "% change from current" is returned
	 * and used as an additional entry in List<Cost> costs member variable.
	 * percentDifference member variable should be removed!
	 */
	public Float getPercentDifference() {
		return percentDifference;
	}

	public void setPercentDifference(Float percentDifference) {
		this.percentDifference = percentDifference;
	}

	public boolean isSelected() {
		return selected;
	}

	public void setSelected(boolean selected) {
		this.selected = selected;
	}

    public boolean isSelectedSecond() {
        return selectedSecond;
    }

    public void setSelectedSecond(boolean selectedSecond) {
        this.selectedSecond = selectedSecond;
    }

    public String getNetworkName() {
		return networkName;
	}

	public void setNetworkName(String networkName) {
		this.networkName = networkName;
	}

	public Float getEmployerFund() {
		return employerFund;
	}

	public void setEmployerFund(Float employerFund) {
		this.employerFund = employerFund;
	}

	public Float getAdministrativeFee() {
		return administrativeFee;
	}

	public void setAdministrativeFee(Float administrativeFee) {
		this.administrativeFee = administrativeFee;
	}

    public String getSummaryFileLink() {
        return summaryFileLink;
    }
  
    public void setSummaryFileLink(String summaryFileLink) {
        this.summaryFileLink = summaryFileLink;
    }

	public List<Attribute> getAttributes() {
		return attributes;
	}

	public void setAttributes(List<Attribute> attributes) {
		this.attributes = attributes;
	}

    public Boolean getFavorite() {
        return favorite;
    }

    public void setFavorite(Boolean favorite) {
        this.favorite = favorite;
    }
}
