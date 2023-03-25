package com.benrevo.common.dto.ancillary;

import com.benrevo.common.enums.AncillaryPlanType;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementWrapper;
import javax.xml.bind.annotation.XmlElements;
import javax.xml.bind.annotation.XmlTransient;
import java.util.ArrayList;
import java.util.List;

@XmlAccessorType(XmlAccessType.FIELD)
public class AncillaryPlanDto {
    @XmlTransient
	private Long ancillaryPlanId;
	private Integer planYear;
	private String planName;
	@XmlTransient
	private Long carrierId;
	private String carrierName;
	private String carrierDisplayName;
	private AncillaryPlanType planType;
	
	@XmlElementWrapper(name = "classes")
    @XmlElements({
            @XmlElement(name = "LtdClass", type = LtdClassDto.class),
            @XmlElement(name = "LifeClass", type = LifeClassDto.class),
            @XmlElement(name = "StdClass", type = StdClassDto.class)
    })
    private List<AncillaryClassDto> classes = new ArrayList<>();
	
	@XmlElements({
        @XmlElement(name = "BasicRate", type = BasicRateDto.class),
        @XmlElement(name = "VoluntaryRate", type = VoluntaryRateDto.class)
	})
    private AncillaryRateDto rates;

    public AncillaryPlanDto() {
	}

	public AncillaryPlanType getPlanType() {
		return planType;
	}

	public void setPlanType(AncillaryPlanType planType) {
		this.planType = planType;
	}

	public List<AncillaryClassDto> getClasses() {
		return classes;
	}
	
	public void setClasses(List<AncillaryClassDto> classes) {
		this.classes = classes;
	}
    
	public AncillaryRateDto getRates() {
		return rates;
	}
	
	public void setRates(AncillaryRateDto rates) {
		this.rates = rates;
	}

    public Long getAncillaryPlanId() {
        return ancillaryPlanId;
    }
 
    public void setAncillaryPlanId(Long ancillaryPlanId) {
        this.ancillaryPlanId = ancillaryPlanId;
    }

    public Integer getPlanYear() {
		return planYear;
	}

	public void setPlanYear(Integer planYear) {
		this.planYear = planYear;
	}

    public String getPlanName() {
        return planName;
    }
    
    public void setPlanName(String planName) {
        this.planName = planName;
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

	public String getCarrierDisplayName() {
		return carrierDisplayName;
	}

	public void setCarrierDisplayName(String carrierDisplayName) {
		this.carrierDisplayName = carrierDisplayName;
	}
    
    public void setCarrierName(String carrierName) {
        this.carrierName = carrierName;
    }
}
