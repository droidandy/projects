package com.benrevo.data.persistence.entities;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "rfp_quote_network_combination")
public class RfpQuoteNetworkCombination {
	@Id 
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column	(name = "rfp_quote_network_combination_id")
	private Long rfpQuoteNetworkCombinationId;
	
    @ManyToOne
	@JoinColumn(name = "carrier_id", referencedColumnName = "carrier_id", nullable = false)
	private Carrier carrier;

	@Column (name = "name")
	private String name;
	
	@Column (name = "network_count")
	private int networkCount;

	public RfpQuoteNetworkCombination() { }

	public RfpQuoteNetworkCombination(Carrier carrier, String name, int networkCount) {
		this.carrier = carrier;
		this.name = name;
		this.networkCount = networkCount;
	}

	public Long getRfpQuoteNetworkCombinationId() {
		return rfpQuoteNetworkCombinationId;
	}

	public void setRfpQuoteNetworkCombinationId(Long rfpQuoteNetworkCombinationId) {
		this.rfpQuoteNetworkCombinationId = rfpQuoteNetworkCombinationId;
	}

	public Carrier getCarrier() {
		return carrier;
	}

	public void setCarrier(Carrier carrier) {
		this.carrier = carrier;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getNetworkCount() {
		return networkCount;
	}

	public void setNetworkCount(int networkCount) {
		this.networkCount = networkCount;
	}
}
