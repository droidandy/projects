package com.benrevo.be.modules.admin.controller;

import com.benrevo.be.modules.admin.service.LoaderService;
import com.benrevo.common.dto.CarrierPlansPreviewDto;
import com.benrevo.common.dto.RestMessageDto;
import com.benrevo.common.exception.BaseException;

import com.benrevo.common.logging.CustomLogger;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Api(basePath = "/admin")
@RestController
@RequestMapping("/admin")
@PreAuthorize("@checkAccess.hasRole(T(CheckAccess).ADMIN_MODULE_ACCESS_ROLES)")
public class PlansUploaderController {

    @Autowired
    private LoaderService loadersService;

    @Autowired
    private CustomLogger LOGGER;

    @ApiOperation(value = "Uploads plans from carriers",
            notes = "Uploads a plans(excel file) to the database")
    @PostMapping(value = "/plans/{carrierName}", consumes = "multipart/form-data")
    public ResponseEntity<RestMessageDto> uploadPlans(@RequestParam("file") MultipartFile file,
        @PathVariable("carrierName") String carrierName,
        @RequestParam(name = "planYear", required = false) Integer planYear,
        @RequestParam(name = "programName", required = false) String programName) {

        try{
            LOGGER.info("Starting plan loading for " + carrierName);
            loadersService.uploadPlans(file, carrierName, programName, planYear);
            LOGGER.info("Finishing plan loading for " + carrierName);
        }catch(Exception e){
            throw new BaseException(e.getMessage(), e);
        }

        return ResponseEntity.ok().body(new RestMessageDto("Plan for carrier= " + carrierName + " uploaded successfully", true));
    }
    
    @ApiOperation(value = "Retrieve changes from new plans",
            notes = "Compare new plans from file and last loaded")
    @PostMapping(value = "/plans/changes/{carrierName}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CarrierPlansPreviewDto> getPlanChanges(@RequestParam("file") MultipartFile file, 
                                                @RequestParam(name = "planYear", required = false) Integer planYear,
    											@PathVariable("carrierName") String carrierName) {
    	CarrierPlansPreviewDto result;
    	try{
    		LOGGER.info("Starting plan preview for " + carrierName);
    		result = loadersService.previewPlans(file, carrierName, planYear);
    		LOGGER.info("Finishing plan preview for " + carrierName);
    	}catch(Exception e){
             throw new BaseException(e.getMessage(), e);
        }
    	return ResponseEntity.ok().body(result);
    }
}
