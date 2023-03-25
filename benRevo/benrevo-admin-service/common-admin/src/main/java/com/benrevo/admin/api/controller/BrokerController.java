package com.benrevo.admin.api.controller;

import com.benrevo.admin.service.BrokerService;
import com.benrevo.be.modules.shared.service.SharedBrokerService;
import com.benrevo.common.dto.BrokerDto;
import com.benrevo.common.dto.ClientMemberDto;
import com.benrevo.common.dto.RestMessageDto;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Api(basePath = "/admin")
@RestController
@RequestMapping("/admin")
@PreAuthorize("@checkAccess.hasRole(T(CheckAccess).ADMIN_MODULE_ACCESS_ROLES)")
public class BrokerController {

    @Autowired
    private BrokerService brokerService;

    @ApiOperation(value = "Request access to Brokerage and Client",
        notes = "Message")
    @PostMapping(value = "/brokers/benrevoGa/request",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RestMessageDto> requestAccessToBrokerageAndClient(@RequestParam("brokerId") Long brokerId,
        @RequestParam("clientId") Long clientId) {

        brokerService.requestAccessToBrokerageAndClient(brokerId, clientId);

        return new ResponseEntity<>(
            new RestMessageDto("Access successfully granted", true),
            HttpStatus.OK
        );
    }

    @ApiOperation(value = "Remove access to Brokerage and Client",
        notes = "Message")
    @DeleteMapping(value = "/brokers/benrevoGa/remove",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RestMessageDto> requestAccessToBrokerageAndClient(@RequestParam("clientId") Long clientId) {

        brokerService.removeAccessToBrokerageAndClient(clientId);

        return new ResponseEntity<>(
            new RestMessageDto("Access successfully removed from client", true),
            HttpStatus.OK
        );
    }

    @ApiOperation(value = "Retrieve all brokers",
        notes = "Return JSON-array of brokers.")
    @GetMapping(value = "/brokers/all/",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<BrokerDto>> getAllBrokers() {
        return new ResponseEntity<>(brokerService.getAllBrokers(), HttpStatus.OK);
    }

}
