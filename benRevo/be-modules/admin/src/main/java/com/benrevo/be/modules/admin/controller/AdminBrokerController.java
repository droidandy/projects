package com.benrevo.be.modules.admin.controller;

import com.benrevo.be.modules.admin.service.AdminClientService;
import com.benrevo.be.modules.shared.service.SharedBrokerService;
import com.benrevo.common.dto.BrokerDto;
import com.benrevo.common.dto.ClientDto;
import com.benrevo.common.dto.RestMessageDto;
import com.benrevo.common.dto.UpdateStatusDto;
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
public class AdminBrokerController {

    @Autowired
    private SharedBrokerService sharedBrokerService;

    @ApiOperation(value = "Update existing broker address attributes",
        notes = "Return updated broker object")
    @PutMapping(value = "/brokers/update",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<BrokerDto> update(@RequestBody BrokerDto params) {
        return new ResponseEntity<>(sharedBrokerService.update(params), HttpStatus.OK);
    }
}
