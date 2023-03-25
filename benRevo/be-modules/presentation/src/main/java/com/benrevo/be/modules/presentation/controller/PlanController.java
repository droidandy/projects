package com.benrevo.be.modules.presentation.controller;

import com.benrevo.be.modules.presentation.service.BasePlanService;
import com.benrevo.be.modules.shared.service.SharedPlanService;
import com.benrevo.common.dto.CreatePlanDto;
import com.benrevo.common.dto.DeletePlanDto;
import com.benrevo.common.dto.PlanNameByNetworkDetailsDto;
import com.benrevo.common.dto.QuoteOptionAltRxDto;
import com.benrevo.common.dto.RestMessageDto;
import com.benrevo.common.dto.ancillary.AncillaryPlanDto;
import com.benrevo.common.dto.ancillary.RfpQuoteAncillaryPlanDto;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@Api(basePath = "/v1")
@RestController
@RequestMapping("/v1")
@PreAuthorize("@checkAccess.hasRole(T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
public class PlanController {

    @Autowired
    private BasePlanService basePlanService;
    
    @Autowired
    private SharedPlanService sharedPlanService;

    @ApiOperation(value = "Create new plan in existing quote network",
        notes = "Return rfp_quote_network_plan_id of created plan")
    @PostMapping(value = "/plans/create",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@createPlanDtoResolver.resolveClientId(#params), T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<Long> createPlan(@Valid @RequestBody CreatePlanDto params) {
        return new ResponseEntity<>(basePlanService.create(params), HttpStatus.CREATED);
    }
    
    @ApiOperation(value = "Create new Ancillary (life/std/ltd) plan",
        notes = "Return created plan object")
    @PostMapping(value = "/plans/createAncillary",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.hasRole(T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<AncillaryPlanDto> createAncillaryPlan(@RequestBody AncillaryPlanDto params) {
        return new ResponseEntity<>(sharedPlanService.createAncillaryPlan(null, params), HttpStatus.OK);
    }

    @ApiOperation(value = "Update Ancillary plan by id")
    @PutMapping(value = "/plans/{clientId}/{id}/updateAncillary",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.hasRole(T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<AncillaryPlanDto> updateAncillaryPlan(@PathVariable("clientId") Long clientId,
        @PathVariable("id") Long ancillaryPlanId, @RequestBody AncillaryPlanDto params) {

        params.setAncillaryPlanId(ancillaryPlanId);
        return new ResponseEntity<>(sharedPlanService.updateAncillaryPlan(clientId, params), HttpStatus.OK);
    }
    
    @ApiOperation(value = "Get Ancillary plan by id")
    @GetMapping(value = "/plans/ancillary/{id}",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.hasRole(T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<AncillaryPlanDto> getAncillaryPlan(@PathVariable("id") Long ancillaryPlanId) {
        return new ResponseEntity<>(sharedPlanService.getAncillaryPlan(ancillaryPlanId), HttpStatus.OK);
    }
    
    @ApiOperation(value = "Create new RfpQuote Ancillary (life/std/ltd) plan",
        notes = "Return created plan object")
    @PostMapping(value = "/plans/createQuoteAncillary",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.hasRole(T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<RfpQuoteAncillaryPlanDto> createRfpQuoteAncillaryPlan(@RequestBody RfpQuoteAncillaryPlanDto params) {
        return new ResponseEntity<>(basePlanService.createRfpQuoteAncillaryPlan(params), HttpStatus.OK);
    }

    @ApiOperation(value = "Update RfpQuote Ancillary plan by id")
    @PutMapping(value = "/plans/{id}/updateQuoteAncillary",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.hasRole(T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<RfpQuoteAncillaryPlanDto> updateRfpQuoteAncillaryPlan(@PathVariable("id") Long rfpQuoteAncillaryPlanId, 
            @RequestBody RfpQuoteAncillaryPlanDto params) {
        params.setRfpQuoteAncillaryPlanId(rfpQuoteAncillaryPlanId);
        return new ResponseEntity<>(basePlanService.updateRfpQuoteAncillaryPlan(params), HttpStatus.OK);
    }
    
    @ApiOperation(value = "Get RfpQuote Ancillary plan by id")
    @GetMapping(value = "/plans/quoteAncillary/{id}",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.hasRole(T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<RfpQuoteAncillaryPlanDto> getRfpQuoteAncillaryPlan(@PathVariable("id") Long rfpQuoteAncillaryPlanId) {
        return new ResponseEntity<>(basePlanService.getRfpQuoteAncillaryPlan(rfpQuoteAncillaryPlanId), HttpStatus.OK);
    }
    
    @ApiOperation(value = "Update plan in existing quote network")
    @PutMapping(value = "/plans/update",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@createPlanDtoResolver.resolveClientId(#params), T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<RestMessageDto> updatePlan(@Valid @RequestBody CreatePlanDto params) {
        basePlanService.update(params);
        return new ResponseEntity<>(RestMessageDto.createSuccessRestMessageDTO("Plan updated successfully"), HttpStatus.OK);
    }

    @ApiOperation(value = "Update separate RX plan in existing quote network")
    @PutMapping(value = "/plans/updateRx",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@quoteOptionAltRxDtoResolver.resolveClientId(#params), T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<RestMessageDto> updateRxPlan(@Valid @RequestBody QuoteOptionAltRxDto params) {
        basePlanService.updateRxPlan(params);
        return new ResponseEntity<>(RestMessageDto.createSuccessRestMessageDTO("Rx plan updated successfully"), HttpStatus.OK);
    }
    
    @ApiOperation(value = "Update current client plan by id")
    @PutMapping(value = "/plans/current/{clientPlanId}/update",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@clientPlanIdResolver.resolveClientId(#clientPlanId), T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<RestMessageDto> updateCurrentPlan(@Valid @RequestBody CreatePlanDto params,
    		@PathVariable("clientPlanId") Long clientPlanId) {
        basePlanService.updateClientPlan(params, clientPlanId);
        return new ResponseEntity<>(RestMessageDto.createSuccessRestMessageDTO("Client plan updated successfully"), HttpStatus.OK);
    }
    
    @ApiOperation(value = "Update current client plan separate RX by id")
    @PutMapping(value = "/plans/current/{clientPlanId}/updateRx",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@clientPlanIdResolver.resolveClientId(#clientPlanId), T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<RestMessageDto> updateCurrentRxPlan(@Valid @RequestBody QuoteOptionAltRxDto params, 
    		@PathVariable("clientPlanId") Long clientPlanId) {
        basePlanService.updateClientRxPlan(params, clientPlanId);
        return new ResponseEntity<>(RestMessageDto.createSuccessRestMessageDTO("Client RX plan updated successfully"), HttpStatus.OK);
    }

    @ApiOperation(value = "Delete plan in existing quote network")
    @DeleteMapping(value = "/plans/delete",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@deletePlanDtoResolver.resolveClientId(#params), T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<RestMessageDto> deletePlan(@Valid @RequestBody DeletePlanDto params) {
        basePlanService.delete(params);
        return new ResponseEntity<>(RestMessageDto.createSuccessRestMessageDTO("Plan deleted successfully"), HttpStatus.OK);
    }

    @ApiOperation(value = "Retrieves a network's plan details",
        notes = "Return PlanNameByNetwork object details")
    @GetMapping(value = "/plans/network/{pnnId}",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<PlanNameByNetworkDetailsDto> getPlanNameByNetworkById(@PathVariable("pnnId") Long pnnId) {
        return new ResponseEntity<>(basePlanService.getPlanNameByNetworkById(pnnId), HttpStatus.OK);
    }
}
