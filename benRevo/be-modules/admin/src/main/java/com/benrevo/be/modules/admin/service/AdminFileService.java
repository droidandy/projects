package com.benrevo.be.modules.admin.service;

import com.benrevo.be.modules.shared.service.S3FileManager;
import com.benrevo.common.dto.FileDto;
import com.benrevo.common.dto.FileInfoDto;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.common.util.RequestUtils;
import com.benrevo.data.persistence.entities.ClientFileUpload;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.repository.ClientFileRepository;
import com.benrevo.data.persistence.repository.RfpRepository;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static java.lang.String.format;

@Service
@Transactional
public class AdminFileService {

    @Autowired
    private S3FileManager s3FileManager;

    @Autowired
    private RfpRepository rfpRepository;

    @Autowired
    private ClientFileRepository clientFileRepository;
    
    public List<FileInfoDto> getFilesByClientId(Long clientId) {
        List<RFP> rfps = rfpRepository.findByClientClientId(clientId);
        List<FileInfoDto> result = new ArrayList<>();

        rfps.forEach(rfp -> {
            List<ClientFileUpload> rfpFiles = clientFileRepository.findByRfpIdAndDeleted(rfp.getRfpId(), false);
            rfpFiles.forEach(fileUpload -> result.add(transformToFileInfoDto(fileUpload)));
        });

        return result;
    }

    public byte[] download(Long fileId, String carrierName) {
        ClientFileUpload fileUpload = clientFileRepository.findOne(fileId);

        if(fileUpload == null) {
            throw new NotFoundException(
                format(
                    "No file found; file_id=%s",
                    fileId
                )
            );
        }

        try {
            FileDto fileDto = s3FileManager.download(fileUpload.getS3Key(), carrierName);
            return fileDto.getContent();
        } catch(IOException e) {
            throw new BaseException(
                format(
                    "Could not download file; file_id=%s",
                    fileId
                ),
                e
            );
        }
    }
    
    private FileInfoDto transformToFileInfoDto(ClientFileUpload fileDto) {
        FileInfoDto infoDto = new FileInfoDto();

        infoDto.setName(getFileName(fileDto.getS3Key()));
        infoDto.setLink(getFileLink(fileDto.getClientFileUploadId()));
        infoDto.setType(fileDto.getType());
        infoDto.setSection(fileDto.getSection());
        infoDto.setCreated(fileDto.getCreated());
        infoDto.setSize(fileDto.getSize());

        return infoDto;
    }

    public String getFileName(String key) {
        return key.substring(key.indexOf("_") + 1);
    }

    public String getFileLink(Long clientFileUploadId) {
        return RequestUtils.getServiceBaseURL() + "/admin/file?id=" + clientFileUploadId;
    }
}
