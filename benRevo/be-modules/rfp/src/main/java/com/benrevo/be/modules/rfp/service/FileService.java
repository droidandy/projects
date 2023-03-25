package com.benrevo.be.modules.rfp.service;

import com.benrevo.be.modules.shared.service.SharedFileService;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.FileDto;
import com.benrevo.common.dto.FileInfoDto;
import com.benrevo.be.modules.shared.service.S3FileManager;
import com.benrevo.data.persistence.entities.ClientFileUpload;
import com.benrevo.data.persistence.repository.ClientFileRepository;
import com.benrevo.common.exception.BadRequestException;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.data.persistence.mapper.FileMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import static com.benrevo.common.util.MapBuilder.field;

@Service
@Transactional
public class FileService {

    @Autowired
    private S3FileManager s3FileManager;

    @Autowired
    SharedFileService sharedFileService;

    @Autowired
    private ClientFileRepository fileRepository;

    @Autowired
    private BaseRfpService baseRfpService;

    public FileInfoDto create(MultipartFile file, Long rfpId, String section) throws IOException {
        if(!baseRfpService.checkIfExist(rfpId)) {
            throw new BadRequestException("RFP not found")
                .withFields(
                    field("rfp_id", rfpId)
                );
        }

        try {
            String key = s3FileManager.uploadRfp(
                file.getOriginalFilename(),
                file.getInputStream(),
                file.getContentType(),
                file.getSize()
            );

            String type = file.getContentType();

            ClientFileUpload fileUpload = new ClientFileUpload();
            fileUpload.setRfpId(rfpId);
            fileUpload.setS3Key(key);
            fileUpload.setType(type);
            fileUpload.setSection(section);
            fileUpload.setSize(file.getSize());

            SimpleDateFormat dateFormatter = new SimpleDateFormat(Constants.DATETIME_FORMAT);
            fileUpload.setCreated(dateFormatter.format(new Date()));

            if(file instanceof MockMultipartFile) {
                s3FileManager.delete(key);
            } else {
                fileRepository.save(fileUpload);
            }

            return transformToFileInfoDto(fileUpload);
        } catch(Exception e) {
            throw new BaseException("Error uploading file", e);
        }
    }

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


    public ClientFileUpload getClientFileById(Long fileId) {
        ClientFileUpload fileUpload = fileRepository.findOne(fileId);

        if(fileUpload == null) {
            throw new NotFoundException("No RFP file found")
                .withFields(
                    field("file_id", fileId)
                );
        }

        return fileUpload;
    }

    public byte[] download(Long fileId) {
        ClientFileUpload fileUpload = fileRepository.findOne(fileId);

        if(fileUpload == null) {
            throw new NotFoundException("No file found")
                .withFields(
                    field("file_id", fileId)
                );
        }

        try {
            FileDto fileDto = s3FileManager.download(fileUpload.getS3Key());
            return fileDto.getContent();
        } catch(IOException e) {
            throw new BaseException("Could not download file")
                .withFields(
                    field("file_id", fileId)
                );
        }
    }

    private FileInfoDto transformToFileInfoDto(ClientFileUpload fileDto) {
        FileInfoDto infoDto = new FileInfoDto();
        infoDto.setName(sharedFileService.getFileName(fileDto.getS3Key()));
        infoDto.setLink(sharedFileService.getFileLink(fileDto.getClientFileUploadId()));
        infoDto.setType(fileDto.getType());
        infoDto.setSection(fileDto.getSection());
        infoDto.setCreated(fileDto.getCreated());
        infoDto.setSize(fileDto.getSize());

        return infoDto;
    }
}
