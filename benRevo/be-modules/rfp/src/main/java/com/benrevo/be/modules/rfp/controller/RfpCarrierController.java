package com.benrevo.be.modules.rfp.controller;

import com.benrevo.be.modules.rfp.service.RfpCarrierService;
import com.benrevo.common.dto.NetworkDto;
import com.benrevo.common.dto.RfpCarrierDto;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Api(basePath = "/v1")
@RestController
@RequestMapping("/v1")
@PreAuthorize("@checkAccess.hasRole(T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
public class RfpCarrierController {

    @Autowired
    private RfpCarrierService rfpCarrierService;

    @ApiOperation(value = "Retrieving the rfp carriers by category",
        notes = "Return JSON array of rfp carriers")
    @GetMapping(value = "/rfpcarriers",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<RfpCarrierDto>> getRfpCarriers(@RequestParam("category") String category) {
        return new ResponseEntity<>(rfpCarrierService.getRfpCarriers(category), HttpStatus.OK);
    }

    @ApiOperation(value = "Retrieving the rfp carrier networks by network type",
        notes = "Return JSON array of rfp carrier networks")
    @GetMapping(value = "/rfpcarriers/{id}/networks",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<NetworkDto>> getRfpCarrierNetworks(@PathVariable("id") Long id, @RequestParam("networkType") String networkType) {
        return new ResponseEntity<>(rfpCarrierService.getRfpCarrierNetworks(id, networkType), HttpStatus.OK);
    }
}
