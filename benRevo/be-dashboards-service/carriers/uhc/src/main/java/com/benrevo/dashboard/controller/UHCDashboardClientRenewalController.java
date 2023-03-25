package com.benrevo.dashboard.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.benrevo.common.dto.ClientRenewalDto;
import com.benrevo.common.dto.DiscountDataDto;
import com.benrevo.dashboard.service.UHCDashboardClientService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@Api(basePath = "/dashboard")
@RestController
@RequestMapping("/dashboard")
public class UHCDashboardClientRenewalController {
    
    @Autowired
    private UHCDashboardClientService dashboardClientService;
    
    
    @ApiOperation(value = "Retrieving renewal clients at risk",
        notes = "Return JSON array of result")
    @GetMapping(value = "/clients/{product}/atRisk",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<ClientRenewalDto>> getAtRiskClients(@PathVariable("product") String product) {
        
        return new ResponseEntity<>(dashboardClientService.getAtRiskRenewalClients(product), HttpStatus.OK);
    }

    @ApiOperation(value = "Retrieving upcoming renewal clients",
        notes = "Return JSON array of result")
    @GetMapping(value = "/clients/{product}/upcoming",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<ClientRenewalDto>> getUpcomingClients(@PathVariable("product") String product) {
        
        return new ResponseEntity<>(dashboardClientService.getUpcomingRenewalClients(product), HttpStatus.OK);
    }

    @ApiOperation(value = "Retrieving top clients",
        notes = "Return JSON array of result")
    @GetMapping(value = "/clients/topClients",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<ClientRenewalDto>> getTopClients(
            @RequestParam(name = "product", required = false, defaultValue = "MEDICAL") String product) {

        return new ResponseEntity<>(dashboardClientService.getTopClients(product), HttpStatus.OK);
    }

    @ApiOperation(value = "Retrieving discount data renewal clients",
        notes = "Return JSON array of result")
    @GetMapping(value = "/clients/discountData",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<DiscountDataDto> getDiscountData(
            @RequestParam(value = "quarterYear", required = false) String quarterYear) {
        
        return new ResponseEntity<>(dashboardClientService.getSalesTotalDiscount(quarterYear), HttpStatus.OK);
    }

}
