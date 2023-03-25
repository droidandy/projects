package com.benrevo.be.modules.rfp.controller;

import com.benrevo.be.modules.rfp.service.RfpPlanService;
import com.benrevo.common.dto.CreatePlanDto;
import com.benrevo.common.dto.RestMessageDto;
import com.benrevo.common.dto.ancillary.AncillaryPlanDto;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import java.util.List;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Api(basePath = "/v1")
@RestController
@RequestMapping("/v1")
@PreAuthorize("@checkAccess.hasRole(T(CheckAccess).RFP_MODULE_ACCESS_ROLES)")
public class RfpPlanController {

    @Autowired
    private RfpPlanService rfpPlanService;

    @ApiOperation(value = "Create or update plans in rfp")
    @PostMapping(value = "/plans/rfp/{rfpId}/create",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@rfpIdResolver.resolveClientId(#rfpId), T(CheckAccess).RFP_MODULE_ACCESS_ROLES)")
    public ResponseEntity<RestMessageDto> createPlansInRfp(@Valid @RequestBody List<CreatePlanDto> params, @PathVariable("rfpId") Long rfpId) {
        rfpPlanService.createOrUpdateInRfp(params, rfpId);
        return new ResponseEntity<>(RestMessageDto.createSuccessRestMessageDTO("Plan stored successfully"), HttpStatus.OK);
    }

    @ApiOperation(value = "Retrieve plans by rfpId")
    @GetMapping(value = "/plans/rfp/{rfpId}",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@rfpIdResolver.resolveClientId(#rfpId), T(CheckAccess).RFP_MODULE_ACCESS_ROLES)")
    public ResponseEntity<List<CreatePlanDto>> getPlansByRfp(@PathVariable("rfpId") Long rfpId) {
        return new ResponseEntity<>(rfpPlanService.getByRfpId(rfpId), HttpStatus.OK);
    }

    @ApiOperation(value = "Create or update ancillary plans in rfp")
    @PostMapping(value = "/plans/rfp/{rfpId}/createAncillary",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@rfpIdResolver.resolveClientId(#rfpId), T(CheckAccess).RFP_MODULE_ACCESS_ROLES)")
    public ResponseEntity<List<AncillaryPlanDto>> createAncillaryPlansInRfp(@Valid @RequestBody List<AncillaryPlanDto> plans, @PathVariable("rfpId") Long rfpId) {
    	rfpPlanService.createOrUpdateAncillaryPlanInRfp(plans, rfpId);
    	return new ResponseEntity<>(rfpPlanService.findAncillaryPlansByRfpId(rfpId), HttpStatus.OK);
    }

    @ApiOperation(value = "Retrieve ancillary plans by rfpId")
    @GetMapping(value = "/plans/rfp/{rfpId}/getAncillary",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@rfpIdResolver.resolveClientId(#rfpId), T(CheckAccess).RFP_MODULE_ACCESS_ROLES)")
    public ResponseEntity<List<AncillaryPlanDto>> getAncillaryPlansByRfp(@PathVariable("rfpId") Long rfpId) {
        return new ResponseEntity<>(rfpPlanService.findAncillaryPlansByRfpId(rfpId), HttpStatus.OK);
    }
}
