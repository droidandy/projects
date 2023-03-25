package com.benrevo.be.modules.admin.controller;

import com.benrevo.be.modules.admin.controller.AdminAbstractControllerTest;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.HistoryDto;
import com.benrevo.common.enums.QuoteType;
import com.benrevo.data.persistence.entities.*;
import com.benrevo.data.persistence.repository.BrokerRepository;
import com.benrevo.data.persistence.repository.ClientFileRepository;

import java.util.ArrayList;
import java.util.List;
import org.json.JSONObject;
import org.junit.Assert;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static java.util.Comparator.comparing;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.http.HttpHeaders.CONTENT_TYPE;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class HistoryControllerTest extends AdminAbstractControllerTest {

    @Autowired
    private ClientFileRepository fileRepository;

    @Autowired
    private BrokerRepository brokerRepository;

    private String UNKNOWN = "N/A";
    private final String HEADER_BEARER = "Bearer ";
    private final String APPLICATION_JSON = "application/json";
    private final String APPLICATION_JSON_UTF_8 = "application/json;charset=UTF-8";

    @Test
    public void getEmailLastNotification() throws Exception {
        Client client = testEntityHelper.createTestClient("unitTestClient", broker);
        List<Notification> notifications = new ArrayList<>();
        notifications.add(testEntityHelper.createNotification(client.getClientId(), "QUOTE_READY", "EMAIL"));
        notifications.add(testEntityHelper.createNotification(client.getClientId(), "QUOTE_READY", "EMAIL"));
        notifications.add(testEntityHelper.createNotification(client.getClientId(), "QUOTE_READY", "EMAIL"));

        notifications.sort(comparing(Notification::getDate));

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/admin/history/notification/{clientId}/{channel}/{name}",
            client.getClientId(), "EMAIL", "QUOTE_READY")
            .header(AUTHORIZATION, HEADER_BEARER + token)
            .header(CONTENT_TYPE, APPLICATION_JSON)
            .accept(MediaType.parseMediaType(APPLICATION_JSON_UTF_8)))
            .andExpect(status().isOk())
            .andExpect(content().contentType(APPLICATION_JSON_UTF_8))
            .andReturn();

        String body = result.getResponse().getContentAsString();
        JSONObject obj = new JSONObject(body);
        Assert.assertEquals(obj.getString("name"), "QUOTE_READY");
        Assert.assertNotNull(obj.getString("date"));
        Assert.assertEquals(obj.getString("date"), notifications.get(notifications.size()-1).getDate().toString());
    }

    @Test
    public void getEmptyEmailNotification() throws Exception {
        Client client = testEntityHelper.createTestClient("unitTestClient2", broker);

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/admin/history/notification/{clientId}/{channel}/{name}",
            client.getClientId(), "EMAIL", "QUOTE_READY")
            .header(AUTHORIZATION, HEADER_BEARER + token)
            .header(CONTENT_TYPE, APPLICATION_JSON)
            .accept(MediaType.parseMediaType(APPLICATION_JSON_UTF_8)))
            .andExpect(status().isOk())
            .andReturn();

        String body = result.getResponse().getContentAsString();
        Assert.assertNotEquals(body.length(),0);
    }

    private RfpQuote createQuote(RfpSubmission rfpSubmission, RfpCarrier rfpCarrier, Carrier carrier, Client client, String category, QuoteType quoteType){

        if(rfpCarrier == null) {
            rfpCarrier = testEntityHelper.createTestRfpCarrier(carrier, category);
            rfpSubmission = testEntityHelper.createTestRfpSubmission(client, rfpCarrier);
        }
        return testEntityHelper.createTestRfpQuote(rfpSubmission, quoteType);
    }

    @Test
    public void getLastQuotes() throws Exception {
        Carrier carrier = testEntityHelper.createTestCarrier();
        Client client = testEntityHelper.createTestClient("unitTestClient3", broker);

        RfpCarrier medicalRfpCarrier = testEntityHelper.createTestRfpCarrier(carrier, Constants.MEDICAL);
        RfpSubmission rfpSubmission = testEntityHelper.createTestRfpSubmission(client, medicalRfpCarrier);
        RfpQuote medicalWithoutKaiserQuote = createQuote(rfpSubmission, medicalRfpCarrier, carrier, client, Constants.MEDICAL, QuoteType.STANDARD);
        RfpQuote medicalWithKaiserQuote = createQuote(rfpSubmission, medicalRfpCarrier, carrier, client, Constants.MEDICAL, QuoteType.KAISER);
        RfpQuote dentalQuote = createQuote(null, null, carrier, client, Constants.DENTAL, QuoteType.STANDARD);
        RfpQuote visionQuote = createQuote(null,null, carrier, client, Constants.VISION, QuoteType.STANDARD);


        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/admin/history/rfpQuote/{clientId}/{carrierName}",
            client.getClientId(), carrier.getName())
            .header(AUTHORIZATION, HEADER_BEARER + token)
            .header(CONTENT_TYPE, APPLICATION_JSON)
            .accept(MediaType.parseMediaType(APPLICATION_JSON_UTF_8)))
            .andExpect(status().isOk())
            .andExpect(content().contentType(APPLICATION_JSON_UTF_8))
            .andReturn();

        String body = result.getResponse().getContentAsString();
        HistoryDto[] historyList = jsonUtils.fromJson(body, HistoryDto[].class);

        Assert.assertEquals(historyList.length, 4);

        for(HistoryDto hist : historyList){
            if(hist.getName().equalsIgnoreCase("Medical_with_kaiser")){
                Assert.assertEquals(hist.getDate(), medicalWithKaiserQuote.getUpdated().toString());
            }else if(hist.getName().equalsIgnoreCase("Medical_without_kaiser")){
                Assert.assertEquals(hist.getDate(), medicalWithoutKaiserQuote.getUpdated().toString());
            }else if(hist.getName().equalsIgnoreCase("Dental")){
                Assert.assertEquals(hist.getDate(), dentalQuote.getUpdated().toString());
            }else if(hist.getName().equalsIgnoreCase("Vision")){
                Assert.assertEquals(hist.getDate(), visionQuote.getUpdated().toString());
            }
        }
    }

    @Test
    public void getLastQuotesWithUnknownUpdatedDates() throws Exception {
        Carrier carrier = testEntityHelper.createTestCarrier();
        Client client = testEntityHelper.createTestClient("unitTestClient4", broker);

        testEntityHelper.createTestRfpCarrier(carrier, Constants.MEDICAL);
        testEntityHelper.createTestRfpCarrier(carrier, Constants.VISION);
        testEntityHelper.createTestRfpCarrier(carrier, Constants.DENTAL);

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/admin/history/rfpQuote/{clientId}/{carrierName}",
            client.getClientId(), carrier.getName())
            .header(AUTHORIZATION, HEADER_BEARER + token)
            .header(CONTENT_TYPE, APPLICATION_JSON)
            .accept(MediaType.parseMediaType(APPLICATION_JSON_UTF_8)))
            .andExpect(status().isOk())
            .andExpect(content().contentType(APPLICATION_JSON_UTF_8))
            .andReturn();

        String body = result.getResponse().getContentAsString();
        HistoryDto[] historyList = jsonUtils.fromJson(body, HistoryDto[].class);

        Assert.assertEquals(historyList.length, 4);

        for(HistoryDto hist : historyList){
            if(hist.getName().equalsIgnoreCase("Medical_with_kaiser")){
                Assert.assertEquals(hist.getDate(), UNKNOWN);
            }else if(hist.getName().equalsIgnoreCase("Medical_without_kaiser")){
                Assert.assertEquals(hist.getDate(), UNKNOWN);
            }else if(hist.getName().equalsIgnoreCase("Dental")){
                Assert.assertEquals(hist.getDate(), UNKNOWN);
            }else if(hist.getName().equalsIgnoreCase("Vision")){
                Assert.assertEquals(hist.getDate(), UNKNOWN);
            }
        }
    }

    @Test
    public void getLastRfpQuoteSummary() throws Exception {
        Client client = testEntityHelper.createTestClient("unitTestClient5", broker);

        RfpQuoteSummary summary = testEntityHelper.createTestRfpQuoteSummary(client);

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/admin/history/rfpQuoteSummary/{clientId}", client.getClientId())
            .header(AUTHORIZATION, HEADER_BEARER + token)
            .header(CONTENT_TYPE, APPLICATION_JSON)
            .accept(MediaType.parseMediaType(APPLICATION_JSON_UTF_8)))
            .andExpect(status().isOk())
            .andExpect(content().contentType(APPLICATION_JSON_UTF_8))
            .andReturn();

        String body = result.getResponse().getContentAsString();
        HistoryDto history = jsonUtils.fromJson(body, HistoryDto.class);
        Assert.assertEquals(history.getDate(), summary.getUpdated().toString());
    }
}
