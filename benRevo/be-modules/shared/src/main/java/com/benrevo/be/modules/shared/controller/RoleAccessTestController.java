package com.benrevo.be.modules.shared.controller;

import com.benrevo.common.dto.AnswerDto;
import io.swagger.annotations.Api;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Api(basePath = "/v1")
@RestController
@RequestMapping("/v1")
// default role chack if API has no @PreAuthorize annotation with roles
@PreAuthorize("@checkAccess.hasRole(T(CheckAccess).CLIENT_MODULE_ACCESS_ROLES)")
public class RoleAccessTestController {

    @GetMapping(value = "/brokerageCheck/{clientId}",
        produces = MediaType.APPLICATION_JSON_VALUE)
    // check only Brokerage access, roles will NOT checked
    @PreAuthorize("@checkAccess.checkBrokerage(#clientId)")
    public ResponseEntity<String> brokerageCheck(@PathVariable("clientId") Long clientId) {
        return new ResponseEntity<>("brokerageCheck OK", HttpStatus.OK);
    }
    
    @PostMapping(value = "/brokerageCheckWithResolver",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    // check only Brokerage access, roles will NOT checked
    @PreAuthorize("@checkAccess.checkBrokerage(@answerDtoResolver.resolveClientId(#dto))")
    public ResponseEntity<String> brokerageCheckWithResolver(@RequestBody AnswerDto dto) {
        return new ResponseEntity<>("OK", HttpStatus.OK);
    }
    
    @PostMapping(value = "/brokerageCheckResolveOnExpression",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    // check only Brokerage access, roles will NOT checked
    @PreAuthorize("@checkAccess.checkBrokerage(#dto.clientId)")
    public ResponseEntity<String> brokerageCheckResolveOnExpression(@RequestBody AnswerDto dto) {
        return new ResponseEntity<>("OK", HttpStatus.OK);
    }
    
    @PostMapping(value = "/brokerageCheckWithResolverAndRoles",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    // check only Brokerage access and CLIENT role
    @PreAuthorize("@checkAccess.checkBrokerage(@answerDtoResolver.resolveClientId(#dto), 'CLIENT')")
    public ResponseEntity<String> brokerageCheckWithResolverAndRoles(@RequestBody AnswerDto dto) {
        return new ResponseEntity<>("OK", HttpStatus.OK);
    }
    
    // used default module role check (see controller level annotation)
    @GetMapping(value = "/controllerRoleCheck",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> controllerRoleCheck() {
        return new ResponseEntity<>("OK", HttpStatus.OK);
    }

    @GetMapping(value = "/methodSingleRoleCheck",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.hasRole('CLIENT')")
    public ResponseEntity<String> methodSingleRoleCheck() {
        return new ResponseEntity<>("OK", HttpStatus.OK);
    }
    
    @GetMapping(value = "/methodModuleRoleCheck",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.hasRole(T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<String> methodModuleRoleCheck() {
        return new ResponseEntity<>("OK", HttpStatus.OK);
    } 
}
