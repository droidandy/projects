package com.benrevo.be.modules.admin.service;

import com.benrevo.be.modules.shared.service.S3FileManager;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.RfpQuoteSummaryDto;
import com.benrevo.common.dto.RfpQuoteSummaryShortDto;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.RfpQuoteSummary;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.RfpQuoteSummaryRepository;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import com.benrevo.common.util.ObjectMapperUtils;

import java.util.Date;

import static com.benrevo.common.util.ValidationHelper.isNotNull;
import static com.benrevo.common.util.ValidationHelper.validateObject;
import static java.lang.String.format;
import static com.benrevo.common.util.MapBuilder.field;

import java.io.IOException;

/**
 * Created by lemdy on 6/13/17.
 */
@Service
@Transactional
public class AdminRfpQuoteSummaryService {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private RfpQuoteSummaryRepository rfpQuoteSummaryRepository;
    
    @Autowired
    private S3FileManager s3FileManager;

    @Value("${app.carrier}")
    String[] appCarrier;

    @Transactional(readOnly = true)
    public RfpQuoteSummaryShortDto getByClientId(Long clientId) {
        validateObject(clientId);

        RfpQuoteSummary rqs = rfpQuoteSummaryRepository.findByClientClientId(clientId);

        if(rqs == null) {
            return null;
        }

        return ObjectMapperUtils.map(rqs, RfpQuoteSummaryShortDto.class);
    }

    public RfpQuoteSummaryDto create(Long clientId, RfpQuoteSummaryShortDto dto) {
        Client client = getAndValidateRfpQuote(clientId);

        RfpQuoteSummary rfpQuoteSummary = new RfpQuoteSummary();
        populateFields(dto, client, rfpQuoteSummary);

        return ObjectMapperUtils.map(rfpQuoteSummaryRepository.save(rfpQuoteSummary), RfpQuoteSummaryDto.class);
    }

    public RfpQuoteSummaryDto update(Long clientId, RfpQuoteSummaryDto dto) {
        Client client = getAndValidateRfpQuote(clientId);

        RfpQuoteSummary rfpQuoteSummary = rfpQuoteSummaryRepository.findByClientClientId(clientId);
        if(rfpQuoteSummary == null) {
            throw new NotFoundException(
                format(
                    "Quote summary not found; client_id=%s",
                    clientId
                )
            );
        }
        populateFields(dto, client, rfpQuoteSummary);

        return ObjectMapperUtils.map(rfpQuoteSummaryRepository.save(rfpQuoteSummary), RfpQuoteSummaryDto.class);
    }

    public void delete(Long clientId) {
        RfpQuoteSummary rfpQuoteSummary = rfpQuoteSummaryRepository.findByClientClientId(clientId);

        if(rfpQuoteSummary == null) {
            throw new NotFoundException(
                format(
                    "Quote summary not found; client_id=%s",
                    clientId
                )
            );
        }

        rfpQuoteSummaryRepository.delete(rfpQuoteSummary);
    }

    private Client getAndValidateRfpQuote(Long clientId) {
        Client client = clientRepository.findOne(clientId);

        isNotNull(client, format(Constants.VALIDATION_MESSAGE_ENTITY_NOT_FOUND_EXTENDED, Client.class.getSimpleName(), clientId));

        return client;
    }

    private void populateFields(RfpQuoteSummaryShortDto dto, Client client, RfpQuoteSummary rfpQuoteSummary) {
        rfpQuoteSummary.setClient(client);
        rfpQuoteSummary.setUpdated(new Date());
        rfpQuoteSummary.setMedicalNotes(dto.getMedicalNotes());
        rfpQuoteSummary.setMedicalWithKaiserNotes(dto.getMedicalWithKaiserNotes());
        rfpQuoteSummary.setDentalNotes(dto.getDentalNotes());
        rfpQuoteSummary.setVisionNotes(dto.getVisionNotes());
        rfpQuoteSummary.setLifeNotes(dto.getLifeNotes());
    }

    public RfpQuoteSummaryShortDto uploadFile(Long clientId, MultipartFile file, boolean override) {
        
        RfpQuoteSummary rqs = rfpQuoteSummaryRepository.findByClientClientId(clientId);
        if(rqs == null) {
            throw new NotFoundException(format("Quote summary not found; client_id=%s", clientId));
        }

        CarrierType carrierType = CarrierType.fromStrings(appCarrier);

        if(rqs.getS3Key() != null) {
            if(!override) {
                throw new BaseException(format("File with name=%s exists", s3FileManager.getNameFromKey(rqs.getS3Key())));
            } else {
                s3FileManager.delete(rqs.getS3Key(), carrierType);
            }
        }
        
        String s3Key;
        try {
            s3Key = s3FileManager.uploadQuote(
                file.getOriginalFilename(),
                file.getInputStream(),
                file.getContentType(),
                file.getSize(),
                carrierType);
        } catch(IOException e) {
            throw new BaseException("Could not upload file", e)
                .withFields(field("file_name", file.getOriginalFilename()));
        }

        rqs.setS3Key(s3Key);
        rqs.setFileUpdated(new Date());
        
        return ObjectMapperUtils.map(rqs, RfpQuoteSummaryShortDto.class);
    }
}
