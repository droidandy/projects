package com.benrevo.be.modules.rfp.controller;

import com.benrevo.common.dto.AdministrativeFeeDto;
import com.benrevo.common.dto.CarrierByProductDto;
import com.benrevo.common.dto.CarrierDto;
import com.benrevo.be.modules.shared.service.SharedCarrierService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Api(basePath = "/v1")
@RestController
@RequestMapping("/v1")
@PreAuthorize("@checkAccess.hasRole(T(CheckAccess).RFP_MODULE_ACCESS_ROLES)")
public class CarrierController {

    @Autowired
    private SharedCarrierService carrierService;

    @ApiOperation(value = "Retrieve all carriers",
        notes = "Return JSON-array of carriers.")
    @GetMapping(value = "/carriers/all/",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<CarrierDto>> getAllCarriers() {
        return new ResponseEntity<>(carrierService.getAllCarriers(), HttpStatus.OK);
    }
    
    @ApiOperation(value = "Retrieve all carriers with networks",
        notes = "Return JSON-array of carriers.")
    @GetMapping(value = "/carriers/networks",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<CarrierDto>> getCarriersNetworks() {
        return new ResponseEntity<>(carrierService.getAllCarriers(true), HttpStatus.OK);
    }

    @ApiOperation(value = "Retrieve all carriers",
        notes = "Return JSON-array of carriers.")
    @GetMapping(value = "/carriers/product/all",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CarrierByProductDto> getAllCarriersByCategory() {
        return new ResponseEntity<>(carrierService.getAllCarriersByCategory(), HttpStatus.OK);
    }
    
    @ApiOperation(value = "Retrieve all сarrier administrative fees",
        notes = "Return JSON-array of fees")
    @GetMapping(value = "/carriers/{id}/fees",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<AdministrativeFeeDto>> getCarriersAdministrativeFees(@PathVariable("id") Long carrierId) {
        return new ResponseEntity<>(carrierService.getCarriersAdministrativeFees(carrierId), HttpStatus.OK);
    }

    @ApiOperation(value = "Retrieve all carriers from the client's rfp",
        notes = "Return JSON-array of carriers from RFP carrier history")
    @GetMapping(value = "client/{clientId}/rfp/{category}/carrierHistory/all/",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(#clientId, T(CheckAccess).RFP_MODULE_ACCESS_ROLES)")
    public ResponseEntity<List<CarrierDto>> getCarriersFromRfpCarrierHistory(@PathVariable("clientId") Long clientId,
                                                                             @PathVariable("category") String category) {
        return new ResponseEntity<>(carrierService.getCarriersFromRfpCarrierHistory(clientId, category), HttpStatus.OK);
    }
}
