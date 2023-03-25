package com.benrevo.dashboard.controller;

import com.benrevo.be.modules.shared.service.SharedHistoryService;
import com.benrevo.common.dto.HistoryDto;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Api(basePath = "/dashboard")
@RestController
@RequestMapping("/dashboard")
public class AnthemDashboardHistoryController {

    @Autowired
    private SharedHistoryService historyService;

    @ApiOperation(value = "Retrieve latest notifications",
        notes = "Return latest notification")
    @GetMapping(value = "/notifications/{clientId}/{channel}/{name}",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<HistoryDto>> getLastNotification(@PathVariable("clientId") Long clientId,
                                                          @PathVariable("channel") String channel,
                                                          @PathVariable("name") String name) {
        return new ResponseEntity<>(historyService.getLastNotifications(clientId, channel, name), HttpStatus.OK);
    }


}
