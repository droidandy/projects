package com.benrevo.be.modules.quote.instant.controller;

import com.benrevo.be.modules.shared.service.SharedRfpService;
import com.benrevo.common.dto.AnthemCVProductQualificationDto;
import com.benrevo.common.dto.CreateProgramQuoteDto;
import com.benrevo.common.dto.RestMessageDto;
import com.benrevo.common.dto.RfpSubmissionStatusDto;
import com.benrevo.common.dto.ValidationErrorDto;
import com.benrevo.common.exception.BadRequestException;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.repository.RfpRepository;
import com.benrevo.be.modules.quote.instant.service.InstantQuoteService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Api(basePath = "/v1/instantQuote")
@RestController
@RequestMapping("/v1/instantQuote")
public class InstantQuoteController {

    @Autowired
    private InstantQuoteService instantQuoteService;

    @Autowired
    private SharedRfpService sharedRfpService;
    
    @Autowired
    private RfpRepository rfpRepository;

    @ApiOperation(value = "check if user qualifies for Anthem Clear Value",
        notes = "Return if user is qualified and disqualification reason")
    @GetMapping(value = "/qualification/{id}",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(#clientId)")
    public ResponseEntity<RfpSubmissionStatusDto> checkIfUserQualifiesForAnthemCV(@PathVariable("id") Long clientId, @RequestParam(name = "rfpIds", required = false) List<Long> rfpIds) {

        RfpSubmissionStatusDto rfpSubmissionStatusDto = new RfpSubmissionStatusDto();
        AnthemCVProductQualificationDto qualificationDto = null;

        if(clientId == null){
            throw new BadRequestException("clientId cannot be null");
        }
       
        List<RFP> rfps;
        if(rfpIds == null || rfpIds.isEmpty()){
            rfps = sharedRfpService.getRfpsByClientId(clientId);
        }else{
            rfps = rfpRepository.findByClientClientIdAndRfpIdIn(clientId, rfpIds);
        }
        qualificationDto = instantQuoteService.doesUserQualifyForClearValue(clientId, rfps, rfpSubmissionStatusDto);
        rfpSubmissionStatusDto.setRfpSubmittedSuccessfully(qualificationDto.isPartiallyQualified());
        return new ResponseEntity<>(rfpSubmissionStatusDto, HttpStatus.OK);
    }

    @ApiOperation(value = "Generates an Instant Quote for client",
        notes = "Generates an Instant Quote for client")
    @PostMapping(value = "/client/{id}/generate",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(#clientId)")
    public ResponseEntity<RfpSubmissionStatusDto> generateAnthemCVQuote(@PathVariable("id") Long clientId, @RequestParam(name = "rfpIds", required = false) List<Long> rfpIds) {
        if(clientId == null){
            throw new BadRequestException("clientId cannot be null");
        }

        if(rfpIds == null || rfpIds.isEmpty()){
            return new ResponseEntity<>(instantQuoteService.startInstantQuoteGeneration(clientId, sharedRfpService
                .getRfpIdsByClientId(clientId)), HttpStatus.OK);
        }else{
            return new ResponseEntity<>(instantQuoteService.startInstantQuoteGeneration(clientId, rfpIds), HttpStatus.OK);
        }
    }

    @ApiOperation(value = "Generates an program Instant Quote for client",
        notes = "Generates an Instant Quote for client")
    @PostMapping(value = "/client/{id}/program/generate",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(#clientId)")
    public ResponseEntity<RestMessageDto> generateProgramInstantQuote(@PathVariable("id") Long clientId,
        @Valid @RequestBody CreateProgramQuoteDto params) {


        instantQuoteService.generateProgramTrustQuote(clientId, params);
        return new ResponseEntity<>(new RestMessageDto("The trust quote successfully generated", true), HttpStatus.OK);
    }

    @ApiOperation(value = "Validates the data per program requirements",
        notes = "Validates the data per program requirements")
    @PostMapping(value = "/client/{id}/program/validate",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(#clientId)")
    public ResponseEntity<ValidationErrorDto> validateProgramRequirements(@PathVariable("id") Long clientId,
        @Valid @RequestBody CreateProgramQuoteDto params) {
        return new ResponseEntity<>(instantQuoteService.validateProgramRequirements(clientId, params), HttpStatus.OK);
    }
}