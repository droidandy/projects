package com.benrevo.be.modules.admin.controller;


import com.benrevo.be.modules.admin.domain.clients.BaseOptimizerLoader;
import com.benrevo.common.dto.OptimizerDto;
import com.benrevo.common.dto.BrokerDto;
import com.benrevo.common.dto.RestMessageDto;
import com.benrevo.common.exception.BadRequestException;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.NotFoundException;
import com.benrevo.common.logging.CustomLogger;
import com.benrevo.common.util.JsonUtils;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import static java.lang.String.format;
import static java.util.Objects.isNull;

@Api(basePath = "/admin")
@RestController
@RequestMapping("/admin")
@PreAuthorize("@checkAccess.hasRole(T(CheckAccess).ADMIN_MODULE_ACCESS_ROLES)")
public class OptimizerUploaderController {

    @Autowired
    private BaseOptimizerLoader baseOptimizerLoader;
    
    @Autowired
    private JsonUtils jsonUtils;

    @Autowired
    private CustomLogger LOGGER;

    @ApiOperation(value = "Uploads an optimizer into BenRevo",
            notes = "Uploads an optimizer into BenRevo")
    @PostMapping(value = "/optimizer/upload/", consumes = "multipart/form-data")
    @Deprecated
    public ResponseEntity<RestMessageDto> uploadQuotes(@RequestParam("file") MultipartFile file,
        @RequestParam("dto") String json) {

        LOGGER.info("POST /optimizer/upload/: Uploads a optimizer(excel file) into BenRevo");

        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Empty quote file(s)");
        }

        if(isNull(json)){
            throw new BaseException("Optimizer upload dto cannot be null!");
        }

        OptimizerDto params = jsonUtils.fromJson(json, OptimizerDto.class);

        try{

            String clientName = baseOptimizerLoader.run(file.getInputStream(), params)
                .getClient().getClientName();
            return new ResponseEntity<>(
                new RestMessageDto(format("Optimizer for client_name=%s successfully uploaded", clientName), true),
                HttpStatus.OK
            );
        }catch(Exception e){
            throw new BaseException(e.getMessage(), e);
        }
    }

    @ApiOperation(value = "Uploads an optimizer into BenRevo",
        notes = "Uploads an optimizer into BenRevo")
    @PostMapping(value = "/optimizer/validator/", consumes = "multipart/form-data")
    public ResponseEntity<OptimizerDto> validateOptimizer(@RequestParam("file") MultipartFile file,
        @RequestParam("dto") String json) {

        LOGGER.info("POST /optimizer/validator/: Uploads a optimizer(excel file) into BenRevo");

        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Empty quote file(s)");
        }

        if(isNull(json)){
            throw new BaseException("Optimizer upload dto cannot be null!");
        }

        OptimizerDto params = jsonUtils.fromJson(json, OptimizerDto.class);
        try{
            OptimizerDto validateDto = baseOptimizerLoader.validate(file.getInputStream(), params);
            return new ResponseEntity<>(validateDto,HttpStatus.OK);
        }catch(NotFoundException e){
            throw e;
        }catch(Exception e){
            throw new BaseException(e.getMessage(), e);
        }
    }

    @ApiOperation(value = "Uploads an optimizer into BenRevo",
        notes = "Uploads an optimizer into BenRevo")
    @PostMapping(value = "/optimizer/v2/upload/", 
        consumes = {MediaType.MULTIPART_FORM_DATA_VALUE}, 
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<OptimizerDto> uploadOptimizer(@RequestParam("file") MultipartFile file,
            @RequestParam("dto") String json) {
        
        LOGGER.info("POST /optimizer/v2/upload/: Uploads a optimizer(excel file) into BenRevo");
 
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Empty quote file(s)");
        }

        if(isNull(json)){
            throw new BaseException("Optimizer upload dto cannot be null!");
        }

        OptimizerDto params = jsonUtils.fromJson(json, OptimizerDto.class);

        try{
            OptimizerDto uploaded = baseOptimizerLoader.run(file.getInputStream(), params);
            return new ResponseEntity<>(uploaded, HttpStatus.OK);
        }catch(NotFoundException e){
            throw e;
        }catch(Exception e){
            throw new BaseException(e.getMessage(), e);
        }
    }
}
