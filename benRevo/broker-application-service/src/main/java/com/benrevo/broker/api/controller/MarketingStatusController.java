package com.benrevo.broker.api.controller;

import com.benrevo.broker.service.MarketingStatusService;
import com.benrevo.common.dto.MarketingStatusDto;
import com.benrevo.common.dto.RestMessageDto;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Api(basePath = "/broker")
@RestController
@RequestMapping("/broker")
public class MarketingStatusController {
    
    @Autowired
    private MarketingStatusService marketingStatusService;

    @ApiOperation(value = "Get all product marketing status items by clientId", 
        notes = "Returns array of objects")
    @GetMapping(value = "/clients/{clientId}/marketingStatusList", 
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<MarketingStatusDto>> getMarketingStatusList(@PathVariable("clientId") Long clientId) {
        return new ResponseEntity<>(marketingStatusService.getMarketingStatusList(clientId), HttpStatus.OK);
    }
    
    @ApiOperation(value = "Updates (create missing or remove old) marketing status items by clientId", 
        notes = "Returns array of actual objects")
    @PutMapping(value = "/clients/{clientId}/marketingStatusList", 
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<MarketingStatusDto>> updateMarketingStatusList(
            @PathVariable("clientId") Long clientId, @RequestBody List<MarketingStatusDto> params) {
        return new ResponseEntity<>(marketingStatusService.createOrUpdateMarketingStatusList(clientId, params, true), HttpStatus.OK);
    }
    
    @ApiOperation(value = "Set new status of marketing item by marketingStatusId", 
        notes = "Returns data the same as /updateOption API")
    @PutMapping(value = "/clients/marketingStatusList/{id}/changeStatus", 
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RestMessageDto> changeMarketingStatus(@PathVariable("id") Long marketingStatusId, 
            @RequestBody MarketingStatusDto params) {
        marketingStatusService.changeMarketingStatus(marketingStatusId, params.getStatus());
        return new ResponseEntity<>(RestMessageDto
            .createSuccessRestMessageDTO("Marketing status changed successful"), HttpStatus.OK);
    }
}
