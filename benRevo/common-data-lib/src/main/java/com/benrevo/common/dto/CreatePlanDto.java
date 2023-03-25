package com.benrevo.common.dto;

import com.benrevo.common.dto.QuoteOptionAltPlanDto.Benefit;
import com.benrevo.common.dto.QuoteOptionAltPlanDto.Cost;
import com.benrevo.common.dto.QuoteOptionAltPlanDto.Rx;
import org.hibernate.validator.constraints.NotEmpty;

import javax.validation.constraints.NotNull;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlTransient;

import java.util.ArrayList;
import java.util.List;

@XmlAccessorType(XmlAccessType.FIELD)
public class CreatePlanDto {
    
	@XmlTransient
	private Long rfpQuoteNetworkPlanId;
	@XmlTransient
	private Long rfpQuoteNetworkId;
	
	@XmlTransient // not required, see BasePlanService.create() for details
    private Long rfpQuoteOptionNetworkId;
	
	private String networkName;
	private String networkType;
	@NotNull
	private String nameByNetwork;
	@NotEmpty
	private List<Benefit> benefits = new ArrayList<>();

	@XmlTransient
	private Long carrierId;
	private String carrierName;

	private String carrierDisplayName;
	private String planType;

	@XmlTransient
	private Long optionId;

	@XmlTransient
	private Long clientId;

	private List<Cost> cost = new ArrayList<>();
	private List<Rx> rx = new ArrayList<>();
	private QuoteOptionAltRxDto extRx;
	
	public CreatePlanDto() {
	}

	public Long getRfpQuoteNetworkPlanId() {
		return rfpQuoteNetworkPlanId;
	}

	public void setRfpQuoteNetworkPlanId(Long rfpQuoteNetworkPlanId) {
		this.rfpQuoteNetworkPlanId = rfpQuoteNetworkPlanId;
	}

	public Long getRfpQuoteNetworkId() {
		return rfpQuoteNetworkId;
	}
	public void setRfpQuoteNetworkId(Long rfpQuoteNetworkId) {
		this.rfpQuoteNetworkId = rfpQuoteNetworkId;
	}

	public String getNetworkName() {
		return networkName;
	}

	public void setNetworkName(String networkName) {
		this.networkName = networkName;
	}

	public String getNetworkType() {
		return networkType;
	}

	public void setNetworkType(String networkType) {
		this.networkType = networkType;
	}

	public String getNameByNetwork() {
		return nameByNetwork;
	}
	public void setNameByNetwork(String nameByNetwork) {
		this.nameByNetwork = nameByNetwork;
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
	public List<Cost> getCost() {
		return cost;
	}
	public void setCost(List<Cost> cost) {
		this.cost = cost;
	}
	public QuoteOptionAltRxDto getExtRx() {
		return extRx;
	}
	public void setExtRx(QuoteOptionAltRxDto extRx) {
		this.extRx = extRx;
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
	public String getCarrierDisplayName() {
		return carrierDisplayName;
	}
	public void setCarrierDisplayName(String carrierDisplayName) {
		this.carrierDisplayName = carrierDisplayName;
	}

	public String getPlanType() {
		return planType;
	}

	public void setPlanType(String planType) {
		this.planType = planType;
	}

	public Long getOptionId() {
		return optionId;
	}

	public void setOptionId(Long optionId) {
		this.optionId = optionId;
	}

    public Long getClientId() {
        return clientId;
    }

    public void setClientId(Long clientId) {
        this.clientId = clientId;
    }
    
    public Long getRfpQuoteOptionNetworkId() {
        return rfpQuoteOptionNetworkId;
    }
    
    public void setRfpQuoteOptionNetworkId(Long rfpQuoteOptionNetworkId) {
        this.rfpQuoteOptionNetworkId = rfpQuoteOptionNetworkId;
    }
}
