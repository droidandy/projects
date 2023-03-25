package com.benrevo.broker.api.controller;

import com.benrevo.be.modules.presentation.service.RfpQuoteService;
import com.benrevo.be.modules.shared.service.pptx.BasePptxPresentationService;
import com.benrevo.broker.service.PresentationService;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.PresentationAlternativeDto;
import com.benrevo.common.dto.PresentationQuoteOptionListDto;
import com.benrevo.common.dto.PresentationUpdateDto;
import com.benrevo.common.dto.QuoteOptionDisclaimerDto;
import com.benrevo.common.dto.QuoteOptionPlanComparisonDto;
import com.benrevo.common.dto.RestMessageDto;
import com.benrevo.common.dto.RfpQuoteOptionDto;
import com.benrevo.common.dto.ancillary.RfpQuoteAncillaryPlanComparisonDto;
import com.benrevo.common.exception.BaseException;
import com.benrevo.data.persistence.entities.PresentationOption;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Api(basePath = "/broker")
@RestController
@RequestMapping("/broker")
public class PresentationController {

    @Autowired
    private PresentationService presentationService;
    
    @Autowired
    private RfpQuoteService rfpQuoteService;
    
    @Autowired
    private BasePptxPresentationService basePptxPresentationService;

    @ApiOperation(value = "Init empty cards for Build Presentation section", 
        notes = "Creates Renewal card")
    @PostMapping(value = "/presentation/initOptions", 
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RestMessageDto> initOptions(@RequestBody RfpQuoteOptionDto params) {
        presentationService.initOptions(params);
        return new ResponseEntity<>(
            RestMessageDto.createSuccessRestMessageDTO("Options successfully initialized."), HttpStatus.OK);
    }
    
    @ApiOperation(value = "Updates option plans base info: rates, contributions, enrollments, renewal",
        notes = "Returns updated option object")
    @PutMapping(value = "/presentation/updateOption", 
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RfpQuoteOptionDto> updateOption(@RequestBody RfpQuoteOptionDto params) {
        return new ResponseEntity<>(presentationService.updateOption(params), HttpStatus.OK);
    }
    
    @ApiOperation(value = "Get option by id or by client+product (Current option only)", 
        notes = "Returns data the same as /updateOption API")
    @GetMapping(value = "/presentation/getOption", 
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RfpQuoteOptionDto> getOption(
            @RequestParam(name = "clientId", required = false) Long clientId,
            @RequestParam(name = "product", required = false) String product,
            @RequestParam(name = "rfpQuoteOptionId", required = false) Long rfpQuoteOptionId) {
        RfpQuoteOptionDto result = null;
        if(rfpQuoteOptionId != null) { 
            result = presentationService.getOptionInfo(rfpQuoteOptionId);
        } else if(clientId != null && product != null) {            
            result = presentationService.getCurrentOptionInfo(clientId, product);
        } else {
            throw new BaseException("Missing required params: rfpQuoteOptionId or clientId+product");
        }
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
    
    @ApiOperation(value = "Download PowerPointPresentation file",
        notes = "Return pptx file")
    @GetMapping(value = "/presentation/file/powerPoint")
    public void downloadPowerPointPresentationFile(@RequestParam(name = "clientId") Long clientId, HttpServletResponse response) {
        
        byte[] result = basePptxPresentationService.getByClientId(clientId);

        try {
            response.setContentType(Constants.HTTP_HEADER_CONTENT_TYPE_PPTX);
            response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=presentation.pptx");
            response.setContentLength(result.length);
            response.getOutputStream().write(result);
            response.getOutputStream().flush();
        } catch(Exception e) {
            throw new BaseException(e.getMessage(), e);
        }
    }
    
    @ApiOperation(value = "Retrieving the quote plans comparison", 
        notes = "Return JSON array of option comparison objects")
    @GetMapping(value = "/presentation/comparePlans",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<QuoteOptionPlanComparisonDto>> comparePlans(
            @RequestParam("product") String product, @RequestParam("clientPlanId") Long clientPlanId,
            @RequestParam(name = "carrierIds", required = false) List<Long> carrierIds) {
        if(carrierIds == null) {
            carrierIds = new ArrayList<>();
        }
        List<QuoteOptionPlanComparisonDto> result = presentationService.comparePlans(product, clientPlanId, carrierIds);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
    
    @ApiOperation(value = "Retrieving the quote anlillary plans comparison", 
        notes = "Return JSON array of option comparison objects")
    @GetMapping(value = "/presentation/compareAncillaryPlans",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<RfpQuoteAncillaryPlanComparisonDto>> compareAncillaryPlans(
            @RequestParam("product") String product, @RequestParam("clientId") Long clientId,
            @RequestParam(name = "carrierIds", required = false) List<Long> carrierIds) {
        List<RfpQuoteAncillaryPlanComparisonDto> result = rfpQuoteService.compareAncillaryPlans(product, clientId, carrierIds);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
    
    @ApiOperation(value = "Retrieving the quote anlillary plans comparison via excel file",
        notes = "Return .xlsx file with plans comparison")
    @GetMapping(value = "/presentation/compareAncillaryPlans/file")
    public void compareAncillaryPlansFile(@RequestParam("product") String product, @RequestParam("clientId") Long clientId,
            @RequestParam(name = "carrierIds", required = false) List<Long> carrierIds, HttpServletResponse response) {
        byte[] result = rfpQuoteService.compareAncillaryPlansFile(product, clientId, carrierIds);

        try {
            response.setContentType(Constants.HTTP_HEADER_CONTENT_TYPE_XLSX);
            response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=plansComparison.xlsx");
            response.setContentLength(result.length);
            response.getOutputStream().write(result);
            response.getOutputStream().flush();
        } catch(Exception e) {
            throw new BaseException(e.getMessage(), e);
        }
    }

    @ApiOperation(value = "Retrieving the quote plans comparison via excel file",
        notes = "Return .xlsx file with quote plans comparison")
    @GetMapping(value = "/presentation/comparePlans/file")
    public void comparePlansFile(@RequestParam("product") String product, @RequestParam("clientPlanId") Long clientPlanId,
            @RequestParam(name = "carrierIds", required = false) List<Long> carrierIds, HttpServletResponse response) {
        if(carrierIds == null) {
            carrierIds = new ArrayList<>();
        }
        byte[] result = presentationService.comparePlansFile(product, clientPlanId, carrierIds);

        try {
            response.setContentType(Constants.HTTP_HEADER_CONTENT_TYPE_XLSX);
            response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=plansComparison.xlsx");
            response.setContentLength(result.length);
            response.getOutputStream().write(result);
            response.getOutputStream().flush();
        } catch(Exception e) {
            throw new BaseException(e.getMessage(), e);
        }
    }


    @ApiOperation(value = "Get set presentation options",
        notes = "Returns data for set up presentation page")
    @GetMapping(value = "/presentation/{clientId}/presentationOption",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(#clientId, T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<PresentationQuoteOptionListDto> getSetUpPresentationOptions(
        @PathVariable("clientId") Long clientId) {
        return new ResponseEntity<>(presentationService.getPresentationAlternatives(clientId), HttpStatus.OK);
    }

    @ApiOperation(value = "Create new presentation alternative",
        notes = "Returns data for set up presentation page")
    @PostMapping(value = "/presentation/{clientId}/alternativeColumn/create",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(#clientId, T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<List<PresentationAlternativeDto>> createPresentationAlternative(
        @PathVariable("clientId") Long clientId, @Valid @RequestBody List<PresentationAlternativeDto> dtos) {
        return new ResponseEntity<>(presentationService.createPresentationAlternative(clientId, dtos), HttpStatus.OK);
    }

    @ApiOperation(value = "Update presentation option",
        notes = "Returns data for set up presentation page")
    @PutMapping(value = "/presentation/presentationOption",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@presentationUpdateDtoResolver.resolveClientId(#presentationUpdateDto), T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<PresentationQuoteOptionListDto> updatePresentationOption(
        @RequestBody PresentationUpdateDto presentationUpdateDto) {
        
        PresentationOption option = presentationService.updatePresentationOption(presentationUpdateDto);
        return new ResponseEntity<>(presentationService.getPresentationAlternatives(option.getClient().getClientId()), HttpStatus.OK);

    }

    @ApiOperation(value = "Delete presentation option",
        notes = "Returns data for set up presentation page")
    @DeleteMapping(value = "/presentation/presentationOption",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@presentationUpdateDtoResolver.resolveClientId(#presentationUpdateDto), T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<PresentationQuoteOptionListDto> deletePresentationOption(
        @RequestBody PresentationUpdateDto presentationUpdateDto) {
        
        PresentationOption option = presentationService.deletePresentationOption(presentationUpdateDto);
        return new ResponseEntity<>(presentationService.getPresentationAlternatives(option.getClient().getClientId()), HttpStatus.OK);
    }

    @ApiOperation(value = "Delete presentation option by id",
        notes = "Returns data for set up presentation page")
    @DeleteMapping(value = "/presentation/presentationOption/{id}",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@presentationOptionIdResolver.resolveClientId(#id), T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<RestMessageDto> deletePresentationOptionById(
        @PathVariable("id") Long id) {

        presentationService.deletePresentationOptionById(id);
        return new ResponseEntity<>(
            RestMessageDto.createSuccessRestMessageDTO("Presentation option successfully deleted."), HttpStatus.OK);
    }
    
    @ApiOperation(value = "Retrieving the disclosures by product, client and carrier names",
            notes = "Return JSON-array of disclosures objects grouped by carrier")
    @GetMapping(value = "/presentation/disclosures",
          produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<Map<String, QuoteOptionDisclaimerDto>> getQuoteDisclosures(
            @RequestParam("product") String product, @RequestParam("clientId") Long clientId, 
            @RequestParam(name = "carrierNames", required = false) List<String> carrierNames) {
        return new ResponseEntity<>(presentationService.getQuoteDisclosures(product, clientId, carrierNames), HttpStatus.OK);
    }
    
}
