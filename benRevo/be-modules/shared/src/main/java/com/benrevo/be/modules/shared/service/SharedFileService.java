package com.benrevo.be.modules.shared.service;

import com.benrevo.common.dto.FileDto;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.common.util.RequestUtils;
import com.benrevo.data.persistence.entities.ClientFileUpload;
import com.benrevo.data.persistence.mapper.FileMapper;
import com.benrevo.data.persistence.repository.ClientFileRepository;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.benrevo.common.util.MapBuilder.field;

@Service
@Transactional
public class SharedFileService{

    @Autowired
    private ClientFileRepository fileRepository;

    public List<FileDto> getFilesByRfpId(Long rfpId) {
        List<ClientFileUpload> fileUploads = fileRepository.findByRfpIdAndDeleted(rfpId, false);

        if(fileUploads == null) {
            throw new NotFoundException("No RFP files found")
                .withFields(
                    field("rfp_id", rfpId)
                );
        }

        return FileMapper.filesToDtos(fileUploads);
    }

    public List<ClientFileUpload> getClientFilesByRfpId(Long rfpId) {
        List<ClientFileUpload> fileUploads = fileRepository.findByRfpIdAndDeleted(rfpId, false);

        if(fileUploads == null) {
            throw new NotFoundException("No RFP files found")
                .withFields(
                    field("rfp_id", rfpId)
                );
        }

        return fileUploads;
    }

    public void markDeleted(Long fileId) {
        ClientFileUpload fileUpload = fileRepository.findOne(fileId);

        if(fileUpload == null) {
            throw new NotFoundException("No file found")
                .withFields(
                    field("file_id", fileId)
                );
        }

        fileUpload.setDeleted(true);

        fileRepository.save(fileUpload);
    }

    public String getFileName(String key) {
        return key.substring(key.indexOf("_") + 1);
    }

    public String getFileLink(Long clientFileUploadId) {
        return RequestUtils.getServiceBaseURL() + "/v1/file?id=" + clientFileUploadId;
    }
}
