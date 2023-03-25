package com.benrevo.be.modules.presentation.service;

import com.benrevo.be.modules.shared.service.S3FileManager;
import com.benrevo.be.modules.shared.service.SharedRfpQuoteService;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.FileDto;
import com.benrevo.common.dto.RfpQuoteSummaryDto;
import com.benrevo.common.dto.RfpQuoteSummaryShortDto;
import com.benrevo.common.enums.OptionType;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.entities.RfpQuoteOption;
import com.benrevo.data.persistence.entities.RfpQuoteSummary;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.RfpQuoteOptionRepository;
import com.benrevo.data.persistence.repository.RfpQuoteSummaryRepository;
import com.benrevo.data.persistence.repository.RfpRepository;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.NotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

import static com.benrevo.common.util.MapBuilder.field;
import static com.benrevo.common.util.ValidationHelper.isNotNull;
import static com.benrevo.common.util.ValidationHelper.validateObject;
import static com.benrevo.common.util.ObjectMapperUtils.*;
import static java.lang.String.format;
import java.io.IOException;

@Service
@Transactional
public class RfpQuoteSummaryService {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private RfpQuoteSummaryRepository rfpQuoteSummaryRepository;
    
    @Autowired
    private RfpQuoteOptionRepository rfpQuoteOptionRepository;
    
    @Autowired
    private S3FileManager s3FileManager;

    @Transactional(readOnly = true)
    public RfpQuoteSummaryShortDto getByClientId(Long clientId) {
        validateObject(clientId);

        RfpQuoteSummary rqs = rfpQuoteSummaryRepository.findByClientClientId(clientId);

        if(rqs == null) {
            throw new NotFoundException("Quote summary not found")
                .withFields(
                    field("client_id", clientId)
                );
        }

        RfpQuoteSummaryShortDto rfpQuoteSummaryShortDto = map(rqs, RfpQuoteSummaryShortDto.class);
        
        boolean isMedicalRenewal = false;
        RfpQuoteOption medicalOption = rfpQuoteOptionRepository.findSelectedByClientIdAndCategory(clientId, Constants.MEDICAL);
        if (medicalOption != null) {
            isMedicalRenewal = OptionType.RENEWAL.equals(SharedRfpQuoteService.getOptionType(medicalOption.getName()));
        }
        
        RfpQuoteOption dentalOption = rfpQuoteOptionRepository.findSelectedByClientIdAndCategory(clientId, Constants.DENTAL);
        if (dentalOption != null && RfpQuoteService.isEligibleForDiscount(dentalOption, isMedicalRenewal)) {
            // eligible for the discount
            rfpQuoteSummaryShortDto.setDentalBundleDiscountPercent(RfpQuoteService.DENTAL_BUNDLE_DISCOUNT_PERCENT);
        }
        RfpQuoteOption visionOption = rfpQuoteOptionRepository.findSelectedByClientIdAndCategory(clientId, Constants.VISION);
        if (visionOption != null && RfpQuoteService.isEligibleForDiscount(visionOption, isMedicalRenewal)) {
            // eligible for the discount
            rfpQuoteSummaryShortDto.setVisionBundleDiscountPercent(RfpQuoteService.VISION_BUNDLE_DISCOUNT_PERCENT);
        }
        
        return rfpQuoteSummaryShortDto;
    }

    public RfpQuoteSummaryDto create(Long clientId, RfpQuoteSummaryShortDto dto) {
        Client client = getAndValidateRfpQuote(clientId);

        RfpQuoteSummary rfpQuoteSummary = new RfpQuoteSummary();
        populateFields(dto, client, rfpQuoteSummary);

        return map(rfpQuoteSummaryRepository.save(rfpQuoteSummary), RfpQuoteSummaryDto.class);
    }

    public RfpQuoteSummaryDto update(Long clientId, RfpQuoteSummaryDto dto) {
        Client client = getAndValidateRfpQuote(clientId);

        RfpQuoteSummary rfpQuoteSummary = rfpQuoteSummaryRepository.findByClientClientId(clientId);
        populateFields(dto, client, rfpQuoteSummary);

        return map(rfpQuoteSummaryRepository.save(rfpQuoteSummary), RfpQuoteSummaryDto.class);
    }

    public void delete(Long clientId) {
        RfpQuoteSummary rfpQuoteSummary = rfpQuoteSummaryRepository.findByClientClientId(clientId);

        if(rfpQuoteSummary == null) {
            throw new NotFoundException("Quote summary not found")
                .withFields(
                    field("client_id", clientId)
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
        rfpQuoteSummary.setMedicalNotes(dto.getMedicalNotes());
        rfpQuoteSummary.setMedicalWithKaiserNotes(dto.getMedicalWithKaiserNotes());
        rfpQuoteSummary.setDentalNotes(dto.getDentalNotes());
        rfpQuoteSummary.setVisionNotes(dto.getVisionNotes());
        rfpQuoteSummary.setLifeNotes(dto.getLifeNotes());
        rfpQuoteSummary.setUpdated(new Date());
    }

    public FileDto downloadFile(Long clientId) {
        
        RfpQuoteSummary rqs = rfpQuoteSummaryRepository.findByClientClientId(clientId);

        if(rqs == null) {
            throw new NotFoundException("Quote summary not found")
                .withFields(
                    field("client_id", clientId)
                );
        }

        if(rqs.getS3Key() == null) {
            throw new NotFoundException("There is no file")
                .withFields(
                    field("client_id", clientId)
                );
        }
        
        try {
            return s3FileManager.download(rqs.getS3Key());
        } catch(IOException e) {
            throw new BaseException("Could not download file",e)
                .withFields(
                    field("client_id", clientId),
                    field("S3 key", rqs.getS3Key())
                );
        }
    }
}
