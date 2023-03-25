package com.benrevo.be.modules.client.controller;

import com.benrevo.be.modules.shared.service.SharedClientService;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.AttributeDto;
import com.benrevo.common.dto.ClientDto;
import com.benrevo.common.dto.OnBoardingClientDto;
import com.benrevo.common.dto.RestMessageDto;
import com.benrevo.common.exception.BadRequestException;
import com.benrevo.common.exception.BaseException;
import com.benrevo.be.modules.client.service.ClientService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import javax.servlet.http.HttpServletResponse;

@Api(basePath = "/v1")
@RestController
@RequestMapping("/v1")
@PreAuthorize("@checkAccess.hasRole(T(CheckAccess).CLIENT_MODULE_ACCESS_ROLES)")
public class ClientController{

    @Autowired
    private ClientService clientService;

    @Autowired
    private SharedClientService sharedClientService;

    @ApiOperation(value = "Retrieving clients for broker by broker_id",
        notes = "Return JSON-array of clients.")
    @GetMapping(value = "/brokers/{id}/clients",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<ClientDto>> getClientsByBrokerId(@PathVariable("id") Long id) {
        return new ResponseEntity<>(clientService.getClientsByBrokerId(id), HttpStatus.OK);
    }

    @ApiOperation(value = "Retrieving clients for current broker",
        notes = "Return JSON-array of clients.")
    @GetMapping(value = "/clients",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<ClientDto>> getClientsForBroker() {
        Long id = (Long) SecurityContextHolder.getContext().getAuthentication().getDetails();

        return new ResponseEntity<>(clientService.getClientsByBrokerId(id), HttpStatus.OK);
    }
    
    @ApiOperation(value = "Retrieving clients in state in (ON_BOARDING, COMPLETED) across all brokers",
        notes = "Return JSON-array of clients")
    @GetMapping(value = "/clients/onboarding",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<OnBoardingClientDto>> getOnBoardingClients() {
        return new ResponseEntity<>(clientService.getOnBoardingClients(), HttpStatus.OK);
    }

    @ApiOperation(value = "Creating a new client",
        notes = "Return JSON obj of created client.")
    @PostMapping(value = "/clients",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ClientDto> createClient(@RequestBody ClientDto clientDto) {
        Long id = (Long) SecurityContextHolder.getContext().getAuthentication().getDetails();

        //clientDto.setBrokerId(id);

        return new ResponseEntity<>(clientService.create(clientDto, id, false), HttpStatus.CREATED);
    }

    @ApiOperation(value = "Updating a client by id",
        notes = "Return JSON obj of updated client.")
    @PutMapping(value = "/clients/{id}",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(#id, T(CheckAccess).CLIENT_MODULE_ACCESS_ROLES)")
    public ResponseEntity<ClientDto> updateClient(@RequestBody ClientDto clientDto, @PathVariable("id") Long id) {
        clientDto.setId(id);

        return new ResponseEntity<>(clientService.update(clientDto), HttpStatus.OK);
    }

    @ApiOperation(value = "Get a client by id",
        notes = "Return JSON obj of a client.")
    @GetMapping(value = "/clients/{id}",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(#id, T(CheckAccess).CLIENT_MODULE_ACCESS_ROLES)")
    public ResponseEntity<ClientDto> getClientById(@PathVariable("id") Long id) {
        ClientDto result = sharedClientService.getById(id);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }
    
    @ApiOperation(value = "Set client external products",
            notes = "Remove old and set new client external products")
    @PostMapping(value = "/clients/{clientId}/extProducts")
    @PreAuthorize("@checkAccess.checkBrokerage(#clientId, T(CheckAccess).CLIENT_MODULE_ACCESS_ROLES)")
    public ResponseEntity<RestMessageDto> setExternalProducts(@PathVariable("clientId") Long clientId, @RequestBody List<String> externalProducts) {
        clientService.setExternalProducts(clientId, externalProducts);

        return new ResponseEntity<>(new RestMessageDto("The client external products successfully set", true), HttpStatus.CREATED);
    }

    @ApiOperation(value = "Download XML file",
            notes = "Return XML file with client")
    @GetMapping(value = "/clients/{clientId}/file")
    @PreAuthorize("@checkAccess.checkBrokerage(#clientId, T(CheckAccess).CLIENT_MODULE_ACCESS_ROLES)")
    public void exportClient(@PathVariable("clientId") Long clientId, HttpServletResponse response) {
        
        try {
            byte[] result = clientService.exportToXML(clientId);
            response.setContentType(Constants.HTTP_HEADER_CONTENT_TYPE_XML);
            response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=benrevo.xml");
            response.setContentLength(result.length);
            response.getOutputStream().write(result);
            response.getOutputStream().flush();
        } catch(Exception e) {
            throw new BaseException(e.getMessage(), e);
        }
    }

    
    @ApiOperation(value = "Upload XML file as multipart/form-data",
            notes = "Return clientDto with upload status.")
    @PostMapping(value = "/clients/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ClientDto> fileUpload(
            @RequestPart("file") MultipartFile file, 
            @RequestParam(value = "clientName", required = false) String clientName, 
            @RequestParam(value = "override", required = false) boolean override,
            @RequestParam(value = "brokerId", required = false) Long brokerId ) {
        
        ClientDto clientDto;
        
        if (!file.getContentType().toUpperCase().contains("XML")) {
            throw new BadRequestException("Wrong ContentType");
        };

        Long currentBrokerId = (Long) SecurityContextHolder.getContext().getAuthentication().getDetails();
        try {
            clientDto = clientService.importFromXML(IOUtils.toByteArray(file.getInputStream()),clientName, currentBrokerId, override, brokerId);
        } catch(Exception e) {
            throw new BaseException(e.getMessage(), e);
        }
        
        return new ResponseEntity<>(clientDto, (clientDto.getId() == null)?HttpStatus.OK:HttpStatus.CREATED);
    }

    @ApiOperation(value = "Archives the client",
            notes = "Return the result message and operation status.")
    @PostMapping(value = "/clients/{clientId}/archive")
    @PreAuthorize("@checkAccess.checkBrokerage(#clientId, T(CheckAccess).CLIENT_MODULE_ACCESS_ROLES)")
    public ResponseEntity<RestMessageDto> archiveClient(@PathVariable("clientId") Long clientId) {
        clientService.archive(clientId);
        return new ResponseEntity<>(new RestMessageDto("The client has just been archived", true), HttpStatus.CREATED);
    }

    @ApiOperation(value = "Un-archives the client",
            notes = "Return the result message and operation status.")
    @PostMapping(value = "/clients/{clientId}/unarchive")
    @PreAuthorize("@checkAccess.checkBrokerage(#clientId, T(CheckAccess).CLIENT_MODULE_ACCESS_ROLES)")
    public ResponseEntity<RestMessageDto> unArchiveClient(@PathVariable("clientId") Long clientId) {
        clientService.unarchive(clientId);
        return new ResponseEntity<>(new RestMessageDto("The client has just been un-archived", true), HttpStatus.CREATED);
    }

    @ApiOperation(value = "Unset attributes for the client",
            notes = "Return the result message and operation status.")
    @PostMapping(value = "/clients/{clientId}/removeAttributes")
    @PreAuthorize("@checkAccess.checkBrokerage(#clientId, T(CheckAccess).CLIENT_MODULE_ACCESS_ROLES)")
    public ResponseEntity<RestMessageDto> removelientAttributes(@PathVariable("clientId") Long clientId,
            @RequestBody List<AttributeDto> attributes) {
        synchronized(this) {
            clientService.removeAttributes(clientId, attributes);
        }
        return new ResponseEntity<>(new RestMessageDto("The client attributes successfully removed", true), HttpStatus.CREATED);
    }

    @ApiOperation(value = "Retrieving client attributes",
        notes = "Return JSON-array of clients.")
    @GetMapping(value = "/clients/{clientId}/attributes",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(#clientId, T(CheckAccess).CLIENT_MODULE_ACCESS_ROLES)")
    public ResponseEntity<List<AttributeDto>> getClientAttributes(@PathVariable("clientId") Long clientId) {
        return new ResponseEntity<>(clientService.getClientAttributes(clientId), HttpStatus.OK);
    }

    @ApiOperation(value = "Set attributes for the client",
        notes = "Return the result message and operation status.")
    @PostMapping(value = "/clients/{clientId}/saveAttributes")
    @PreAuthorize("@checkAccess.checkBrokerage(#clientId, T(CheckAccess).CLIENT_MODULE_ACCESS_ROLES)")
    public ResponseEntity<RestMessageDto> saveClientAttributes(@PathVariable("clientId") Long clientId,
        @RequestBody List<AttributeDto> attributeDto) {
        synchronized(this) {
            clientService.saveAttributes(clientId, attributeDto);
        }
        return new ResponseEntity<>(new RestMessageDto("The client attributes successfully set", true), HttpStatus.CREATED);
    }

}
