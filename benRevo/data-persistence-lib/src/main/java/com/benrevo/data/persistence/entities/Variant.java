package com.benrevo.data.persistence.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "variant")
public class Variant {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name = "variant_id")
    private Long variantId;

    @Column	(name = "number")
    private Integer number;

    @Column	(name = "`option`")
    private String option;

    @Column (name = "alias")
    private String alias;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    public Long getVariantId() {
        return variantId;
    }

    public Integer getNumber() {
        return number;
    }

    public void setNumber(Integer number) {
        this.number = number;
    }

    public void setVariantId(Long variantId) {
        this.variantId = variantId;
    }

    public String getOption() {
        return option;
    }

    public void setOption(String option) {
        this.option = option;
    }

    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public String getAlias() {
		return alias;
	}

	public void setAlias(String alias) {
		this.alias = alias;
	}

	@Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Variant)) return false;

        Variant variant = (Variant) o;

        return new org.apache.commons.lang3.builder.EqualsBuilder()
    			.append(getVariantId(), variant.getVariantId())
    			.append(getNumber(), variant.getNumber())
    			.append(getOption(), variant.getOption())
    			.append(getQuestion(), variant.getQuestion())
    			.append(getAlias(), variant.getAlias())
    			.isEquals();
    }

    @Override
    public int hashCode() {
        return new org.apache.commons.lang3.builder.HashCodeBuilder(1, 31)
    			.append(getVariantId())
    			.append(getNumber())
    			.append(getOption())
    			.append(getQuestion())
    			.append(getAlias())
                .toHashCode();
    }
}