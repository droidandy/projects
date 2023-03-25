package com.benrevo.be.modules.presentation.controller;

import com.benrevo.be.modules.shared.service.SharedRfpService;
import com.benrevo.common.dto.ClientPlanDto;
import com.benrevo.common.dto.ClientPlanEnrollmentsDto;
import com.benrevo.common.dto.ClientPlanEnrollmentsDto.Enrollment;
import com.benrevo.common.dto.RestMessageDto;
import com.benrevo.common.dto.UpdateClientPlanEnrollmentsDto;
import com.benrevo.common.dto.ancillary.AncillaryPlanDto;
import com.benrevo.be.modules.presentation.service.ClientPlanService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@Api(basePath = "/v1")
@RestController
@RequestMapping("/v1")
@PreAuthorize("@checkAccess.hasRole(T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
/*
 * Seems that only 3 API really used from UI: 
 * getClientPlanEnrollments 
 * updateClientPlanEnrollments
 * getClientAncillaryPlansByClientId
 * 
 * Others CRUD API not used  and can be moved to SharedClientPlanController or removed at all
 */
public class ClientPlanController {

    @Autowired
    private ClientPlanService clientPlanService;

    @ApiOperation(value = "Retrieving plans for client by client_id",
        notes = "Return JSON-array of client plans")
    @GetMapping(value = "/clients/{id}/plans",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(#clientId, T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<List<ClientPlanDto>> getClientPlansByClientId(@PathVariable("id") Long clientId, 
            @RequestParam(name = "product", required = false) String product) {
        return new ResponseEntity<>(clientPlanService.getPlansByClientId(clientId, product), HttpStatus.OK);
    }
    
    @ApiOperation(value = "Retrieving Ancillary plans for client by client_id and product",
        notes = "Return JSON-array of ancillary plans")
    @GetMapping(value = "/clients/{id}/plans/ancillary",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(#clientId, T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<List<AncillaryPlanDto>> getClientAncillaryPlansByClientId(@PathVariable("id") Long clientId, 
        @RequestParam(name = "product", required = false) String product) {
        return new ResponseEntity<>(clientPlanService.getAncillaryPlansByClientId(clientId, product), HttpStatus.OK);
    }
    
    @ApiOperation(value = "Create new Ancillary (life/std/ltd) plan for client",
        notes = "Return created plan object")
    @PostMapping(value = "/clients/{id}/plans/createAncillary",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(#clientId, T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<AncillaryPlanDto> createClientAncillaryPlansByClientId(@PathVariable("id") Long clientId, 
    		@RequestBody AncillaryPlanDto params) {
        return new ResponseEntity<>(clientPlanService.createClientAncillaryPlan(clientId, params), HttpStatus.OK);
    }

    @ApiOperation(value = "Retrieving client plans enrollments by client_id",
        notes = "Return JSON obj of client plans enrollments")
    @GetMapping(value = "/clients/{id}/plans/enrollments",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(#clientId, T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<ClientPlanEnrollmentsDto> getClientPlanEnrollments(@PathVariable("id") Long clientId) {
        return new ResponseEntity<>(clientPlanService.getClientPlanEnrollments(clientId), HttpStatus.OK);
    }

    @ApiOperation(value = "Updating client plans enrollments by client_plan_id",
        notes = "Return JSON obj of updated client plan enrollments")
    @PutMapping(value = "/clients/plans/enrollments",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Enrollment> updateClientPlanEnrollments(@Valid @RequestBody List<UpdateClientPlanEnrollmentsDto> params) {
        return new ResponseEntity<>(clientPlanService.updateClientPlanEnrollments(params), HttpStatus.OK);
    }

    @ApiOperation(value = "Create new client plan",
        notes = "Return JSON obj of created client plan")
    @PostMapping(value = "/clients/{id}/plans",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(#clientId, T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<ClientPlanDto> createClientPlan(@Valid @RequestBody ClientPlanDto clientPlanDto,
                                                          @PathVariable("id") Long clientId) {
        clientPlanDto.setClientId(clientId);

        return new ResponseEntity<>(clientPlanService.create(clientPlanDto), HttpStatus.CREATED);
    }

    @ApiOperation(value = "Create client plans from rfp",
        notes = "Returns message")
    @PostMapping(value = "/clients/{id}/plans/rfp",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(#clientId, T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<RestMessageDto> createClientPlanForRfp(@RequestParam("rfpIds") List<Long> rfpIds,
        @PathVariable("id") Long clientId) {

        clientPlanService.createClientPlan(clientId, rfpIds);
        return new ResponseEntity<>(
            RestMessageDto.createSuccessRestMessageDTO("Client plans were successfully created"),
            HttpStatus.CREATED);
    }

    @ApiOperation(value = "Update client plan by id",
        notes = "Return JSON obj of updated client plan")
    @PutMapping(value = "/clients/plans/{id}",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@clientPlanIdResolver.resolveClientId(#id), T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<ClientPlanDto> updateClientPlan(@Valid @RequestBody ClientPlanDto clientPlanDto,
                                                          @PathVariable("id") Long id) {
        clientPlanDto.setClientPlanId(id);

        return new ResponseEntity<>(clientPlanService.update(clientPlanDto), HttpStatus.OK);
    }

    @ApiOperation(value = "Get client plan by id",
        notes = "Return JSON obj of a client plan")
    @GetMapping(value = "/clients/plans/{id}",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@clientPlanIdResolver.resolveClientId(#id), T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<ClientPlanDto> getClientPlan(@PathVariable("id") Long id) {
        return new ResponseEntity<>(clientPlanService.getById(id), HttpStatus.OK);
    }

    @ApiOperation(value = "Remove client plan by id")
    @DeleteMapping(value = "/clients/plans/{id}")
    @PreAuthorize("@checkAccess.checkBrokerage(@clientPlanIdResolver.resolveClientId(#id), T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<Void> deleteClientPlan(@PathVariable("id") Long id) {
        clientPlanService.delete(id);

        return new ResponseEntity<>(HttpStatus.OK);
    }
}
