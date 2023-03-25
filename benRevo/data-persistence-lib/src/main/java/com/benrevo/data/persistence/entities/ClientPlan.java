package com.benrevo.data.persistence.entities;


import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import com.benrevo.data.persistence.entities.ancillary.AncillaryPlan;
import org.springframework.beans.BeanUtils;
import static com.benrevo.common.Constants.ER_CONTRIBUTION_FORMAT_DOLLAR;
import static com.benrevo.common.Constants.ER_CONTRIBUTION_FORMAT_PERCENT;

@Entity
@Table(name = "client_plan")
public class ClientPlan implements Tier4RatePlan {
	@Id @GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column	(name = "client_plan_id")
	private Long clientPlanId;
	
    @ManyToOne
    @JoinColumn(name="client_id", nullable=false)
	private Client client;
	
    @ManyToOne
    @JoinColumn(name="pnn_id", referencedColumnName="pnn_id", nullable=false)
	private PlanNameByNetwork pnn;

	@ManyToOne
	@JoinColumn(name="rx_pnn_id", referencedColumnName="pnn_id")
	private PlanNameByNetwork rxPnn;
	
	@Column (name = "tier1_census")
	private Long tier1Census;
	
	@Column (name = "tier2_census")
	private Long tier2Census;
	
	@Column (name = "tier3_census")
	private Long tier3Census;
	
	@Column (name = "tier4_census")
	private Long tier4Census;
	
	@Column (name = "tier1_rate")
	private Float tier1Rate;
	
	@Column (name = "tier2_rate")
	private Float tier2Rate;
	
	@Column (name = "tier3_rate")
	private Float tier3Rate;
	
	@Column (name = "tier4_rate")
	private Float tier4Rate;
	
	@Column (name = "tier1_renewal")
	private Float tier1Renewal;
	
	@Column (name = "tier2_renewal")
	private Float tier2Renewal;
	
	@Column (name = "tier3_renewal")
	private Float tier3Renewal;
	
	@Column (name = "tier4_renewal")
	private Float tier4Renewal;

	@Column (name = "er_contribution_format")
	private String erContributionFormat;
	
	@Column (name = "tier1_er_contribution")
	private Float tier1ErContribution;
	
	@Column (name = "tier2_er_contribution")
	private Float tier2ErContribution;
	
	@Column (name = "tier3_er_contribution")
	private Float tier3ErContribution;
	
	@Column (name = "tier4_er_contribution")
	private Float tier4ErContribution;
	
	@Column (name = "plan_type")
	private String planType;

	@Column (name = "out_of_state")
	private boolean outOfState;

	@Column (name = "option_id")
	private Long optionId;

	@ManyToOne
	@JoinColumn(name="ancillary_plan_id", referencedColumnName="ancillary_plan_id", nullable = true)
	private AncillaryPlan ancillaryPlan;

	public ClientPlan() { }
	
	public ClientPlan(Client client, Option option, boolean outOfState, PlanNameByNetwork pnn,
			Long t1Census, Long t2Census, Long t3Census, Long t4Census,
			Float t1Rate, Float t2Rate, Float t3Rate, Float t4Rate,
			Float t1Renewal, Float t2Renewal, Float t3Renewal, Float t4Renewal,
			String erContributionFormat,
			Float t1ErContr, Float t2ErContr, Float t3ErContr, Float t4ErContr) {
		this.client = client;
		this.pnn = pnn;
		this.optionId = option.getId();
		this.outOfState = outOfState;
		this.tier1Census = t1Census;
		this.tier2Census = t2Census;
		this.tier3Census = t3Census;
		this.tier4Census = t4Census;
		this.tier1Rate = t1Rate;
		this.tier2Rate = t2Rate;
		this.tier3Rate = t3Rate;
		this.tier4Rate = t4Rate;
		this.tier1Renewal = t1Renewal;
		this.tier2Renewal = t2Renewal;
		this.tier3Renewal = t3Renewal;
		this.tier4Renewal = t4Renewal;
		this.erContributionFormat = erContributionFormat;
		this.tier1ErContribution = t1ErContr;
		this.tier2ErContribution = t2ErContr;
		this.tier3ErContribution = t3ErContr;
		this.tier4ErContribution = t4ErContr;
	}

	public Long getClientPlanId() {
		return clientPlanId;
	}

	public void setClientPlanId(Long clientPlanId) {
		this.clientPlanId = clientPlanId;
	}

	public Client getClient() {
		return client;
	}

	public void setClient(Client client) {
		this.client = client;
	}

	public PlanNameByNetwork getPnn() {
		return pnn;
	}

	public void setPnn(PlanNameByNetwork pnn) {
		this.pnn = pnn;
	}

	public Long getTier1Census() {
		return tier1Census;
	}

	public void setTier1Census(Long tier1Census) {
		this.tier1Census = tier1Census;
	}

	public Long getTier2Census() {
		return tier2Census;
	}

	public void setTier2Census(Long tier2Census) {
		this.tier2Census = tier2Census;
	}

	public Long getTier3Census() {
		return tier3Census;
	}

	public void setTier3Census(Long tier3Census) {
		this.tier3Census = tier3Census;
	}

	public Long getTier4Census() {
		return tier4Census;
	}

	public void setTier4Census(Long tier4Census) {
		this.tier4Census = tier4Census;
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

	public Float getTier1Renewal() {
		return tier1Renewal;
	}

	public void setTier1Renewal(Float tier1Renewal) {
		this.tier1Renewal = tier1Renewal;
	}

	public Float getTier2Renewal() {
		return tier2Renewal;
	}

	public void setTier2Renewal(Float tier2Renewal) {
		this.tier2Renewal = tier2Renewal;
	}

	public Float getTier3Renewal() {
		return tier3Renewal;
	}

	public void setTier3Renewal(Float tier3Renewal) {
		this.tier3Renewal = tier3Renewal;
	}

	public Float getTier4Renewal() {
		return tier4Renewal;
	}

	public void setTier4Renewal(Float tier4Renewal) {
		this.tier4Renewal = tier4Renewal;
	}

	public String getErContributionFormat() {
		return erContributionFormat;
	}

	public void setErContributionFormat(String erContributionFormat) {
		if (!ER_CONTRIBUTION_FORMAT_PERCENT.equals(erContributionFormat) && !ER_CONTRIBUTION_FORMAT_DOLLAR.equals(erContributionFormat)) {
			throw new IllegalArgumentException("Invalid ER_CONTRIBUTION_FORMAT: " + erContributionFormat);
		}
		this.erContributionFormat = erContributionFormat;
	}

	public Float getTier1ErContribution() {
		return tier1ErContribution;
	}

	public void setTier1ErContribution(Float tier1ErContribution) {
		this.tier1ErContribution = tier1ErContribution;
	}

	public Float getTier2ErContribution() {
		return tier2ErContribution;
	}

	public void setTier2ErContribution(Float tier2ErContribution) {
		this.tier2ErContribution = tier2ErContribution;
	}

	public Float getTier3ErContribution() {
		return tier3ErContribution;
	}

	public void setTier3ErContribution(Float tier3ErContribution) {
		this.tier3ErContribution = tier3ErContribution;
	}

	public Float getTier4ErContribution() {
		return tier4ErContribution;
	}

	public void setTier4ErContribution(Float tier4ErContribution) {
		this.tier4ErContribution = tier4ErContribution;
	}

	public PlanNameByNetwork getRxPnn() {
		return rxPnn;
	}

	public void setRxPnn(PlanNameByNetwork rxPnn) {
		this.rxPnn = rxPnn;
	}

	public String getPlanType() {
		return planType;
	}

	public void setPlanType(String planType) {
		this.planType = planType;
	}

	public boolean isOutOfState() {
		return outOfState;
	}

	public void setOutOfState(boolean outOfState) {
		this.outOfState = outOfState;
	}

	public Long getOptionId() {
		return optionId;
	}

	public void setOptionId(Long optionId) {
		this.optionId = optionId;
	}
    
    public AncillaryPlan getAncillaryPlan() {
        return ancillaryPlan;
    }
    
    public void setAncillaryPlan(AncillaryPlan ancillaryPlan) {
        this.ancillaryPlan = ancillaryPlan;
    }

    public ClientPlan copy() {
	  ClientPlan copy = new ClientPlan();
      BeanUtils.copyProperties(this, copy, "clientPlanId");
      return copy; 
  }
}