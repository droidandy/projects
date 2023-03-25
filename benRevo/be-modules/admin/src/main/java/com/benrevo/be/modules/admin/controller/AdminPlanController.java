package com.benrevo.be.modules.admin.controller;

import com.benrevo.be.modules.shared.service.SharedPlanService;
import com.benrevo.common.dto.PlanInfoPageContainerDto;
import com.benrevo.common.enums.CarrierType;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

import java.time.Year;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

/**
 * Created by ebrandell on 4/16/18 at 1:12 PM.
 */
@Api(basePath = "/admin")
@RestController
@RequestMapping("/admin")
@PreAuthorize("@checkAccess.hasRole(T(CheckAccess).ADMIN_MODULE_ACCESS_ROLES)")
public class AdminPlanController {

    @Autowired
    private SharedPlanService sharedPlanService;

    @ApiOperation("Retrieve all, non-custom plans (with networks and benefits) for a given carrier")
    @GetMapping(value = "/plans/{carrier}/{page}", produces = APPLICATION_JSON_VALUE)
    public ResponseEntity<PlanInfoPageContainerDto> getAllPlansByCarrier(
        @PathVariable("carrier") CarrierType carrier,
        @PathVariable("page") Integer page,
        @RequestParam(name = "planYear", required = false) Integer planYear,
        @RequestParam(name = "planType", required = false) String planType,
        @RequestParam(name = "s", required = false) Integer size
    ) {
        page = page != null && page >= 1 ? page - 1 : 0;
        size = size != null && size > 0 && size <= 30 ? size : 30;
        planYear = planYear != null && planYear >= 2017 ? planYear : Year.now().getValue();

        return new ResponseEntity<>(
            sharedPlanService.getAllPlans(carrier, planYear, planType, new PageRequest(page, size)),
            HttpStatus.OK
        );
    }

    @ApiOperation("Retrieve all plan types by carrier")
    @GetMapping(value = "/plans/{carrier}/types", produces = APPLICATION_JSON_VALUE)
    public ResponseEntity<Set<String>> getAllPlanTypesByCarrier(
        @PathVariable("carrier") CarrierType carrier
    ) {
        return new ResponseEntity<>(
            sharedPlanService.getAllPlanTypes(carrier),
            HttpStatus.OK
        );
    }
}
