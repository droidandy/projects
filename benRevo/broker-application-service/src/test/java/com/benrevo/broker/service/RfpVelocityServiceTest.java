package com.benrevo.broker.service;

import static org.apache.commons.lang.StringEscapeUtils.escapeXml;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertTrue;
import com.benrevo.be.modules.rfp.service.RfpVelocityService;
import com.benrevo.be.modules.shared.controller.AbstractControllerTest;
import com.benrevo.be.modules.shared.service.DocumentGeneratorService;
import com.benrevo.common.Constants;
import com.benrevo.common.dto.ClientDto;
import com.benrevo.common.dto.OptionDto;
import com.benrevo.common.dto.RfpDto;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.CarrierHistory;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientTeam;
import com.benrevo.data.persistence.entities.Option;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.mapper.ClientMapper;
import com.benrevo.data.persistence.mapper.RfpMapper;
import com.benrevo.data.persistence.repository.RfpRepository;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.util.Arrays;
import java.util.stream.Stream;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.docx4j.convert.in.xhtml.XHTMLImporterImpl;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import uk.co.jemos.podam.api.AbstractClassInfoStrategy;
import uk.co.jemos.podam.api.PodamFactory;
import uk.co.jemos.podam.api.PodamFactoryImpl;

public class RfpVelocityServiceTest extends AbstractControllerTest {
    
    @Autowired
    private RfpVelocityService velocityService;
    
    @Autowired
    private RfpRepository rfpRepository;
    
    @Autowired
    private DocumentGeneratorService documentGeneratorService;

    private PodamFactory podamFactory = new PodamFactoryImpl();
    private Client testClient;
    private ClientDto testClientDto;
    private Broker testBroker;

    @Override
    public void init() {
    }

    @Before
    public void setUp() {
        AbstractClassInfoStrategy classInfoStrategy = new AbstractClassInfoStrategy() {};
	    classInfoStrategy
                .addExcludedField(Broker.class, "clients")
                .addExcludedField(Client.class, "clientPlans")
                .addExcludedField(Client.class, "attributes")
                .addExcludedField(RFP.class, "id")
                .addExcludedField(RFP.class, "client")
                .addExcludedField(RFP.class, "plans")
                .addExcludedField(RFP.class, "attributes")
                .addExcludedField(Option.class, "id")
                .addExcludedField(Option.class, "rfp")
                .addExcludedField(CarrierHistory.class, "id")
                .addExcludedField(CarrierHistory.class, "rfp");
		
		podamFactory.setClassStrategy(classInfoStrategy);
        testBroker = testEntityHelper.createTestBroker("MMA/Barney & Barney – San Diego");
        testClient = testEntityHelper.createTestClient("Granda Tree Service, Inc.", testBroker);
        testClientDto = ClientMapper.clientToDTO(testClient);
    }

    private void writePDF(String[] pagesArray, String fileName) throws Exception {
    	 ByteArrayOutputStream baos = (ByteArrayOutputStream) documentGeneratorService
                 .stringArrayToPdfOS(pagesArray);
//    	 File pdf = new File(fileName);
//         FileUtils.writeByteArrayToFile(pdf, baos.toByteArray());
         // comment to store file for manual checking
         //pdf.delete();
    }
    
    private void writeDOCX(String[] pagesArray, String fileName) throws Exception {
    	ByteArrayOutputStream baos = (ByteArrayOutputStream) documentGeneratorService
                .stringArrayToDocxOS(pagesArray);
      
//    	File docx = new File(fileName);
//        FileUtils.writeByteArrayToFile(docx, baos.toByteArray());
        // comment to store file for manual checking
        //docx.delete();
   }

    @Test
    public void getRfpAllPages() throws Exception {
        
            RFP medicalRfp = podamFactory.manufacturePojo(RFP.class);
            medicalRfp.setProduct(Constants.MEDICAL);
            medicalRfp.setContributionType(Constants.ER_CONTRIBUTION_TYPE_DOLLAR);
            medicalRfp.setClient(testClient);
            medicalRfp.getCarrierHistories().forEach(p -> p.setRfp(medicalRfp));
            medicalRfp.getOptions().forEach(o -> o.setRfp(medicalRfp));
            rfpRepository.save(medicalRfp);
            
            RFP dentalRfp = podamFactory.manufacturePojo(RFP.class);
            dentalRfp.setProduct(Constants.DENTAL);
            dentalRfp.setContributionType(Constants.ER_CONTRIBUTION_TYPE_DOLLAR);
            dentalRfp.setClient(testClient);
            dentalRfp.getCarrierHistories().forEach(p -> p.setRfp(dentalRfp));
            dentalRfp.getOptions().forEach(o -> o.setRfp(dentalRfp));
            rfpRepository.save(dentalRfp);

            RFP visionRfp = podamFactory.manufacturePojo(RFP.class);
            visionRfp.setProduct(Constants.VISION);
            visionRfp.setContributionType(Constants.ER_CONTRIBUTION_TYPE_DOLLAR);
            visionRfp.setClient(testClient);
            visionRfp.getCarrierHistories().forEach(p -> p.setRfp(visionRfp));
            visionRfp.getOptions().forEach(o -> o.setRfp(visionRfp));
            rfpRepository.save(visionRfp);
            
            String testBrokerLanguage = "<table><tr><td>test <br/><strong>Language</strong></td></tr></table>";
            String clientPage = velocityService.getRfpClientPage(testBroker, testClientDto, "");
            assertThat(clientPage).doesNotContain("/mma.png");

            testBroker.setLogo("https://s3-us-west-2.amazonaws.com/benrevo-prod-global-static/brokerage/mma/mma.png");
            ClientTeam clientTeam = testEntityHelper.createClientTeam(testBroker, testClient);
            clientPage = velocityService.getRfpClientPage(testBroker, testClientDto, "");

            assertThat(clientPage).contains("/mma_2x.png");
            String[] medicalResult = velocityService.getRfpPagesArray(testBroker, testClientDto, Constants.MEDICAL);
            String[] dentalResult = velocityService.getRfpPagesArray(testBroker, testClientDto, Constants.DENTAL);
            String[] visionResult = velocityService.getRfpPagesArray(testBroker, testClientDto, Constants.VISION);
            String brokerLanguage = velocityService.getRfpBrokerLanguagePage(testBroker, testBrokerLanguage );

            assertThat(clientPage).isNotEmpty();
            assertThat(clientPage).contains("/mma_2x.png");
            assertThat(medicalResult).hasSize(1);
            assertThat(dentalResult).hasSize(1);
            assertThat(visionResult).hasSize(1);
            assertThat(brokerLanguage).isNotEmpty();
            assertThat(brokerLanguage).contains("/mma_2x.png");
            
            String[] pagesArray = Stream
                    .concat(
                            Stream.concat(
                                    Stream.concat(Stream.of(clientPage), Arrays.stream(medicalResult)),
                                    Stream.concat(Arrays.stream(dentalResult), Arrays.stream(visionResult))),
                            Stream.of(brokerLanguage))
                    .toArray(String[]::new);
            
            // uncomment to store files for manual checking
            writePDF(pagesArray, "RFP_test.pdf");
            writeDOCX(pagesArray, "RFP_test.docx");
    }

}
