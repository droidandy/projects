package com.benrevo.data.persistence.entities;

import javax.persistence.*;
import org.springframework.beans.BeanUtils;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static com.benrevo.common.Constants.ER_CONTRIBUTION_FORMAT_DOLLAR;
import static com.benrevo.common.Constants.ER_CONTRIBUTION_FORMAT_PERCENT;

@Entity
@Table(name = "rfp_quote_option_network")
public class RfpQuoteOptionNetwork {
	@Id @GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column	(name = "rfp_quote_option_network_id")
	private Long rfpQuoteOptionNetworkId;
	
    @ManyToOne
    @JoinColumn(name="rfp_quote_option_id", referencedColumnName="rfp_quote_option_id", nullable=false)
	private RfpQuoteOption rfpQuoteOption;
	
    @ManyToOne
    @JoinColumn(name="rfp_quote_network_id", referencedColumnName="rfp_quote_network_id", nullable=false)
	private RfpQuoteNetwork rfpQuoteNetwork;
	
    @ManyToOne
    @JoinColumn(name="client_plan_id", referencedColumnName="client_plan_id", nullable=true)
	private ClientPlan clientPlan;

    @ManyToOne
    @JoinColumn(name="selected_quote_network_plan_id", referencedColumnName="rfp_quote_network_plan_id", nullable=true)
	private RfpQuoteNetworkPlan selectedRfpQuoteNetworkPlan;

	@ManyToOne
	@JoinColumn(name="selected_quote_network_rx_plan_id", referencedColumnName="rfp_quote_network_plan_id", nullable=true)
	private RfpQuoteNetworkPlan selectedRfpQuoteNetworkRxPlan;

    @ManyToOne
    @JoinColumn(name="selected_second_quote_network_plan_id", referencedColumnName="rfp_quote_network_plan_id", nullable=true)
    private RfpQuoteNetworkPlan selectedSecondRfpQuoteNetworkPlan;

    @ManyToOne
    @JoinColumn(name="selected_second_quote_network_rx_plan_id", referencedColumnName="rfp_quote_network_plan_id", nullable=true)
    private RfpQuoteNetworkPlan selectedSecondRfpQuoteNetworkRxPlan;

	@Column (name = "out_of_state")
	private boolean outOfState;

	@Column (name = "tier1_census")
	private Long tier1Census;
	
	@Column (name = "tier2_census")
	private Long tier2Census;
	
	@Column (name = "tier3_census")
	private Long tier3Census;
	
	@Column (name = "tier4_census")
	private Long tier4Census;

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

	@Column(name = "tier1_ee_fund")
	private Float tier1EeFund= 0f;

	@Column(name = "tier2_ee_fund")
	private Float tier2EeFund= 0f;

	@Column(name = "tier3_ee_fund")
	private Float tier3EeFund= 0f;

	@Column(name = "tier4_ee_fund")
	private Float tier4EeFund = 0f;

	@ManyToOne
	@JoinColumn(name="rfp_quote_version_id", referencedColumnName="rfp_quote_version_id", nullable=false)
	private RfpQuoteVersion rfpQuoteVersion;

	@JoinTable(name = "rider_rfp_quote_option_network",
			joinColumns = {@JoinColumn(name = "rfp_quote_option_network_id", referencedColumnName = "rfp_quote_option_network_id")},
			inverseJoinColumns = {@JoinColumn(name = "rider_id", referencedColumnName = "rider_id")})
	@ManyToMany
	private Set<Rider> selectedRiders = new HashSet<>();
	
	@ManyToOne
	@JoinColumn(name = "administrative_fee_id", referencedColumnName = "administrative_fee_id", nullable = true)
	private AdministrativeFee administrativeFee;
	
	@Column(name = "network_group")
    private String networkGroup;	

	public RfpQuoteOptionNetwork() { }
	
	public RfpQuoteOptionNetwork(RfpQuoteOption rfpQuoteOption, RfpQuoteNetwork rfpQuoteNetwork, RfpQuoteNetworkPlan selectedPlan, ClientPlan clientPlan, Long tier1Census, Long tier2Census, Long tier3Census, Long tier4Census,
			String erContributionFormat, Float t1ErContr, Float t2ErContr, Float t3ErContr, Float t4ErContr) {
		this.rfpQuoteOption = rfpQuoteOption;
		this.rfpQuoteNetwork = rfpQuoteNetwork;
		this.selectedRfpQuoteNetworkPlan = selectedPlan;
		this.clientPlan = clientPlan;
		this.tier1Census = tier1Census;
		this.tier2Census = tier2Census;
		this.tier3Census = tier3Census;
		this.tier4Census = tier4Census;
		this.erContributionFormat = erContributionFormat;
		this.tier1ErContribution = t1ErContr;
		this.tier2ErContribution = t2ErContr;
		this.tier3ErContribution = t3ErContr;
		this.tier4ErContribution = t4ErContr;
		this.rfpQuoteVersion = rfpQuoteNetwork.getRfpQuote().getRfpQuoteVersion();
	}

	public Long getRfpQuoteOptionNetworkId() {
		return rfpQuoteOptionNetworkId;
	}

	public void setRfpQuoteOptionNetworkId(Long rfpQuoteOptionNetworkId) {
		this.rfpQuoteOptionNetworkId = rfpQuoteOptionNetworkId;
	}

	public RfpQuoteOption getRfpQuoteOption() {
		return rfpQuoteOption;
	}

	public void setRfpQuoteOption(RfpQuoteOption rfpQuoteOption) {
		this.rfpQuoteOption = rfpQuoteOption;
	}

	public RfpQuoteNetwork getRfpQuoteNetwork() {
		return rfpQuoteNetwork;
	}

	public void setRfpQuoteNetwork(RfpQuoteNetwork rfpQuoteNetwork) {
		this.rfpQuoteNetwork = rfpQuoteNetwork;
	}

	public ClientPlan getClientPlan() {
		return clientPlan;
	}

	public void setClientPlan(ClientPlan clientPlan) {
		this.clientPlan = clientPlan;
	}

	public RfpQuoteNetworkPlan getSelectedRfpQuoteNetworkPlan() {
		return selectedRfpQuoteNetworkPlan;
	}

	public void setSelectedRfpQuoteNetworkPlan(RfpQuoteNetworkPlan selectedRfpQuoteNetworkPlan) {
		this.selectedRfpQuoteNetworkPlan = selectedRfpQuoteNetworkPlan;
	}

	public RfpQuoteNetworkPlan getSelectedRfpQuoteNetworkRxPlan() {
		return selectedRfpQuoteNetworkRxPlan;
	}

	public void setSelectedRfpQuoteNetworkRxPlan(RfpQuoteNetworkPlan selectedRfpQuoteNetworkRxPlan) {
		this.selectedRfpQuoteNetworkRxPlan = selectedRfpQuoteNetworkRxPlan;
	}

    public RfpQuoteNetworkPlan getSelectedSecondRfpQuoteNetworkPlan() {
        return selectedSecondRfpQuoteNetworkPlan;
    }

    public void setSelectedSecondRfpQuoteNetworkPlan(
        RfpQuoteNetworkPlan selectedSecondRfpQuoteNetworkPlan) {
        this.selectedSecondRfpQuoteNetworkPlan = selectedSecondRfpQuoteNetworkPlan;
    }

    public RfpQuoteNetworkPlan getSelectedSecondRfpQuoteNetworkRxPlan() {
        return selectedSecondRfpQuoteNetworkRxPlan;
    }

    public void setSelectedSecondRfpQuoteNetworkRxPlan(
        RfpQuoteNetworkPlan selectedSecondRfpQuoteNetworkRxPlan) {
        this.selectedSecondRfpQuoteNetworkRxPlan = selectedSecondRfpQuoteNetworkRxPlan;
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

	public RfpQuoteVersion getRfpQuoteVersion() {
		return rfpQuoteVersion;
	}

	public void setRfpQuoteVersion(RfpQuoteVersion rfpQuoteVersion) {
		this.rfpQuoteVersion = rfpQuoteVersion;
	}

	public Float getTier1EeFund() {
		return tier1EeFund;
	}

	public void setTier1EeFund(Float tier1EeFund) {
		this.tier1EeFund = tier1EeFund;
	}

	public Float getTier2EeFund() {
		return tier2EeFund;
	}

	public void setTier2EeFund(Float tier2EeFund) {
		this.tier2EeFund = tier2EeFund;
	}

	public Float getTier3EeFund() {
		return tier3EeFund;
	}

	public void setTier3EeFund(Float tier3EeFund) {
		this.tier3EeFund = tier3EeFund;
	}

	public Float getTier4EeFund() {
		return tier4EeFund;
	}

	public void setTier4EeFund(Float tier4EeFund) {
		this.tier4EeFund = tier4EeFund;
	}

	public Set<Rider> getSelectedRiders() {
		return selectedRiders;
	}

	public void setSelectedRiders(Set<Rider> selectedRiders) {
		this.selectedRiders = selectedRiders;
	}

	public boolean isOutOfState() {
		return outOfState;
	}

	public void setOutOfState(boolean outOfState) {
		this.outOfState = outOfState;
	}

	public AdministrativeFee getAdministrativeFee() {
		return administrativeFee;
	}

	public void setAdministrativeFee(AdministrativeFee administrativeFee) {
		this.administrativeFee = administrativeFee;
	}

    public String getNetworkGroup() {
        return networkGroup;
    }
  
    public void setNetworkGroup(String networkGroup) {
        this.networkGroup = networkGroup;
    }
	
	public RfpQuoteOptionNetwork copy() {
	  RfpQuoteOptionNetwork copy = new RfpQuoteOptionNetwork();
      BeanUtils.copyProperties(this, copy, "rfpQuoteOptionNetworkId", "selectedRiders");
      if (selectedRiders != null) {
        copy.getSelectedRiders().addAll(selectedRiders);
      }
      return copy; 
    }
}
