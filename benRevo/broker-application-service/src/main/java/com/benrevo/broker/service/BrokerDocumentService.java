package com.benrevo.broker.service;

import static com.benrevo.common.util.MathUtils.round;
import static org.apache.poi.ss.util.CellReference.convertColStringToIndex;

import com.benrevo.be.modules.shared.service.Auth0Service;
import com.benrevo.common.Constants;
import com.benrevo.common.anthem.AnthemClearValueCalculator;
import com.benrevo.common.dto.ClientMemberDto;
import com.benrevo.common.enums.BrokerLocale;
import com.benrevo.common.enums.AncillaryPlanType;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.ClientException;
import com.benrevo.common.security.AuthenticatedUser;
import com.benrevo.common.util.ClientLocaleUtils;
import com.benrevo.common.util.DateHelper;
import com.benrevo.data.persistence.entities.Broker;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.ClientPlan;
import com.benrevo.data.persistence.entities.ClientRfpProduct;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.entities.ancillary.AncillaryPlan;
import com.benrevo.data.persistence.entities.ancillary.BasicRate;
import com.benrevo.data.persistence.entities.ancillary.RfpToAncillaryPlan;
import com.benrevo.data.persistence.entities.ancillary.VoluntaryRate;
import com.benrevo.data.persistence.repository.ClientPlanRepository;
import com.benrevo.data.persistence.repository.ClientRepository;
import com.benrevo.data.persistence.repository.ClientRfpProductRepository;
import com.benrevo.data.persistence.repository.ancillary.RfpToAncillaryPlanRepository;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Row.MissingCellPolicy;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class BrokerDocumentService {

    private static final String COMMON_TEMPLATE_DIR = "/templates/";
    private static final String APP_CARRIER_TEMPLATE_DIR = "/templates/%s/";

    private static final String TEMPLATE_TRUST_TECH = "Trust_Tech.xlsm";
    private static final String TEMPLATE_TRUST_BEYOND_BENEFITS_SOCAL = "Trust_Beyond_Benefits_SOCAL.xlsm";
    private static final String TEMPLATE_TRUST_BEYOND_BENEFITS_NORCAL = "Trust_Beyond_Benefits_NORCAL.xlsm";
    
    @Autowired
    private ClientRepository clientRepository;
    
    @Autowired
    private ClientPlanRepository clientPlanRepository;
    
    @Autowired
    private ClientRfpProductRepository clientRfpProductRepository;
    
    @Autowired
    private Auth0Service auth0Service;
    
    @Autowired
    private ClientLocaleUtils clientLocaleUtils;
    
    @Autowired
    private RfpToAncillaryPlanRepository rfpToAncillaryPlanRepository;

    public byte[] buildTrustDocument(String programName, Long clientId, Broker broker, List<RFP> rfps) {
        Client client = clientRepository.findOne(clientId);
        
        XSSFWorkbook workbook = null; 
        if(programName.equalsIgnoreCase(Constants.TECH_TRUST_PROGRAM)) {
            workbook = buildTechTrust(client, broker, rfps);
        } else if(programName.equalsIgnoreCase(Constants.BEYOND_BENEFITS_TRUST_PROGRAM)) {
            workbook = buildBeyondBenefitsTrust(client, broker, rfps);
        } else {
            throw new BaseException("Unsupported Trust option type :" + programName);
        }
        return writeWorkbook(workbook);
    }
    
    private XSSFWorkbook buildTechTrust(Client client, Broker broker, List<RFP> rfps) {
        return fillTemplate(TEMPLATE_TRUST_TECH, client, broker, rfps);
    }
    
    private XSSFWorkbook buildBeyondBenefitsTrust(Client client, Broker broker, List<RFP> rfps) {
        BrokerLocale clientLocale = getClientLocale(client);
        return fillTemplate(clientLocale == BrokerLocale.NORTH 
            ? TEMPLATE_TRUST_BEYOND_BENEFITS_NORCAL 
            : TEMPLATE_TRUST_BEYOND_BENEFITS_SOCAL, client, broker, rfps);
    }
    
    private XSSFWorkbook fillTemplate(String template, Client client, Broker broker, List<RFP> rfps) {
        XSSFWorkbook workbook = readTemplate(template);
        workbook.setMissingCellPolicy(MissingCellPolicy.CREATE_NULL_AS_BLANK);
        
        XSSFSheet rfpSheet = workbook.getSheet("RFP");
        
        // CLIENT INFORMATION 
        XSSFCell clientNameCell = findCellForValue(rfpSheet, "Client Name", "A");
        clientNameCell.setCellValue(client.getClientName());
        
        XSSFCell clientAddressCell = findCellForValue(rfpSheet, "Client Address", "A");
        clientAddressCell.setCellValue(client.getAddress());
        
        XSSFCell sicCodeCell = findCellForValue(rfpSheet, "SIC Code", "A");
        if(StringUtils.isNoneBlank(client.getZip())) {
            sicCodeCell.setCellValue(Integer.parseUnsignedInt(client.getSicCode()));
        }
        
        XSSFCell cityCell = findCellForValue(rfpSheet, "City", "A");
        cityCell.setCellValue(client.getCity());
        
        XSSFCell stateCell = findCellForValue(rfpSheet, "State", "A");
        stateCell.setCellValue(client.getState());
        
        XSSFCell zipCell = findCellForValue(rfpSheet, "Zip", "A");
        if(StringUtils.isNoneBlank(client.getZip())) {
            zipCell.setCellValue(Integer.parseUnsignedInt(client.getZip()));
        }
        
        XSSFCell effectiveDateCell = findCellForValue(rfpSheet, "Effective Date", "A");
        effectiveDateCell.setCellValue(DateHelper.fromDateToString(client.getEffectiveDate()));
        
        XSSFCell dueDateDateCell = findCellForValue(rfpSheet, "Due Date", "A");
        dueDateDateCell.setCellValue(DateHelper.fromDateToString(client.getDueDate()));
        
        XSSFCell virginGroupCell = findCellForValue(rfpSheet, "Virgin Group", "A");
        List<ClientRfpProduct> rfpProducts = clientRfpProductRepository.findByClientId(client.getClientId());
        boolean isVirginGroup = rfpProducts.stream().anyMatch(ClientRfpProduct::isVirginGroup);
//        Map<String, Boolean> rfpProductsVirgin = rfpProducts.stream()
//            .collect(Collectors.toMap(p -> p.getExtProduct().getName(), ClientRfpProduct::isVirginGroup));
        virginGroupCell.setCellValue(isVirginGroup ? "Yes" : "No");
        
        XSSFCell eligibleEmployeesCell = findCellForValue(rfpSheet, "Total Eligible Employees", "A");
        eligibleEmployeesCell.setCellValue(client.getEligibleEmployees());

        XSSFCell kaiserAlongsideCell = findCellForValue(rfpSheet, "Kaiser-Alongside", "A");
        if(kaiserAlongsideCell != null) { // in BEYOND_BENEFITS_TRUST template only
            boolean isAlongside = rfps.stream().anyMatch(RFP::isAlongside);
            kaiserAlongsideCell.setCellValue(isAlongside ? "Along Side" : "Total Takeover");
        }
        
        XSSFCell waitingPeriodCell = findCellForValue(rfpSheet, "Waiting Period", "A");
        RFP medicalRfp = rfps.stream().filter(r -> r.getProduct().equals(Constants.MEDICAL))
            .findFirst().orElse(null);
        if(medicalRfp != null) {
            waitingPeriodCell.setCellValue(medicalRfp.getWaitingPeriod());
        }
        
        // BROKER INFORMATION 
        XSSFCell brokerNameCell = findCellForValue(rfpSheet, "Broker", "E", 2);
        brokerNameCell.setCellValue(broker.getName());
        
        ClientMemberDto loggerUser = getLoggedInUser();
        
        XSSFCell brokerContactCell = findCellForValue(rfpSheet, "Main Contact", "E", 2);
        brokerContactCell.setCellValue(loggerUser.getFullName());
        
        XSSFCell brokerEmailCell = findCellForValue(rfpSheet, "Email Address", "E", 2);
        brokerEmailCell.setCellValue(loggerUser.getEmail());
        
        XSSFCell brokerOfRecordCell = findCellForValue(rfpSheet, "Broker of Record", "E", 2);
        boolean isBrokerOfRecord = rfps.stream().anyMatch(RFP::isBrokerOfRecord);
        brokerOfRecordCell.setCellValue(isBrokerOfRecord ? "Yes" : "No");
        
        // RFP CHECKLIST 
        XSSFCell extBenSummaryCell = findCellForValue(rfpSheet, "Life, STD, LTD, Optional Life Benefit", "F", -1);
        // see below in for(RFP rfp : rfps)
        XSSFCell dppoBenSummaryCell = findCellForValue(rfpSheet, "DPPO Benefit Summary", "F", -1);
        // see below in for(RFP rfp : rfps)
        
        // CURRENT PLANS                                       
        List<ClientPlan> currentPlans = clientPlanRepository.findByClientClientId(client.getClientId());

        ClientPlan planHMO = null, planPPO = null, planDPPO = null, planVision = null;

        for(ClientPlan clientPlan : currentPlans) {
            long enrollment = clientPlan.getTier1Census() + clientPlan.getTier2Census() 
                + clientPlan.getTier3Census() + clientPlan.getTier4Census();
            if(clientPlan.getPnn().getPlanType().equals("HMO")) {
                if(planHMO == null || enrollment > planHMO.getTier1Census() + planHMO.getTier2Census() 
                        + planHMO.getTier3Census() + planHMO.getTier4Census()) {
                    planHMO = clientPlan;  
                }
            } else if(clientPlan.getPnn().getPlanType().equals("PPO")) {
                if(planPPO == null || enrollment > planPPO.getTier1Census() + planPPO.getTier2Census() 
                        + planPPO.getTier3Census() + planPPO.getTier4Census()) {
                    planPPO = clientPlan;  
                }
            } else if(clientPlan.getPnn().getPlanType().equals("DPPO")) {
                if(planDPPO == null || enrollment > planDPPO.getTier1Census() + planDPPO.getTier2Census() 
                        + planDPPO.getTier3Census() + planDPPO.getTier4Census()) {
                    planDPPO = clientPlan;  
                }
            } else if(clientPlan.getPnn().getPlanType().equals("VISION")) {
                if(planVision == null || enrollment > planVision.getTier1Census() + planVision.getTier2Census() 
                        + planVision.getTier3Census() + planVision.getTier4Census()) {
                    planVision = clientPlan;  
                }
            } 
        }
        XSSFRow planForceRow = findRow(rfpSheet, "HMO", "B", 1);
        XSSFRow empContributionRow = rfpSheet.getRow(planForceRow.getRowNum() + 1);
        XSSFRow carrierNameRow = rfpSheet.getRow(empContributionRow.getRowNum() + 1);
        XSSFRow tier1RateRow = rfpSheet.getRow(carrierNameRow.getRowNum() + 2);
        XSSFRow tier2RateRow = rfpSheet.getRow(tier1RateRow.getRowNum() + 1);
        XSSFRow tier3RateRow = rfpSheet.getRow(tier2RateRow.getRowNum() + 1);
        XSSFRow tier4RateRow = rfpSheet.getRow(tier3RateRow.getRowNum() + 1);
        tier1RateRow = rfpSheet.getRow(carrierNameRow.getRowNum() + 2);
        
        List<Pair<ClientPlan, Integer>> planColumns = new ArrayList<>();
        if(planHMO != null) {
            planColumns.add(Pair.of(planHMO, convertColStringToIndex("B")));
        }
        if(planPPO != null) {
            planColumns.add(Pair.of(planPPO, convertColStringToIndex("D")));
        }
        if(planDPPO != null) {
            planColumns.add(Pair.of(planDPPO, convertColStringToIndex("F")));
        }
        if(planVision != null) {
            planColumns.add(Pair.of(planVision, convertColStringToIndex("H")));
        }
        
        int nonCAEmployeesTotal = 0;
        
        for(Pair<ClientPlan, Integer> pair : planColumns) {
            ClientPlan plan = pair.getLeft();
            int columnIndex = pair.getRight();
            planForceRow.getCell(columnIndex).setCellValue("Yes");
            Pair<Float, Float> contr = getFormattedEEAndDEPContributions(plan);
            empContributionRow.getCell(columnIndex).setCellValue(contr.getLeft());
            empContributionRow.getCell(columnIndex + 1).setCellValue(contr.getRight());
            if(isVirginGroup) {
                carrierNameRow.getCell(columnIndex).setCellValue("Virgin");
            } else {
                carrierNameRow.getCell(columnIndex).setCellValue(plan.getPnn().getPlan().getCarrier().getDisplayName());
            }
            tier1RateRow.getCell(columnIndex).setCellValue(plan.getTier1Rate());
            tier1RateRow.getCell(columnIndex + 1).setCellValue(plan.getTier1Renewal());
            tier2RateRow.getCell(columnIndex).setCellValue(plan.getTier2Rate());
            tier2RateRow.getCell(columnIndex + 1).setCellValue(plan.getTier2Renewal());
            tier3RateRow.getCell(columnIndex).setCellValue(plan.getTier3Rate());
            tier3RateRow.getCell(columnIndex + 1).setCellValue(plan.getTier3Renewal());
            tier4RateRow.getCell(columnIndex).setCellValue(plan.getTier4Rate());
            tier4RateRow.getCell(columnIndex + 1).setCellValue(plan.getTier4Renewal());
            
            if(plan.isOutOfState()) {
                nonCAEmployeesTotal += (plan.getTier1Census() + plan.getTier2Census() 
                    + plan.getTier3Census() + plan.getTier4Census());
            }
        }
        if(nonCAEmployeesTotal > 0) {
            XSSFCell nonCAEmployeesCell = findCellForValue(rfpSheet, "Non-CA Employees", "A");
            nonCAEmployeesCell.setCellValue("Yes");
        }
        
        planForceRow = findRow(rfpSheet, "Basic Life", "B", 1);
        empContributionRow = rfpSheet.getRow(planForceRow.getRowNum() + 1);
        carrierNameRow = rfpSheet.getRow(empContributionRow.getRowNum() + 1);
        tier1RateRow = rfpSheet.getRow(carrierNameRow.getRowNum() + 2);
        for(RFP rfp : rfps) {
            if(rfp.getProduct().equals(Constants.LIFE)) {
                int basicLifeProductColumn = convertColStringToIndex("B");
                int basicADDProductColumn = convertColStringToIndex("D");
                int optLifeProductColumn = convertColStringToIndex("J");
                List<RfpToAncillaryPlan> rfp2ancPlans = rfpToAncillaryPlanRepository.findByRfp_RfpId(rfp.getRfpId());
                for(RfpToAncillaryPlan rfp2AncPlans :  rfp2ancPlans) {
                    AncillaryPlan ancPlan = rfp2AncPlans.getAncillaryPlan();
                    if(ancPlan.getPlanType() == AncillaryPlanType.BASIC) {
                        planForceRow.getCell(basicLifeProductColumn).setCellValue("Yes");
                        if(isVirginGroup) {
                            carrierNameRow.getCell(basicLifeProductColumn).setCellValue("Virgin");
                            carrierNameRow.getCell(basicADDProductColumn).setCellValue("Virgin");
                        } else {
                            carrierNameRow.getCell(basicLifeProductColumn).setCellValue(ancPlan.getCarrier().getDisplayName());
                            carrierNameRow.getCell(basicADDProductColumn).setCellValue(ancPlan.getCarrier().getDisplayName());
                        }
                        BasicRate rates = (BasicRate) ancPlan.getRates();
                        empContributionRow.getCell(basicLifeProductColumn).setCellValue(rates.getVolume() / 1000f * rates.getCurrentLife());
                        empContributionRow.getCell(basicADDProductColumn).setCellValue(rates.getVolume() / 1000f * rates.getCurrentADD());
                        tier1RateRow.getCell(basicLifeProductColumn).setCellValue(rates.getCurrentLife());
                        tier1RateRow.getCell(basicLifeProductColumn + 1).setCellValue(rates.getRenewalLife());
                        tier1RateRow.getCell(basicADDProductColumn).setCellValue(rates.getCurrentADD());
                        tier1RateRow.getCell(basicADDProductColumn + 1).setCellValue(rates.getRenewalADD());
                    } else if(ancPlan.getPlanType() == AncillaryPlanType.VOLUNTARY) {
                        planForceRow.getCell(optLifeProductColumn).setCellValue("Yes");
                        if(isVirginGroup) {
                            carrierNameRow.getCell(optLifeProductColumn).setCellValue("Virgin");
                        } else {
                            carrierNameRow.getCell(optLifeProductColumn).setCellValue(ancPlan.getCarrier().getDisplayName());
                        }
                        VoluntaryRate rates = (VoluntaryRate) ancPlan.getRates();
                        empContributionRow.getCell(optLifeProductColumn).setCellValue("100%");
                        tier1RateRow.getCell(optLifeProductColumn).setCellValue(rates.getMonthlyCost());
                    }
                } 
                extBenSummaryCell.setCellValue("Yes");
            } else if(rfp.getProduct().equals(Constants.STD) || rfp.getProduct().equals(Constants.LTD)) {
                int productColumn = convertColStringToIndex(rfp.getProduct().equals(Constants.STD) ? "F" : "H");
                List<RfpToAncillaryPlan> rfp2ancPlans = rfpToAncillaryPlanRepository.findByRfp_RfpId(rfp.getRfpId());
                for(RfpToAncillaryPlan rfp2AncPlans : rfp2ancPlans) {
                    AncillaryPlan ancPlan = rfp2AncPlans.getAncillaryPlan();
                    if(ancPlan.getPlanType() == AncillaryPlanType.BASIC) { // only Basic required for template
                        planForceRow.getCell(productColumn).setCellValue("Yes");
                        if(isVirginGroup) {
                            carrierNameRow.getCell(productColumn).setCellValue("Virgin");
                        } else {
                            carrierNameRow.getCell(productColumn).setCellValue(ancPlan.getCarrier().getDisplayName());
                        }
                        BasicRate rates = (BasicRate) ancPlan.getRates();
                        if(rfp.getProduct().equals(Constants.STD)) {
                            empContributionRow.getCell(productColumn).setCellValue(rates.getVolume() / 10f * rates.getCurrentSL());
                        } else {
                            empContributionRow.getCell(productColumn).setCellValue(rates.getVolume() / 10f * rates.getCurrentSL());
                        }
                        tier1RateRow.getCell(productColumn).setCellValue(rates.getCurrentSL());
                        tier1RateRow.getCell(productColumn + 1).setCellValue(rates.getRenewalSL());
                        break;
                    }
                }
                extBenSummaryCell.setCellValue("Yes");
            } else if(rfp.getProduct().equals(Constants.DENTAL)) {
                dppoBenSummaryCell.setCellValue("Yes");
            }
        }
        
        return workbook;
    }
    
    private Pair<Float, Float> getFormattedEEAndDEPContributions(ClientPlan plan) {
        int ratingTiers = 1;
        if(plan.getTier2Rate() != null && plan.getTier2Rate() > 0f) {
            ratingTiers = 2;
        }
        if(plan.getTier3Rate() != null && plan.getTier3Rate() > 0f) {
            ratingTiers = 3;
        }
        if(plan.getTier4Rate() != null && plan.getTier4Rate() > 0f) {
            ratingTiers = 4;
        }
        
        // NOTE See AnthemEmployerApplicationDataServiceImpl.fillRates() for implementatuon details
        
        // take the dependent contribution from the largest tier that is available
        float depContribution = 0f;
        float depRate = 1f;
       
        switch(ratingTiers) {
            case 2:
                depContribution = plan.getTier2ErContribution();
                depRate = plan.getTier2Rate();
                break;
            case 3:
                depContribution = plan.getTier3ErContribution();
                depRate = plan.getTier3Rate();
                break;
            case 4:
                depContribution = plan.getTier4ErContribution();
                depRate = plan.getTier4Rate();
                break;
            default:
                break;
        }

        float eeContribution;
        if(plan.getErContributionFormat().equals(Constants.ER_CONTRIBUTION_FORMAT_PERCENT)){
            eeContribution = round(plan.getTier1ErContribution() / 100f, 2);
            depContribution = round(depContribution / 100f, 2);
        } else {
            eeContribution = round(plan.getTier1ErContribution() / plan.getTier1Rate(), 2);
            depContribution = round(depContribution / depRate, 2);
        }
        return Pair.of(eeContribution, (ratingTiers == 1) ? null : depContribution);
    }
    /*
    private boolean isVirginGroup(Long clientId){
        ClientRfpProduct clientRfpProduct = clientRfpProductRepository.findByClientId(clientId).stream()
            .filter(r -> r.isVirginGroup())
            .findFirst()
            .orElse(null);
        return clientRfpProduct != null;
    }*/

    private XSSFCell findCellForValue(Sheet sheet, String keyName, String column, int columnOffset) {
        XSSFRow row = findRow(sheet, keyName, column);
        if(row != null) {
            return row.getCell(convertColStringToIndex(column) + columnOffset);
        }
        return null;
    }
    
    private XSSFCell findCellForValue(Sheet sheet, String keyName, String column) {
       return findCellForValue(sheet, keyName, column, 1);
    }
    
    private XSSFRow findRow(Sheet sheet, String keyName, String column) {
        return findRow(sheet, keyName, column, 0);
    }
    
    private XSSFRow findRow(Sheet sheet, String keyName, String column, int rowOffset) {
        for(Iterator<Row> it = sheet.rowIterator(); it.hasNext();) {
            Row r = (Row) it.next();
            Cell cell = r.getCell(convertColStringToIndex(column));
            if(cell != null && cell.getCellTypeEnum() == CellType.STRING 
                    && cell.getStringCellValue().trim().startsWith(keyName)) {
                return (XSSFRow) sheet.getRow(r.getRowNum() + rowOffset);
            }
        }
        return null;
    }
    

    private XSSFWorkbook readTemplate(String name) {
        try {
            InputStream is = this.getClass().getResourceAsStream(COMMON_TEMPLATE_DIR + name);
            return new XSSFWorkbook(is);
        } catch(IOException e) {
            throw new BaseException("Cannot read rewards template file", e);
        }
    }
    
    private byte[] writeWorkbook(Workbook workbook) {
        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            out.close();
            workbook.close();
            return out.toByteArray();
        } catch(IOException e) {
            throw new ClientException("Unable to create quote options file");
        }
    }
    
    private BrokerLocale getClientLocale(Client client) {
        return clientLocaleUtils.getLocale(client.getPredominantCounty(), client.getZip(), client.getCity());
    }
    
    private ClientMemberDto getLoggedInUser() {
        AuthenticatedUser authentication = (AuthenticatedUser) SecurityContextHolder.getContext().getAuthentication();
        return auth0Service.getUserByAuthId(authentication.getName());
    }

//    String getPrefix() {
//        CarrierType ct = fromStrings(appCarrier);
//        return ct != null ? format(APP_CARRIER_TEMPLATE_DIR, ct.abbreviation) : null;
//    }
}