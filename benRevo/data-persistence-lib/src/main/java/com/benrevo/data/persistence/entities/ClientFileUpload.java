package com.benrevo.data.persistence.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.benrevo.common.dto.ClientFileUploadDto;

import java.util.Date;

@Entity
@Table(name = "client_file_upload")
public class ClientFileUpload {
	@Id @GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column	(name = "client_file_upload_id")
	private Long clientFileUploadId;

	@Column	(name = "rfp_id")
	private Long rfpId;
	
	@Column (name = "s3_key")
	private String s3Key;

	@Column (name = "mime_type")
	private String type;

	@Column (name = "section")
	private String section;

	@Column (name = "deleted")
	private boolean deleted;

	@Column (name = "created")
	private String created;

	@Column (name = "size")
	private Long size;


	public Long getClientFileUploadId() {
		return clientFileUploadId;
	}

	public void setClientFileUploadId(Long clientFileUploadId) {
		this.clientFileUploadId = clientFileUploadId;
	}

	public Long getRfpId() {
		return rfpId;
	}

	public void setRfpId(Long rfpId) {
		this.rfpId = rfpId;
	}

	public String getS3Key() {
		return s3Key;
	}

	public void setS3Key(String fileName) {
		this.s3Key = fileName;
	}

	public boolean isDeleted() {
		return deleted;
	}

	public void setDeleted(boolean deleted) {
		this.deleted = deleted;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getSection() {
		return section;
	}

	public void setSection(String section) {
		this.section = section;
	}

	public String getCreated() {
		return created;
	}

	public void setCreated(String created) {
		this.created = created;
	}

	public Long getSize() {
		return size;
	}

	public void setSize(Long size) {
		this.size = size;
	}

	public ClientFileUploadDto toClientFileUploadDto(String value) {
		ClientFileUploadDto upload = new ClientFileUploadDto();
		upload.setId(clientFileUploadId);
		upload.setInfoValueId(rfpId);
		upload.setFileName(s3Key);
		upload.setLink(s3Key);
		upload.setValue(value);
		upload.setSize(size);
		return upload;
	}

}
