package com.benrevo.core.api.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import java.io.File;

import com.benrevo.core.service.UHCQuestionnaireDataService;
import com.benrevo.data.persistence.entities.Form;
import com.benrevo.data.persistence.entities.RfpQuoteSummary;
import org.apache.commons.io.FileUtils;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import com.benrevo.be.modules.presentation.util.PoiUtil;
import com.benrevo.be.modules.shared.controller.BaseControllerTest;
import com.benrevo.core.UHCCoreServiceApplicationTest;
import java.util.Map;
import com.benrevo.data.persistence.entities.Client;


@UHCCoreServiceApplicationTest
public class UHCRfpQuoteControllerTest extends BaseControllerTest {

    @Autowired
    private UHCRfpQuoteController controller;

    @Autowired
    private UHCQuestionnaireDataService uhcQuestionnaireDataService;
    
    @Override
    protected Object getController() {
        return controller;
    }

    @Test
    public void downloadMotionOverview() throws Exception {

        MockHttpServletRequestBuilder req = MockMvcRequestBuilders.get("/v1/quotes/options/motionOverview");
        MvcResult result = mockMvc.perform(req.header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_PDF_VALUE))
                .andReturn();
        byte[] bytes = result.getResponse().getContentAsByteArray();
        //File pdf = new File("testMotionOverview.pdf");
        //FileUtils.writeByteArrayToFile(pdf, bytes);
  
        assertThat(bytes).isNotEmpty();
    }

    @Test
    public void testGetData(){
        Client client = testEntityHelper.createTestClient();
        Map<String,String> answers = uhcQuestionnaireDataService.getData(client);
        assertThat(answers.get("situs_state").equals("testState"));
        assertThat(answers.get("policy_number").equals(client.getPolicyNumber()));
        assertThat(answers.get("min_hrs_wks_to_be_considered").equals(client.getMinimumHours()));
        assertThat(answers.get("consultant_broker_company").equals(client.getBroker().getName()));
        assertThat(answers.get("groups_legal_name").equals(client.getClientName()));
        assertThat(answers.get("date_questionnaire_completed").equals(client.getDateQuestionnaireCompleted()));
    }

    @Test
    public void poiUtilTest() {
        String medicalNotes = "TEST\n\n-Medical";
        Client client = testEntityHelper.createTestClient();
        RfpQuoteSummary rqs = testEntityHelper.createTestRfpQuoteSummary(client);
        rqs.setMedicalNotes(medicalNotes);
        PoiUtil util = new PoiUtil();
        Map<String, String> data = util.prepareSummaryPageData(client, rqs);
        
        assertThat(data.get("DISCOUNT VISION")).isEqualTo("0.5");
        assertThat(data.get("DISCOUNT DENTAL")).isEqualTo("1.0");
        assertThat(data.get("DISCOUNT LIFE")).isEqualTo("1.0");
        assertThat(data.get("DISCOUNT STD")).isEqualTo("0.5");
        assertThat(data.get("DISCOUNT LTD")).isEqualTo("0.5");
        assertThat(data.get("DISCOUNT SUM")).isEqualTo("3.5");
        assertThat(data.get("MEDICAL SUMMARY")).isEqualTo(medicalNotes);
    }

}
