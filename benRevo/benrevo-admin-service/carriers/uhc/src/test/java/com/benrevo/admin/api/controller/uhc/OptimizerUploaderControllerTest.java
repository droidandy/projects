package com.benrevo.admin.api.controller.uhc;

import static com.benrevo.common.Constants.MEDICAL;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.benrevo.be.modules.admin.controller.AdminAbstractControllerTest;
import com.benrevo.be.modules.admin.domain.clients.BaseOptimizerLoader;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.BrokerDto;
import com.benrevo.common.dto.OptimizerDto;
import com.benrevo.common.dto.OptimizerDto.OptimizerProduct;
import com.benrevo.data.persistence.entities.ClientPlan;
import com.benrevo.data.persistence.repository.ClientPlanRepository;
import java.io.File;
import java.io.FileInputStream;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

public class OptimizerUploaderControllerTest extends AdminAbstractControllerTest {

    @Autowired
    BaseOptimizerLoader baseOptimizerLoader;

    @Autowired
    private ClientPlanRepository clientPlanRepository;


    @Test
    public void validateOptimizer() throws Exception {

        String currDir = Paths.get("").toAbsolutePath().toString();
        File file = new File(currDir + "/data/clients/UHC/2018/Optimizers/GoGuardian_Uploader v2.xlsm");
//        File file = new File(currDir + "/data/clients/UHC/2018/Optimizers/Padre Associates, Inc. Uploader v2.xlsm");     
        FileInputStream fis = new FileInputStream(file);

        MockMultipartFile mockFile = new MockMultipartFile("file", file.getName(),
                Constants.EXTENSION_XLS, fis);

        OptimizerDto params = new OptimizerDto();
        params.getProducts().add(new OptimizerProduct(Constants.MEDICAL, false));
//        params.getProducts().add(new OptimizerProduct(Constants.DENTAL, false));
//        params.getProducts().add(new OptimizerProduct(Constants.VISION, false));
        
        
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.fileUpload("/admin/optimizer/validator/")
                .file(mockFile)
                .param("dto", jsonUtils.toJson(params))
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .header("Authorization", "Bearer " + token)
                .accept(MediaType.APPLICATION_JSON_UTF8_VALUE))
                .andExpect(status().isOk())
                .andReturn();
        OptimizerDto validateDto = jsonUtils.fromJson(result.getResponse().getContentAsString(), OptimizerDto.class);
        
        assertThat(validateDto.getErrors()).isEmpty();
        assertThat(validateDto.getClient()).isNotNull();
    }

    @Test
    public void uhcExternalRxOptimizer() throws Exception {

        String currDir = Paths.get("").toAbsolutePath().toString();
        File file = new File(currDir + "/data/clients/UHC/2018/Optimizers/UHC 4-Tier Optimizer.xlsm");
        FileInputStream fis = new FileInputStream(file);

        MockMultipartFile mockFile = new MockMultipartFile("file", file.getName(),
            Constants.EXTENSION_XLS, fis);

        OptimizerDto override = new OptimizerDto();
        BrokerDto brokerDto = new BrokerDto();
        brokerDto.setId(broker.getBrokerId());
        brokerDto.setBcc("testBcc");
        override.setBrokerage(brokerDto);
        override.setNewClientName("newClientName");
        override.setOverrideClient(false);
        override.getProducts().add(new OptimizerProduct(MEDICAL, false));

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.fileUpload("/admin/optimizer/v2/upload/")
            .file(mockFile)
            .contentType(MediaType.MULTIPART_FORM_DATA)
            .header("Authorization", "Bearer " + token)
            .param("dto", jsonUtils.toJson(override))
            .accept(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(status().isOk())
            .andReturn();

        flushAndClear();

        OptimizerDto uploaded = jsonUtils.fromJson(result.getResponse().getContentAsString(), OptimizerDto.class);

        List<ClientPlan> clientPlans = clientPlanRepository.findByClientClientId(uploaded.getClient().getId())
            .stream()
            .filter(cp -> cp.getRxPnn() != null)
            .collect(Collectors.toList());

        assertThat(clientPlans).hasSize(5); // all plans should have rx pnn
        assertThat(clientPlans.get(0).getPlanType()).isEqualTo("HMO");
        assertThat(clientPlans.get(0).getPnn().getPlanType()).isEqualTo("HMO");
        assertThat(clientPlans.get(0).getRxPnn().getPlanType()).isEqualTo("RX_HMO");
    }

}
