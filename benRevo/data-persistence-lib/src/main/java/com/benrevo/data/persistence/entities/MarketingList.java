package com.benrevo.data.persistence.entities;

import com.benrevo.common.enums.EmailType;
import com.benrevo.common.enums.MarketingStatus;
import com.benrevo.common.enums.QuoteState;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "marketing_list")
public class MarketingList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "marketing_list_id")
    private Long marketingListId;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private MarketingStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", referencedColumnName = "client_id", nullable = false)
    private Client client;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rfp_carrier_id", referencedColumnName = "rfp_carrier_id", nullable = false)
    private RfpCarrier rfpCarrier;

    public Long getMarketingListId() {
        return marketingListId;
    }

    public void setMarketingListId(Long marketingListId) {
        this.marketingListId = marketingListId;
    }

    public MarketingStatus getStatus() {
        return status;
    }

    public void setStatus(MarketingStatus status) {
        this.status = status;
    }

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public RfpCarrier getRfpCarrier() {
        return rfpCarrier;
    }

    public void setRfpCarrier(RfpCarrier rfpCarrier) {
        this.rfpCarrier = rfpCarrier;
    }
}
