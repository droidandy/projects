package com.benrevo.be.modules.admin.controller;

import com.benrevo.be.modules.admin.service.HistoryService;
import com.benrevo.common.dto.HistoryDto;
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
public class HistoryController {

    @Autowired
    private HistoryService historyService;

    @ApiOperation(value = "Retrieve latest notification",
        notes = "Return latest notification")
    @GetMapping(value = "/history/notification/{clientId}/{channel}/{name}",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<HistoryDto> getLastNotification(@PathVariable("clientId") Long clientId,
                                                          @PathVariable("channel") String channel,
                                                          @PathVariable("name") String name) {
        return new ResponseEntity<>(historyService.getLastNotification(clientId, channel, name), HttpStatus.OK);
    }

    @ApiOperation(value = "Retrieves last RFP Quote for client and carrier",
        notes = "Retrieve last RFP Quote for client and carrier")
    @GetMapping(value = "/history/rfpQuote/{clientId}/{carrierName}",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<HistoryDto>> getLastQuote(@PathVariable("clientId") Long clientId,
                                                          @PathVariable("carrierName") String carrierName) {
        return new ResponseEntity<>(historyService.getLastQuote(clientId, carrierName), HttpStatus.OK);
    }


    @ApiOperation(value = "Retrieves RFP Quote Summary for client",
        notes = "Retrieves RFP Quote Summary for client")
    @GetMapping(value = "/history/rfpQuoteSummary/{clientId}",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<HistoryDto> getLastQuoteSummary(@PathVariable("clientId") Long clientId) {
        return new ResponseEntity<>(historyService.getLastQuoteSummary(clientId), HttpStatus.OK);
    }
    
}
