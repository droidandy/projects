package com.benrevo.be.modules.admin.controller;


import com.benrevo.be.modules.admin.service.BaseAdminRfpQuoteService;
import com.benrevo.common.dto.CreateOption1Dto;
import com.benrevo.common.dto.GetOption1Dto;
import com.benrevo.common.dto.PlanDifferenceDto;
import com.benrevo.common.dto.QuoteNetworkDto;
import com.benrevo.common.dto.RestMessageDto;
import com.benrevo.common.dto.RfpQuoteDto;
import com.benrevo.common.enums.OptionType;
import com.benrevo.common.enums.QuoteType;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@Api(basePath = "/admin")
@RestController
@RequestMapping("/admin")
@PreAuthorize("@checkAccess.hasRole(T(CheckAccess).ADMIN_MODULE_ACCESS_ROLES)")
public class AdminRFPQuoteController {

    @Autowired
    private BaseAdminRfpQuoteService baseRfpQuoteService;

    @ApiOperation("Retrieves all networks and plans of quote")
    @GetMapping(value = "/quoteNetworks", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<QuoteNetworkDto>> getQuoteNetworks(@RequestParam Long rfpQuoteId) {
        return new ResponseEntity<>(baseRfpQuoteService.getRfpQuoteNetworkList(rfpQuoteId), HttpStatus.OK);
    }

    @ApiOperation(value = "Creates or updates Option", notes = "Return id of option")
    @PostMapping(value = "/createOption", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Long> createOption1(@Valid @RequestBody CreateOption1Dto createOption1Dto) {
        return new ResponseEntity<>(baseRfpQuoteService.createOrUpdateOption1(createOption1Dto), HttpStatus.OK);
    }
    
    @ApiOperation(value = "Get plan differences of Option 1", notes = "Return percent and dollar differences of current and match plans")
    @GetMapping(value = "/planDifferences", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<PlanDifferenceDto>> getOption1PlanDifferences(@RequestParam("clientId") Long clientId,
        @RequestParam("optionType") OptionType optionType) {
      return new ResponseEntity<>(baseRfpQuoteService.getOption1PlanDifferences(clientId, optionType), HttpStatus.OK);
    }

    @ApiOperation(value = "Creates Option", notes = "Returns option 1 network and plans")
    @GetMapping(value = "/getOption", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<GetOption1Dto>> getOption1(@RequestParam String category, @RequestParam Long clientId,
        @RequestParam("optionType") OptionType optionType) {
        return new ResponseEntity<>(baseRfpQuoteService.getOption1(category, clientId, optionType), HttpStatus.OK);
    }

    @ApiOperation(value = "Get latest quote information",  notes = "Get latest quote with current plans and networks")
    @GetMapping(value = "/getLatestQuotes/{clientId}/{carrierName}/{optionType}")
    public ResponseEntity<List<RfpQuoteDto>> getLatestQuote(
                                                        @PathVariable("carrierName") String carrierName,
                                                        @PathVariable("clientId") Long clientId,
                                                        @PathVariable("optionType") OptionType optionType) {
        
        return  new ResponseEntity<>(baseRfpQuoteService
            .getRfpQuoteListWithCurrentPlansAndRfpQuoteNetworks(clientId, carrierName, optionType), HttpStatus.OK);
    }    

    @ApiOperation(value = "Delete rfpQuote by Id", notes = "Returns a message about deletion")
    @DeleteMapping(value = "/quotes/delete/{clientId}/{category}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RestMessageDto> deleteQuote(@PathVariable("clientId") Long clientId,
            @PathVariable("category") String category,
            @RequestParam(name = "quoteType", required = false) QuoteType quoteType) {

        baseRfpQuoteService.deleteRfpQuote(clientId, category, quoteType);
        return new ResponseEntity<>(new RestMessageDto("The quote was successfully deleted", true), HttpStatus.OK);
    }
    
}
