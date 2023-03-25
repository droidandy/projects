package com.benrevo.be.modules.presentation.controller;


import static java.lang.String.format;

import com.benrevo.be.modules.presentation.service.RfpQuoteService;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.AlternativeSearchParams;
import com.benrevo.common.dto.CreateRfpQuoteOptionDto;
import com.benrevo.common.dto.CreateRfpQuoteOptionNetworkDto;
import com.benrevo.common.dto.DeleteRfpQuoteAncillaryOptionDto;
import com.benrevo.common.dto.DeleteRfpQuoteOptionDto;
import com.benrevo.common.dto.DeleteRfpQuoteOptionNetworkDto;
import com.benrevo.common.dto.FavoriteRfpQuoteNetworkPlanDto;
import com.benrevo.common.dto.FileDto;
import com.benrevo.common.dto.NetworkDto;
import com.benrevo.common.dto.QuoteOptionContributionsDto;
import com.benrevo.common.dto.QuoteOptionDetailsDto;
import com.benrevo.common.dto.QuoteOptionDisclaimerDto;
import com.benrevo.common.dto.QuoteOptionDto;
import com.benrevo.common.dto.QuoteOptionFinalSelectionDto;
import com.benrevo.common.dto.QuoteOptionListDto;
import com.benrevo.common.dto.QuoteOptionNetworkBriefDto;
import com.benrevo.common.dto.QuoteOptionPlanAlternativesDto;
import com.benrevo.common.dto.QuoteOptionPlanComparisonDto;
import com.benrevo.common.dto.QuoteOptionRidersDto;
import com.benrevo.common.dto.QuoteOptionSubmissionDto;
import com.benrevo.common.dto.QuoteStatusDto;
import com.benrevo.common.dto.RestMessageDto;
import com.benrevo.common.dto.RfpQuoteDto;
import com.benrevo.common.dto.SelectRfpQuoteOptionNetworkAdmFeeDto;
import com.benrevo.common.dto.SelectRfpQuoteOptionNetworkPlanDto;
import com.benrevo.common.dto.UpdateContributionsDto;
import com.benrevo.common.dto.UpdateRfpQuoteOptionNetworkDto;
import com.benrevo.common.dto.ancillary.RfpQuoteAncillaryOptionDto;
import com.benrevo.common.dto.ancillary.SelectRfpQuoteAnsillaryPlanDto;
import com.benrevo.common.enums.AncillaryPlanType;
import com.benrevo.common.enums.OptionType;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.common.exception.BadRequestException;
import com.benrevo.common.exception.BaseException;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import java.util.List;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
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
@PreAuthorize("@checkAccess.hasRole(T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
public class RfpQuoteController {

    @Autowired
    private RfpQuoteService rfpQuoteService;

    @ApiOperation(value = "Retrieving the rfp quotes by client id and rfp carrier id and category",
            notes = "Return the JSON array of quotes")
    @GetMapping(value = "/clients/{clientId}/quotes",
            produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(#clientId, T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<List<RfpQuoteDto>> getRfpQuotes(@PathVariable("clientId") Long clientId,
                                                                 @RequestParam(value = "rfpCarrierId", required = false) Long rfpCarrierId,
                                                                 @RequestParam(value = "category", required = false) String category) {
        List<RfpQuoteDto> result = rfpQuoteService.getQuotes(clientId, rfpCarrierId, category);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @ApiOperation(value = "Select the rfp quote option for final selection",
        notes = "Return result message and operation status")
    @PutMapping(value = "/quotes/options/{id}/select",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@rfpQuoteOptionIdResolver.resolveClientId(#rfpQuoteOptionId), T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<RestMessageDto> selectRfpQuoteOption(@PathVariable("id") Long rfpQuoteOptionId) {
        rfpQuoteService.selectQuoteOption(rfpQuoteOptionId);

        return new ResponseEntity<>(new RestMessageDto("The option were successfully selected", true), HttpStatus.OK);
    }

    @ApiOperation(value = "Remove the rfp quote option from final selection",
        notes = "Return result message and operation status")
    @PutMapping(value = "/quotes/options/{id}/unselect",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@rfpQuoteOptionIdResolver.resolveClientId(#rfpQuoteOptionId), T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<RestMessageDto> unselectRfpQuoteOption(@PathVariable("id") Long rfpQuoteOptionId) {
        rfpQuoteService.unselectQuoteOption(rfpQuoteOptionId);

        return new ResponseEntity<>(new RestMessageDto("The option were successfully unselected", true), HttpStatus.OK);
    }

    @ApiOperation(value = "Select the rfp quote option for final selection",
        notes = "Return JSON object of selected options")
    @GetMapping(value = "/quotes/options/selected",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(#clientId, T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<QuoteOptionFinalSelectionDto> getSelectedRfpQuoteOptions(@RequestParam("clientId") Long clientId) {
        QuoteOptionFinalSelectionDto result = rfpQuoteService.getSelectedQuoteOptions(clientId);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @ApiOperation(value = "Submit the rfp quote option for purchase to the carrier",
        notes = "Return JSON object of selected options and status")
    @PostMapping(value = "/quotes/options/submit",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@quoteOptionSubmissionDtoResolver.resolveClientId(#quoteSubmission), T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<QuoteOptionSubmissionDto> submitQuoteOptions(@Valid @RequestBody QuoteOptionSubmissionDto quoteSubmission) {
        QuoteOptionSubmissionDto result = rfpQuoteService.submitQuoteOptions(quoteSubmission);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @ApiOperation(value = "Retrieving the rfp quote options by client_id and category",
        notes = "Return JSON object of quote options")
    @GetMapping(value = "/quotes/options",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(#clientId, T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<QuoteOptionListDto> getRfpQuoteOptions(@RequestParam("clientId") Long clientId,
                                                                 @RequestParam("category") String category) {
        QuoteOptionListDto result = rfpQuoteService.getQuoteOptions(clientId, category);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }
    
    @ApiOperation(value = "Retrieving the Ancillary products options by client_id and product",
        notes = "Return JSON object of quote options")
    @GetMapping(value = "/quotes/ancillaryOptions",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(#clientId, T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<QuoteOptionListDto> getAncillaryRfpQuoteOptions(
            @RequestParam("clientId") Long clientId, @RequestParam("category") String category) {
        QuoteOptionListDto result = rfpQuoteService.getAncillaryQuoteOptions(clientId, category);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @ApiOperation(value = "Retrieving status of quotes",
        notes = "Return JSON object of quote status")
    @GetMapping(value = "/quotes/status",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(#clientId, T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<List<QuoteStatusDto>> getRfpQuoteStatus(@RequestParam("clientId") Long clientId,
                                                                 @RequestParam("category") String category) {
        List<QuoteStatusDto> result = rfpQuoteService.getQuoteStatus(clientId, category);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @ApiOperation(value = "Retrieving the rfp quote option by rfp_quote_option_id",
        notes = "Return JSON object of quote option details")
    @GetMapping(value = "/quotes/options/{id}",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@rfpQuoteOptionIdResolver.resolveClientId(#id), T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<QuoteOptionDetailsDto> getRfpQuoteOptionById(@PathVariable("id") Long id) {
        QuoteOptionDetailsDto result = rfpQuoteService.getQuoteOptionById(id);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }
    
    @ApiOperation(value = "Retrieving the Ancillary quote option by rfp_quote_ancillary_option_id",
        notes = "Return JSON object of quote option details")
    @GetMapping(value = "/quotes/options/ancillary/{id}",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@rfpQuoteAncillaryOptionIdResolver.resolveClientId(#rfpQuoteAncillaryOptionId), T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<RfpQuoteAncillaryOptionDto> getAncillaryQuoteOptionById(@PathVariable("id") Long rfpQuoteAncillaryOptionId) {
        RfpQuoteAncillaryOptionDto result = rfpQuoteService.getQuoteAncellaryOptionById(rfpQuoteAncillaryOptionId);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @ApiOperation(value = "Retrieving the plan names of rfp quote network alternative plans by rfp_quote_option_network_id",
        notes = "Return JSON object of alternative plans")
    @GetMapping(value = "/quotes/options/alternatives/names",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@rfpQuoteNetworkIdListResolver.resolveClientId(#rfpQuoteNetworkIds), T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<List<QuoteOptionPlanAlternativesDto>> getRfpQuoteOptionAlternativesPlanNames(
        @RequestParam("rfpQuoteNetworkIds") List<Long> rfpQuoteNetworkIds) {
        return new ResponseEntity<>(rfpQuoteService.getQuoteNetworkAlternativesPlanNames(rfpQuoteNetworkIds), HttpStatus.OK);
    }

    @ApiOperation(value = "Retrieving the rfp quote network alternative plans by rfp_quote_option_network_id",
        notes = "Return JSON object of alternative plans")
    @GetMapping(value = "/quotes/options/alternatives",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@rfpQuoteOptionNetworkIdResolver.resolveClientId(#rfpQuoteOptionNetworkId), T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<QuoteOptionPlanAlternativesDto> getRfpQuoteOptionAlternatives(
        @RequestParam("rfpQuoteOptionNetworkId") Long rfpQuoteOptionNetworkId,
        @RequestParam(name = "diffPercentFrom", required = false) Float diffPercentFrom,
        @RequestParam(name = "diffPercentTo", required = false) Float diffPercentTo,
        @RequestParam(name = "copayFrom", required = false) Float copayFrom,
        @RequestParam(name = "copayTo", required = false) Float copayTo,
        @RequestParam(name = "deductibleFrom", required = false) Float deductibleFrom,
        @RequestParam(name = "deductibleTo", required = false) Float deductibleTo,
        @RequestParam(name = "coinsuranceFrom", required = false) Float coinsuranceFrom,
        @RequestParam(name = "coinsuranceTo", required = false) Float coinsuranceTo,
         @RequestParam(name = "favorite", required = false) Boolean favorite
        ) {

        AlternativeSearchParams params = AlternativeSearchParams.Builder.anAlternativeSearchParams()
            .withDiffPercentFrom(diffPercentFrom)
            .withDiffPercentTo(diffPercentTo)
            .withCopayFrom(copayFrom)
            .withCopayTo(copayTo)
            .withDeductibleFrom(deductibleFrom)
            .withDeductibleTo(deductibleTo)
            .withCoinsuranceFrom(coinsuranceFrom)
            .withCoinsuranceTo(coinsuranceTo)
            .withFavorite(favorite)
            .build();

        QuoteOptionPlanAlternativesDto result = rfpQuoteService.getQuoteOptionNetworkAlternatives(rfpQuoteOptionNetworkId, params);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @ApiOperation(value = "Retrieving the quote options comparison by array of rfp_quote_option_id",
        notes = "Return JSON array of option comparison objects")
    @GetMapping(value = "/quotes/options/compare",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@rfpQuoteOptionIdListResolver.resolveClientId(#rfpQuoteOptionIds), T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<List<QuoteOptionPlanComparisonDto>> compareRfpQuoteOptions(@RequestParam("ids") List<Long> rfpQuoteOptionIds,
                                                                                     @RequestParam(name = "currentOptionCompare", required = false, defaultValue = "false") Boolean currentOptionCompare) {
        List<QuoteOptionPlanComparisonDto> result = rfpQuoteService.compareQuoteOptions(rfpQuoteOptionIds, currentOptionCompare);

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    // TODO: Move logic to service?
    @ApiOperation(value = "Retrieving the quote options comparison by array of rfp_quote_option_id via excel file",
        notes = "Return FileDto of excel file with quote options comparison")
    @GetMapping(value = "/quotes/options/compare/file")
    @PreAuthorize("@checkAccess.checkBrokerage(@rfpQuoteOptionIdListResolver.resolveClientId(#rfpQuoteOptionIds), T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public void compareRfpQuoteOptionsFile(@RequestParam("ids") List<Long> rfpQuoteOptionIds, HttpServletResponse response) {
        byte[] result = rfpQuoteService.compareQuoteOptionsFile(rfpQuoteOptionIds);

        try {
            response.setContentType(Constants.HTTP_HEADER_CONTENT_TYPE_XLSX);
            response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=quoteOptionComparison.xlsx");
            response.setContentLength(result.length);
            response.getOutputStream().write(result);
            response.getOutputStream().flush();
        } catch(Exception e) {
            throw new BaseException(e.getMessage(), e);
        }
    }

    @ApiOperation(value = "Retrieving the rfp quote option contributions by rfp_quote_option_id",
        notes = "Return JSON array of contribution objects")
    @GetMapping(value = "/quotes/options/contributions",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@rfpQuoteOptionIdResolver.resolveClientId(#rfpQuoteOptionId), T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<List<QuoteOptionContributionsDto>> getRfpQuoteOptionContributions(
        @RequestParam("rfpQuoteOptionId") Long rfpQuoteOptionId) {
        return new ResponseEntity<>(rfpQuoteService.getQuoteOptionNetworkContributions(rfpQuoteOptionId), HttpStatus.OK);
    }

    @ApiOperation(value = "Updating the rfp quote option contributions by rfp_quote_option_id",
        notes = "Return JSON array of updated contributions for common rfp quote option")
    @PutMapping(value = "/quotes/options/contributions",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@updateContributionsDtoListResolver.resolveClientId(#contributions), T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<List<QuoteOptionContributionsDto>> updateRfpQuoteOptionContributions(
        @Valid @RequestBody List<UpdateContributionsDto> contributions) {
        Long rfpQuoteOptionId = rfpQuoteService.updateQuoteOptionNetworkContributions(contributions);

        return new ResponseEntity<>(rfpQuoteService.getQuoteOptionNetworkContributions(rfpQuoteOptionId), HttpStatus.OK);
    }

    @ApiOperation(value = "Retrieving the avaliable networks for adding to option by rfp_quote_option_id",
        notes = "Return JSON array of quote option networks")
    @GetMapping(value = "/quotes/options/{id}/networks",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@rfpQuoteOptionIdResolver.resolveClientId(#rfpQuoteOptionId), T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<List<QuoteOptionNetworkBriefDto>> getQuoteOptionNetworksToAdd(@PathVariable("id") Long rfpQuoteOptionId) {
        return new ResponseEntity<>(rfpQuoteService.getQuoteOptionNetworksToAdd(rfpQuoteOptionId), HttpStatus.OK);
    }
    
    @ApiOperation(value = "Retrieving the all avaliable networks from quote by rfp_quote_option_id",
        notes = "Return JSON array of quote networks")
    @GetMapping(value = "/quotes/options/{id}/networks/all",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@rfpQuoteOptionIdResolver.resolveClientId(#rfpQuoteOptionId), T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<List<NetworkDto>> getQuoteOptionNetworks(@PathVariable("id") Long rfpQuoteOptionId) {
        return new ResponseEntity<>(rfpQuoteService.getQuoteOptionNetworks(rfpQuoteOptionId), HttpStatus.OK);
    }
    
    @ApiOperation(value = "Retrieving the avaliable networks for switching from rfpQuoteNetworkId in current option by rfp_quote_option_id",
        notes = "Return JSON array of quote networks")
    @GetMapping(value = "/quotes/options/{id}/avaliableNetworks",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@rfpQuoteOptionIdResolver.resolveClientId(#rfpQuoteOptionId), T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<List<QuoteOptionNetworkBriefDto>> getQuoteOptionNetworksToChange(
    		@PathVariable("id") Long rfpQuoteOptionId,
    		@RequestParam("rfpQuoteNetworkId") Long rfpQuoteNetworkId) {
        return new ResponseEntity<>(rfpQuoteService.getQuoteOptionNetworksToChange(rfpQuoteOptionId, rfpQuoteNetworkId), HttpStatus.OK);
    }

    // TODO: Exception handling
    @ApiOperation(value = "Adding the RfpQuoteOptionNetwork item to existing option",
        notes = "Return rfp_quote_option_network_id. "
            + "If params contains only rfpQuoteNetworkId, will be created RfpQuoteOptionNetwork with default zero census values."
            + "If params contains clientPlanId + networkId, will be created RfpQuoteNetwork based on networkId and RfpQuoteOptionNetwork with census values from client plan")
    @PostMapping(value = "/quotes/options/{id}/addNetwork",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@rfpQuoteOptionIdResolver.resolveClientId(#rfpQuoteOptionId), T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<Long> createRfpQuoteOptionNetwork(@PathVariable("id") Long rfpQuoteOptionId,
                                                            @Valid @RequestBody CreateRfpQuoteOptionNetworkDto params) {
        Long result = null;

        if(params.getRfpQuoteNetworkId() != null) {
            if(params.getClientPlanId() != null || params.getNetworkId() != null) {
                throw new BadRequestException("Incorrect params combination: 1) rfpQuoteNetworkId only or 2) clientPlanId + networkId");
            }
            result = rfpQuoteService.createQuoteOptionNetwork(rfpQuoteOptionId, params.getRfpQuoteNetworkId());
        } else if(params.getClientPlanId() != null && params.getNetworkId() != null) {
            result = rfpQuoteService.createOrUpdateQuoteOptionNetwork(rfpQuoteOptionId, params.getClientPlanId(), params.getNetworkId());
        } else {
            throw new BadRequestException("Missing required params: rfpQuoteNetworkId or clientPlanId + networkId");
        }

        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @ApiOperation(value = "Adding the RfpQuoteOptionNetwork item to existing option",
        notes = "If params contains only networkId, will be created RfpQuoteOptionNetwork with default zero census values. ")
    @PostMapping(value = "/quotes/options/{id}/createEmptyNetwork",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@rfpQuoteOptionIdResolver.resolveClientId(#rfpQuoteOptionId), T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<Long> createNewTabRfpQuoteOptionNetwork(@PathVariable("id") Long rfpQuoteOptionId,
        @Valid @RequestBody CreateRfpQuoteOptionNetworkDto params) {

        if(params.getNetworkId() == null){
            throw new BadRequestException("Missing required params: networkId");
        }

        Long result = rfpQuoteService.createOrUpdateQuoteOptionNetwork(rfpQuoteOptionId, null, params.getNetworkId());
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
    
    @ApiOperation(value = "Updating the RfpQuoteOptionNetwork item: "
    		+ "- set new RfpQuoteNetwork "
    		+ "- set ClientPlan to null "
    		+ "- set selected and RX plans to null ",
        notes = "Return rfp_quote_option_network_id of updated item")
    @PutMapping(value = "/quotes/options/{id}/changeNetwork",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@rfpQuoteOptionIdResolver.resolveClientId(#rfpQuoteOptionId), T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<Long> changeRfpQuoteOptionNetwork(@PathVariable("id") Long rfpQuoteOptionId,
                                                            @Valid @RequestBody UpdateRfpQuoteOptionNetworkDto params) {
        Long result = rfpQuoteService.updateQuoteOptionNetwork(params.getRfpQuoteOptionNetworkId(), 
            params.getRfpQuoteNetworkId(), params.getNetworkId());
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @ApiOperation(value = "Removing the rfp quote network from existing option",
        notes = "Return rfp_quote_option_network_id")
    @DeleteMapping(value = "/quotes/options/deleteNetwork",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@deleteRfpQuoteOptionNetworkDtoResolver.resolveClientId(#params), T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<RestMessageDto> deleteRfpQuoteOptionNetwork(@Valid @RequestBody DeleteRfpQuoteOptionNetworkDto params) {
        rfpQuoteService.deleteQuoteOptionNetwork(params.getRfpQuoteOptionNetworkId());

        return new ResponseEntity<>(new RestMessageDto("The option network were successfully deleted", true), HttpStatus.OK);
    }

    @ApiOperation(value = "Creating a new quote option based by 'Option 1'",
        notes = "Return JSON object of quote option details")
    @PostMapping(value = "/quotes/options/create",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@createRfpQuoteOptionDtoResolver.resolveClientId(#params), T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<QuoteOptionDetailsDto> createRfpQuoteOption(@Valid @RequestBody CreateRfpQuoteOptionDto params) {
        QuoteType quoteType = params != null && params.getQuoteType() != null ? params.getQuoteType() : QuoteType.STANDARD;
        OptionType optionType = params != null && params.getOptionType() != null ? params.getOptionType() : OptionType.OPTION;

    	Long quoteOptionId = rfpQuoteService.createQuoteOption(params.getClientId(), params.getRfpCarrierId(), params.getDisplayName(), quoteType, optionType);

        return new ResponseEntity<>(rfpQuoteService.getQuoteOptionById(quoteOptionId), HttpStatus.OK);
    }
    
    @ApiOperation(value = "Creating a new Ancillary quote option",
        notes = "Return JSON object of quote option details")
    @PostMapping(value = "/quotes/options/createAncillary",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@createRfpQuoteOptionDtoResolver.resolveClientId(#params), T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<RfpQuoteAncillaryOptionDto> createAncillaryQuoteOption(@Valid @RequestBody CreateRfpQuoteOptionDto params) {
        OptionType optionType = params != null && params.getOptionType() != null ? params.getOptionType() : OptionType.OPTION;

        Long optionId = rfpQuoteService.createAncillaryQuoteOption(
            params.getClientId(), params.getRfpCarrierId(), params.getDisplayName(), params.getQuoteType(), optionType);

        return new ResponseEntity<>(rfpQuoteService.getQuoteAncellaryOptionById(optionId), HttpStatus.OK);
    }

    @ApiOperation(value = "Updates Option (Standard/Ancillary) display name",
        notes = "Return operation status message")
    @PutMapping(value = "/quotes/options/update",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage("
    		+ "#params.rfpQuoteOptionId != null ? @rfpQuoteOptionIdResolver.resolveClientId(#params.rfpQuoteOptionId)"
    		+ ": @rfpQuoteAncillaryOptionIdResolver.resolveClientId(#params.rfpQuoteAncillaryOptionId), T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<RestMessageDto> updateOptionName(@Valid @RequestBody QuoteOptionDto params) {
        if (params.getRfpQuoteOptionId() != null) {
        	rfpQuoteService.updateOptionDisplayName(params.getRfpQuoteOptionId(), params.getDisplayName());
        } else if (params.getRfpQuoteAncillaryOptionId() != null) {
        	rfpQuoteService.updateAncillaryOptionDisplayName(params.getRfpQuoteAncillaryOptionId(), params.getDisplayName());
        } else {
        	throw new BadRequestException("Missing required param: rfpQuoteOptionId or rfpQuoteAncillaryOptionId");
        }
        return new ResponseEntity<>(new RestMessageDto("The option name successfully updated", true), HttpStatus.OK);
    }

    @ApiOperation(value = "Deleting quote option by rfp_quote_option_id",
        notes = "Return operation status message")
    @DeleteMapping(value = "/quotes/options/delete",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@deleteRfpQuoteOptionDtoResolver.resolveClientId(#params), T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<RestMessageDto> deleteRfpQuoteOption(@Valid @RequestBody DeleteRfpQuoteOptionDto params) {
        rfpQuoteService.deleteQuoteOption(params.getRfpQuoteOptionId());

        return new ResponseEntity<>(new RestMessageDto("The option were successfully deleted", true), HttpStatus.OK);
    }
    
    @ApiOperation(value = "Deleting Ancillary quote option by rfp_quote_ancillary_option_id",
        notes = "Return operation status message")
    @DeleteMapping(value = "/quotes/options/ancillary/delete",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@rfpQuoteAncillaryOptionIdResolver.resolveClientId(#params.rfpQuoteAncillaryOptionId), T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<RestMessageDto> deleteAncillaryRfpQuoteOption(@Valid @RequestBody DeleteRfpQuoteAncillaryOptionDto params) {
        rfpQuoteService.deleteAncillaryQuoteOption(params.getRfpQuoteAncillaryOptionId());

        return new ResponseEntity<>(new RestMessageDto("The option were successfully deleted", true), HttpStatus.OK);
    }
    


    @ApiOperation(value = "Setting plan as favorite for specified quote option network",
        notes = "Return result message and operation status")
    @PutMapping(value = "/quotes/options/favoriteNetworkPlan",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@favoriteRfpQuoteNetworkPlanDtoResolver.resolveClientId(#params), T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<RestMessageDto> favoriteRfpQuoteNetworkPlan(@Valid @RequestBody FavoriteRfpQuoteNetworkPlanDto params) {
        rfpQuoteService.favoriteQuoteOptionNetworkPlan(params.getRfpQuoteNetworkId(), params.getRfpQuoteNetworkPlanId());
        return new ResponseEntity<>(new RestMessageDto("The network plan were successfully favored", true), HttpStatus.OK);
    }

    @ApiOperation(value = "Setting plan as unfavorite for specified quote option network",
        notes = "Return result message and operation status")
    @PutMapping(value = "/quotes/options/unfavoriteNetworkPlan",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@favoriteRfpQuoteNetworkPlanDtoResolver.resolveClientId(#params), T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<RestMessageDto> unfavoriteRfpQuoteNetworkPlan(@Valid @RequestBody FavoriteRfpQuoteNetworkPlanDto params) {
        rfpQuoteService.unfavoriteQuoteOptionNetworkPlan(params.getRfpQuoteNetworkId(), params.getRfpQuoteNetworkPlanId());
        return new ResponseEntity<>(new RestMessageDto("The network plan were successfully unfavored", true), HttpStatus.OK);
    }


    @ApiOperation(value = "Setting plan as selected for specified quote option network",
        notes = "Return result message and operation status")
    @PutMapping(value = "/quotes/options/selectNetworkPlan",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@selectRfpQuoteOptionNetworkPlanDtoResolver.resolveClientId(#params), T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<RestMessageDto> selectRfpQuoteOptionNetworkPlan(@Valid @RequestBody SelectRfpQuoteOptionNetworkPlanDto params) {
        rfpQuoteService.selectQuoteOptionNetworkPlan(params.getRfpQuoteOptionNetworkId(), params.getRfpQuoteNetworkPlanId());

        return new ResponseEntity<>(new RestMessageDto("The network plan were successfully selected", true), HttpStatus.OK);
    }
    
    @ApiOperation(value = "Setting plan as selected for specified ancillary quote option",
        notes = "Return result message and operation status")
    @PutMapping(value = "/quotes/options/selectAncillaryPlan",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@selectRfpQuoteAncillaryPlanDtoResolver.resolveClientId(#params), T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<RestMessageDto> selectRfpQuoteAncillaryPlan(@Valid @RequestBody SelectRfpQuoteAnsillaryPlanDto params) {
        rfpQuoteService.selectRfpQuoteAncillaryPlan(params.getRfpQuoteAncillaryOptionId(), 
        		params.getRfpQuoteAncillaryPlanId(), params.getSecondRfpQuoteAncillaryPlanId(), true);

        return new ResponseEntity<>(new RestMessageDto("The plan were successfully selected", true), HttpStatus.OK);
    }
    
    @ApiOperation(value = "Remove plan selection from specified ancillary quote option",
            notes = "Return result message and operation status")
        @PutMapping(value = "/quotes/options/unselectAncillaryPlan",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
        @PreAuthorize("@checkAccess.checkBrokerage(@selectRfpQuoteAncillaryPlanDtoResolver.resolveClientId(#params), T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
        public ResponseEntity<RestMessageDto> unselectRfpQuoteAncillaryPlan(@Valid @RequestBody SelectRfpQuoteAnsillaryPlanDto params) {
            rfpQuoteService.selectRfpQuoteAncillaryPlan(params.getRfpQuoteAncillaryOptionId(), 
            		params.getRfpQuoteAncillaryPlanId(), params.getSecondRfpQuoteAncillaryPlanId(), false);

            return new ResponseEntity<>(new RestMessageDto("The plan were successfully selected", true), HttpStatus.OK);
        }

    @ApiOperation(value = "Remove plan selection from specified quote option network",
        notes = "Return result message and operation status")
    @PutMapping(value = "/quotes/options/unselectNetworkPlan",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@selectRfpQuoteOptionNetworkPlanDtoResolver.resolveClientId(#params), T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<RestMessageDto> unselectRfpQuoteOptionNetworkPlan(@Valid @RequestBody SelectRfpQuoteOptionNetworkPlanDto params) {
        rfpQuoteService.unselectQuoteOptionNetworkPlan(params.getRfpQuoteOptionNetworkId(), params.getRfpQuoteNetworkPlanId());

        return new ResponseEntity<>(new RestMessageDto("The network plan were successfully unselected", true), HttpStatus.OK);
    }

    @ApiOperation(value = "Setting plan as selected for specified quote option network",
        notes = "Return result message and operation status")
    @PutMapping(value = "/quotes/options/selectSecondNetworkPlan",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@selectRfpQuoteOptionNetworkPlanDtoResolver.resolveClientId(#params), T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<RestMessageDto> selectRfpQuoteOptionNetworkPlanSecond(@Valid @RequestBody SelectRfpQuoteOptionNetworkPlanDto params) {
        rfpQuoteService.selectSecondQuoteOptionNetworkPlan(params.getRfpQuoteOptionNetworkId(), params.getRfpQuoteNetworkPlanId());
        return new ResponseEntity<>(new RestMessageDto("The network plan were successfully selected", true), HttpStatus.OK);
    }

    @ApiOperation(value = "Remove plan selection from specified quote option network",
        notes = "Return result message and operation status")
    @PutMapping(value = "/quotes/options/unselectSecondNetworkPlan",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@selectRfpQuoteOptionNetworkPlanDtoResolver.resolveClientId(#params), T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<RestMessageDto> unselectRfpQuoteOptionNetworkPlanSecond(@Valid @RequestBody SelectRfpQuoteOptionNetworkPlanDto params) {
        rfpQuoteService.unselectSecondQuoteOptionNetworkPlan(params.getRfpQuoteOptionNetworkId(), params.getRfpQuoteNetworkPlanId());
        return new ResponseEntity<>(new RestMessageDto("The network plan were successfully unselected", true), HttpStatus.OK);
    }

    @ApiOperation(value = "Retrieving the riders by rfp_quote_option_id",
        notes = "Return JSON object of riders list")
    @GetMapping(value = "/quotes/options/{id}/riders",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@rfpQuoteOptionIdResolver.resolveClientId(#id), T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<QuoteOptionRidersDto> getQuoteOptionNetworkRiders(@PathVariable("id") Long id) {
        return new ResponseEntity<>(rfpQuoteService.getQuoteOptionRiders(id), HttpStatus.OK);
    }

    @ApiOperation(value = "Select rider by option id and rider id")
    @PostMapping(value = "/quotes/options/{optionId}/riders/{riderId}/select",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@rfpQuoteOptionIdResolver.resolveClientId(#optionId), T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<RestMessageDto> selectRiderByOptionId(@PathVariable("optionId") Long optionId, @PathVariable("riderId") Long riderId) {
        rfpQuoteService.selectRiderByOptionId(optionId, riderId, true);

        return new ResponseEntity<>(
            new RestMessageDto(format("Rider %s successfully selected", riderId), true),
            HttpStatus.OK
        );
    }

    @ApiOperation(value = "Unselect rider by option id and rider id")
    @PostMapping(value = "/quotes/options/{optionId}/riders/{riderId}/unselect",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@rfpQuoteOptionIdResolver.resolveClientId(#optionId), T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<RestMessageDto> unselectRiderByOptionId(@PathVariable("optionId") Long optionId, @PathVariable("riderId") Long riderId) {
        rfpQuoteService.selectRiderByOptionId(optionId, riderId, false);

        return new ResponseEntity<>(
            new RestMessageDto(format("Rider %s successfully unselected", riderId), true),
            HttpStatus.OK
        );
    }
    
    @ApiOperation(value = "Select administrative fee")
    @PutMapping(value = "/quotes/options/selectAdministrativeFee",
    	consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<RestMessageDto> selectRfpQuoteOptionNetworkAdmFee(@Valid @RequestBody SelectRfpQuoteOptionNetworkAdmFeeDto params) {
        rfpQuoteService.selectAdministrativeFee(params.getRfpQuoteOptionNetworkId(), params.getAdministrativeFeeId());

        return new ResponseEntity<>(new RestMessageDto("The administrative fee were successfully selected", true), HttpStatus.OK);
    }

    @ApiOperation(value = "Select rider by option network id and rider id")
    @PostMapping(value = "/quotes/options/networks/{networkId}/riders/{riderId}/select",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@rfpQuoteOptionNetworkIdResolver.resolveClientId(#networkId), T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<RestMessageDto> selectRiderByOptionNetworkId(@PathVariable("networkId") Long networkId, @PathVariable("riderId") Long riderId) {
        rfpQuoteService.selectRiderByOptionNetworkId(networkId, riderId, true);

        return new ResponseEntity<>(
            new RestMessageDto(format("Rider %s successfully selected", riderId), true),
            HttpStatus.OK
        );
    }

    @ApiOperation(value = "Unselect rider by option network id and rider id")
    @PostMapping(value = "/quotes/options/networks/{networkId}/riders/{riderId}/unselect",
        produces = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@rfpQuoteOptionNetworkIdResolver.resolveClientId(#networkId), T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<RestMessageDto> unselectRiderByOptionNetworkId(@PathVariable("networkId") Long networkId, @PathVariable("riderId") Long riderId) {
        rfpQuoteService.selectRiderByOptionNetworkId(networkId, riderId, false);

        return new ResponseEntity<>(
            new RestMessageDto(format("Rider %s successfully unselected", riderId), true),
            HttpStatus.OK
        );
    }

    @ApiOperation(value = "Retrieving the disclaimer by rfp_quote_option_id",
                  notes = "Return JSON object of disclaimer")
    @GetMapping(value = "/quotes/options/{id}/disclaimer",
                produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@rfpQuoteOptionIdResolver.resolveClientId(#id), T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<QuoteOptionDisclaimerDto> getQuoteOptionDisclaimer(@PathVariable("id") Long id) {
        return new ResponseEntity<>(rfpQuoteService.getQuoteOptionDisclaimer(id), HttpStatus.OK);
    }

    @ApiOperation(value = "Retrieving the disclaimers by rfp_quote_option_id",
            notes = "Return JSON object of disclaimers")
    @GetMapping(value = "/quotes/options/{id}/disclaimers",
              produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    @PreAuthorize("@checkAccess.checkBrokerage(@rfpQuoteOptionIdResolver.resolveClientId(#id), T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public ResponseEntity<List<QuoteOptionDisclaimerDto>> getQuoteOptionDisclaimers(@PathVariable("id") Long id) {
        return new ResponseEntity<>(rfpQuoteService.getQuoteOptionDisclaimers(id), HttpStatus.OK);
    }


    @ApiOperation("Download quote file")
    @GetMapping(value = "/quotes/{rfpQuoteId}/file")
    @PreAuthorize("@checkAccess.checkBrokerage(@rfpQuoteIdResolver.resolveClientId(#rfpQuoteId), T(CheckAccess).PRESENTATION_MODULE_ACCESS_ROLES)")
    public void getQuoteFile(@PathVariable("rfpQuoteId") Long rfpQuoteId, HttpServletResponse response) {
        
        try {
            FileDto result = rfpQuoteService.downloadFile(rfpQuoteId);
            response.setContentType(result.getType());
            response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + result.getName()+"\"");
            response.setHeader("Access-Control-Expose-Headers", "Content-Length, Content-Disposition");
            response.setContentLength(result.getSize().intValue());
            response.getOutputStream().write(result.getContent());
            response.getOutputStream().flush();
        } catch(Exception e) {
            throw new BaseException(e.getMessage(), e);
        }

    }
    
}
