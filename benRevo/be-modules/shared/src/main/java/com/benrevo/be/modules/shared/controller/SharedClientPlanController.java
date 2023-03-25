package com.benrevo.be.modules.shared.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.benrevo.be.modules.shared.service.SharedPlanService;
import com.benrevo.common.dto.ClientPlanDto;
import com.benrevo.common.dto.CreatePlanDto;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@Api(basePath = "/admin")
@RestController
@RequestMapping("/admin")
public class SharedClientPlanController {

    @Autowired
    private SharedPlanService sharedPlanService;

    @ApiOperation(value = "Retrieving plans for client by client_id",
        notes = "Return JSON-array of client plans")
    @GetMapping(value = "/clients/{clientId}/plans",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<ClientPlanDto>> getClientPlansByClientId(@PathVariable("clientId") Long clientId,
            @RequestParam(name = "product", required = false) String product) {
        return new ResponseEntity<>(sharedPlanService.getPlansByClientId(clientId, product), HttpStatus.OK);
    }
    
    @ApiOperation(value = "Create new plan and linked it with current client plan",
        notes = "Return JSON obj of updated client plan")
    @PostMapping(value = "/clients/plans/{id}/createPlan",
    	consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ClientPlanDto> createAndSetPlan(@RequestBody CreatePlanDto planParams, @PathVariable("id") Long clientPlanId) {
    	ClientPlanDto updated = sharedPlanService.createOrUpdatePlanReferences(clientPlanId, planParams);
    	return new ResponseEntity<>(updated, HttpStatus.CREATED);
    }

    @ApiOperation(value = "Create new plan and linked it with list of current client plan",
        notes = "Return JSON obj of updated client plan")
    @PostMapping(value = "/clients/plans/createPlan",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<ClientPlanDto>> createAndSetPlan(@RequestBody CreatePlanDto planParams, @RequestParam("clientPlanIds") List<Long> clientPlanIds) {
        return new ResponseEntity<>(sharedPlanService.createOrUpdatePlanReferences(clientPlanIds, planParams), HttpStatus.CREATED);
    }

    @ApiOperation(value = "Update Client plans",
            notes = "Return JSON obj of updated client plan")
    @PutMapping(value = "/clients/plans/updatePlan",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<ClientPlanDto>> updateClientPlans(@RequestBody List<ClientPlanDto> clientPlans) {
        return new ResponseEntity<>(sharedPlanService.updateClientPlans(clientPlans), HttpStatus.OK);
    }

    @ApiOperation(value = "Get plans under client plan",
        notes = "Return JSON obj plans under client plan")
    @GetMapping(value = "/clients/plans/{id}/",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CreatePlanDto> getPlans(@PathVariable("id") Long clientPlanId) {
        CreatePlanDto retrieved = sharedPlanService.getPlans(clientPlanId);
        return new ResponseEntity<>(retrieved, HttpStatus.OK);
    }
}
