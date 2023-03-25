package com.benrevo.data.persistence.entities;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.*;
import org.springframework.beans.BeanUtils;

@Entity
@Table(name = "rfp_quote_option")
public class RfpQuoteOption implements QuoteOption {
	@Id @GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column	(name = "rfp_quote_option_id")
	private Long rfpQuoteOptionId;

	@Column (name = "rfp_quote_option_name")
	private String rfpQuoteOptionName;

    @Column (name = "display_name")
    private String displayName;
	
    @ManyToOne(optional = false)
    @JoinColumn(name="rfp_quote_id")
	private RfpQuote rfpQuote;
	
	@Column (name = "matches_orig_rfp_option")
	private boolean matchesOrigRfpOption;

	@OneToMany(mappedBy = "rfpQuoteOption")
	private List<RfpQuoteOptionNetwork> rfpQuoteOptionNetworks = new ArrayList<RfpQuoteOptionNetwork>();

	@ManyToOne
	@JoinColumn(name="rfp_quote_version_id", referencedColumnName="rfp_quote_version_id", nullable=false)
	private RfpQuoteVersion rfpQuoteVersion;
	
	@Column (name = "final_selection")
	private boolean finalSelection;

	@JoinTable(name = "rider_rfp_quote_option",
			joinColumns = {@JoinColumn(name = "rfp_quote_option_id", referencedColumnName = "rfp_quote_option_id")},
			inverseJoinColumns = {@JoinColumn(name = "rider_id", referencedColumnName = "rider_id")})
	@ManyToMany
	private Set<Rider> selectedRiders = new HashSet<>();

	public RfpQuoteOption() { }
	
	public RfpQuoteOption(RfpQuote rfpQuote, String rfpQuoteOptionName, String displayName, boolean matchesOrigRfpOption) {
		this.rfpQuote = rfpQuote;
		this.rfpQuoteOptionName = rfpQuoteOptionName;
		this.displayName = displayName;
		this.matchesOrigRfpOption = matchesOrigRfpOption;
		this.rfpQuoteVersion = rfpQuote.getRfpQuoteVersion();
	}
	
	@Transient
	@Override
	public Long getOptionId() {
	    return rfpQuoteOptionId;
	}
	
	public Long getRfpQuoteOptionId() {
		return rfpQuoteOptionId;
	}

	public void setRfpQuoteOptionId(Long rfpQuoteOptionId) {
		this.rfpQuoteOptionId = rfpQuoteOptionId;
	}

    public String getRfpQuoteOptionName() {
		return rfpQuoteOptionName;
	}
    
    @Transient
	@Override
    public String getName() {
        return rfpQuoteOptionName;
    }

	public void setRfpQuoteOptionName(String rfpQuoteOptionName) {
		this.rfpQuoteOptionName = rfpQuoteOptionName;
	}

	@Override
    public RfpQuote getRfpQuote() {
		return rfpQuote;
	}

	public void setRfpQuote(RfpQuote rfpQuote) {
		this.rfpQuote = rfpQuote;
	}

	public boolean isMatchesOrigRfpOption() {
		return matchesOrigRfpOption;
	}

	public void setMatchesOrigRfpOption(boolean matchesOrigRfpOption) {
		this.matchesOrigRfpOption = matchesOrigRfpOption;
	}

	public List<RfpQuoteOptionNetwork> getRfpQuoteOptionNetworks() {
		return rfpQuoteOptionNetworks;
	}

	public RfpQuoteVersion getRfpQuoteVersion() {
		return rfpQuoteVersion;
	}

	public void setRfpQuoteVersion(RfpQuoteVersion rfpQuoteVersion) {
		this.rfpQuoteVersion = rfpQuoteVersion;
	}

	public boolean isFinalSelection() {
		return finalSelection;
	}

	public void setFinalSelection(boolean finalSelection) {
		this.finalSelection = finalSelection;
	}

	public Set<Rider> getSelectedRiders() {
		return selectedRiders;
	}

	public void setSelectedRiders(Set<Rider> riders) {
		this.selectedRiders = riders;
	}

    @Override
    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public RfpQuoteOption copy() {
	  RfpQuoteOption copy = new RfpQuoteOption();
      BeanUtils.copyProperties(this, copy, "rfpQuoteOptionId", "rfpQuoteOptionNetworks", "selectedRiders");
      if (rfpQuoteOptionNetworks != null) {
        for (RfpQuoteOptionNetwork optNetwork : rfpQuoteOptionNetworks) {
          RfpQuoteOptionNetwork optNetwCopy = optNetwork.copy();
          optNetwCopy.setRfpQuoteOption(copy);
          copy.getRfpQuoteOptionNetworks().add(optNetwCopy);
        } 
      }
      if (selectedRiders != null) {
        copy.getSelectedRiders().addAll(selectedRiders);
      }
      return copy; 
    }
}
