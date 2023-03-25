package com.benrevo.be.modules.admin.controller;

import static java.lang.String.format;

import com.benrevo.be.modules.admin.service.AdminClientService;
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
public class AdminClientController{

    @Autowired
    private AdminClientService clientService;

    @ApiOperation(value = "Retrieving clients for broker by broker_id",
        notes = "Return JSON-array of clients.")
    @GetMapping(value = "/brokers/{brokerId}/clients",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<ClientDto>> getClientsByBrokerId(@PathVariable("brokerId") Long brokerId) {
        return new ResponseEntity<>(clientService.getClientsByBrokerId(brokerId), HttpStatus.OK);
    }

    @ApiOperation(value = "Update client status",
            notes = "Return the result message and operation status.")
    @PostMapping(value = "/clients/{clientId}",
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RestMessageDto> updateStatus(@PathVariable("clientId") Long clientId, @RequestBody UpdateStatusDto updateStatusDto) {
        clientService.updateStatus(clientId, updateStatusDto);
        return ResponseEntity.ok().body(new RestMessageDto(String.format("The client state was successfully updated to '%s'", updateStatusDto.getClientState()), true));
    }

    @ApiOperation(value = "Retrieving clients benrevo GA has access to",
        notes = "Return JSON-array of clients.")
    @GetMapping(value = "/brokers/benrevoGa/clients",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<ClientDto>> getBenrevoGaClients() {
        return new ResponseEntity<>(clientService.getClientsBenrevoHasAccessTo(), HttpStatus.OK);
    }
    
    @ApiOperation(value = "Updating a client by id",
        notes = "Return JSON obj of updated client.")
    @PutMapping(value = "/clients/{clientId}",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ClientDto> updateClient(@PathVariable("clientId") Long clientId, @RequestBody ClientDto clientDto) {
        clientDto.setId(clientId);

        return new ResponseEntity<>(clientService.update(clientDto), HttpStatus.OK);
    }

    @ApiOperation(value = "Get a client by id",
        notes = "Return JSON obj of a client.")
    @GetMapping(value = "/clients/{clientId}",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ClientDto> getClientById(@PathVariable("clientId") Long clientId) {

        return new ResponseEntity<>(clientService.getById(clientId), HttpStatus.OK);
    }

    @ApiOperation(value = "Delete a client in RFP_STARTED state",
        notes = "Deletes a client in RFP_STARTED state")
    @DeleteMapping(value = "/clients/{clientId}",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RestMessageDto> deleteClientById(@PathVariable("clientId") Long clientId) {
        clientService.delete(clientId);

        return new ResponseEntity<>(
            new RestMessageDto("Client successfully deleted", true),
            HttpStatus.OK
        );
    }

    @ApiOperation(value = "Move a client from one brokerage to another brokerage",
        notes = "Message")
    @PostMapping(value = "/clients/move",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RestMessageDto> moveClientFromOneBrokerageToAnother(
        @RequestParam("fromBrokerId") Long fromBrokerId,
        @RequestParam("toBrokerId") Long toBrokerId,
        @RequestParam("clientId") Long clientId) {

        clientService.moveClientFromOneBrokerageToAnother(fromBrokerId, toBrokerId, clientId);

        return new ResponseEntity<>(
            new RestMessageDto("Client successfully moved", true),
            HttpStatus.OK
        );
    }

    @ApiOperation(value = "Get list of ClientDto's for a given client name",
            notes = "Return JSON-array of client objects")
    @GetMapping(value = "/clients/{clientName}/search",
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<ClientDto>> searchByClientName(@PathVariable("clientName") String clientName) {
        return new ResponseEntity<>(clientService.searchByClientName(clientName), HttpStatus.OK);
    }
}
