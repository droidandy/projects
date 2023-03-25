package com.benrevo.admin.domain.plans.UHC;

import static com.benrevo.common.enums.CarrierType.UHC;
import static org.docx4j.org.apache.poi.util.IOUtils.copy;

import com.amazonaws.services.cloudfront.model.InvalidArgumentException;
import com.benrevo.be.modules.admin.domain.plans.FormattedPlanPortfolioLoader;
import com.benrevo.be.modules.admin.domain.plans.GenericPlanDetails;
import com.benrevo.be.modules.admin.util.helper.PlanHistoryHelper;
import com.benrevo.common.Constants;
import com.benrevo.common.annotation.AppCarrier;
import com.benrevo.common.logging.CustomLogger;
import com.benrevo.data.persistence.entities.*;
import com.benrevo.data.persistence.repository.*;
import com.google.gson.Gson;
import com.monitorjbl.xlsx.StreamingReader;
import org.apache.commons.collections4.multimap.ArrayListValuedHashMap;
import org.apache.poi.openxml4j.util.ZipSecureFile;
import org.apache.poi.ss.formula.ConditionalFormattingEvaluator;
import org.apache.poi.ss.formula.WorkbookEvaluatorProvider;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.FormulaEvaluator;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.*;
import java.nio.file.Paths;
import java.text.ParseException;
import java.util.*;
import org.springframework.transaction.annotation.Transactional;

/**
 * Created by ojas.sitapara on 8/19/17.
 */
@Component
@AppCarrier(UHC)
@Transactional
public class UHCDentalVisionFormattedPlanLoader extends FormattedPlanPortfolioLoader {
    @Autowired
    private CustomLogger LOGGER;

    private List<BenefitName> benefitNames;
    private static DataFormatter formatter = new DataFormatter();

    private final String PPO_1 = "PPO Standard";
    private final String PPO_2 = "INO Coinsurance Standard";
    private final String DHMO_1 = "DHMO Capitated Standard";
    private final String DHMO_2 = "DHMO Direct Comp Standard";

    private final String VISION = "Retail Frame Allowance Plans";

    private final List<String> productsToLoad = new ArrayList<>(Arrays.asList(PPO_1, PPO_2, DHMO_1, DHMO_2, VISION));

    private Long batchNumber;

    @Autowired
    private BenefitRepository benefitRepository;

    @Autowired
    private BenefitNameRepository benefitNameRepository;

    @Autowired
    private NetworkRepository networkRepository;

    @Autowired
    private PlanNameByNetworkRepository planNameByNetworkRepository;

    @Autowired
    private PlanRepository planRepository;

    @Autowired
    private RiderMetaRepository riderMetaRepository;

    @Autowired
    private PlanHistoryHelper planHistoryHelper;

    @Autowired
    private CarrierRepository carrierRepository;

    private Gson gson = new Gson();

    FormulaEvaluator evaluator;
    ConditionalFormattingEvaluator cfEvaluator;

    private boolean doUploadForProduct(String product) {
        return productsToLoad.contains(product);
    }

    private void setup() {
        //get all the benefits allowed
        if(null == benefitNames || 0 == benefitNames.size()) {
            benefitNames = benefitNameRepository.findAll();
        }

        if(null == benefitNames || 0 == benefitNames.size()) {
            LOGGER.error("No benefits found in the system, they should be loaded as part of the static data.");
            benefitNames = Collections.emptyList();
        }
    }

    public Map<String, List<GenericPlanDetails>> parseDentalAndVisionPlans(Carrier carrier, InputStream dentalFis, InputStream visionFis) throws Exception {

        Map<String, List<GenericPlanDetails>> dentalPlansMap = parseDentalAndVisionPlansHelper(carrier, dentalFis);
        Map<String, List<GenericPlanDetails>> visionPlansMap = parseDentalAndVisionPlansHelper(carrier, visionFis);
        return combineFirstAndSecondIfNotEmpty(dentalPlansMap, visionPlansMap);
    }

    public Map<String, List<GenericPlanDetails>> parseDentalAndVisionPlansHelper(Carrier carrier, InputStream fis) throws Exception {
        setup();
        Map<String, List<GenericPlanDetails>> plansMap = parsePlans(carrier, fis);
        return plansMap;
    }

    @Override
    public Map<String, List<GenericPlanDetails>> parsePlans(Carrier carrier, InputStream fis, boolean parseRider) throws Exception {
        byte[] bytes = copyInputStream(fis);

        if(isUHCDentalAndVisionFile(carrier, bytes)){
            return parseDentalAndVisionPlansHelper(carrier, new ByteArrayInputStream(bytes));
        } else {
            // call parent to parse file
            return super.parsePlans(carrier, new ByteArrayInputStream(bytes), parseRider);
        }
    }

    private boolean isUHCDentalAndVisionFile(Carrier carrier, byte[] inputStreamByte) throws Exception {
        InputStream inputStream = null;
        Workbook myWorkBook = null;
        boolean isDentalVisionProduct = false;
        try {
            inputStream = new ByteArrayInputStream(inputStreamByte);
            ZipSecureFile.setMinInflateRatio(0.009d); // default is 0.01

            myWorkBook = StreamingReader.builder()
                .rowCacheSize(100)
                .bufferSize(4096)
                .open(inputStream);
            for (int sheetIndex = 0; sheetIndex < myWorkBook.getNumberOfSheets(); sheetIndex++) {
                if(myWorkBook.isSheetHidden(sheetIndex)) { // skip hidden sheet
                    continue;
                }
                Sheet mySheet = myWorkBook.getSheetAt(sheetIndex);
                String product = mySheet.getSheetName().trim();
                if(doUploadForProduct(product)){
                    isDentalVisionProduct = true;
                    break;
                }
            }
        } catch (Exception e) {
            LOGGER.error("An error occurred while parsing plans for carrier " + carrier.getName(), e);
            throw e;
        } finally {
            if(myWorkBook != null) {
                myWorkBook.close();
            }
            if(inputStream != null) {
                inputStream.close();
            }
        }
        return isDentalVisionProduct;
    }

    private Map<String, List<GenericPlanDetails>> parsePlans(Carrier carrier, InputStream fis) throws Exception {

        batchNumber = planHistoryHelper.getNextBatchNumber();
        XSSFWorkbook myWorkBook = new XSSFWorkbook (fis);
        evaluator = myWorkBook.getCreationHelper().createFormulaEvaluator();
        cfEvaluator = new ConditionalFormattingEvaluator(myWorkBook, (WorkbookEvaluatorProvider) evaluator);

        ArrayListValuedHashMap<String, GenericPlanDetails> planDetailsByProduct = new ArrayListValuedHashMap<>();

        try {
            /**********************************************
             * Parse the document and load plans by product
             **********************************************/
            // Walk through all the sheets
            for (int sheetIndex= 0; sheetIndex < myWorkBook.getNumberOfSheets(); sheetIndex++) {

                if (myWorkBook.isSheetHidden(sheetIndex)) {
                    // skip hidden sheet
                    continue;
                }
                XSSFSheet mySheet = myWorkBook.getSheetAt(sheetIndex);
                String product = mySheet.getSheetName().trim();

                if(!isValidProduct(product)) {
                    LOGGER.error("SKIPPING: Unknown product tab found in plan portfolio: '" + product + "'");
                    continue;
                }

                if(!doUploadForProduct(product)) {
                    LOGGER.info("Skipping product '"+ product +"' for plan upload.");
                    continue;
                }
                LOGGER.error("Loading plans for product '"+ product +"' in plan upload.");

                int rowNum = 0;
                // Get iterator to all the rows in current sheet
                Iterator<Row> rowIterator = mySheet.iterator();

                //burn the first row blank

                rowNum++;
                rowIterator.next();

                rowNum++;
                //set network type and validate rows.
                String networkType = verifyHeadersAndGetNetworkType(product, rowIterator.next());

                Set<String> planNames = new HashSet<>();

                // Traversing over each row of XLSX file
                while (rowIterator.hasNext()) {
                    rowNum++;

                    GenericPlanDetails planDetails = getPlanDetails(rowNum, carrier, networkType, rowIterator.next(), product);
                    if (planDetails == null) {
                        LOGGER.error("Skipping row number " + rowNum + " for product " + product + ", is not included in the CA portfolio");
                        continue;
                    }

                    if(planDetails.getPlanNamesByNetwork().size() != 0){
                        // skip empty row plans
                        planDetailsByProduct.put(networkType, planDetails);
                        // check for duplicates
                        for (String planNameByNetworkName : planDetails.getPlanNamesByNetwork().keySet()) {
                            if (!planNames.add(planNameByNetworkName)) {
                                throw new IllegalArgumentException("Duplicate planNameByNetwork name: " + planNameByNetworkName);
                            }
                        }
                    }
                }
            }
            System.out.println("Plans for carrier "+ carrier.getName() +" have been successfully parsed.");
        } catch (Exception e) {
            LOGGER.error("An error occurred while parsing plans for carrier " + carrier.getName(), e);
            planDetailsByProduct.clear();
            throw e;
        } finally {
            myWorkBook.close();
            fis.close();
        }
        return (Map) planDetailsByProduct.asMap();
    }


    public String verifyHeadersAndGetNetworkType(String product, Row header) throws Exception {
        String networkType = null;

        if (product.equals(PPO_1) || product.equals(PPO_2)) {
            networkType = "DPPO";

            if (!"INN Individual Deductible".equals(getString(header, 17)) ||
                !"INN Family Deductible".equals(getString(header, 18)) ||
                !"OON Individual Deductible".equals(getString(header, 19)) ||
                !"OON Family Deductible".equals(getString(header, 20)) ||
                !"INN Deductible Waived For P and D".equals(getString(header, 21)) ||
                !"INN Annual Maximum".equals(getString(header, 22)) ||
                !"OON Annual Maximum".equals(getString(header, 23))) {
                throw new IllegalArgumentException("!!! File contains unexpected or missing columns in SHARED COLUMNS for tab " + product + ", cannot parser file correctly.");
            }
            if (product.equals(PPO_1)) {
                if (!"INN Preventive Diagnostic".equals(getString(header, 28)) ||
                    !"INN Simple Extractions".equals(getString(header, 34)) ||
                    !"INN Inlays Onlays Crowns".equals(getString(header, 36)) ||
                    !"INN Ortho".equals(getString(header, 39)) ||
                    !"INN Ortho Lifetime Maximum".equals(getString(header, 40)) ||
                    !"INN Ortho Eligibility".equals(getString(header, 41)) ||
                    !"INN Implants".equals(getString(header, 44)) ||
                    !"OON Preventive and Diagnostic".equals(getString(header, 46)) ||
                    !"OON Simple Extractions".equals(getString(header, 52)) ||
                    !"OON Inlays Onlays Crowns".equals(getString(header, 54)) ||
                    !"OON Ortho".equals(getString(header, 57)) ||
                    !"OON Ortho Lifetime Maximum".equals(getString(header, 58)) ||
                    !"OON Ortho Eligibility".equals(getString(header, 59)) ||
                    !"OON Implants".equals(getString(header, 62)) ||
                    !"OON Reimbursement Schedule".equals(getString(header, 63)) ||
                    !"OON UCR".equals(getString(header, 64))) {
                    throw new IllegalArgumentException("File contains unexpected or missing columns for in tab " + product + ", cannot parser file correctly.");
                }
            } else if (product.equals(PPO_2)) {
                if (!"INN Preventive Diagnostic".equals(getString(header, 26)) ||
                    !"INN Simple Extractions".equals(getString(header, 32)) ||
                    !"INN Inlays Onlays Crowns".equals(getString(header, 34)) ||
                    !"INN Ortho".equals(getString(header, 37)) ||
                    !"INN Ortho Lifetime Maximum".equals(getString(header, 38)) ||
                    !"INN Ortho Eligibility".equals(getString(header, 39)) ||
                    !"INN Implants".equals(getString(header, 42)) ||
                    !"OON Ortho".equals(getString(header, 44)) ||
                    !"OON Ortho Lifetime Maximum".equals(getString(header, 45)) ||
                    !"OON Ortho Eligibility".equals(getString(header, 46)) ||
                    !"OON Reimbursement Schedule".equals(getString(header, 49))) {
                    throw new IllegalArgumentException("File contains unexpected or mission columns for in tab " + product + ", cannot parser file correctly.");
                }
            }
        } else if (product.equals(DHMO_1) || product.equals(DHMO_2)) {
                networkType = "DHMO";

                if(product.equals(DHMO_1)) {
                    if (!"INN D0120 Periodic Oral Eval".equals(getString(header, 15)) ||
                        !"INN D1110 Adult Prophy".equals(getString(header, 17)) ||
                        !"INN D1120 Child Prophy".equals(getString(header, 18)) ||
                        !"INN D2140 Silver Filling 1 Surface".equals(getString(header, 19)) ||
                        !"INN D2330 White Filling 1 Surface Anterior".equals(getString(header, 20)) ||
                        !"INN D3330 Molar Root Canal".equals(getString(header, 21)) ||
                        !"INN D4910 Perio Maintenance".equals(getString(header, 24)) ||
                        !"INN D7140 Simple Extraction Erupted Tooth".equals(getString(header, 27)) ||
                        !"INN D8080 Ortho Treatment Adult".equals(getString(header, 30)) ||
                        !"INN D8090 Ortho Treatment Adolescent".equals(getString(header, 31))) {
                        throw new IllegalArgumentException("File contains unexpected or missing columns for in tab " + product + ", cannot parser file correctly.");
                    }
                } else if (product.equals(DHMO_2)) {
                    if (!"INN MEMBER PAYS D0120 Periodic Oral Eval".equals(getString(header, 19)) ||
                        !"INN  MEMBER PAYS D1110 Adult Prophy".equals(getString(header, 21)) ||
                        !"INN  MEMBER PAYS D1120 Child Prophy".equals(getString(header, 22)) ||
                        !"INN  MEMBER PAYS D2140 Silver Filling 1 Surface".equals(getString(header, 23)) ||
                        !"INN MEMBER PAYS D2330 White Filling 1 Surface Anterior".equals(getString(header, 24)) ||
                        !"INN  MEMBER PAYS D3330 Molar Root Canal".equals(getString(header, 25)) ||
                        !"INN  MEMBER PAYS D4910 Perio Maintenance".equals(getString(header, 28)) ||
                        !"INN MEMBER PAYS D7140 Simple Extraction Erupted Tooth".equals(getString(header, 31)) ||
                        !"INN MEMBER PAYS D8080 Ortho Treatment Adult".equals(getString(header, 34)) ||
                        !"INN MEMBER PAYS D8090 Ortho Treatment Adolescent".equals(getString(header, 35))) {
                        throw new IllegalArgumentException("File contains unexpected or missing columns for in tab " + product + ", cannot parser file correctly.");
                    }
                }
        } else if(product.equals(VISION)) {
            networkType = "VISION";
            if (!"Vision Plan Code".equals(getString(header, 0)) ||
                !"Frequency".equals(getString(header, 2)) ||
                !"Exam Copay".equals(getString(header, 3)) ||
                !"Materials Copay".equals(getString(header, 4)) ||
                !"Retail Frame Allowance".equals(getString(header, 5)) ||
                !"Contact Lens".equals(getString(header, 6))) {
                throw new IllegalArgumentException("File contains unexpected or missing columns for in tab " + product + ", cannot parser file correctly.");
            }
        } else {
            throw new InvalidArgumentException("Unknown network type trying to be parsed for UHC Dental/Vision plan parser");
        }
        return networkType;
    }

    private boolean isValidProduct(String product) {
        return product.equals(PPO_1) || product.equals(PPO_2) ||
                product.equals(DHMO_1) || product.equals(DHMO_2) ||
                product.equals(VISION);
    }

    /**
     * We need to look at the CA_UNET column to know if this plan is offered in CA or not.
     * @param row
     * @param product
     * @param tabName
     * @return
     */
    private boolean isPlanOfferedInCA(Row row, String product, String tabName) {
        String caUnit = "";

        if(product.equals("DPPO")) {
            if(tabName.equals(PPO_1)) {
                caUnit = getString(row, 93);
            } else if(tabName.equals(PPO_2)) {
                caUnit = getString(row, 79);
            }
        } else if (product.equals("DHMO")) {
            if(tabName.equals(DHMO_1)) {
                caUnit = getString(row, 56);
            } else if (tabName.equals(DHMO_2)) {
                caUnit = getString(row, 77);
            }
        } else if (product.equals("VISION")) {
            caUnit = "Y"; //load all Vision plans
        }
        return "Y".equalsIgnoreCase(caUnit);
    }

    public GenericPlanDetails getPlanDetails(int rowNum, Carrier carrier, String product, Row row, String tabName) throws Exception {

        String uchNetworkName = null;
        if("DPPO".equals(product)) {
            uchNetworkName = "Options PPO 20";
        } else if ("DHMO".equals(product)) {
            uchNetworkName = "Full Network";
        } else if ("VISION".equals(product)) {
            uchNetworkName = "Full Network";
        }

        Network dppoNetworks = networkRepository.findByNameAndTypeAndCarrier(uchNetworkName, product, carrier);
        if (null == dppoNetworks) {
            LOGGER.error("No " + product + " networks found for carrier: " + carrier.getName() + " with network named: " + uchNetworkName);
            return null;
        }

        if (!isPlanOfferedInCA(row, product, tabName)) { //only taking plans that are
            return null;
        }

        GenericPlanDetails details = new GenericPlanDetails();
        details.addIfValidPlanNameByNetwork(dppoNetworks, getString(row, 0));

        if (product.equals("DPPO")) {
            details.addBenefit(benefitNames, "DENTAL_INDIVIDUAL", "IN", getString(row, 17));
            details.addBenefit(benefitNames, "DENTAL_FAMILY", "IN", getString(row, 18));
            details.addBenefit(benefitNames, "DENTAL_INDIVIDUAL", "OUT", getString(row, 19));
            details.addBenefit(benefitNames, "DENTAL_FAMILY", "OUT", getString(row, 20));
            details.addBenefit(benefitNames, "WAIVED_FOR_PREVENTIVE", "IN", getString(row, 21));
            details.addBenefit(benefitNames, "CALENDAR_YEAR_MAXIMUM", "IN", getString(row, 22));
            details.addBenefit(benefitNames, "CALENDAR_YEAR_MAXIMUM", "OUT", getString(row, 23));

            if(tabName.equals(PPO_1)) {
                details.addBenefit(benefitNames, "CLASS_1_PREVENTIVE", "IN", getString(row, 28));
                details.addBenefit(benefitNames, "CLASS_2_BASIC", "IN", getString(row, 34));
                details.addBenefit(benefitNames, "CLASS_3_MAJOR", "IN", getString(row, 36));
                details.addBenefit(benefitNames, "CLASS_4_ORTHODONTIA", "IN", getString(row, 39));
                details.addBenefit(benefitNames, "ORTHODONTIA_LIFETIME_MAX", "IN", getString(row, 40));
                details.addBenefit(benefitNames, "ORTHO_ELIGIBILITY", "IN", getString(row, 41));
                details.addBenefit(benefitNames, "IMPLANT_COVERAGE", "IN", getString(row, 44));

                details.addBenefit(benefitNames, "CLASS_1_PREVENTIVE", "OUT", getString(row, 46));
                details.addBenefit(benefitNames, "CLASS_2_BASIC", "OUT", getString(row, 52));
                details.addBenefit(benefitNames, "CLASS_3_MAJOR", "OUT", getString(row, 54));
                details.addBenefit(benefitNames, "CLASS_4_ORTHODONTIA", "OUT", getString(row, 57));
                details.addBenefit(benefitNames, "ORTHODONTIA_LIFETIME_MAX", "OUT", getString(row, 58));
                details.addBenefit(benefitNames, "ORTHO_ELIGIBILITY", "OUT", getString(row, 59));
                details.addBenefit(benefitNames, "IMPLANT_COVERAGE", "OUT", getString(row, 62));
                details.addBenefit(benefitNames, "REIMBURSEMENT_SCHEDULE", "OUT", getString(row, 63) + ((getString(row, 64).equals(""))? "":" " + getString(row, 64)));

            } else if (tabName.equals(PPO_2)) {
                details.addBenefit(benefitNames, "CLASS_1_PREVENTIVE", "IN", getString(row, 26));
                details.addBenefit(benefitNames, "CLASS_2_BASIC", "IN", getString(row, 32));
                details.addBenefit(benefitNames, "CLASS_3_MAJOR", "IN", getString(row, 34));
                details.addBenefit(benefitNames, "CLASS_4_ORTHODONTIA", "IN", getString(row, 37));
                details.addBenefit(benefitNames, "ORTHODONTIA_LIFETIME_MAX", "IN", getString(row, 38));
                details.addBenefit(benefitNames, "ORTHO_ELIGIBILITY", "IN", getString(row, 39));
                details.addBenefit(benefitNames, "IMPLANT_COVERAGE", "IN", getString(row, 42));

                details.addBenefit(benefitNames, "CLASS_1_PREVENTIVE", "OUT", "n/a");
                details.addBenefit(benefitNames, "CLASS_2_BASIC", "OUT", "n/a");
                details.addBenefit(benefitNames, "CLASS_3_MAJOR", "OUT", "n/a");
                details.addBenefit(benefitNames, "CLASS_4_ORTHODONTIA", "OUT", getString(row, 44));
                details.addBenefit(benefitNames, "ORTHODONTIA_LIFETIME_MAX", "OUT", getString(row, 45));
                details.addBenefit(benefitNames, "ORTHO_ELIGIBILITY", "OUT", getString(row, 46));
                details.addBenefit(benefitNames, "IMPLANT_COVERAGE", "OUT", "n/a");
                details.addBenefit(benefitNames, "REIMBURSEMENT_SCHEDULE", "OUT", getString(row, 49));
            }
        } else if(product.equals("DHMO")) {
            if (tabName.equals(DHMO_1)) {
                details.addBenefit(benefitNames, "ORAL_EXAMINATION", "IN", getString(row, 15));
                details.addBenefit(benefitNames, "ADULT_PROPHY", "IN", getString(row, 17));
                details.addBenefit(benefitNames, "CHILD_PROPHY", "IN", getString(row, 18));
                details.addBenefit(benefitNames, "SILVER_FILL_1_SURFACE", "IN", getString(row, 19));
                details.addBenefit(benefitNames, "WHITE_FILL_1_SURFACE_ANTERIOR", "IN", getString(row, 20));
                details.addBenefit(benefitNames, "MOLAR_ROOT_CANAL", "IN", getString(row, 21));
                details.addBenefit(benefitNames, "PERIO_MAINTAINANCE", "IN", getString(row, 24));
                details.addBenefit(benefitNames, "SIMPLE_EXTRACTION_ERUPTED_TOOTH", "IN", getString(row, 27));
                details.addBenefit(benefitNames, "ORTHO_SERVICES_ADULTS", "IN", getString(row, 30));
                details.addBenefit(benefitNames, "ORTHO_SERVICES_CHILDREN", "IN", getString(row, 31));

            } else if (tabName.equals(DHMO_2)) {
                details.addBenefit(benefitNames, "ORAL_EXAMINATION", "IN", getString(row, 19));
                details.addBenefit(benefitNames, "ADULT_PROPHY", "IN", getString(row, 21));
                details.addBenefit(benefitNames, "CHILD_PROPHY", "IN", getString(row, 22));
                details.addBenefit(benefitNames, "SILVER_FILL_1_SURFACE", "IN", getString(row, 23));
                details.addBenefit(benefitNames, "WHITE_FILL_1_SURFACE_ANTERIOR", "IN", getString(row, 24));
                details.addBenefit(benefitNames, "MOLAR_ROOT_CANAL", "IN", getString(row, 25));
                details.addBenefit(benefitNames, "PERIO_MAINTAINANCE", "IN", getString(row, 28));
                details.addBenefit(benefitNames, "SIMPLE_EXTRACTION_ERUPTED_TOOTH", "IN", getString(row, 31));
                details.addBenefit(benefitNames, "ORTHO_SERVICES_ADULTS", "IN", getString(row, 34));
                details.addBenefit(benefitNames, "ORTHO_SERVICES_CHILDREN", "IN", getString(row, 35));
            }
        } else if(product.equals("VISION")) {

            String frequencyCol = getString(row, 2);
            String [] examLensFramesCombo = frequencyCol.split("/");
            if(3 == examLensFramesCombo.length) {
                details.addBenefit(benefitNames, "EXAMS_FREQUENCY", "IN", examLensFramesCombo[0]);
                details.addBenefit(benefitNames, "LENSES_FREQUENCY", "IN", examLensFramesCombo[1]);
                details.addBenefit(benefitNames, "FRAMES_FREQUENCY", "IN", examLensFramesCombo[2]);
                details.addBenefit(benefitNames, "CONTACTS_FREQUENCY", "IN", examLensFramesCombo[1]); // same as LENS
            } else {
                LOGGER.error("Error parsing frequency col with value: " + frequencyCol + ", setting all to N/A");
                details.addBenefit(benefitNames, "EXAMS_FREQUENCY", "IN", "n/a");
                details.addBenefit(benefitNames, "LENSES_FREQUENCY", "IN", "n/a");
                details.addBenefit(benefitNames, "FRAMES_FREQUENCY", "IN", "n/a");
                details.addBenefit(benefitNames, "CONTACTS_FREQUENCY", "IN", "n/a");
            }

            details.addBenefit(benefitNames, "EXAM_COPAY", "IN", getString(row, 3));
            details.addBenefit(benefitNames, "MATERIALS_COPAY", "IN", getString(row, 4));
            details.addBenefit(benefitNames, "FRAME_ALLOWANCE", "IN", getString(row, 5));
            details.addBenefit(benefitNames, "CONTACTS_ALLOWANCE", "IN", getString(row, 6));
        }

        //validation, we should have something in the benefit list
        if(0 == details.getBenefits().size()) {
            throw new ParseException("Could not find any benefits to parse in " + product + " row number " + rowNum + ": " + row.toString(), rowNum);
        }
        return details;
    }

    private Map<String, List<GenericPlanDetails>> combineFirstAndSecondIfNotEmpty ( Map<String, List<GenericPlanDetails>> first,
                                                                                    Map<String, List<GenericPlanDetails>> second) {
        HashMap <String, List<GenericPlanDetails>> result =  (first instanceof HashMap) ? (HashMap) first : new HashMap<>(first);
        if(null != second && second.size() > 0) {
            result.putAll(second);
        }
        return result;
    }

    private String getString(Row row, int col) {
        return formatter.formatCellValue(row.getCell(col), evaluator, cfEvaluator).trim();
    }

    private byte[] copyInputStream(InputStream is){
        // Make a copy of the input stream so we can read more than once
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            copy(is, baos);
            byte[] bytes = baos.toByteArray();
            is.close();

            return bytes;
        }catch (IOException e){
            LOGGER.error("An error occurred when copying input stream", e);
        }
        return null;
    }
}




