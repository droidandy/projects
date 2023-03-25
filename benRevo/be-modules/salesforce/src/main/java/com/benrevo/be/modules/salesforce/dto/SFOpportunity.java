package com.benrevo.be.modules.salesforce.dto;

import com.benrevo.be.modules.salesforce.annotation.SFLookup;
import com.benrevo.be.modules.salesforce.annotation.SFLookup.SFCondition;
import com.benrevo.be.modules.salesforce.annotation.SFLookup.SFField;
import com.benrevo.be.modules.salesforce.enums.OpportunityType;
import com.benrevo.be.modules.salesforce.enums.StageType;
import com.benrevo.common.enums.CarrierType;
import com.fasterxml.jackson.annotation.*;

import java.util.Date;
import java.util.Optional;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;

import static com.benrevo.be.modules.salesforce.annotation.SFLookup.OverrideType.ONLY_IF_CHANGED;
import static com.benrevo.be.modules.salesforce.annotation.SFLookup.OverrideType.ONLY_IF_NULL;
import static com.benrevo.be.modules.salesforce.enums.SalesforceObject.*;
import static com.fasterxml.jackson.annotation.JsonFormat.Shape.STRING;
import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL;


/**
 * Created by ebrandell on 11/9/17 at 11:47 AM.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(NON_NULL)
@SFLookup({
    @SFField(
        property = "id",
        columns = "id",
        sobject = Opportunity,
        conditions = {
            @SFCondition(key = "name", op = "=", values = {"currentName","name"}),
            @SFCondition(key = "carrier__c", op = "=", values = "carrier"),
            @SFCondition(key = "test__c", op = "=", values = "test")
        }
    ),
    @SFField(
        property = "stageName",
        columns = {"id","stagename"},
        sobject = Opportunity,
        conditions = {
            @SFCondition(key = "name", op = "=", values = {"currentName","name"}),
            @SFCondition(key = "carrier__c", op = "=", values = "carrier"),
            @SFCondition(key = "test__c", op = "=", values = "test")
        },
        jsonPath = "$.records[0].StageName",
        override = ONLY_IF_NULL
    ),
    @SFField(
        property = "accountId",
        columns = "id",
        sobject = Account,
        conditions = {
            @SFCondition(key = "name", op = "=", values = {"currentName","name"}),
            @SFCondition(key = "type", op = "=", values = "Employer", lookup = false),
            @SFCondition(key = "carrier__c", op = "=", values = "carrier"),
            @SFCondition(key = "test__c", op = "=", values = "test")
        }
    ),
    @SFField(
        property = "brokerageFirm",
        columns = "id",
        sobject = Account,
        conditions = {
            @SFCondition(key = "name", op = "=", values = {"brokerageFirmName","brokerageFirm"}),
            @SFCondition(key = "type", op = "=", values = "Brokerage Firm", lookup = false),
            @SFCondition(key = "carrier__c", op = "=", values = "carrier"),
            @SFCondition(key = "test__c", op = "=", values = "test")
        },
        override = ONLY_IF_CHANGED
    ),
    @SFField(
        property = "carrierContact",
        columns = {"id","email"},
        sobject = Contact,
        conditions = {
            @SFCondition(key = "email", op = "=", values = "carrierContact"),
        },
        override = ONLY_IF_CHANGED
    )
})
public class SFOpportunity extends SFBase {

    // Standard fields
    @JsonIgnore
    String id;
    @JsonProperty("AccountId")
    String accountId;
    @JsonProperty("Amount")
    Double amount;
    @JsonProperty("CloseDate")
    @JsonFormat(shape = STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    Date closeDate;
    @JsonProperty("CreatedById")
    String createdById;
    @JsonProperty("Description")
    String description;
    @JsonProperty("ExpectedRevenue")
    String expectedRevenue;
    @JsonProperty("ForecastCategoryName")
    String forecastCategory;
    @JsonProperty("LastModifiedById")
    String lastModifiedById;
    @JsonProperty("LeadSource")
    String leadSource;
    @JsonProperty("NextStep")
    String nextStep;
    @JsonProperty("Owner")
    String owner;
    @JsonProperty("Pricebook2Id")
    String pricebookId;
    @JsonProperty("CampaignId")
    String campaignId;
    @JsonProperty("IsPrivate")
    String isPrivate;
    @JsonProperty("Probability")
    Double probability;
    @JsonProperty("TotalOpportunityQuantity")
    Double totalOpportunityQuantity;
    @JsonProperty("StageName")
    String stageName;
    @JsonProperty("SyncedQuoteId")
    String syncedQuoteId;
    @JsonProperty("Type")
    OpportunityType type;

    // Custom fields
    @JsonProperty("Anthem_Medical_plans_quoted__c")
    String anthemMedicalPlansQuoted;
    @JsonProperty("Brokerage_firm__c")
    String brokerageFirm;
    @JsonIgnore
    String brokerageFirmName;
    @JsonProperty("Broker_Demo_Conducted__c")
    @JsonFormat(shape = STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    Date brokerDemoConducted;
    @JsonProperty("Broker_Notes__c")
    String brokerNotes;
    @JsonProperty("Carrier_Contact__c")
    String carrierContact;
    @JsonProperty("Carrier_notes__c")
    String carrierNotes;
    @JsonProperty("Clear_Value__c")
    Boolean clearValueQuoteIssued;
    @JsonProperty("CV_Disqualification_Reason__c")
    String cvDisqualificationReason;
    @JsonProperty("CV_vs_current__c")
    Double cvVsCurrentIssued;
    @JsonProperty("Effective_date__c")
    @JsonFormat(shape = STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    Date effectiveDate;
    @JsonProperty("Elligible_Employees__c")
    Long eligibleEmployees;
    @JsonProperty("General_Agent__c")
    String generalAgent;
    @JsonProperty("Incumbent_dental_carrier__c")
    String incumbentDentalCarrier;
    @JsonProperty("Incumbent_medical_carrier__c")
    String incumbentMedicalCarrier;
    @JsonProperty("Incumbent_vision_carrier__c")
    String incumbentVisionCarrier;
    @JsonProperty("Participating_employees__c")
    Long participatingEmployees;
    @JsonProperty("Products_quoted__c")
    String productsQuoted;
    @JsonProperty("RFP_submitted__c")
    @JsonFormat(shape = STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    Date rfpSubmitted;
    @JsonProperty("Standard_vs_Current__c")
    Double standardVsCurrent;
    @JsonProperty("Viewed_online_by_broker__c")
    Boolean viewedByBroker;

    public SFOpportunity() {}

    @JsonIgnore
    private SFOpportunity(Builder builder) {
        setsObjectType(Opportunity);
        setId(builder.id);
        setAccountId(builder.accountId);
        setAmount(builder.amount);
        setCloseDate(builder.closeDate);
        setCreatedById(builder.createdById);
        setDescription(builder.description);
        setExpectedRevenue(builder.expectedRevenue);
        setForecastCategory(builder.forecastCategory);
        setLastModifiedById(builder.lastModifiedById);
        setLeadSource(builder.leadSource);
        setNextStep(builder.nextStep);
        setCurrentName(builder.currentName);
        setName(builder.name);
        setOwner(builder.owner);
        setPricebookId(builder.pricebookId);
        setCampaignId(builder.campaignId);
        setIsPrivate(builder.isPrivate);
        setProbability(builder.probability);
        setTotalOpportunityQuantity(builder.totalOpportunityQuantity);
        setStageName(builder.stageName);
        setSyncedQuoteId(builder.syncedQuoteId);
        setType(builder.type);
        setAnthemMedicalPlansQuoted(builder.anthemMedicalPlansQuoted);
        setBrokerageFirm(builder.brokerageFirm);
        setBrokerageFirmName(builder.brokerageFirmName);
        setBrokerDemoConducted(builder.brokerDemoConducted);
        setBrokerNotes(builder.brokerNotes);
        setCarrierContact(builder.carrierContact);
        setCarrierNotes(builder.carrierNotes);
        setCarrier(builder.carrier);
        setClearValueQuoteIssued(builder.clearValueQuoteIssued);
        setCvVsCurrentIssued(builder.cvVsCurrentIssued);
        setCvDisqualificationReason(builder.cvDisqualificationReason);
        setEffectiveDate(builder.effectiveDate);
        setEligibleEmployees(builder.eligibleEmployees);
        setGeneralAgent(builder.generalAgent);
        setIncumbentDentalCarrier(builder.incumbentDentalCarrier);
        setIncumbentMedicalCarrier(builder.incumbentMedicalCarrier);
        setIncumbentVisionCarrier(builder.incumbentVisionCarrier);
        setParticipatingEmployees(builder.participatingEmployees);
        setProductsQuoted(builder.productsQuoted);
        setRfpSubmitted(builder.rfpSubmitted);
        setStandardVsCurrent(builder.standardVsCurrent);
        setTest(builder.test);
        setViewedByBroker(builder.viewedByBroker);
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getAccountId() {
        return accountId;
    }

    public void setAccountId(String accountId) {
        this.accountId = accountId;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Date getCloseDate() {
        return closeDate;
    }

    public void setCloseDate(Date closeDate) {
        this.closeDate = closeDate;
    }

    public String getCreatedById() {
        return createdById;
    }

    public void setCreatedById(String createdById) {
        this.createdById = createdById;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getExpectedRevenue() {
        return expectedRevenue;
    }

    public void setExpectedRevenue(String expectedRevenue) {
        this.expectedRevenue = expectedRevenue;
    }

    public String getForecastCategory() {
        return forecastCategory;
    }

    public void setForecastCategory(String forecastCategory) {
        this.forecastCategory = forecastCategory;
    }

    public String getLastModifiedById() {
        return lastModifiedById;
    }

    public void setLastModifiedById(String lastModifiedById) {
        this.lastModifiedById = lastModifiedById;
    }

    public String getLeadSource() {
        return leadSource;
    }

    public void setLeadSource(String leadSource) {
        this.leadSource = leadSource;
    }

    public String getNextStep() {
        return nextStep;
    }

    public void setNextStep(String nextStep) {
        this.nextStep = nextStep;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public String getPricebookId() {
        return pricebookId;
    }

    public void setPricebookId(String pricebookId) {
        this.pricebookId = pricebookId;
    }

    public String getCampaignId() {
        return campaignId;
    }

    public void setCampaignId(String campaignId) {
        this.campaignId = campaignId;
    }

    public String getIsPrivate() {
        return isPrivate;
    }

    public void setIsPrivate(String isPrivate) {
        this.isPrivate = isPrivate;
    }

    public Double getProbability() {
        return probability;
    }

    public void setProbability(Double probability) {
        this.probability = probability;
    }

    public Double getTotalOpportunityQuantity() {
        return totalOpportunityQuantity;
    }

    public void setTotalOpportunityQuantity(Double totalOpportunityQuantity) {
        this.totalOpportunityQuantity = totalOpportunityQuantity;
    }

    public StageType getStageName() {
        return stageName != null ? StageType.fromName(stageName) : StageType.RfpStarted;
    }

    public void setStageName(StageType stageName) {
        this.stageName = Optional.ofNullable(stageName).map(StageType::toString).orElse(null);
    }

    public String getSyncedQuoteId() {
        return syncedQuoteId;
    }

    public void setSyncedQuoteId(String syncedQuoteId) {
        this.syncedQuoteId = syncedQuoteId;
    }

    public OpportunityType getType() {
        return type;
    }

    public void setType(OpportunityType type) {
        this.type = type;
    }

    public String getAnthemMedicalPlansQuoted() {
        return anthemMedicalPlansQuoted;
    }

    public void setAnthemMedicalPlansQuoted(String anthemMedicalPlansQuoted) {
        this.anthemMedicalPlansQuoted = anthemMedicalPlansQuoted;
    }

    public String getBrokerageFirm() {
        return brokerageFirm;
    }

    public void setBrokerageFirm(String brokerageFirm) {
        this.brokerageFirm = brokerageFirm;
    }

    public String getBrokerageFirmName() {
        return brokerageFirmName;
    }

    public void setBrokerageFirmName(String brokerageFirmName) {
        this.brokerageFirmName = brokerageFirmName;
    }

    public Date getBrokerDemoConducted() {
        return brokerDemoConducted;
    }

    public void setBrokerDemoConducted(Date brokerDemoConducted) {
        this.brokerDemoConducted = brokerDemoConducted;
    }

    public String getBrokerNotes() {
        return brokerNotes;
    }

    public void setBrokerNotes(String brokerNotes) {
        this.brokerNotes = brokerNotes;
    }

    public String getCarrierContact() {
        return carrierContact;
    }

    public void setCarrierContact(String carrierContact) {
        this.carrierContact = carrierContact;
    }

    public String getCarrierNotes() {
        return carrierNotes;
    }

    public void setCarrierNotes(String carrierNotes) {
        this.carrierNotes = carrierNotes;
    }

    public CarrierType getCarrier() {
        return carrier;
    }

    public void setCarrier(CarrierType carrier) {
        this.carrier = carrier;
    }

    public Boolean getClearValueQuoteIssued() {
        return clearValueQuoteIssued;
    }

    public void setClearValueQuoteIssued(Boolean clearValueQuoteIssued) {
        this.clearValueQuoteIssued = clearValueQuoteIssued;
    }

    public String getCvDisqualificationReason() {
        return cvDisqualificationReason;
    }

    public void setCvDisqualificationReason(String cvDisqualificationReason) {
        this.cvDisqualificationReason = cvDisqualificationReason;
    }

    public Double getCvVsCurrentIssued() {
        return cvVsCurrentIssued;
    }

    public void setCvVsCurrentIssued(Double cvVsCurrentIssued) {
        this.cvVsCurrentIssued = cvVsCurrentIssued;
    }

    public Date getEffectiveDate() {
        return effectiveDate;
    }

    public void setEffectiveDate(Date effectiveDate) {
        this.effectiveDate = effectiveDate;
    }

    public Long getEligibleEmployees() {
        return eligibleEmployees;
    }

    public void setEligibleEmployees(Long eligibleEmployees) {
        this.eligibleEmployees = eligibleEmployees;
    }

    public String getGeneralAgent() {
        return generalAgent;
    }

    public void setGeneralAgent(String generalAgent) {
        this.generalAgent = generalAgent;
    }

    public String getIncumbentDentalCarrier() {
        return incumbentDentalCarrier;
    }

    public void setIncumbentDentalCarrier(String incumbentDentalCarrier) {
        this.incumbentDentalCarrier = incumbentDentalCarrier;
    }

    public String getIncumbentMedicalCarrier() {
        return incumbentMedicalCarrier;
    }

    public void setIncumbentMedicalCarrier(String incumbentMedicalCarrier) {
        this.incumbentMedicalCarrier = incumbentMedicalCarrier;
    }

    public String getIncumbentVisionCarrier() {
        return incumbentVisionCarrier;
    }

    public void setIncumbentVisionCarrier(String incumbentVisionCarrier) {
        this.incumbentVisionCarrier = incumbentVisionCarrier;
    }

    public Long getParticipatingEmployees() {
        return participatingEmployees;
    }

    public void setParticipatingEmployees(Long participatingEmployees) {
        this.participatingEmployees = participatingEmployees;
    }

    public String getProductsQuoted() {
        return productsQuoted;
    }

    public void setProductsQuoted(String productsQuoted) {
        this.productsQuoted = productsQuoted;
    }

    public Date getRfpSubmitted() {
        return rfpSubmitted;
    }

    public void setRfpSubmitted(Date rfpSubmitted) {
        this.rfpSubmitted = rfpSubmitted;
    }

    public Double getStandardVsCurrent() {
        return standardVsCurrent;
    }

    public void setStandardVsCurrent(Double standardVsCurrent) {
        this.standardVsCurrent = standardVsCurrent;
    }

    public Boolean getViewedByBroker() {
        return viewedByBroker;
    }

    public void setViewedByBroker(Boolean viewedByBroker) {
        this.viewedByBroker = viewedByBroker;
    }

    public static final class Builder {

        private String id;
        private String accountId;
        private Double amount;
        private Date closeDate;
        private String createdById;
        private String description;
        private String expectedRevenue;
        private String forecastCategory;
        private String lastModifiedById;
        private String leadSource;
        private String nextStep;
        private String currentName;
        private String name;
        private String owner;
        private String pricebookId;
        private String campaignId;
        private String isPrivate;
        private Double probability;
        private Double totalOpportunityQuantity;
        private StageType stageName;
        private String syncedQuoteId;
        private OpportunityType type;
        private String anthemMedicalPlansQuoted;
        private String brokerageFirm;
        private String brokerageFirmName;
        private Date brokerDemoConducted;
        private String brokerNotes;
        private String carrierContact;
        private String carrierNotes;
        private CarrierType carrier;
        private Boolean clearValueQuoteIssued;
        private String cvDisqualificationReason;
        private Double cvVsCurrentIssued;
        private Date effectiveDate;
        private Long eligibleEmployees;
        private String generalAgent;
        private String incumbentDentalCarrier;
        private String incumbentMedicalCarrier;
        private String incumbentVisionCarrier;
        private Long participatingEmployees;
        private String productsQuoted;
        private Date rfpSubmitted;
        private Double standardVsCurrent;
        private Boolean test;
        private Boolean viewedByBroker;

        public Builder() {}

        public Builder withId(String val) {
            id = val;
            return this;
        }

        public Builder withAccountId(String val) {
            accountId = val;
            return this;
        }

        public Builder withAmount(Double val) {
            amount = val;
            return this;
        }

        public Builder withCloseDate(Date val) {
            closeDate = val;
            return this;
        }

        public Builder withCreatedById(String val) {
            createdById = val;
            return this;
        }

        public Builder withDescription(String val) {
            description = val;
            return this;
        }

        public Builder withExpectedRevenue(String val) {
            expectedRevenue = val;
            return this;
        }

        public Builder withForecastCategory(String val) {
            forecastCategory = val;
            return this;
        }

        public Builder withLastModifiedById(String val) {
            lastModifiedById = val;
            return this;
        }

        public Builder withLeadSource(String val) {
            leadSource = val;
            return this;
        }

        public Builder withNextStep(String val) {
            nextStep = val;
            return this;
        }

        public Builder withCurrentName(String val) {
            currentName = val;
            return this;
        }

        public Builder withName(String val) {
            name = val;
            return this;
        }

        public Builder withOwner(String val) {
            owner = val;
            return this;
        }

        public Builder withPricebookId(String val) {
            pricebookId = val;
            return this;
        }

        public Builder withCampaignId(String val) {
            campaignId = val;
            return this;
        }

        public Builder withIsPrivate(String val) {
            isPrivate = val;
            return this;
        }

        public Builder withProbability(Double val) {
            probability = val;
            return this;
        }

        public Builder withTotalOpportunityQuantity(Double val) {
            totalOpportunityQuantity = val;
            return this;
        }

        public Builder withStageName(StageType val) {
            stageName = val;
            return this;
        }

        public Builder withSyncedQuoteId(String val) {
            syncedQuoteId = val;
            return this;
        }

        public Builder withType(OpportunityType val) {
            type = val;
            return this;
        }

        public Builder withAnthemMedicalPlansQuoted(String val) {
            anthemMedicalPlansQuoted = val;
            return this;
        }

        public Builder withBrokerageFirm(String val) {
            brokerageFirm = val;
            return this;
        }

        public Builder withBrokerageFirmName(String val) {
            brokerageFirmName = val;
            return this;
        }

        public Builder withBrokerDemoConducted(Date val) {
            brokerDemoConducted = val;
            return this;
        }

        public Builder withBrokerNotes(String val) {
            brokerNotes = val;
            return this;
        }

        public Builder withCarrierContact(String val) {
            carrierContact = val;
            return this;
        }

        public Builder withCarrierNotes(String val) {
            carrierNotes = val;
            return this;
        }

        public Builder withCarrier(CarrierType val) {
            carrier = val;
            return this;
        }

        public Builder withClearValueQuoteIssued(Boolean val) {
            clearValueQuoteIssued = val;
            return this;
        }

        public Builder withCvDisqualificationReason(String val) {
            cvDisqualificationReason = val;
            return this;
        }

        public Builder withCvVsCurrentIssued(Double val) {
            cvVsCurrentIssued = val;
            return this;
        }

        public Builder withEffectiveDate(Date val) {
            effectiveDate = val;
            return this;
        }

        public Builder withEligibleEmployees(Long val) {
            eligibleEmployees = val;
            return this;
        }

        public Builder withGeneralAgent(String val) {
            generalAgent = val;
            return this;
        }

        public Builder withIncumbentDentalCarrier(String val) {
            incumbentDentalCarrier = val;
            return this;
        }

        public Builder withIncumbentMedicalCarrier(String val) {
            incumbentMedicalCarrier = val;
            return this;
        }

        public Builder withIncumbentVisionCarrier(String val) {
            incumbentVisionCarrier = val;
            return this;
        }

        public Builder withParticipatingEmployees(Long val) {
            participatingEmployees = val;
            return this;
        }

        public Builder withProductsQuoted(String val) {
            productsQuoted = val;
            return this;
        }

        public Builder withRfpSubmitted(Date val) {
            rfpSubmitted = val;
            return this;
        }

        public Builder withStandardVsCurrent(Double val) {
            standardVsCurrent = val;
            return this;
        }

        public Builder withTest(Boolean val) {
            test = val;
            return this;
        }

        public Builder withViewedByBroker(Boolean val) {
            viewedByBroker = val;
            return this;
        }

        public SFOpportunity build() {
            return new SFOpportunity(this);
        }
    }

    @Override
    public boolean equals(Object o) {
        if(this == o) { return true; }

        if(!(o instanceof SFOpportunity)) { return false; }

        SFOpportunity that = (SFOpportunity) o;

        return new EqualsBuilder()
            .append(getId(), that.getId())
            .append(getAccountId(), that.getAccountId())
            .append(getAmount(), that.getAmount())
            .append(getCloseDate(), that.getCloseDate())
            .append(getCreatedById(), that.getCreatedById())
            .append(getDescription(), that.getDescription())
            .append(getExpectedRevenue(), that.getExpectedRevenue())
            .append(getForecastCategory(), that.getForecastCategory())
            .append(getLastModifiedById(), that.getLastModifiedById())
            .append(getLeadSource(), that.getLeadSource())
            .append(getNextStep(), that.getNextStep())
            .append(getCurrentName(), that.getCurrentName())
            .append(getName(), that.getName())
            .append(getOwner(), that.getOwner())
            .append(getPricebookId(), that.getPricebookId())
            .append(getCampaignId(), that.getCampaignId())
            .append(getIsPrivate(), that.getIsPrivate())
            .append(getProbability(), that.getProbability())
            .append(getTotalOpportunityQuantity(), that.getTotalOpportunityQuantity())
            .append(getStageName(), that.getStageName())
            .append(getSyncedQuoteId(), that.getSyncedQuoteId())
            .append(getType(), that.getType())
            .append(getAnthemMedicalPlansQuoted(), that.getAnthemMedicalPlansQuoted())
            .append(getBrokerageFirm(), that.getBrokerageFirm())
            .append(getBrokerageFirmName(), that.getBrokerageFirmName())
            .append(getBrokerDemoConducted(), that.getBrokerDemoConducted())
            .append(getBrokerNotes(), that.getBrokerNotes())
            .append(getCarrierContact(), that.getCarrierContact())
            .append(getCarrierNotes(), that.getCarrierNotes())
            .append(getCarrier(), that.getCarrier())
            .append(getClearValueQuoteIssued(), that.getClearValueQuoteIssued())
            .append(getCvVsCurrentIssued(), that.getCvVsCurrentIssued())
            .append(getCvDisqualificationReason(), that.getCvDisqualificationReason())
            .append(getEffectiveDate(), that.getEffectiveDate())
            .append(getEligibleEmployees(), that.getEligibleEmployees())
            .append(getGeneralAgent(), that.getGeneralAgent())
            .append(getIncumbentDentalCarrier(), that.getIncumbentDentalCarrier())
            .append(getIncumbentMedicalCarrier(), that.getIncumbentMedicalCarrier())
            .append(getIncumbentVisionCarrier(), that.getIncumbentVisionCarrier())
            .append(getParticipatingEmployees(), that.getParticipatingEmployees())
            .append(getProductsQuoted(), that.getProductsQuoted())
            .append(getRfpSubmitted(), that.getRfpSubmitted())
            .append(getStandardVsCurrent(), that.getStandardVsCurrent())
            .append(getTest(), that.getTest())
            .append(getViewedByBroker(), that.getViewedByBroker())
            .isEquals();
    }

    @Override
    public int hashCode() {
        return new HashCodeBuilder(17, 37)
            .append(getId())
            .append(getAccountId())
            .append(getAmount())
            .append(getCloseDate())
            .append(getCreatedById())
            .append(getDescription())
            .append(getExpectedRevenue())
            .append(getForecastCategory())
            .append(getLastModifiedById())
            .append(getLeadSource())
            .append(getNextStep())
            .append(getCurrentName())
            .append(getName())
            .append(getOwner())
            .append(getPricebookId())
            .append(getCampaignId())
            .append(getIsPrivate())
            .append(getProbability())
            .append(getTotalOpportunityQuantity())
            .append(getStageName())
            .append(getSyncedQuoteId())
            .append(getType())
            .append(getAnthemMedicalPlansQuoted())
            .append(getBrokerageFirm())
            .append(getBrokerageFirmName())
            .append(getBrokerDemoConducted())
            .append(getBrokerNotes())
            .append(getCarrierContact())
            .append(getCarrierNotes())
            .append(getCarrier())
            .append(getClearValueQuoteIssued())
            .append(getCvVsCurrentIssued())
            .append(getCvDisqualificationReason())
            .append(getEffectiveDate())
            .append(getEligibleEmployees())
            .append(getGeneralAgent())
            .append(getIncumbentDentalCarrier())
            .append(getIncumbentMedicalCarrier())
            .append(getIncumbentVisionCarrier())
            .append(getParticipatingEmployees())
            .append(getProductsQuoted())
            .append(getRfpSubmitted())
            .append(getStandardVsCurrent())
            .append(getTest())
            .append(getViewedByBroker())
            .toHashCode();
    }
}
