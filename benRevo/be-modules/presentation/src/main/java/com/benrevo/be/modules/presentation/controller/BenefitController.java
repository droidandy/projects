package com.benrevo.be.modules.presentation.controller;

import com.benrevo.common.dto.QuoteOptionAltPlanDto;
import com.benrevo.data.persistence.helper.PlanBenefitsHelper;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Api(basePath = "/v1")
@RestController
@RequestMapping("/v1")
@PreAuthorize("@checkAccess.hasRole(T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
public class BenefitController {

    @Autowired
    private PlanBenefitsHelper planBenefitsHelper;

    @ApiOperation(value = "Retrieve benefit names by planTye and carrierId",
        notes = "Return the JSON of GenericPlanDetails")
    @GetMapping(value = "/benefitNames/",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<QuoteOptionAltPlanDto.Benefit>> getDefaultPlanTypeBenefits(
        @RequestParam("planType") String planType,
        @RequestParam(value = "includeRx", required = false, defaultValue = "false") boolean includeRx) {
        return new ResponseEntity<>(planBenefitsHelper.getBenefitNamesByPlanType(planType, includeRx), HttpStatus.OK);
    }
    @ApiOperation(value = "Retrieve benefit names by planTye and carrierId",
        notes = "Return the JSON of GenericPlanDetails")
    @GetMapping(value = "/benefitNames/all",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, List<QuoteOptionAltPlanDto.Benefit>>> getDefaultBenefits(
        @RequestParam(value = "includeRx", required = false, defaultValue = "false") boolean includeRx
    ) {
        return new ResponseEntity<>(planBenefitsHelper.getDefaultBenefitNames(includeRx), HttpStatus.OK);
    }
}
