package com.benrevo.data.persistence.entities;

import javax.persistence.*;
import org.springframework.beans.BeanUtils;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "rfp_quote_network")
public class RfpQuoteNetwork {
	@Id @GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column	(name = "rfp_quote_network_id")
	private Long rfpQuoteNetworkId;
	
    @ManyToOne
    @JoinColumn(name="rfp_quote_id", referencedColumnName="rfp_quote_id", nullable=false)
	private RfpQuote rfpQuote;
	
    @ManyToOne
    @JoinColumn(name="network_id", referencedColumnName="network_id", nullable=false)
	private Network network;

	@Column (name = "rfp_quote_option_name")
	private String rfpQuoteOptionName;

	@Column (name = "a_la_carte")
	private boolean aLaCarte;

	@OneToMany(mappedBy = "rfpQuoteNetwork")
	private List<RfpQuoteNetworkPlan> rfpQuoteNetworkPlans = new ArrayList<RfpQuoteNetworkPlan>();

	@ManyToOne
	@JoinColumn(name="rfp_quote_version_id", referencedColumnName="rfp_quote_version_id", nullable=false)
	private RfpQuoteVersion rfpQuoteVersion;

	@JoinTable(name = "rider_rfp_quote_network",
			joinColumns = {@JoinColumn(name = "rfp_quote_network_id", referencedColumnName = "rfp_quote_network_id")},
			inverseJoinColumns = {@JoinColumn(name = "rider_id", referencedColumnName = "rider_id")})
	@ManyToMany
	private Set<Rider> riders = new HashSet<>();
	 
	@ManyToOne
	@JoinColumn(name = "rfp_quote_network_combination_id", referencedColumnName = "rfp_quote_network_combination_id", nullable = true)
	private RfpQuoteNetworkCombination rfpQuoteNetworkCombination;

    @Column (name = "discount_percent")
    private Float discountPercent;

	public RfpQuoteNetwork() { }
	
	public RfpQuoteNetwork(RfpQuote rfpQuote, Network network, String rfpQuoteOptionName) {
		this.rfpQuote = rfpQuote;
		this.network = network;
		this.rfpQuoteOptionName = rfpQuoteOptionName;
		this.rfpQuoteVersion = rfpQuote.getRfpQuoteVersion();
	}

	public Long getRfpQuoteNetworkId() {
		return rfpQuoteNetworkId;
	}

	public void setRfpQuoteNetworkId(Long rfpQuoteNetworkId) {
		this.rfpQuoteNetworkId = rfpQuoteNetworkId;
	}

	public RfpQuote getRfpQuote() {
		return rfpQuote;
	}

	public void setRfpQuote(RfpQuote rfpQuote) {
		this.rfpQuote = rfpQuote;
	}

	public Network getNetwork() {
		return network;
	}

	public void setNetwork(Network network) {
		this.network = network;
	}

	public String getRfpQuoteOptionName() {
		return rfpQuoteOptionName;
	}

	public void setRfpQuoteOptionName(String rfpQuoteOptionName) {
		this.rfpQuoteOptionName = rfpQuoteOptionName;
	}

	public boolean isaLaCarte() {
		return aLaCarte;
	}

	public void setaLaCarte(boolean aLaCarte) {
		this.aLaCarte = aLaCarte;
	}

	public List<RfpQuoteNetworkPlan> getRfpQuoteNetworkPlans() {
		return rfpQuoteNetworkPlans;
	}

	public RfpQuoteVersion getRfpQuoteVersion() {
		return rfpQuoteVersion;
	}

	public void setRfpQuoteVersion(RfpQuoteVersion rfpQuoteVersion) {
		this.rfpQuoteVersion = rfpQuoteVersion;
	}

	public Set<Rider> getRiders() {
		return riders;
	}

	public void setRiders(Set<Rider> riders) {
		this.riders = riders;
	}

	public RfpQuoteNetworkCombination getRfpQuoteNetworkCombination() {
		return rfpQuoteNetworkCombination;
	}

	public void setRfpQuoteNetworkCombination(RfpQuoteNetworkCombination rfpQuoteNetworkCombination) {
		this.rfpQuoteNetworkCombination = rfpQuoteNetworkCombination;
	}

    public Float getDiscountPercent() {
        return discountPercent;
    }

    public void setDiscountPercent(Float discountPercent) {
        this.discountPercent = discountPercent;
    }

    public RfpQuoteNetwork copy() {
	  RfpQuoteNetwork copy = new RfpQuoteNetwork();
      BeanUtils.copyProperties(this, copy, "rfpQuoteNetworkId", "rfpQuoteNetworkPlans", "riders");
      if (rfpQuoteNetworkPlans != null) {
        for (RfpQuoteNetworkPlan netwPlan : rfpQuoteNetworkPlans) {
          RfpQuoteNetworkPlan netwPlanCopy = netwPlan.copy();
          netwPlanCopy.setRfpQuoteNetwork(copy);
          copy.getRfpQuoteNetworkPlans().add(netwPlanCopy);
        } 
      }
      if (riders != null) {
        copy.getRiders().addAll(riders);
      }
      return copy; 
    }
}
