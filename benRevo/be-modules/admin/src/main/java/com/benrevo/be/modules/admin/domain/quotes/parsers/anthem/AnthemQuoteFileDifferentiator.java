package com.benrevo.be.modules.admin.domain.quotes.parsers.anthem;

import static java.util.Objects.isNull;
import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.docx4j.org.apache.poi.util.IOUtils.copy;

import com.monitorjbl.xlsx.StreamingReader;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.regex.Pattern;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.poifs.filesystem.OfficeXmlFileException;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.web.multipart.MultipartFile;

/**
 * Created by lemdy on 4/30/18.
 */
public class AnthemQuoteFileDifferentiator {

    private static final Logger LOGGER = LogManager.getLogger(AnthemQuoteFileDifferentiator.class);
    private Iterator<Row> rowIterator;
    private Row row;
    private String lastValue = "";
    DataFormatter dataFormatter = new DataFormatter();


    private enum FileType {
        STANDARD,
        DPPO
    }

    private final Pattern PLAN_NAME_PATTERN = Pattern.compile(".*Fully.+Insured.+Rate.+Quotation.+For.*",Pattern.CASE_INSENSITIVE);
    private final Pattern RATE_DESCRIPTION_PATTERN = Pattern.compile(".*Rate.+Description.*",Pattern.CASE_INSENSITIVE);
    private final Pattern NOT_AVAILABLE = Pattern.compile("\\s*Not\\s+Available\\s*",Pattern.CASE_INSENSITIVE);


    public MultipartFile setAnthemFilesAndGetStandardFile(List<MultipartFile> files, List<InputStream> standardFiles, List<InputStream> dppoFiles) throws Exception{
        if(isNull(standardFiles)){
            standardFiles = new ArrayList<>();
        }

        if(isNull(dppoFiles)){
            dppoFiles = new ArrayList<>();
        }

        MultipartFile standardFile = null;
        for(MultipartFile file : files){

            // copy input stream, partition file by determining file type using their parsers
            InputStream is = file.getInputStream();
            byte[] bytes = copyInputStream(is);
            String fileType = getQuoteFileType(bytes);

            if(isNull(fileType)){
                fileType = "STANDARD";
                LOGGER.warn("Quote file type cannot be determined. Using default "
                    + "'Standard Quote File Type'. fileName=" + file.getOriginalFilename());
            }

            if(fileType.equals("STANDARD")){
                // Standard parser
                standardFiles.add(new ByteArrayInputStream(bytes));
                standardFile = file;
            } else if(fileType.equals("DPPO")){
                dppoFiles.add(new ByteArrayInputStream(bytes));
            }
        }

        return standardFile;
    }
    /**
     * Determine the type of file the quote file is - Standard or DPPO file
     * @param
     * @throws Exception
     */
    public String getQuoteFileType(byte[] inputStreamByte) throws Exception {

        try {
            if(isStandardFile(new ByteArrayInputStream(inputStreamByte))){
                return FileType.STANDARD.name();
            }
        } catch(Exception e){/* Do nothing as exception could happen while opening file */}

        try {
            if(isDPPOFile(new ByteArrayInputStream(inputStreamByte))){
                return FileType.DPPO.name();
            }
        } catch(Exception e){
            LOGGER.error(e); /* Do nothing as exception could happen while opening file */
        }

        return null;
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

    /**
     * Helper method that tries to open the input stream as Standard
     * @param is
     * @return
     */
    private boolean isStandardFile(InputStream is) throws Exception{
        HSSFWorkbook workbook = null;
        try{
            workbook = new HSSFWorkbook(is);
            HSSFSheet mySheet = workbook.getSheetAt(0);
            int dentalProposalIndex = workbook.getSheetIndex("Dental Proposal");
            if(dentalProposalIndex == -1
                && getQuoteFileTypeFromInterior(mySheet.iterator()).equals(FileType.STANDARD)){
                return true;
            }
        } catch(OfficeXmlFileException e){
            /* Do not thing cuz if .xls is opened here, it is a DPPO file*/
        } catch(Exception e){
            LOGGER.error(e);
        } finally {
            if (workbook != null) {
                workbook.close();
            }
        }
        return false;
    }

    /**
     * Helper method that tries to open the input stream as DPPO
     * @param is
     * @return
     */
    private boolean isDPPOFile(InputStream is) throws Exception{
        Workbook workbook = null;
        try {
            workbook = StreamingReader.builder()
                .rowCacheSize(100)
                .bufferSize(4096)
                .open(is);

            int dentalProposalIndex = workbook.getSheetIndex("Dental Proposal");
            if (dentalProposalIndex != -1
                && getQuoteFileTypeFromInterior(workbook.getSheet("Dental Proposal").iterator())
                .equals(FileType.DPPO)) {
                return true;
            }
        } catch(ParseException e){
            LOGGER.error(e);
        } finally {
            if(workbook != null) {
                workbook.close();
            }
        }
        return false;
    }

    /**
     * Helper method that examines the interior of the file and determines the file type
     * @param inputIterator
     * @return
     * @throws ParseException
     */
    private FileType getQuoteFileTypeFromInterior(Iterator<Row> inputIterator) throws ParseException {
        String dppoPlanName = null;
        String standardRateDescription = null;

        rowIterator = inputIterator;
        while(getNextRow()) {
            if (column(2,3).matches(PLAN_NAME_PATTERN)) {
                dppoPlanName = column(4).value();
                break;
            }

            if (column(0,3).matches(RATE_DESCRIPTION_PATTERN)) {
                standardRateDescription = column(0).value();
                break;
            }
        }

        if(isBlank(standardRateDescription) && !isBlank(dppoPlanName)){
            return FileType.DPPO;
        }else {
            return FileType.STANDARD;
        }
    }

    private boolean getNextRow() {
        if (rowIterator.hasNext()) {
            row = rowIterator.next();
            return true;
        }
        return false;
    }
    
    private AnthemQuoteFileDifferentiator column(int index) {
        if (index < 0) {
            lastValue = "N/A";
        } else {
            Cell cell = row.getCell(index);
            if(cell == null) { 
                lastValue = "";
            } else {
                lastValue = dataFormatter.formatCellValue(cell).replace("\"", "");
                if (NOT_AVAILABLE.matcher(lastValue).matches()) {
                    lastValue = "N/A";
                };
            }
        }
        return this;
    }
    
    private AnthemQuoteFileDifferentiator column(int startIndex, int endIndex) {
        StringBuilder sb = new StringBuilder();
        for (int index=startIndex;index<=endIndex;index++) {
            Cell cell = row.getCell(index);
            if(cell != null && cell.getCellType() != Cell.CELL_TYPE_BLANK) {
                sb.append(dataFormatter.formatCellValue(cell).replace("\"", ""));
            }
        }
        lastValue = sb.toString();
        return this;
    }
    
    private boolean matches(Pattern pattern) {
        return pattern.matcher(lastValue).matches();
    } 

    private String value() {
        return lastValue;
    }
}
