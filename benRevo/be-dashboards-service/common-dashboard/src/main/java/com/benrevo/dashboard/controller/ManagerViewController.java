package com.benrevo.dashboard.controller;

import com.benrevo.common.dto.BrokerVolumeDto;
import com.benrevo.common.dto.RelativeMarketPosition;
import com.benrevo.common.enums.ClientState;
import com.benrevo.dashboard.service.ManagerViewService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Api(basePath = "/dashboard")
@RestController
@RequestMapping("/dashboard")
public class ManagerViewController {
    
    @Autowired
    private ManagerViewService managerViewService;
    
    @ApiOperation(value = "Retrieving the Broker Volume info",
        notes = "Used clientState values: QUOTED & PENDING_APPROVAL (Active Groups) or SOLD & ON_BOARDING (Sold Groups)")
    @GetMapping(value = "/manager/brokerVolume",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<BrokerVolumeDto> getBrokerVolume(@RequestParam("clientState") List<ClientState> clientStates, 
        @RequestParam(name = "product") String product) {
        return new ResponseEntity<>(managerViewService.getBrokerVolume(clientStates, product), HttpStatus.OK);
    }
    
    @ApiOperation(value = "Retrieving the Relative Market Positions",
        notes = "Return JSON array of items")
    @GetMapping(value = "/manager/relativeMarketPosition",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<RelativeMarketPosition>> getRelativeMarketPosition(
            @RequestParam(name = "product", required = false) String product) {
        return new ResponseEntity<>(managerViewService.getRelativeMarketPosition(product), HttpStatus.OK);
    }
    
    @ApiOperation(value = "Retrieving the average Quote Differences",
        notes = "Return JSON array of items")
    @GetMapping(value = "/manager/quoteDifference",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<RelativeMarketPosition>> getAverageQuoteDifferences(@RequestParam(name = "product") String product) {
        return new ResponseEntity<>(managerViewService.getAverageQuoteDifferences(product), HttpStatus.OK);
    }
}
