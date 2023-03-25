package com.benrevo.be.modules.rfp.service;

import static java.util.Comparator.comparing;
import static org.apache.commons.lang.StringEscapeUtils.escapeXml;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertFalse;
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
import com.benrevo.data.persistence.entities.Option;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.mapper.ClientMapper;
import com.benrevo.data.persistence.mapper.RfpMapper;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.RfpRepository;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Stream;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.docx4j.convert.in.xhtml.XHTMLImporterImpl;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import uk.co.jemos.podam.api.AbstractClassInfoStrategy;
import uk.co.jemos.podam.api.PodamFactory;
import uk.co.jemos.podam.api.PodamFactoryImpl;

public class RfpVelocityServiceTest extends AbstractControllerTest {
    
    static {
        // suppress "No mapping for" warning
        XHTMLImporterImpl.addFontMapping("OpenSansBold", "");
        XHTMLImporterImpl.addFontMapping("OpenSansRegular_0", "");
    }

    @Autowired
    private RfpVelocityService velocityService;
    
    @Autowired
    private RfpRepository rfpRepository;
    
    @Autowired
    private DocumentGeneratorService documentGeneratorService;

    @Autowired
    private ClientRepository clientRepository;

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
        testBroker = testEntityHelper.createTestBroker();
        testClient = testEntityHelper.createTestClient("testClient", testBroker);
        testClientDto = ClientMapper.clientToDTO(testClient);
    }

    @Test
    public void getRfpPagesArrayForDental() throws Exception {
        
        String rfpType = Constants.DENTAL;
        final RFP rfp = podamFactory.manufacturePojo(RFP.class);
        rfp.setProduct(rfpType);
        rfp.setContributionType(Constants.ER_CONTRIBUTION_TYPE_DOLLAR);
        rfp.setClient(testClient);
        rfp.getCarrierHistories().forEach(p -> p.setRfp(rfp));
        rfp.getOptions().forEach(o -> o.setRfp(rfp));
        rfpRepository.save(rfp);
        
        String[] result = velocityService.getRfpPagesArray(testBroker, testClientDto, rfpType);
        assertTrue(result.length > 0);

        int maxCarrierHistory = rfp
            .getCarrierHistories()
            .stream()
            .mapToInt(CarrierHistory::getYears)
            .max()
            .orElse(0);

        rfp.getCarrierHistories().forEach(
            history -> assertTrue(result[0].contains(history.getName()))
        );

        assertTrue(result[0].contains(String.valueOf(maxCarrierHistory)));
        
        writeDOCX(result, "RFP_dental.docx");
    }

    @Test
    public void getRfpPagesArrayForMedicalAndEmptyLTD() throws Exception {
        String rfpType = Constants.MEDICAL;
        final RFP rfp = podamFactory.manufacturePojo(RFP.class);
        rfp.setProduct(rfpType);
        rfp.setContributionType(Constants.ER_CONTRIBUTION_TYPE_DOLLAR);
        rfp.setClient(testClient);
        rfp.getCarrierHistories().forEach(p -> p.setRfp(rfp));
        rfp.getOptions().forEach(o -> o.setRfp(rfp));
        rfpRepository.save(rfp);

        final RFP ltdRfp = new RFP();
        ltdRfp.setProduct(Constants.LTD);
        ltdRfp.setContributionType(Constants.ER_CONTRIBUTION_TYPE_DOLLAR);
        ltdRfp.setClient(testClient);
        rfpRepository.save(ltdRfp);

        String clientPage = velocityService.getRfpClientPage(testBroker, testClientDto, "");
        String[] result = velocityService.getRfpPagesArray(testBroker, testClientDto, rfpType);
        assertTrue(result.length > 0);

        // empty ltd
        result = velocityService.getRfpPagesArray(testBroker, testClientDto, Constants.LTD);
        assertFalse(result.length > 0);
    }

    @Test
    public void getRfpPagesArrayForMedical() throws Exception {
        String rfpType = Constants.MEDICAL;
        final RFP rfp = podamFactory.manufacturePojo(RFP.class);
        rfp.setProduct(rfpType);
        rfp.setContributionType(Constants.ER_CONTRIBUTION_TYPE_DOLLAR);
        rfp.setClient(testClient);
        rfp.getCarrierHistories().forEach(p -> p.setRfp(rfp));
        rfp.getOptions().forEach(o -> o.setRfp(rfp));
        rfpRepository.save(rfp);

        String clientPage = velocityService.getRfpClientPage(testBroker, testClientDto, "");
        String[] result = velocityService.getRfpPagesArray(testBroker, testClientDto, rfpType);
        assertTrue(result.length > 0);

        int maxCarrierHistory = rfp
            .getCarrierHistories()
            .stream()
            .mapToInt(CarrierHistory::getYears)
            .max()
            .orElse(0);

        rfp.getCarrierHistories().forEach(
            history -> assertTrue(result[0].contains(history.getName()))
        );

        assertTrue(result[0].contains(String.valueOf(maxCarrierHistory)));

        assertThat(clientPage).contains(testBroker.getName());
        assertThat(clientPage).contains(testBroker.getAddress());
        assertThat(clientPage).contains(testBroker.getCity());
        assertThat(clientPage).contains(testBroker.getState());
        assertThat(clientPage).contains(testBroker.getZip());
                
        String[] pagesArray = Stream.concat(Stream.of(clientPage), Arrays.stream(result)).toArray(String[]::new);
        
        writePDF(pagesArray, "RFP_medical.pdf");
        writeDOCX(pagesArray, "RFP_medical.docx");
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
    public void testAmpersandIssue() throws Exception {

        testClientDto.setClientName(testClientDto.getClientName() + "&Lemdy");
        
        String result = velocityService.getRfpClientPage(testBroker, testClientDto, "testWaitingPeriod");
        Assert.assertTrue(result.contains("testClient&amp;Lemdy"));
    }

    @Test
    public void getRfpPagesArrayNullCarrier() {
        String rfpType = Constants.DENTAL;
        final RFP rfp = podamFactory.manufacturePojo(RFP.class);
        rfp.setProduct(rfpType);
        rfp.setContributionType(Constants.ER_CONTRIBUTION_TYPE_DOLLAR);
        rfp.setClient(testClient);
        rfp.setCarrierHistories(null);
        rfp.getOptions().forEach(o -> o.setRfp(rfp));
        rfpRepository.save(rfp);
        
        String[] result = velocityService.getRfpPagesArray(testBroker, testClientDto, rfpType);
        assertTrue(result.length > 0);
    }

    @Test
    public void getRfpBrokerLanguagePage() throws Exception {
        
            String rfpType = Constants.MEDICAL;
            final RFP rfp = podamFactory.manufacturePojo(RFP.class);
            rfp.setProduct(rfpType);
            rfp.setContributionType(Constants.ER_CONTRIBUTION_TYPE_DOLLAR);
            rfp.setClient(testClient);
            rfp.getCarrierHistories().forEach(p -> p.setRfp(rfp));
            rfp.getOptions().forEach(o -> o.setRfp(rfp));
            rfpRepository.save(rfp);
            
            String testBrokerLanguage = "<table><tr><td>test <br/><strong>Language</strong></td></tr></table>";
            
            String clientPage = velocityService.getRfpClientPage(testBroker, testClientDto, "");
            String[] result = velocityService.getRfpPagesArray(testBroker, testClientDto, rfpType);
            String brokerLanguage = velocityService.getRfpBrokerLanguagePage(testBroker, testBrokerLanguage );
            
            assertThat(brokerLanguage.isEmpty()).isFalse();
            assertThat(StringUtils.countMatches(brokerLanguage, testBrokerLanguage)).isEqualTo(1);
            assertThat(StringUtils.countMatches(brokerLanguage, escapeXml(testBroker.getName()))).isEqualTo(1);

            String[] pagesArray = Stream
                    .concat(
                            Stream.concat(Stream.of(clientPage), Arrays.stream(result)), 
                            Stream.of(brokerLanguage))
                    .toArray(String[]::new);
            
            // uncomment to store files for manual checking
            writePDF(pagesArray, "RFP_medical_with_broker_language.pdf");
            writeDOCX(pagesArray, "RFP_medical_with_broker_language.docx");
    }

    @Test
    @Ignore // Not needed because I default null rates to '-'
    public void getRfpMedicalPage4NullRates() throws Exception{
        
        RFP testRfp = testEntityHelper.createTestRFP(testClient);
        
        RfpDto testRfpDto = RfpMapper.rfpToDTO(testRfp);
        testRfpDto.getOptions().add(new OptionDto());
                
        String template = velocityService.getProductRfpPage(testBroker, testClientDto, testRfpDto);
        
        //File file = new File("getRfpMedicalPage4Null.html");
        //FileUtils.writeByteArrayToFile(file, template.getBytes());

        assertThat(StringUtils.countMatches(template, "Not provided in RFP")).isEqualTo(1);
        
    }

    @Test
    @Ignore // Not needed because I default null rates to '-'
    public void getRfpPage4NullRates() throws Exception{
        
        RFP testRfp = testEntityHelper.createTestRFP(testClient);
        
        RfpDto testRfpDto = RfpMapper.rfpToDTO(testRfp);
        testRfpDto.getOptions().add(new OptionDto());
                
        String template = velocityService.getProductRfpPage(testBroker, testClientDto, testRfpDto);
        
        //File file = new File("getRfpPage4Null.html");
        //FileUtils.writeByteArrayToFile(file, template.getBytes());

        
        assertThat(StringUtils.countMatches(template, "Not provided in RFP")).isEqualTo(1);
    }
        
}
