package com.benrevo.data.persistence.entities;

import javax.persistence.*;

@Entity
@Table(name = "administrative_fee")
public class AdministrativeFee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "administrative_fee_id")
    private Long administrativeFeeId;

    @ManyToOne
    @JoinColumn(name = "carrier_id", columnDefinition = "BIGINT(20)", referencedColumnName = "carrier_id", nullable = false)
    private Carrier carrier;

    @Column(name = "name")
    private String name;

    @Column(name = "value")
    private Float value;

    public AdministrativeFee() {
    }

	public Long getAdministrativeFeeId() {
		return administrativeFeeId;
	}

	public void setAdministrativeFeeId(Long administrativeFeeId) {
		this.administrativeFeeId = administrativeFeeId;
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

	public Float getValue() {
		return value;
	}

	public void setValue(Float value) {
		this.value = value;
	}
}