package com.benrevo.common.anthem;

import com.benrevo.common.dto.OptimizerDto;
import com.benrevo.common.dto.OptimizerDto.OptimizerProduct;
import com.benrevo.common.dto.RfpDto;
import com.benrevo.common.exception.BaseException;
//import com.monitorjbl.xlsx.StreamingReader;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;

import static com.benrevo.common.Constants.DENTAL;
import static com.benrevo.common.Constants.MEDICAL;
import static com.benrevo.common.Constants.VISION;
import static com.benrevo.common.util.DateHelper.fromDateToString;
import static org.apache.commons.lang3.StringUtils.isEmpty;

import java.io.InputStream;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class AnthemOptimizerParser {

    protected static final Logger logger = LoggerFactory.getLogger(AnthemOptimizerParser.class);
    protected static DataFormatter formatter = new DataFormatter();
    protected static DateFormat dateFormatter = new SimpleDateFormat("MM/dd/yy");
    protected static final Pattern SECTION_PATTERN = Pattern.compile("\\s*SECTION\\s+(\\d+).*",Pattern.CASE_INSENSITIVE);

    protected static final String EXHIBIT_SHEET = "EXHIBIT";
    protected static final String EXHIBIT_4_TIER_SHEET = "EXHIBIT 4 TIER";
    protected static final String INTAKE_SHEET = "INTAKE";
    protected static final String DENTAL_INTAKE_SHEET = "DENTAL INTAKE";
    protected static final String DENTAL_SHEET = "DENTAL";
    protected static final String ANCILLARY_EXHIBIT_SHEET = "ANCILLARY EXHIBIT";

    private boolean debug = false;
    protected AnthemOptimizerParserData data;
    
    public AnthemOptimizerParser() {
    }
    
    public AnthemOptimizerParser(AnthemOptimizerParserData data) {
        this.data = data;
    }

    public AnthemOptimizerParserData parseAll(InputStream fileInputStream, boolean validate, OptimizerDto dto) {
        
        data = new AnthemOptimizerParserData();
        // on default, parse everything that in optimizer
        // do not check if some products are missing
        data.setParseAll(false);
        if (dto != null && dto.getProducts().size() != 0) {
            for (OptimizerProduct product : dto.getProducts()) {
                // if any products param are present 
                // force checking if they are in Optimizer
                data.setParseAll(false);
                if(MEDICAL.equals(product.getCategory()) && !product.isRenewal()){
                    data.setParseMedical(true);
                } else if(DENTAL.equals(product.getCategory()) && !product.isRenewal()){
                    data.setParseDental(true);
                } else if(VISION.equals(product.getCategory()) && !product.isRenewal()){
                    data.setParseVision(true);
                }
            }
        }
        
        if (validate) {
            data.setErrors(new ArrayList<>());
        }
        String tabName = "";
        try( Workbook myWorkBook = new XSSFWorkbook (fileInputStream); ) {

            // Walk through all the sheets
            for (int sheetIndex = 0; sheetIndex < myWorkBook.getNumberOfSheets(); sheetIndex++) {

                Sheet mySheet = myWorkBook.getSheetAt(sheetIndex);
                tabName = mySheet.getSheetName().trim().toUpperCase();

                Iterator<Row> rowIterator = mySheet.iterator();
                switch(tabName) {
                    case INTAKE_SHEET:
                        new AnthemOptimizerIntakeSheetParser(data).processIntakeSheet(rowIterator);
                        break;
                    case EXHIBIT_4_TIER_SHEET:
                    case EXHIBIT_SHEET:
                        //processExhibitSheet(rowIterator, data);
                        break;
                    case DENTAL_INTAKE_SHEET:
                    case DENTAL_SHEET:
                        if (data.isHasDental() || data.isHasVision()) {
                            new AnthemOptimizerDentalSheetParser(data).processDentalSheet(rowIterator);
                        }
                        break;
                    case ANCILLARY_EXHIBIT_SHEET:
                        if (data.isHasVision() && !data.isFoundVision() ) {
                            new AnthemOptimizerVisionSheetParser(data).processVisionSheet(rowIterator);
                        }
                        break;
                }

            }
            
            if (!data.isParseAll()) {
                if (data.isParseMedical() && !data.isHasMedical()) {
                    String error = "MEDICAL product not found";
                    if(validate){
                        data.getErrors().add(error);
                    }else{
                        throw new BaseException(error);
                    }
                }
                if (data.isParseDental() && !data.isHasDental()) {
                    String error = "DENTAL product not found";
                    if(validate){
                        data.getErrors().add(error);
                    }else{
                        throw new BaseException(error);
                    }
                }
                if (data.isParseVision() && !data.isHasVision()) {
                    String error = "VISION product not found";
                    if(validate){
                        data.getErrors().add(error);
                    }else{
                        throw new BaseException(error);
                    }
                }
            }
        } catch (BaseException e) {
            if(validate){
                data.getErrors().add(e.getMessage() + " TabName=" + tabName);
            }else{
                throw new BaseException("TabName=" + tabName +". " + e.getMessage(), e);
            }
        } catch (Exception e) {
            if(validate){
                data.getErrors().add(e.getMessage() + " TabName=" + tabName);
            }else{
                logger.error("An error occurred while parsing Anthem Optimizer", e);
            }
        }
        return data;
    }


    private void processExhibitSheet(Iterator<Row> rowIterator, AnthemOptimizerParserData data) {
        
        Row row = skipAndGetRow(rowIterator,2); 
        int numberOfPlans = Integer.parseInt(getString(row, 'k', "Number of Medical Plans", EXHIBIT_SHEET));
        logger.info("\t\tnumberOfPlans {} ", numberOfPlans);

        skipRow(rowIterator,4);
        
        for(int planLoop = 0; planLoop < numberOfPlans; planLoop++) {
            
            row = skipAndGetRow(rowIterator,4);
            String network = getString(row, 'i', "Network", EXHIBIT_SHEET);
            logger.info("\t\tnetwork {}",network);

            row = getNextRow(rowIterator);
            String planName = getString(row, 'h', "Plan Name", EXHIBIT_SHEET);
            logger.info("\t\tplanName {}",planName);

            row = skipAndGetRow(rowIterator,8);
            String eeString = getString(row, 'h', "Rate 1", EXHIBIT_SHEET).replace("$","").replace(",","");
            logger.info("\t\teeString {}",eeString);

            row = getNextRow(rowIterator);
            String esString = getString(row, 'h', "Rate 2", EXHIBIT_SHEET).replace("$","").replace(",","");
            logger.info("\t\tesString {}",esString);
        
            row = getNextRow(rowIterator);
            String ecString = getString(row, 'h', "Rate 3", EXHIBIT_SHEET).replace("$","").replace(",","");
            logger.info("\t\tecString {}",ecString);

            row = getNextRow(rowIterator);
            String efString = getString(row, 'h', "Rate 4", EXHIBIT_SHEET).replace("$","").replace(",","");
            logger.info("\t\tefString {}",efString);
            
            // plan boxes are 19 rows high
            skipRow(rowIterator,3);
        }
    }

    /***********************************
     * Helper Methods
     ***********************************/

    protected void setCommissionInRfp(RfpDto rfp, String commissionStr) {
        Double commission;

        if((rfp.getProduct().equalsIgnoreCase(DENTAL) || rfp.getProduct().equalsIgnoreCase(VISION))
            && commissionStr.equalsIgnoreCase("std")){
            rfp.setCommission("10");
            rfp.setPaymentMethod("%");
        }else if((rfp.getProduct().equalsIgnoreCase(DENTAL) || rfp.getProduct().equalsIgnoreCase(
            VISION))
            && commissionStr.equalsIgnoreCase("net")){
            rfp.setCommission("0");
            rfp.setPaymentMethod("%");
        } else if(commissionStr.contains("%")) {
            commission = Double.parseDouble(commissionStr.replace("%", ""));
            rfp.setCommission(commission.toString());
            rfp.setPaymentMethod("%");
        } else if(commissionStr.contains("$")) { //TODO: need an example of PEPM
            commission = Double.parseDouble(commissionStr.replace("$", "").replace(",",""));
            rfp.setCommission(commission.toString());
            rfp.setPaymentMethod("PEPM");
        } else if (commissionStr.contains("Commissions")) {//TODO: need an example of Net of Comissions
            rfp.setPaymentMethod("COMMISSION");
        }
    }

    protected Float parseFloat(String strFloat) {
        return strFloat.isEmpty() ? 0F : Float.parseFloat(strFloat);
    }

    protected Long parseLong(String strLong) {
        return strLong.isEmpty() ? 0L : Long.parseLong(strLong);
    }

    private String getCellValue(Row row, int col) {
        Cell cell = row.getCell(col);
        if (cell == null) {
            return "";
        }
        
        switch (cell.getCellTypeEnum()) {
            case BLANK:
                return "";
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                return formatter.formatCellValue(cell);
            case FORMULA:
                switch (cell.getCachedFormulaResultTypeEnum()) {
                    case NUMERIC:
                        return formatter.formatRawCellContents(
                                cell.getNumericCellValue(),
                                -1,
                                cell.getCellStyle().getDataFormatString());
                    case STRING:
                        return cell.getStringCellValue();
                    case FORMULA:
                        String value = cell.getStringCellValue();
                        return value.length() > 1
                                && value.charAt(0) == '"' 
                                && value.charAt(value.length() - 1) == '"' 
                                ? value.substring(1, value.length() - 1) 
                                : value;
                }
        }
        
        return formatter.formatCellValue(cell);
    }

    protected String getString(Row row, char letter, String description, String sheetName) {
        String value = getStringOrEmpty(row, letter);
        if (value.isEmpty()) {
            if(data.getErrors() != null){
                data.getErrors().add(description + " can't be empty. Sheet="
                    + sheetName
                    + ", Row=" + (row.getRowNum() + 1) + ", Col=" + letter);
            }else {
                throw new BaseException(description + " can't be empty. Sheet="
                    + sheetName
                    + ", Row=" + (row.getRowNum() + 1) + ", Col=" + letter);
            }
        }
        return value.trim();
    }
    
    protected Date getDate(Row row, char letter, String description, String sheetName, String format, boolean optional) {
        String value = getString(row, letter, description, sheetName);
        
        DateFormat dateFormatter = new SimpleDateFormat(format);

        try {
            if(optional && isEmpty(value)){
                if(data.getErrors() != null){
                    data.getErrors().remove(data.getErrors().size()-1);
                }
                return null;
            }

            return dateFormatter.parse(value);
        } catch (ParseException e) {
            String error = String.format("%s. %s. Sheet=%s, Row=%s, Col=%s",
                    description,
                    e.getMessage(),
                    sheetName,
                    row.getRowNum() + 1,
                    letter);
            if(data.getErrors() != null){
                data.getErrors().add(error);
            }else {
                throw new BaseException(error, e);
            }
        }
        return null;
    }
    
    protected Float getFloat(Row row, char letter, String description, String sheetName) {
        String value = getString(row, letter, description, sheetName);
        
        return parseFloat(row, letter, description, sheetName, value);
    }

    protected Float parseFloat(Row row, char letter, String description, String sheetName, String value) {
        try {
            return Float.valueOf(value.replace("$","").replace(",","").replace("%",""));
        } catch (NumberFormatException e) {
            String error = String.format("%s. %s. Sheet=%s, Row=%s, Col=%s", 
                    description,
                    e.getMessage(),
                    sheetName,
                    row.getRowNum() + 1,
                    letter);
            if(data.getErrors() != null){
                data.getErrors().add(error);
            }else {
                throw new BaseException(error, e);
            }
        }
        return null;
    }
    
    protected Long getLong(Row row, char letter, String description, String sheetName) {
        String value = getString(row, letter, description, sheetName).replace(",","");
        
        try {
            return Long.valueOf(value);
        } catch (NumberFormatException e) {
            String error = String.format("%s. %s. Sheet=%s, Row=%s, Col=%s", 
                    description,
                    e.getMessage(),
                    sheetName,
                    row.getRowNum() + 1,
                    letter);
            if(data.getErrors() != null){
                data.getErrors().add(error);
            }else {
                throw new BaseException(error, e);
            }
        }
        return null;
    }
    
    protected String getStringOrEmpty(Row row, char letter) {
        int pos = letter - 'a';
        return getCellValue(row, pos).trim();
    }

    protected boolean contains(String value, Pattern pattern, String[] values) {
        Matcher m = pattern.matcher(value);
        if (m.find()) {
            if ( values != null ) {
                for (int i=0; i < values.length; i++) {
                    values[i] = i < m.groupCount() ? m.group(i+1) : "";    
                }
            }
            return true; 
        }
        return false;
    }

    protected Row getNextRow(Iterator<Row> rowIterator) {
        if (rowIterator.hasNext()) {
            return rowIterator.next();
        }
        return null;
    }

    protected void skipRow(Iterator<Row> rowIterator, int num) {
        for (int i=0; i < num; i++) {
            rowIterator.next();
        }
    }

    protected Row skipAndGetRow(Iterator<Row> rowIterator, int num) {
        skipRow(rowIterator, num-1);
        return rowIterator.next();
    }

    protected boolean isDebug() {
        return debug;
    }

    protected void setDebug(boolean debug) {
        this.debug = debug;
    }

}
