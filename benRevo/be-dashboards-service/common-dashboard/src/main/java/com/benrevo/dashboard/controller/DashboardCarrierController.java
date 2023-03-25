package com.benrevo.dashboard.controller;

import com.benrevo.be.modules.shared.service.SharedCarrierService;
import com.benrevo.common.dto.CarrierDto;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Api(basePath = "/dashboard")
@RestController
@RequestMapping("/dashboard")
public class DashboardCarrierController {

    @Autowired
    private SharedCarrierService carrierService;

    @ApiOperation(value = "Retrieve all carriers",
        notes = "Return JSON-array of carriers.")
    @GetMapping(value = "/carriers/all",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<CarrierDto>> getAllCarriers() {
        return new ResponseEntity<>(carrierService.getAllCarriers(), HttpStatus.OK);
    }
}
