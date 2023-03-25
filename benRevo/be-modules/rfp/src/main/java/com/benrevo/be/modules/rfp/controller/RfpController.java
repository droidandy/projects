package com.benrevo.be.modules.rfp.controller;

import com.benrevo.be.modules.shared.service.SharedRfpService;
import com.benrevo.common.dto.CensusInfoDto;
import com.benrevo.common.dto.RfpDto;
import com.benrevo.common.dto.RfpSubmissionStatusDto;
import com.benrevo.be.modules.rfp.service.BaseRfpService;
import com.benrevo.common.exception.BadRequestException;
import com.benrevo.common.exception.BaseException;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.ByteArrayOutputStream;
import java.util.List;

@Api(basePath = "/v1")
@RestController
@RequestMapping("/v1")
@PreAuthorize("@checkAccess.hasRole(T(CheckAccess).RFP_MODULE_ACCESS_ROLES)")
public class RfpController{

	public static final String APPLICATION_DOCX_VALUE = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    
	@Autowired
    private BaseRfpService baseRfpService;

    @Autowired
    private SharedRfpService sharedRfpService;


    @ApiOperation(value = "Retrieving a rfp by rfp_id",
        notes = "Return JSON obj of rfp.")
    @GetMapping(value = "/rfps/{id}",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@rfpIdResolver.resolveClientId(#rfpId), T(CheckAccess).RFP_MODULE_ACCESS_ROLES)")
    public ResponseEntity<RfpDto> getRfpById(@PathVariable("id") Long rfpId) {
        return new ResponseEntity<>(baseRfpService.getById(rfpId), HttpStatus.OK);
    }

    @ApiOperation(value = "Retrieving a rfp for client by type",
        notes = "Return JSON obj of rfp.")
    @GetMapping(value = "/clients/{id}/rfps/{type}",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(#clientId, T(CheckAccess).RFP_MODULE_ACCESS_ROLES)")
    public ResponseEntity<RfpDto> getRfpForClientByType(@PathVariable("id") Long clientId,
                                                        @PathVariable("type") String rfpType) {
        return new ResponseEntity<>(baseRfpService.getRfpForClientByType(clientId, rfpType), HttpStatus.OK);
    }

    @ApiOperation(value = "Retrieving a rfp for client by clientId",
        notes = "Return JSON array of rfps.")
    @GetMapping(value = "/clients/{id}/rfps",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(#clientId, T(CheckAccess).RFP_MODULE_ACCESS_ROLES)")
    public ResponseEntity<List<RfpDto>> getRfpForClientByType(@PathVariable("id")  Long clientId) {
        return new ResponseEntity<>(sharedRfpService.getByClientId(clientId), HttpStatus.OK);
    }

    @ApiOperation(value = "Creating an array of rfps",
        notes = "Return JSON array of the created rfps.")
    @PostMapping(value = "/clients/{id}/rfps",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(#clientId, T(CheckAccess).RFP_MODULE_ACCESS_ROLES)")
    public ResponseEntity<List<RfpDto>> createRFPs(@Valid @RequestBody List<RfpDto> dtoList,
                                                   @PathVariable("id") Long clientId) {
        return new ResponseEntity<>(baseRfpService.create(dtoList, clientId), HttpStatus.CREATED);
    }


    @ApiOperation(value = "Updating a rfp by rfp_id",
        notes = "Return JSON array of updated rfp.")
    @PutMapping(value = "/clients/{id}/rfps",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(#clientId, T(CheckAccess).RFP_MODULE_ACCESS_ROLES)")
    public ResponseEntity<List<RfpDto>> updateRFP(@Valid @RequestBody List<RfpDto> dtoList, @PathVariable("id") Long clientId) {
        return new ResponseEntity<>(baseRfpService.update(dtoList, clientId), HttpStatus.OK);
    }

    @ApiOperation(value = "Client's RFPs submission",
        notes = "Returns status of RFP submission to carrier")
    @PostMapping(value = "/clients/{id}/rfps/submit",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(#clientId, T(CheckAccess).RFP_MODULE_ACCESS_ROLES)")
    public ResponseEntity<List<RfpSubmissionStatusDto>> submitRFPs(@PathVariable("id") Long clientId, @RequestParam("rfpIds") List<Long> rfpIds) {
        List<RfpSubmissionStatusDto> result = baseRfpService.rfpSubmission(clientId, rfpIds);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }


    @ApiOperation(value = "Client's RFPs submission status",
        notes = "Returns status of RFP submission to carrier")
    @GetMapping(value = "/clients/{id}/rfp/status",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(#clientId, T(CheckAccess).RFP_MODULE_ACCESS_ROLES)")
    public ResponseEntity<List<RfpSubmissionStatusDto>> getRfpStatus(@PathVariable("id") Long clientId, @RequestParam(name = "rfpIds", required = false) List<Long> rfpIds) {
        if(clientId == null){
            throw new BadRequestException("clientId cannot be null");
        }

        if(rfpIds == null || rfpIds.isEmpty()){
            return new ResponseEntity<>(
                baseRfpService.getRfpSubmissionStatus(clientId, baseRfpService.getRfpIdsByClientId(clientId)), HttpStatus.OK);
        }else{
            return new ResponseEntity<>(baseRfpService.getRfpSubmissionStatus(clientId, rfpIds), HttpStatus.OK);
        }
    }

    // TODO: Move logic to service
    @ApiOperation(value = "Generates an RFP submission PDF preview",
        notes = "Returns a PDF of RFP submission")
    @GetMapping(value = "/clients/{id}/rfps/{type}/pdf/",
        produces = MediaType.APPLICATION_PDF_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(#clientId, T(CheckAccess).RFP_MODULE_ACCESS_ROLES)")
    public void generateRFPPDFPreviewByRFPType(@PathVariable("id") Long clientId,
                                               @PathVariable("type") String rfpType,
                                               HttpServletResponse response) {
        ByteArrayOutputStream baos = baseRfpService.generatePDF(clientId, rfpType, true);
        byte[] data = baos != null ? baos.toByteArray() : new byte[0];

        try {
            response.setContentType(MediaType.APPLICATION_PDF_VALUE);
            response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "inline");
            response.setContentLength(data.length);

            response.getOutputStream().write(data);
            response.getOutputStream().flush();
        } catch(Exception e) {
            throw new BaseException(e.getMessage(), e);
        }
    }

    @ApiOperation(value = "Generates an RFP submission DOCX preview for all rfp types",
        notes = "Returns a PDF of RFP submission for all rfp types")
    @GetMapping(value = "/clients/{id}/rfps/all/docx/",
        produces = APPLICATION_DOCX_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(#clientId, T(CheckAccess).RFP_MODULE_ACCESS_ROLES)")
    public void generateRFPDOCXPreview(@PathVariable("id") Long clientId, @RequestParam("rfpIds") List<Long> rfpIds,
                                      HttpServletResponse response) {
    	byte[] data =  baseRfpService.generateRfpDOCXsByClient(clientId, rfpIds);
        writeDataToResponse(data, response, APPLICATION_DOCX_VALUE);
    }
    
    @ApiOperation(value = "Generates an RFP submission PDF preview for all rfp types",
        notes = "Returns a PDF of RFP submission for all rfp types")
    @GetMapping(value = "/clients/{id}/rfps/all/pdf/",
        produces = MediaType.APPLICATION_PDF_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(#clientId, T(CheckAccess).RFP_MODULE_ACCESS_ROLES)")
    public void generateRFPPDFPreview(@PathVariable("id") Long clientId, @RequestParam("rfpIds") List<Long> rfpIds,
                                      HttpServletResponse response) {
        ByteArrayOutputStream stream = (ByteArrayOutputStream) baseRfpService
            .generateRfpPDFsByClient(clientId, rfpIds);
        byte[] data = stream.toByteArray();
        writeDataToResponse(data, response, MediaType.APPLICATION_PDF_VALUE);
    }
    
    private void writeDataToResponse(byte[] data, HttpServletResponse response, String contentType) {
    	 try {
	    	 response.setContentType(contentType);
	         response.setHeader("Content-disposition", "inline");
	         response.setContentLength(data.length);
	         response.getOutputStream().write(data);
	         response.getOutputStream().flush();
    	 } catch(Exception e) {
             throw new BaseException(e.getMessage(), e);
         }
    }

    @ApiOperation(value = "Get census info dto", notes = "Returns census info dto")
    @GetMapping(value = "/rfps/census",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(#clientId, T(CheckAccess).RFP_MODULE_ACCESS_ROLES)")
    public ResponseEntity<CensusInfoDto> getCensusInfoByClientCalculations(@RequestParam("clientId") Long clientId) {
        return new ResponseEntity<>(sharedRfpService.getCensusInfoByClientCalculations(clientId), HttpStatus.OK);
    }
}
