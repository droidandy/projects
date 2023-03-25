package com.benrevo.data.persistence.entities;

import java.util.Objects;
import javax.persistence.*;

@Entity
@Table(name = "rfp_quote_version")
public class RfpQuoteVersion {

	@Id @GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column	(name = "rfp_quote_version_id")
	private Long rfpQuoteVersionId;

	@Column	(name = "rfp_submission_id")
	private Long rfpSubmissionId;

	public Long getRfpQuoteVersionId() {
		return rfpQuoteVersionId;
	}

	public void setRfpQuoteVersionId(Long rfpQuoteVersionId) {
		this.rfpQuoteVersionId = rfpQuoteVersionId;
	}

	public Long getRfpSubmissionId() {
		return rfpSubmissionId;
	}

	public void setRfpSubmissionId(Long rfpSubmissionId) {
		this.rfpSubmissionId = rfpSubmissionId;
	}
	
    @Override
    public int hashCode() {
      return Objects.hash(rfpQuoteVersionId, rfpSubmissionId);
    }

	@Override
    public boolean equals(Object obj) {
      if (this == obj) {
        return true;
      }
      if (obj == null || getClass() != obj.getClass()) {
        return false;
      }
      RfpQuoteVersion other = (RfpQuoteVersion) obj;
  
      return Objects.equals(rfpQuoteVersionId, other.rfpQuoteVersionId)
          && Objects.equals(rfpSubmissionId, other.rfpSubmissionId);
    }
}
