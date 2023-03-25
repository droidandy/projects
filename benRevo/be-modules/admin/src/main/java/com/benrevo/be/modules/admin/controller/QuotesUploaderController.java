package com.benrevo.be.modules.admin.controller;


import com.benrevo.be.modules.admin.service.LoaderService;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.QuoteChangesDto;
import com.benrevo.common.dto.QuoteUploaderDto;
import com.benrevo.common.dto.RfpQuoteDto;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.common.exception.BadRequestException;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.logging.CustomLogger;
import com.benrevo.common.util.JsonUtils;
import com.benrevo.data.persistence.entities.RfpQuote;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import static java.util.Objects.isNull;
import static org.apache.commons.lang3.StringUtils.isEmpty;
import static org.apache.commons.lang3.StringUtils.split;

import java.util.List;

@Api(basePath = "/admin")
@RestController
@RequestMapping("/admin")
@PreAuthorize("@checkAccess.hasRole(T(CheckAccess).ADMIN_MODULE_ACCESS_ROLES)")
public class QuotesUploaderController {

    @Autowired
    private LoaderService loadersService;

    @Autowired
    private CustomLogger LOGGER;

    @Autowired
    private JsonUtils jsonUtils;


    @ApiOperation(value = "Validates quote uploader for all carrier products",
        notes = "Validates a quote(excel file) to the database")
    @PostMapping(value = "/quotes/{brokerId}/{clientId}/validate",
        consumes = {MediaType.MULTIPART_FORM_DATA_VALUE},
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<QuoteUploaderDto> validateQuotes(
        @PathVariable("brokerId") String brokerId,
        @PathVariable("clientId") String clientId,
        @RequestParam(name = "files", required = false) List<MultipartFile> files) {

        LOGGER.info("POST /quotes/{brokerId}/{clientId}/validate: Validates a list of quote(excel file) to the database");
        validateAPI(brokerId, clientId, files);

        try{
            return new ResponseEntity<>(loadersService.validateQuotes(files, clientId, brokerId), HttpStatus.OK);
        }catch(Exception e){
            throw new BaseException(e.getMessage(), e);
        }
    }

    @ApiOperation(value = "Generic quote uploader for all carrier products",
        notes = "Uploads a quote(excel file) to the database")
    @PostMapping(value = "/quotes/{brokerId}/{clientId}",
        consumes = {MediaType.MULTIPART_FORM_DATA_VALUE},
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<RfpQuoteDto>> uploadQuotes_v2(
        @PathVariable("brokerId") String brokerId,
        @PathVariable("clientId") String clientId,
        @RequestParam(value = "dto", required = false) String json,
        @RequestParam(name = "files", required = false) List<MultipartFile> files) {

        LOGGER.info("POST /quotes/{brokerId}/{clientId}: Uploads a list of quote(excel file) to the database");
        validateAPI(brokerId, clientId, files);

        try{
            if(isNull(json)){
                throw new BaseException("Quote upload Dto cannot be null!");
            }

            QuoteUploaderDto params = jsonUtils.fromJson(json, QuoteUploaderDto.class);
            List<RfpQuoteDto> quotes = loadersService.uploadQuotes(files, clientId,
                brokerId, params);

            LOGGER.info("Quote for broker = " + brokerId + " and client = " + clientId + " uploaded successfully");
            return new ResponseEntity<>(quotes, HttpStatus.OK);
        }catch(Exception e){
            throw new BaseException(e.getMessage(), e);
        }
    }

    @ApiOperation(value = "Uploads quotes from carriers",
            notes = "Uploads a quote(excel file) to the database")
    @PostMapping(value = "/quotes/{brokerId}/{clientId}/{carrierName}/{category}/{quoteType}/{isRenewal}", consumes = "multipart/form-data")
    public ResponseEntity<RfpQuoteDto> uploadQuotes(@RequestParam(name = "file", required = false) MultipartFile file,
                                                    @RequestParam(name = "file2", required = false) List<MultipartFile> file2List,
                                                @PathVariable("isRenewal") Boolean isRenewal,
                                               @PathVariable("carrierName") String carrierName,
                                               @PathVariable("clientId") String clientId,
                                               @PathVariable("brokerId") String brokerId,
                                               @PathVariable("quoteType") String quoteTypeStr,
                                               @PathVariable("category") String category) {

        LOGGER.info("POST /quotes/{brokerId}/{clientId}/{carrierName}/{category}/{quoteType}/{isRenewal}: Uploads a quote(excel file) to the database");

        if(isRenewal == null){
            throw new BadRequestException("isRenewal cannot be null or empty");
        }

        if(isEmpty(carrierName)){
            throw new BadRequestException("Carrier Name cannot be null or empty");
        }

        if(isEmpty(clientId)){
            throw new BadRequestException("Client ID cannot be null or empty");
        }

        if(isEmpty(brokerId)){
            throw new BadRequestException("brokerId cannot be null or empty");
        }

        QuoteType quoteType = checkAndConvertQuoteType(quoteTypeStr);

        if(isEmpty(category)){
            throw new BadRequestException("category cannot be null or empty");
        }

        if ((file == null || file.isEmpty()) 
                && file2List.isEmpty() 
                && (! QuoteType.DECLINED.equals(quoteType))) {
            throw new BadRequestException("Empty quote file(s)");
        }

        if(!category.toUpperCase().equals(Constants.DENTAL) && !category.toUpperCase().equals(Constants.VISION) && !category.toUpperCase().equals(Constants.MEDICAL)
            && !category.toUpperCase().equals(Constants.LIFE)){
            throw new BadRequestException("Invalid category. It is either Life, Medical, Vision or Dental");
        }

        RfpQuote quote;

        try{
            quote = loadersService.uploadQuote(file, file2List, carrierName, clientId,
                brokerId, quoteType, category, isRenewal);

            LOGGER.info("Quote for carrier = " + carrierName +
                ", broker = " + brokerId + " and client = " + clientId + " uploaded successfully");

            RfpQuoteDto dto = loadersService.getRfpQuoteDto(quoteType, quote);
            return new ResponseEntity<>(dto, HttpStatus.OK);
        }catch(Exception e){
            throw new BaseException(e.getMessage(), e);
        }
    }
    
    @ApiOperation(value = "Retrieve changes from new quote")
    @PostMapping(value = "/quotes/changes/{brokerId}/{clientId}/{carrierName}/{category}/{quoteType}/{isRenewal}", consumes = "multipart/form-data")
    public ResponseEntity<QuoteChangesDto> getQuoteChanges(@RequestParam(name = "file", required = false) MultipartFile file,
                                                           @RequestParam(name = "file2", required = false) List<MultipartFile> file2List,
                                                            @PathVariable("isRenewal") Boolean isRenewal,
                                                           @PathVariable("carrierName") String carrierName,
                                                           @PathVariable("clientId") Long clientId,
                                                           @PathVariable("brokerId") Long brokerId,
                                                           @PathVariable("quoteType") String quoteTypeStr,
                                                           @PathVariable("category") String category) {

        LOGGER.info("POST /quotes/changes/{brokerId}/{clientId}/{carrierName}/{category}/{quoteType}/{isRenewal}: Retrieve changes from new quote");

        if(isRenewal == null){
            throw new BadRequestException("isRenewal cannot be null or empty");
        }

        if ((file == null || file.isEmpty()) && file2List.isEmpty()) {
            throw new BadRequestException("Empty quote file(s)");
        }

        if(isEmpty(carrierName)){
            throw new BadRequestException("Carrier Name cannot be null or empty");
        }

        if(isEmpty(category)){
            throw new BadRequestException("category cannot be null or empty");
        }

        if(!category.toUpperCase().equals(Constants.DENTAL) && !category.toUpperCase().equals(Constants.VISION) && !category.toUpperCase().equals(Constants.MEDICAL)){
            throw new BadRequestException("Invalid category. It is either Medical, Vision or Dental");
        }
        
        QuoteType quoteType = checkAndConvertQuoteType(quoteTypeStr);

        QuoteChangesDto changesDto;

        try{
            changesDto = loadersService.getQuoteChanges(file, file2List, carrierName, clientId,
                brokerId, quoteType, category, isRenewal);
        }catch(Exception e){
            throw new BaseException(e.getMessage(), e);
        }

        return ResponseEntity.ok().body(changesDto);
    }

    @ApiOperation(value = "Get latest quote information",
        notes = "Get latest quote information")
    @GetMapping(value = "/quotes/latest/{brokerId}/{clientId}/{carrierName}/{category}/{quoteType}/")
    public ResponseEntity<RfpQuoteDto> getLatestQuote(
                                                    @PathVariable("carrierName") String carrierName,
                                                    @PathVariable("clientId") String clientId,
                                                    @PathVariable("brokerId") String brokerId,
                                                    @PathVariable("quoteType") String quoteTypeStr,
                                                    @PathVariable("category") String category) {

        LOGGER.info("GET /quotes/latest/{brokerId}/{clientId}/{carrierName}/{category}/{quoteType}/: Get latest quote information");
        RfpQuote quote;

        try{
            QuoteType quoteType = checkAndConvertQuoteType(quoteTypeStr);
            quote = loadersService.getLatestQuote(carrierName, clientId,
                brokerId, quoteType, category);

            RfpQuoteDto dto = null;

            if(quote != null){
                dto = new RfpQuoteDto();
                dto.setQuoteType(quoteType);
                dto.setRfpQuoteId(quote.getRfpQuoteId());
                dto.setRatingTiers(quote.getRatingTiers());
                if(quote.getS3Key() != null){
                    String fileName = split(quote.getS3Key(), "_", 2)[1];
                    dto.setFileName(fileName);
                }
            }
            return new ResponseEntity<>(dto, HttpStatus.OK);

        }catch(Exception e){
            throw new BaseException(e.getMessage(), e);
        }
    }
    
    private QuoteType checkAndConvertQuoteType (String quoteType) {
    	 if(quoteType == null || quoteType.isEmpty()){
             throw new BadRequestException("quoteType cannot be null or empty");
         }
         try {
        	 QuoteType quoteTypeEnumValue = QuoteType.valueOf(quoteType);
        	 return quoteTypeEnumValue;
 		} catch (IllegalArgumentException e) {
 			 throw new BadRequestException("Unsupported quoteType value: " + quoteType);
 		}
    }

    private void validateAPI(String brokerId, String clientId, List<MultipartFile> files) {
        if(clientId == null || clientId.isEmpty()){
            throw new BadRequestException("Client ID cannot be null or empty");
        }

        if(brokerId == null || brokerId.isEmpty()){
            throw new BadRequestException("brokerId cannot be null or empty");
        }

        if(CollectionUtils.isEmpty(files)) {
            throw new BadRequestException("Empty quote file(s)");
        }
    }
}
