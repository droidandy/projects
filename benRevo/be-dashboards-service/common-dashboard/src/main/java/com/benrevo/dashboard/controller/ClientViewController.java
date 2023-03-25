package com.benrevo.dashboard.controller;

import com.benrevo.common.dto.*;
import com.benrevo.common.enums.ClientState;
import com.benrevo.dashboard.service.ClientDetailsService;
import com.benrevo.dashboard.service.DashboardClientService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.tuple.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Api(basePath = "/dashboard")
@RestController
@RequestMapping("/dashboard")
public class ClientViewController {
    
    @Autowired
    private DashboardClientService dashboardClientService;
    
    @Autowired
    private ClientDetailsService clientDetailsService;
    
    @ApiOperation(value = "Refresh cached Option 1 attributes",
        notes = "Return count of cached options")
    @GetMapping(value = "/refreshCachedOptions",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Integer> refreshCachedOptions(
            @RequestParam(name = "clientId", required = false) Long clientId,
            @RequestParam(name = "brokerId", required = false) Long brokerId) {
        return new ResponseEntity<>(dashboardClientService.refreshCachedOptions(clientId, brokerId), HttpStatus.OK);
    }
    
    @ApiOperation(value = "Retrieving client detail attributes by params",
        notes = "Return JSON array of result table items")
    @GetMapping(value = "/clients/search",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<ClientSearchResult>> searchClientsByParams(
            @RequestParam(name = "product", required = true) String product,
            @RequestParam(name = "brokerIds", required = false) List<Long> brokerIds,
            @RequestParam(name = "clientName", required = false) String clientName,
            @RequestParam(name = "effectiveDateFrom", required = false) String effectiveDateFrom,
            @RequestParam(name = "effectiveDateTo", required = false) String effectiveDateTo,
            @RequestParam(name = "clientStates", required = false) List<ClientState> clientStates,
            @RequestParam(name = "carrierIds", required = false) List<Long> carrierIds,
            @RequestParam(name = "multipleCarriers", required = false) Boolean multipleCarriers,
            @RequestParam(name = "presaleIds", required = false) List<Long> presaleIds,
            @RequestParam(name = "saleIds", required = false) List<Long> saleIds,
            @RequestParam(name = "employeeCountFrom", required = false) Integer employeeCountFrom,
            @RequestParam(name = "employeeCountTo", required = false) Integer employeeCountTo,
            @RequestParam(name = "diffPercentFrom", required = false) Float diffPercentFrom,
            @RequestParam(name = "diffPercentTo", required = false) Float diffPercentTo,
            @RequestParam(name = "diffDollarFrom", required = false) Float diffDollarFrom,
            @RequestParam(name = "diffDollarTo", required = false) Float diffDollarTo,
            @RequestParam(name = "probability", required = false) String probability,
            @RequestParam(name = "rateBankAmount", required = false) Float rateBankAmount,
            @RequestParam(name = "competitiveInfoCarrier", required = false) String competitiveInfoCarrier) {
        
        ClientSearchParams params = new ClientSearchParams();
        params.setProduct(product);
        params.setBrokerIds(brokerIds);
        params.setClientName(clientName);
        params.setEffectiveDateFrom(effectiveDateFrom);
        params.setEffectiveDateTo(effectiveDateTo);
        params.setClientStates(clientStates);
        params.setCarrierIds(carrierIds);
        params.setMultipleCarriers(multipleCarriers);
        params.setPresaleIds(presaleIds);
        params.setSaleIds(saleIds);
        params.setEmployeeCountFrom(employeeCountFrom);
        params.setEmployeeCountTo(employeeCountTo);
        params.setDiffPercentFrom(diffPercentFrom);
        params.setDiffPercentTo(diffPercentTo);
        params.setDiffDollarFrom(diffDollarFrom);
        params.setDiffDollarTo(diffDollarTo);
        params.setProbability(probability);
        params.setRateBankAmount(rateBankAmount);
        params.setCompetitiveInfoCarrier(competitiveInfoCarrier);
        return new ResponseEntity<>(dashboardClientService.searchClientsByParams(params), HttpStatus.OK);
    }

    @ApiOperation(value = "Retrieving summary client count, grouped by state",
            notes = "Return JSON map, where key is state and value is pair of client/employees count")
    @GetMapping(value = "/clients/countByState",
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Pair<Integer, Integer>>> getCountByState(@RequestParam(name = "product") String product) {
        return new ResponseEntity<>(dashboardClientService.countClientsByState(product), HttpStatus.OK);
    }

    @ApiOperation(value = "Retrieving summary client count, grouped by probability",
            notes = "Return JSON map, where key is probability and value is pair of client/employees count")
    @GetMapping(value = "/clients/countByProbability",
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Pair<Integer, Integer>>> getCountByProbability(@RequestParam(name = "product") String product) {
        return new ResponseEntity<>(dashboardClientService.countClientsByProbability(product), HttpStatus.OK);
    }
    
    @ApiOperation(value = "Retrieving clients with pre quoted state",
        notes = "Return JSON array of result")
    @GetMapping(value = "/clients/preQuoted",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, List<ClientPreQuotedDto>>> getPreQuotedClients() {

        return new ResponseEntity<>(dashboardClientService.getPreQuotedClients(), HttpStatus.OK);
    }

    @ApiOperation(value = "Retrieving all available client search filter params",
        notes = "Return JSON object")
    @GetMapping(value = "/clients/search/filters",
        produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ClientSearchFilterParams> getClientFilterParams(@RequestParam("product") String product) {
        return new ResponseEntity<>(dashboardClientService.getClientFilterParams(product), HttpStatus.OK);
    }
    
    @ApiOperation(value = "Get rewards info for all clients",
        notes = "Return the JSON-array of info objects")
    @GetMapping(value = "/clients/rewards",
        produces = MediaType.APPLICATION_JSON_VALUE)
    // FIXME access control
    public ResponseEntity<List<RewardsInfoDto>> getRewardsInfo() {
        return new ResponseEntity<>(clientDetailsService.getRewardsInfoDto(), HttpStatus.OK);
    }
}
