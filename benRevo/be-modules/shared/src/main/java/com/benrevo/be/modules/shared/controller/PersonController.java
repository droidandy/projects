package com.benrevo.be.modules.shared.controller;

import com.benrevo.be.modules.shared.service.PersonService;
import com.benrevo.common.dto.PersonDto;
import com.benrevo.common.dto.RelationDto;
import com.benrevo.common.dto.RestMessageDto;
import com.benrevo.common.enums.PersonType;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import java.util.List;
import javax.validation.Valid;
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

@Api(basePath = "/v1")
@RestController
@RequestMapping("/v1")
public class PersonController {

    @Autowired
    private PersonService personService;
    
    @ApiOperation(value = "Return persons by params", 
        notes = "If carrierId not passed, used default app.carrier")
    @GetMapping(value = "/persons/find", 
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<PersonDto>> getByTypeAndCarrier(
        @RequestParam(name = "type", required = false) PersonType type,
        @RequestParam(name = "carrierId", required = false) Long carrierId) {
        return new ResponseEntity<>(personService.getByTypeAndCarrier(type, carrierId), HttpStatus.OK);
    }

    @ApiOperation(value = "Get person by id",
        notes = "Return  person object")
    @GetMapping(value = "/persons/{id}",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<PersonDto> getById(@PathVariable("id") Long personId) {
        return new ResponseEntity<>(personService.getById(personId), HttpStatus.OK);
    }
    
    @ApiOperation(value = "Return child persons by parent", 
        notes = "Return array of person objects")
    @GetMapping(value = "/persons/children", 
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.hasRole('ADMINISTRATOR')")
    public ResponseEntity<List<PersonDto>> getChildren(@RequestParam(name = "parentPersonId") Long parentPersonId) {
        return new ResponseEntity<>(personService.getChildren(parentPersonId), HttpStatus.OK);
    }
    
    @ApiOperation(value = "Create new person",
        notes = "Return created person object")
    @PostMapping(value = "/persons/create",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.hasRole('ADMINISTRATOR')")
    public ResponseEntity<PersonDto> create(@Valid @RequestBody PersonDto params) {
        return new ResponseEntity<>(personService.create(params), HttpStatus.CREATED);
    }

    @ApiOperation(value = "Create new person",
        notes = "Return created person object")
    @PostMapping(value = "/persons/createList",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.hasRole('ADMINISTRATOR')")
    public ResponseEntity<List<PersonDto>> ListCreate(@Valid @RequestBody List<PersonDto> params) {
        return new ResponseEntity<>(personService.create(params), HttpStatus.CREATED);
    }
    
    @ApiOperation(value = "Add new persons relation")
    @PostMapping(value = "/persons/addChild",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.hasRole('ADMINISTRATOR')")
    public ResponseEntity<RestMessageDto> addChild(@Valid @RequestBody RelationDto params) {
        personService.addChild(params.getParentId(), params.getChildId());
        return new ResponseEntity<>(RestMessageDto.createSuccessRestMessageDTO(
            "The person relation were successfully created"), HttpStatus.CREATED);
    }
    
    @ApiOperation(value = "Delete existing persons relation")
    @DeleteMapping(value = "/persons/deleteChild",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.hasRole('ADMINISTRATOR')")
    public ResponseEntity<RestMessageDto> deleteChild(@Valid @RequestBody RelationDto params) {
        personService.deleteChild(params.getParentId(), params.getChildId());
        return new ResponseEntity<>(RestMessageDto.createSuccessRestMessageDTO(
            "The person relation were successfully deleted"), HttpStatus.OK);
    }

    @ApiOperation(value = "Update existing person",
        notes = "Return updated person object")
    @PutMapping(value = "/persons/update",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.hasRole('ADMINISTRATOR')")
    public ResponseEntity<PersonDto> update(@Valid @RequestBody PersonDto params) {       
        return new ResponseEntity<>(personService.update(params), HttpStatus.OK);
    }
    
    @ApiOperation(value = "Delete existing person")
    @DeleteMapping(value = "/persons/delete",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.hasRole('ADMINISTRATOR')")
    public ResponseEntity<RestMessageDto> delete(@Valid @RequestBody PersonDto params) {
        personService.delete(params.getPersonId());
        return new ResponseEntity<>(RestMessageDto.createSuccessRestMessageDTO("Person deleted successfully"), HttpStatus.OK);
    }
}
