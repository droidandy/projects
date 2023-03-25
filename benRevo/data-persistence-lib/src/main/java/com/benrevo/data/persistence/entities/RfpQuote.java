package com.benrevo.data.persistence.entities;

import java.util.*;
import java.util.stream.Collectors;
import javax.persistence.*;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.annotations.Where;
import org.springframework.beans.BeanUtils;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.data.persistence.converter.type.QuoteTypeConverter;

@Entity
@Table(name = "rfp_quote")
public class RfpQuote {
	@Id @GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column	(name = "rfp_quote_id")
	private Long rfpQuoteId;

    @OneToOne
    @JoinColumn(name="rfp_submission_id", referencedColumnName="rfp_submission_id", nullable=false)
	private RfpSubmission rfpSubmission;

	@OneToOne
	@JoinColumn(name="rfp_quote_version_id", referencedColumnName="rfp_quote_version_id", nullable=false)
	private RfpQuoteVersion rfpQuoteVersion;

	@Column(name = "quote_type")
	@Convert(converter = QuoteTypeConverter.class)
	private QuoteType quoteType;

	@OneToMany(mappedBy = "rfpQuote")
	private List<RfpQuoteOption> rfpQuoteOptions = new ArrayList<RfpQuoteOption>();

	@OneToMany(mappedBy = "rfpQuote")
	private List<RfpQuoteNetwork> rfpQuoteNetworks = new ArrayList<RfpQuoteNetwork>();

	@Column (name = "latest")
	private boolean latest;

	//@Column (name = "disclaimer")
	//private String disclaimer;

	@OneToMany(mappedBy = "rfpQuote", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval=true)
	private List<RfpQuoteDisclaimer> disclaimers = new ArrayList<>();

	@Column (name = "updated")
	private Date updated;

	@Column(name = "rating_tiers")
	private Integer ratingTiers;

	@JoinTable(name = "rider_rfp_quote",
			joinColumns = {@JoinColumn(name = "rfp_quote_id", referencedColumnName = "rfp_quote_id")},
			inverseJoinColumns = {@JoinColumn(name = "rider_id", referencedColumnName = "rider_id")})
	@ManyToMany
	private Set<Rider> riders = new HashSet<>();

	@Column (name = "s3_key")
	private String s3Key;

	@Column (name = "viewed")
	private boolean viewed;

    @OneToMany(mappedBy="rfpQuote", fetch=FetchType.LAZY, cascade = CascadeType.REMOVE)
    @Where(clause="type='QUOTE'")
    private List<RfpQuoteAttribute> attributes = new ArrayList<>();

	public Long getRfpQuoteId() {
		return rfpQuoteId;
	}

	public void setRfpQuoteId(Long rfpQuoteId) {
		this.rfpQuoteId = rfpQuoteId;
	}

	public RfpSubmission getRfpSubmission() {
		return rfpSubmission;
	}

	public void setRfpSubmission(RfpSubmission rfpSubmission) {
		this.rfpSubmission = rfpSubmission;
	}

	public List<RfpQuoteOption> getRfpQuoteOptions() {
		return rfpQuoteOptions;
	}

	public List<RfpQuoteNetwork> getRfpQuoteNetworks() {
		return rfpQuoteNetworks;
	}

	public RfpQuoteVersion getRfpQuoteVersion() {
		return rfpQuoteVersion;
	}

	public void setRfpQuoteVersion(RfpQuoteVersion rfpQuoteVersion) {
		this.rfpQuoteVersion = rfpQuoteVersion;
	}

	public QuoteType getQuoteType() {
		return quoteType;
	}

	public void setQuoteType(QuoteType quoteType) {
		this.quoteType = quoteType;
	}
	
	public boolean isLatest() {
		return latest;
	}

	public void setLatest(boolean latest) {
		this.latest = latest;
	}

	@Transient
	public String getDisclaimer() {
	    if (disclaimers.size() == 0) {
	        return null;
	    }
	    
	    if (disclaimers.size() == 1) {
            return disclaimers.get(0).getText();
        }
	    
		return disclaimers.stream()
		        .map(RfpQuoteDisclaimer::getText)
		        .collect(Collectors.joining(" &lt;br/&gt; &lt;br/&gt; "));
	}

	@Transient
	public void setDisclaimer(String text) {
		disclaimers.clear();
		addDisclaimer(null, text);
	}

	@Transient
	public void addDisclaimer(String type, String text) {
		if (StringUtils.isNotEmpty(text)) {
			disclaimers.add(new RfpQuoteDisclaimer(this, type, text));
		}
	}

	public Set<Rider> getRiders() {
		return riders;
	}

	public void setRiders(Set<Rider> riders) {
		this.riders = riders;
	}

	public Date getUpdated() {
		return updated;
	}

	public void setUpdated(Date updated) {
		this.updated = updated;
	}

	public Integer getRatingTiers() {
		return ratingTiers;
	}

	public void setRatingTiers(Integer ratingTiers) {
		this.ratingTiers = ratingTiers;
	}

	public String getS3Key() {
		return s3Key;
	}

	public void setS3Key(String fileName) {
		this.s3Key = fileName;
	}

	public boolean isViewed() {
		return viewed;
	}

	public void setViewed(boolean viewed) {
		this.viewed = viewed;
	}

    public List<RfpQuoteAttribute> getAttributes() {
        return attributes;
    }

    public void setAttributes(
        List<RfpQuoteAttribute> attributes) {
        this.attributes = attributes;
    }

    public List<RfpQuoteDisclaimer> getDisclaimers() {
        return disclaimers;
    }

    public void setDisclaimers(List<RfpQuoteDisclaimer> disclaimers) {
        this.disclaimers = disclaimers;
    }

    public RfpQuote copy() {
	  RfpQuote copy = new RfpQuote();
      BeanUtils.copyProperties(this, copy, "rfpQuoteId", "rfpQuoteNetworks",
          "rfpQuoteOptions", "riders", "attributes", "disclaimers");
      
      Map<Long, RfpQuoteNetwork> rfpQuoteNetworkId2Copy = new HashMap<>();
      Map<Long, RfpQuoteNetworkPlan> rfpQuoteNetworkPlanId2Copy = new HashMap<>();
      if (rfpQuoteNetworks != null) {
        for (RfpQuoteNetwork qNetw : rfpQuoteNetworks) {
          RfpQuoteNetwork qNetwCopy = qNetw.copy();
          qNetwCopy.setRfpQuote(copy);
          copy.getRfpQuoteNetworks().add(qNetwCopy);
          
          rfpQuoteNetworkId2Copy.put(qNetw.getRfpQuoteNetworkId(), qNetwCopy);
          
          for (int i = 0; i < qNetw.getRfpQuoteNetworkPlans().size(); i++) {
            rfpQuoteNetworkPlanId2Copy.put(
                qNetw.getRfpQuoteNetworkPlans().get(i).getRfpQuoteNetworkPlanId(), 
                qNetwCopy.getRfpQuoteNetworkPlans().get(i));
          }        
        } 
      }
      if (rfpQuoteOptions != null) {
        for (RfpQuoteOption option : rfpQuoteOptions) {
          RfpQuoteOption optCopy = option.copy();
          optCopy.setRfpQuote(copy);
          copy.getRfpQuoteOptions().add(optCopy);
          
          for (RfpQuoteOptionNetwork rfpQuoteNetwork : optCopy.getRfpQuoteOptionNetworks()) {
            RfpQuoteNetwork netwCopy = rfpQuoteNetworkId2Copy.get(
                rfpQuoteNetwork.getRfpQuoteNetwork().getRfpQuoteNetworkId());
            rfpQuoteNetwork.setRfpQuoteNetwork(netwCopy);
            
            if (rfpQuoteNetwork.getSelectedRfpQuoteNetworkPlan() != null) {
              RfpQuoteNetworkPlan netwPlanCopy = rfpQuoteNetworkPlanId2Copy.get(
                  rfpQuoteNetwork.getSelectedRfpQuoteNetworkPlan().getRfpQuoteNetworkPlanId());
              rfpQuoteNetwork.setSelectedRfpQuoteNetworkPlan(netwPlanCopy);
            }
            
            if (rfpQuoteNetwork.getSelectedRfpQuoteNetworkRxPlan() != null) {
              RfpQuoteNetworkPlan netwPlanCopy = rfpQuoteNetworkPlanId2Copy.get(
                  rfpQuoteNetwork.getSelectedRfpQuoteNetworkRxPlan().getRfpQuoteNetworkPlanId());
              rfpQuoteNetwork.setSelectedRfpQuoteNetworkRxPlan(netwPlanCopy);
            }

              if (rfpQuoteNetwork.getSelectedSecondRfpQuoteNetworkPlan() != null) {
                  RfpQuoteNetworkPlan netwPlanCopy = rfpQuoteNetworkPlanId2Copy.get(
                      rfpQuoteNetwork.getSelectedSecondRfpQuoteNetworkPlan().getRfpQuoteNetworkPlanId());
                  rfpQuoteNetwork.setSelectedSecondRfpQuoteNetworkPlan(netwPlanCopy);
              }

              if (rfpQuoteNetwork.getSelectedSecondRfpQuoteNetworkRxPlan() != null) {
                  RfpQuoteNetworkPlan netwPlanCopy = rfpQuoteNetworkPlanId2Copy.get(
                      rfpQuoteNetwork.getSelectedSecondRfpQuoteNetworkRxPlan().getRfpQuoteNetworkPlanId());
                  rfpQuoteNetwork.setSelectedSecondRfpQuoteNetworkRxPlan(netwPlanCopy);
              }
          }
        } 
      }
      if (riders != null) {
        copy.getRiders().addAll(riders);
      }

      if(attributes != null){
          for(RfpQuoteAttribute attribute : attributes) {
              RfpQuoteAttribute attributeCopy = attribute.copy();
              attributeCopy.setRfpQuote(copy);
              copy.getAttributes().add(attributeCopy);
          }
      }
      
      if(disclaimers!= null){
          for(RfpQuoteDisclaimer disclaimer : disclaimers) {
              copy.addDisclaimer(disclaimer.getType(), disclaimer.getText());
          }
      }
      
      return copy; 
    }
}
