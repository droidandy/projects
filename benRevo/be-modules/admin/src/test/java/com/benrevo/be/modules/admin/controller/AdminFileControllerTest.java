package com.benrevo.be.modules.admin.controller;

import com.benrevo.be.modules.admin.controller.AdminAbstractControllerTest;
import com.benrevo.data.persistence.entities.ClientFileUpload;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.repository.ClientFileRepository;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.Date;
import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.Assert;
import org.junit.Ignore;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static com.benrevo.common.enums.CarrierType.fromStrings;
import static java.nio.file.Files.probeContentType;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class AdminFileControllerTest extends AdminAbstractControllerTest {

    @Autowired
    private ClientFileRepository fileRepository;

    @Value("${app.carrier}")
    private String[] appCarrier;

    @Test
    public void getFiles() throws Exception {
        RFP rfp = testEntityHelper.createTestRFP();
        ClientFileUpload uploadedFile = testEntityHelper.createTestRFPFile(rfp);

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/admin/files/{id}", rfp.getClient().getClientId())
            .header("Authorization", "Bearer " + token)
            .header("Content-Type", "application/json")
            .accept(MediaType.parseMediaType("application/json;charset=UTF-8")))
            .andExpect(status().isOk())
            .andExpect(content().contentType("application/json;charset=UTF-8"))
            .andReturn();

        String body = result.getResponse().getContentAsString();
        JSONArray array = new JSONArray(body);
        Assert.assertEquals(array.length(), 1);
        JSONObject obj = array.getJSONObject(0);
        Assert.assertEquals(obj.getString("link").split("=")[1], uploadedFile.getClientFileUploadId().toString());
        Assert.assertEquals(obj.getString("name"), uploadedFile.getS3Key().split("_")[1]);
    }

    @Test
    public void getEmptyFiles() throws Exception {
        RFP rfp = testEntityHelper.createTestRFP();

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/admin/files/{id}", rfp.getClient().getClientId())
            .header("Authorization", "Bearer " + token)
            .header("Content-Type", "application/json")
            .accept(MediaType.parseMediaType("application/json;charset=UTF-8")))
            .andExpect(status().isOk())
            .andExpect(content().contentType("application/json;charset=UTF-8"))
            .andReturn();

        String body = result.getResponse().getContentAsString();
        JSONArray array = new JSONArray(body);
        Assert.assertEquals(array.length(), 0);
    }


    @Ignore // because we mocking S3FileManager
    @Test
    public void downloadFile() throws Exception {
        RFP rfp = testEntityHelper.createTestRFP();

        String filename = "test.txt";
        String contents = "This is my test file for " + (new Date());
        FileOutputStream out = new FileOutputStream(filename);
        out.write(contents.getBytes());
        out.close();

        File f = new File(filename);

        String key = s3FileManager.uploadRfp(
            f.getName(),
            new FileInputStream(f),
            probeContentType(f.toPath()),
            f.length(),
            fromStrings(appCarrier)
        );

        ClientFileUpload uploadedFile = testEntityHelper.buildTestRfpFile(rfp, key);
        fileRepository.save(uploadedFile);

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/admin/file")
            .header("Authorization", "Bearer " + token)
            .header("Content-Type", "application/json")
            .param("id", uploadedFile.getClientFileUploadId().toString())
            .param("carrierName", fromStrings(appCarrier).name())
            .accept(MediaType.parseMediaType("application/json;charset=UTF-8")))
            .andExpect(status().isOk())
            .andReturn();

        s3FileManager.delete(key, fromStrings(appCarrier));
    }

    @Test
    public void downloadFile_Not_Found() throws Exception {
        RFP rfp = testEntityHelper.createTestRFP();

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/admin/file")
            .header("Authorization", "Bearer " + token)
            .header("Content-Type", "application/json")
            .param("id", "0")
            .param("carrierName", fromStrings(appCarrier).name())
            .accept(MediaType.parseMediaType("application/json;charset=UTF-8")))
            .andExpect(status().isNotFound())
            .andReturn();
    }
}
