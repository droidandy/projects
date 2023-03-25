package com.benrevo.be.modules.rfp.controller;


import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.common.dto.RestMessageDto;
import com.benrevo.data.persistence.entities.ClientFileUpload;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.repository.ClientFileRepository;
import com.benrevo.data.persistence.mapper.FileMapper;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.FileInputStream;
import java.util.List;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Ignore
public class FileControllerTest extends AbstractControllerTest {

    @Autowired
    private FileController controller;

    @Autowired
    private ClientFileRepository fileRepository;

    @Before
    @Override
    public void init() {
        initController(controller);
    }

    @Test
    @Transactional
    public void fileUpload() throws Exception {
        RFP rfp = testEntityHelper.createTestRFP();
        Long rfpId = rfp.getRfpId();

        String workingDir = System.getProperty("user.dir");
        String filePath = workingDir + "/src/test/resources/static/test_file.png";

        File file = new File(filePath);
        FileInputStream fis = new FileInputStream(file);
        MockMultipartFile mockFile = new MockMultipartFile("file", file.getName(), "multipart/form-data", fis);

        token = createToken(rfp.getClient().getBroker().getBrokerToken());
        mockMvc.perform(MockMvcRequestBuilders.fileUpload("/v1/rfp/{id}/files/RFP/upload", rfpId)
                .file(mockFile)
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andReturn();
    }

    @Test
    @Transactional
    public void getFileByRfpId() throws Exception {

        RFP rfp = testEntityHelper.createTestRFP();
        testEntityHelper.createTestRFPFile(rfp);
        long rfpId = rfp.getRfpId();

        List<ClientFileUpload> fileUploads = fileRepository.findByRfpIdAndDeleted(rfpId, false);

        token = createToken(rfp.getClient().getBroker().getBrokerToken());
        mockMvc.perform(MockMvcRequestBuilders.get("/v1/rfps/{id}/files", rfpId)
                .header("Authorization", "Bearer " + token)
                .header("Content-Type", "application/json")
                .accept(MediaType.parseMediaType("application/json;charset=UTF-8")))
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json;charset=UTF-8"))
                .andExpect(content().json(jsonUtils.toJson(FileMapper.filesToDtos(fileUploads)), true))
                .andReturn();
    }

    @Test
    @Transactional
    public void markDeleted() throws Exception {
        RFP rfp = testEntityHelper.createTestRFP();
        ClientFileUpload clientFileUpload =  testEntityHelper.createTestRFPFile(rfp);
        long rfpId = rfp.getRfpId();

        token = createToken(rfp.getClient().getBroker().getBrokerToken());
        mockMvc.perform(MockMvcRequestBuilders.delete("/v1/file/{id}", clientFileUpload.getClientFileUploadId())
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isNoContent())
                .andExpect(content().json(
                    jsonUtils.toJson(new RestMessageDto("File successfully deleted", true))))
                .andReturn();
    }
}
