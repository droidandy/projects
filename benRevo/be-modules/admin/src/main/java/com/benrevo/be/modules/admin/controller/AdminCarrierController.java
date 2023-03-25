package com.benrevo.be.modules.admin.controller;

import com.benrevo.be.modules.shared.service.SharedCarrierService;
import com.benrevo.common.dto.CarrierDto;
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

@Api(basePath = "/admin")
@RestController
@RequestMapping("/admin")
@PreAuthorize("@checkAccess.hasRole(T(CheckAccess).ADMIN_MODULE_ACCESS_ROLES)")
public class AdminCarrierController {

    @Autowired
    private SharedCarrierService carrierService;

    @ApiOperation(value = "Retrieve all carriers",
        notes = "Return JSON-array of carriers.")
    @GetMapping(value = "/carriers/all/",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<CarrierDto>> getAllCarriers() {
        return new ResponseEntity<>(carrierService.getAllCarriers(), HttpStatus.OK);
    }

    @ApiOperation(value = "Retrieve all carriers from the client's rfp",
        notes = "Return JSON-array of carriers from RFP carrier history")
    @GetMapping(value = "client/{clientId}/rfp/{category}/carrierHistory/all/",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<CarrierDto>> getCarriersFromRfpCarrierHistory(@PathVariable("clientId") Long clientId, @PathVariable("category") String category) {
        return new ResponseEntity<>(carrierService.getCarriersFromRfpCarrierHistory(clientId, category), HttpStatus.OK);
    }
}
