package com.benrevo.core.api.controller;

import com.benrevo.core.service.AnthemRfpService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Api(basePath = "/v1")
@RestController
@RequestMapping("/v1")
public class AnthemRfpController {
    
	@Autowired
    @Lazy
    private AnthemRfpService anthemRfpService;


    @ApiOperation(value = "Get available county list")
    @GetMapping(value = "/rfps/countyList",
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<String>> getCountyList() {
        return new ResponseEntity<>(anthemRfpService.getCountyList(), HttpStatus.OK);
    }
}