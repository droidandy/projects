package com.benrevo.data.persistence.entities;

import com.benrevo.common.dto.ClientDto;
import com.benrevo.common.enums.AttributeName;
import com.benrevo.common.enums.ClientState;
import com.benrevo.common.enums.PersonType;
import com.benrevo.common.params.ClientParams;
import com.benrevo.common.util.DateHelper;

import javax.persistence.*;
import org.hibernate.annotations.Where;
import org.springframework.beans.BeanUtils;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "client")
public class Client {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column	(name = "client_id")
	private Long clientId;
	
	@Column (name = "client_name", nullable = false)
	private String clientName;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "broker_id", nullable = false)
	private Broker broker;

	@OrderBy("id DESC")
	@OneToMany(mappedBy = "client", fetch = FetchType.EAGER, cascade = CascadeType.REMOVE)
	private List<ClientTeam> clientTeamList;

	@Column	(name = "employee_count")
	private Long employeeCount;

	@Column	(name = "eligible_employee_count")
	private Long eligibleEmployees;
	
	@Column	(name = "participating_employees")
	private Long participatingEmployees;

	@Column (name = "sic_code")
	private String sicCode;

	@Column (name = "address")
	private String address;

	@Column (name = "address2")
	private String address2;

	@Column (name = "city")
	private String city;

	@Column (name = "state")
	private String state;

	@Column (name = "zip")
	private String zip;

	@Column (name = "image")
	private String image;

	@Column (name = "website")
	private String website;

	@Column (name = "effective_date")
	private Date effectiveDate;

	@Column	(name = "minimum_hours")
	private Long minimumHours;
	
	@Column (name = "domestic_partner")
	private String domesticPartner;

	@Column (name = "due_date")
	private Date dueDate;

	@Column (name = "last_visited")
	private Date lastVisited;

	@Column (name = "policy_number")
	private String policyNumber;

	@Column (name = "date_questionnaire_completed")
	private Date dateQuestionnaireCompleted;

	@Column (name = "contact_name")
	private String contactName;

	@Column (name = "contact_title")
	private String contactTitle;

	@Column (name = "contact_address")
	private String contactAddress;

	@Column (name = "contact_city")
	private String contactCity;

	@Column (name = "contact_state")
	private String contactState;

	@Column (name = "contact_zip")
	private String contactZip;

	@Column (name = "contact_phone")
	private String contactPhone;

	@Column (name = "contact_fax")
	private String contactFax;

	@Column (name = "contact_email")
	private String contactEmail;

	@Column (name = "business_type")
	private String businessType;

	@Column (name = "org_type")
	private String orgType;

	@Column (name = "fed_tax_id")
	private String fedTaxId;

	@Column (name = "client_state")
	@Enumerated(EnumType.STRING)
	private ClientState clientState;

	@Column (name = "members_count")
	private Integer membersCount;

	@Column (name = "retirees_count")
	private Integer retireesCount;
	
	@Column (name = "cobra_count")
	private Integer cobraCount;

	@Column(name = "out_to_bid_reason")
	private String outToBidReason;

	@OneToMany(mappedBy = "client", fetch = FetchType.LAZY)
	private List<ClientPlan> clientPlans = new ArrayList<>();

	@Column(name = "predominant_county")
	private String predominantCounty;

	@Column(name = "average_age")
	private Float averageAge;
	
	@Column(name = "date_form_submitted")
	private Date dateFormSubmitted;

	@Column(name = "date_quote_option_submitted")
	private Date dateQuoteOptionSubmitted;

	@Column	(name = "archived")
	private boolean archived;
	
	@Column (name = "declined_outside")
	private boolean declinedOutside = true;

    @Column (name = "submitted_rfp_separately")
    private boolean submittedRfpSeparately = false;

    @Column (name = "carrier_owned")
    private boolean carrierOwned = false;

    @Column(name = "dba")
    private String dba;

	@OneToMany(mappedBy = "client", fetch=FetchType.LAZY, cascade = CascadeType.REMOVE)
	@Where(clause="type='CLIENT'")
	private List<ClientAttribute> attributes = new ArrayList<>();

	@OneToMany(mappedBy = "client", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	private List<ClientPersonRelation> persons = new ArrayList<>();
	
    @Column(name = "client_token")
    private String clientToken;
	
	public Integer getMembersCount() {
		return membersCount;
	}

	public void setMembersCount(Integer membersCount) {
		this.membersCount = membersCount;
	}

	public Integer getRetireesCount() {
		return retireesCount;
	}

	public void setRetireesCount(Integer retireesCount) {
		this.retireesCount = retireesCount;
	}

	public Integer getCobraCount() {
		return cobraCount;
	}

	public void setCobraCount(Integer cobraCount) {
		this.cobraCount = cobraCount;
	}

	public Long getClientId() {
		return clientId;
	}

	public void setClientId(Long clientId) {
		this.clientId = clientId;
	}

	public String getClientName() {
		return clientName;
	}

	public void setClientName(String clientName) {
		this.clientName = clientName;
	}

	public Broker getBroker() {
		return broker;
	}

	public void setBroker(Broker broker) {
		this.broker = broker;
	}

	public List<ClientTeam> getClientTeamList() {
		return clientTeamList;
	}

	public void setClientTeamList(List<ClientTeam> clientTeamList) {
		this.clientTeamList = clientTeamList;
	}

	public Long getEmployeeCount() {
		return employeeCount;
	}

	public void setEmployeeCount(Long employeeCount) {
		this.employeeCount = employeeCount;
	}

	public Long getParticipatingEmployees() {
		return participatingEmployees;
	}

	public void setParticipatingEmployees(Long participatingEmployees) {
		this.participatingEmployees = participatingEmployees;
	}

	public String getSicCode() {
		return sicCode;
	}

	public void setSicCode(String sicCode) {
		this.sicCode = sicCode;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getAddress2() {
		return address2;
	}

	public void setAddress2(String address2) {
		this.address2 = address2;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getZip() {
		return zip;
	}

	public void setZip(String zip) {
		this.zip = zip;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public String getWebsite() {
		return website;
	}

	public void setWebsite(String website) {
		this.website = website;
	}

	public Date getEffectiveDate() {
		return effectiveDate;
	}

	public void setEffectiveDate(Date effectiveDate) {
		this.effectiveDate = effectiveDate;
	}
	
	@Transient
	public int getEffectiveYear() {
	    Calendar cal = Calendar.getInstance();
	    if (effectiveDate != null) {
	        cal.setTime(effectiveDate);
        }
	    return cal.get(Calendar.YEAR);
    }

	public Long getMinimumHours() {
		return minimumHours;
	}

	public void setMinimumHours(Long minimumHours) {
		this.minimumHours = minimumHours;
	}

	public String getDomesticPartner() {
		return domesticPartner;
	}

	public void setDomesticPartner(String domesticPartner) {
		this.domesticPartner = domesticPartner;
	}

	public Date getDueDate() {
		return dueDate;
	}

	public void setDueDate(Date dueDate) {
		this.dueDate = dueDate;
	}

	public Date getLastVisited() {
		return lastVisited;
	}

	public void setLastVisited(Date lastVisited) {
		this.lastVisited = lastVisited;
	}

	public String getPolicyNumber() {
		return policyNumber;
	}

	public void setPolicyNumber(String policyNumber) {
		this.policyNumber = policyNumber;
	}

	public Date getDateQuestionnaireCompleted() {
		return dateQuestionnaireCompleted;
	}

	public void setDateQuestionnaireCompleted(Date dateQuestionnaireCompleted) {
		this.dateQuestionnaireCompleted = dateQuestionnaireCompleted;
	}

	public String getContactName() {
		return contactName;
	}

	public void setContactName(String contactName) {
		this.contactName = contactName;
	}

	public String getContactTitle() {
		return contactTitle;
	}

	public void setContactTitle(String contactTitle) {
		this.contactTitle = contactTitle;
	}

	public String getContactAddress() {
		return contactAddress;
	}

	public void setContactAddress(String contactAddress) {
		this.contactAddress = contactAddress;
	}

	public String getContactCity() {
		return contactCity;
	}

	public void setContactCity(String contactCity) {
		this.contactCity = contactCity;
	}

	public String getContactState() {
		return contactState;
	}

	public void setContactState(String contactState) {
		this.contactState = contactState;
	}

	public String getContactZip() {
		return contactZip;
	}

	public void setContactZip(String contactZip) {
		this.contactZip = contactZip;
	}

	public String getContactPhone() {
		return contactPhone;
	}

	public void setContactPhone(String contactPhone) {
		this.contactPhone = contactPhone;
	}

	public String getContactFax() {
		return contactFax;
	}

	public void setContactFax(String contactFax) {
		this.contactFax = contactFax;
	}

	public String getContactEmail() {
		return contactEmail;
	}

	public void setContactEmail(String contactEmail) {
		this.contactEmail = contactEmail;
	}

	public String getBusinessType() {
		return businessType;
	}

	public void setBusinessType(String businessType) {
		this.businessType = businessType;
	}

	public String getOrgType() {
		return orgType;
	}

	public void setOrgType(String orgType) {
		this.orgType = orgType;
	}

	public String getFedTaxId() {
		return fedTaxId;
	}

	public void setFedTaxId(String fedTaxId) {
		this.fedTaxId = fedTaxId;
	}

	public ClientState getClientState() {
		return clientState;
	}

	public void setClientState(ClientState clientState) {
		this.clientState = clientState;
	}

	public String getOutToBidReason() {
		return outToBidReason;
	}

	public void setOutToBidReason(String outToBidReason) {
		this.outToBidReason = outToBidReason;
	}

	public List<ClientPlan> getClientPlans() {
		return clientPlans;
	}

	public void setClientPlans(List<ClientPlan> clientPlans) {
		this.clientPlans = clientPlans;
	}

	public Long getEligibleEmployees() {
		return eligibleEmployees;
	}

	public void setEligibleEmployees(Long eligibleEmployees) {
		this.eligibleEmployees = eligibleEmployees;
	}

	public String getPredominantCounty() {
		return predominantCounty;
	}

	public void setPredominantCounty(String predominantCounty) {
		this.predominantCounty = predominantCounty;
	}

	public Float getAverageAge() {
		return averageAge;
	}

	public void setAverageAge(Float averageAge) {
		this.averageAge = averageAge;
	}

	public Date getDateFormSubmitted() {
		return dateFormSubmitted;
	}

	public void setDateFormSubmitted(Date dateFormSubmitted) {
		this.dateFormSubmitted = dateFormSubmitted;
	}

	public Date getDateQuoteOptionSubmitted() {
		return dateQuoteOptionSubmitted;
	}

	public void setDateQuoteOptionSubmitted(Date dateQuoteOptionSubmitted) {
		this.dateQuoteOptionSubmitted = dateQuoteOptionSubmitted;
	}

	public boolean isArchived() {
		return archived;
	}

	public void setArchived(boolean archived) {
		this.archived = archived;
	}

	public boolean isDeclinedOutside() {
		return declinedOutside;
	}

	public void setDeclinedOutside(boolean declinedOutside) {
		this.declinedOutside = declinedOutside;
	}

    public boolean isSubmittedRfpSeparately() {
        return submittedRfpSeparately;
    }

    public void setSubmittedRfpSeparately(boolean submittedRfpSeparately) {
        this.submittedRfpSeparately = submittedRfpSeparately;
    }

    public boolean isCarrierOwned() {
        return carrierOwned;
    }

    public String getDba() {
        return dba;
    }

    public void setDba(String dba) {
        this.dba = dba;
    }

    public void setCarrierOwned(boolean carrierOwned) {
        this.carrierOwned = carrierOwned;
    }

    public List<ClientAttribute> getAttributes() {
		return attributes;
	}

	public void setAttributes(List<ClientAttribute> attributes) {
		this.attributes = attributes;
	}

    public String getClientToken() {
        return clientToken;
    }

    public void setClientToken(String clientToken) {
        this.clientToken = clientToken;
    }

    public void updateWithClientParams(ClientParams params) {
		setClientName(params.getClientName());
		setEmployeeCount((long)params.getEmployeeCount());
		setSicCode(params.getSicCode());
		setAddress(params.getAddress());
		setAddress2(params.getComplementaryAddress());
		setCity(params.getCity());
		setState(params.getState());
		setZip(params.getZip());
		setWebsite(params.getWebsite());
		setEffectiveDate(new Date(params.getEffectiveDate().getTime()));
		setDueDate(new Date(params.getDueDate().getTime()));
		setMinimumHours((long)params.getMinimumHours());
		setParticipatingEmployees((long)params.getParticipatingEmployees());
		setDomesticPartner(params.getDomesticPartner());
	}

	public ClientDto toClientDto() {
		ClientDto result = new ClientDto();
    	result.setId(this.getClientId());
    	result.setBrokerId(this.getBroker().getBrokerId());
    	result.setClientName(this.getClientName());
    	result.setEmployeeCount(this.getEmployeeCount());
    	result.setEligibleEmployees(this.getEligibleEmployees());
    	result.setParticipatingEmployees(this.getParticipatingEmployees());
    	result.setSicCode(this.getSicCode());
    	result.setAddress(this.getAddress());
    	result.setAddressComplementary(this.getAddress2());
    	result.setCity(this.getCity());
    	result.setState(this.getState());
    	result.setZip(this.getZip());
    	result.setImageUrl(this.getImage());
    	result.setWebsite(this.getWebsite());
    	result.setMinimumHours(this.getMinimumHours());
    	result.setEffectiveDate(DateHelper.fromDateToString(this.getEffectiveDate()));
    	result.setDueDate(DateHelper.fromDateToString(this.getDueDate()));
    	result.setDomesticPartner(this.getDomesticPartner());
    	result.setLastVisited(DateHelper.fromDateToString(this.getLastVisited(), "MM/dd/yyyy HH:mm"));
		result.setPredominantCounty(getPredominantCounty());
		result.setAverageAge(getAverageAge());
		result.setCarrierOwned(this.carrierOwned);
		result.setDba(this.dba);
        result.setClientToken(this.clientToken);
    	return result;
	}
	
	@Deprecated // TODO process list of sales
	@Transient
    public String getSalesEmail() {
        List<Person> sales = getSales();
        if(!sales.isEmpty()) {
            return sales.get(0).getEmail();
        }
        return broker.getSalesEmail();
    }
	
	@Deprecated // TODO process list of sales
    @Transient
    public String getSalesFirstName() {
        List<Person> sales = getSales();
        if(!sales.isEmpty()) {
            return sales.get(0).getFirstName();
        }
        return broker.getSalesFirstName();
    }
	
	@Deprecated // TODO process list of sales
    @Transient
    public String getSalesFullName() {
        List<Person> sales = getSales();
        if(!sales.isEmpty()) {
            return sales.get(0).getFullName();
        }
        return broker.getSalesFullName();
    }
	
	@Transient
    public List<Person> getSales() {
        List<Person> sales = new ArrayList<>();
        PersonType persType = null;
        if(getAttributes().stream().anyMatch(a -> a.getName().equals(AttributeName.RENEWAL))) {
            persType = PersonType.SALES_RENEWAL;
        } else {
            persType = PersonType.SALES;
        }
        if(!persons.isEmpty()) {
            for(ClientPersonRelation cpr : persons) {
                if(cpr.getPerson().getType() == persType) {
                    sales.add(cpr.getPerson());
                }
            }
        }
        // return broker sales as default
        return !sales.isEmpty() ? sales : broker.getSales(persType);
    }
	
	@Transient
    public List<Person> getPresales() {
        List<Person> presales = new ArrayList<>();
        if(!persons.isEmpty()) {
            for(ClientPersonRelation cpr : persons) {
                if(cpr.getPerson().getType() == PersonType.PRESALES) {
                    presales.add(cpr.getPerson());
                }
            }
        }
        // return broker presales as default
        return !presales.isEmpty() ? presales : broker.getPresales();
    }
	
	@Deprecated // TODO process list of presales
    @Transient
    public String getPresalesFullName() {
        List<Person> presales = getPresales();
        if(!presales.isEmpty()) {
            return presales.get(0).getFullName();
        }
        return broker.getPresalesFullName();
    }
	
	@Deprecated // TODO process list of presales
    @Transient
    public String getPresalesEmail() {
        List<Person> presales = getPresales();
        if(!presales.isEmpty()) {
            return presales.get(0).getEmail();
        }
        return broker.getPresalesEmail();
    }
	
	@Deprecated // TODO process list of presales
    @Transient
    public String getPresalesFirstName() {
        List<Person> presales = getPresales();
        if(!presales.isEmpty()) {
            return presales.get(0).getFirstName();
        }
        return broker.getPresalesFirstName();
    }
	
	@Transient
    public String getSpecialtyEmail() {
	    PersonType persType = null;
        if(getAttributes().stream().anyMatch(a -> a.getName().equals(AttributeName.RENEWAL))) {
            persType = PersonType.SPECIALTY_RENEWAL;
        } else {
            persType = PersonType.SPECIALTY;
        }
        if(!persons.isEmpty()) {
            for(ClientPersonRelation cpr : persons) {
                if(cpr.getPerson().getType() == persType) {
                    return cpr.getPerson().getEmail();
                }
            }
        }
        return broker.getSpecialtyEmail(persType);
    }

	public Client copy() {
	  Client copy = new Client();
      BeanUtils.copyProperties(this, copy, "clientId", "clientToken",
          "clientTeamList", "clientPlans", "attributes", "persons");

      if (clientTeamList != null) {
          copy.setClientTeamList(new ArrayList<>());
        for (ClientTeam ct : clientTeamList) {
          ClientTeam ctCopy = ct.copy();
          ctCopy.setClient(copy);
          copy.getClientTeamList().add(ctCopy);
        } 
      }
      if (clientPlans != null) {
        for (ClientPlan cp : clientPlans) {
          ClientPlan cpCopy = cp.copy();
          cpCopy.setClient(copy);
          copy.getClientPlans().add(cpCopy);
        } 
      }
      if (attributes != null) {
        for (ClientAttribute attr : attributes) {
          ClientAttribute attrCopy = attr.copy();
          attrCopy.setClient(copy);
          copy.getAttributes().add(attrCopy);
        } 
      }
      if (persons != null) {
        for(ClientPersonRelation pers : persons) {
            copy.persons.add(new ClientPersonRelation(copy, pers.getPerson()));
        }
      }
      return copy; 
  }
}
