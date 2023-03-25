package com.benrevo.be.modules.admin.controller;

import com.benrevo.be.modules.admin.service.AdminNetworkService;
import com.benrevo.common.dto.NetworkDto;
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
public class AdminNetworkController {

    @Autowired
    private AdminNetworkService adminNetworkService;

    @ApiOperation(value = "Retrieves a carrier's networks",
        notes = "Return JSON-array of networks associated with a carrier.")
    @GetMapping(value = "/carrier/{carrierId}/network/{type}/all",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<NetworkDto>> getNetworksForCarrier(@PathVariable("carrierId") Long carrierId, @PathVariable("type") String networkType) {
        return new ResponseEntity<>(adminNetworkService.getNetworksForCarrier(carrierId, networkType), HttpStatus.OK);
    }
    
}
