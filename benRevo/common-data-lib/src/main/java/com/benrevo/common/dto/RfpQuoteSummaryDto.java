package com.benrevo.common.dto;

import javax.validation.constraints.NotNull;

public class RfpQuoteSummaryDto extends RfpQuoteSummaryShortDto {
	@NotNull
	private Long id;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	@Override
	public boolean equals(Object o) {
		
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;

		RfpQuoteSummaryDto quoteSummaryDto = (RfpQuoteSummaryDto) o;
		
		if (getMedicalNotes() != null ? !getMedicalNotes().equals(quoteSummaryDto.getMedicalNotes()) : quoteSummaryDto.getMedicalNotes() != null) return false;
		if (getDentalNotes()!= null ? !getDentalNotes().equals(quoteSummaryDto.getDentalNotes()) : quoteSummaryDto.getDentalNotes() != null) return false;
		if (getVisionNotes()!= null ? !getVisionNotes().equals(quoteSummaryDto.getVisionNotes()) : quoteSummaryDto.getVisionNotes() != null) return false;
		if (getId() != null ? !getId().equals(quoteSummaryDto.getId()) : quoteSummaryDto.getId() != null) return false;
		
		return true;
	}
}