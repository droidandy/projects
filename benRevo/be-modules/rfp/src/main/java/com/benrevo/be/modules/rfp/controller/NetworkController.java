package com.benrevo.be.modules.rfp.controller;

import com.benrevo.common.dto.NetworkDto;
import com.benrevo.common.dto.PlanNameByNetworkDto;
import com.benrevo.be.modules.rfp.service.NetworkService;
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
public class NetworkController {

    @Autowired
    private NetworkService networkService;

    @ApiOperation(value = "Retrieves a carrier's networks by type",
        notes = "Return JSON-array of networks associated with a carrier.")
    @GetMapping(value = "/carrier/{carrierId}/network/{type}/all",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<NetworkDto>> getNetworksForCarrier(@PathVariable("carrierId") Long carrierId, @PathVariable("type") String networkType) {
        return new ResponseEntity<>(networkService.getNetworksForCarrier(carrierId, networkType), HttpStatus.OK);
    }
    
    @ApiOperation(value = "Retrieves a carrier's networks",
        notes = "Return JSON-array of networks associated with a carrier.")
    @GetMapping(value = "/carrier/{carrierId}/networks",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<NetworkDto>> getAllNetworksForCarrier(@PathVariable("carrierId") Long carrierId) {
        return new ResponseEntity<>(networkService.getNetworksForCarrier(carrierId, null), HttpStatus.OK);
    }
    
    @ApiOperation(value = "Retrieves a network's plans",
        notes = "Return JSON-array of plans associated with a network")
    @GetMapping(value = "/network/{networkId}/plans",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<PlanNameByNetworkDto>> getPlansForNetwork(@PathVariable("networkId") Long networkId) {
        return new ResponseEntity<>(networkService.getPlansForNetwork(networkId), HttpStatus.OK);
    }
    
    
}
