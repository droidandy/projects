package com.benrevo.be.modules.onboarding.service.email.report;

import com.benrevo.common.exception.DocumentGeneratorException;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.IntStream;

public class XSSFWorkbookProcessor implements DocumentProcessor<XSSFWorkbook> {
    private static final Logger LOGGER = LogManager.getLogger(XSSFWorkbookProcessor.class);

    private static final String MESSAGE_DATA_MAP_IS_NOT_VALID = "The data map can not be null.";
    private static final String MESSAGE_XSSFWORKBOOK_IS_NOT_INITIALIZED = "XSSFWorkbook is not initialized. Please load an *.xlxs document at first.";

    private static final String VARIABLE_TEMPLATE = "${%s}";
    private static final String COMPLEX_VARIABLE_TEMPLATE = "${%s:\"%s\"}";
    private static final String KEY_PATTERN = "\\$\\{(.*?)\\}";
    private static final String COMPLEX_KEY_PATTERN = "\\$\\{(.*?)\\:\"";
    private static final String REPLACE_STRING = "X";

    private static List<String> findKey(String rawValue, String pattern) {
        List<String> keys = new ArrayList<>();
        Pattern r = Pattern.compile(pattern);
        Matcher matcher = r.matcher(rawValue);
        while(matcher.find()) {
            String group = matcher.group(1);
            if(validGroup(group)) {
                keys.add(group);
            } else {
                LOGGER.warn("The group is not valid: {}", group);
            }
        }

        return keys;
    }

    private static boolean validGroup(String group) {
        return !group.isEmpty() && !group.contains("$") && !group.contains("{") && !group.contains("}");
    }

    private Document<XSSFWorkbook> load(String path) throws DocumentGeneratorException {
        InputStream inputStream = XSSFWorkbookProcessor.class.getResourceAsStream(path);
        if(inputStream == null) {
            throw new DocumentGeneratorException(String.format("Can not load the '%s' file", path));
        }

        return load(inputStream);
    }

    @Override
    public final Document<XSSFWorkbook> load(InputStream inputStream) {
        try {
            return new Document<>((XSSFWorkbook) WorkbookFactory.create(inputStream));
        } catch(IOException | InvalidFormatException e) {
            throw new DocumentGeneratorException(e.getMessage(), e);
        }
    }

    private void populate(Document<XSSFWorkbook> xssfWorkbook, Map<String, String> dataMap) {
        if(dataMap == null) {
            throw new DocumentGeneratorException(MESSAGE_DATA_MAP_IS_NOT_VALID);
        }

        if(xssfWorkbook == null) {
            throw new DocumentGeneratorException(MESSAGE_XSSFWORKBOOK_IS_NOT_INITIALIZED);
        }

        int pageCount = xssfWorkbook.getDocument().getNumberOfSheets();
        IntStream.range(0, pageCount).forEach(sheetIndex -> {
            XSSFSheet xssfSheet = xssfWorkbook.getDocument().getSheetAt(sheetIndex);

            int firstRowIndex = xssfSheet.getFirstRowNum();
            int lastRowIndex = xssfSheet.getLastRowNum();
            IntStream.range(firstRowIndex, lastRowIndex).forEach(rowIndex -> {
                XSSFRow xssfRow = xssfSheet.getRow(rowIndex);

                int firstCellIndex = xssfRow.getFirstCellNum();
                int lastCellIndex = xssfRow.getLastCellNum();
                IntStream.range(firstCellIndex, lastCellIndex).forEach(cellIndex -> {
                    XSSFCell xssfCell = xssfRow.getCell(cellIndex);

                    if(xssfCell.getCellTypeEnum() == CellType.STRING) {
                        StringBuilder value = new StringBuilder(xssfCell.getStringCellValue());
                        populateComplexKeys(dataMap, value);
                        populateKeys(dataMap, value);
                        xssfCell.setCellValue(value.toString());
                    }
                });
            });
        });
    }

    private void populateKeys(Map<String, String> dataMap, StringBuilder value) {
        List<String> keys = findKey(value.toString(), KEY_PATTERN);
        keys.stream().forEach(key -> {
            String data = dataMap.get(key);
            String variable = String.format(VARIABLE_TEMPLATE, key);

            String content = value.toString();
            int indexOf = content.indexOf(variable);
            int lastIndexOf = indexOf + variable.length();
            value.replace(indexOf, lastIndexOf, data != null ? data : "");
        });
    }

    private void populateComplexKeys(Map<String, String> dataMap, StringBuilder value) {
        List<String> complexKeys = findKey(value.toString(), COMPLEX_KEY_PATTERN);
        complexKeys.forEach(key -> {
            String data = dataMap.get(key);
            if(data != null) {
                String variable = String.format(COMPLEX_VARIABLE_TEMPLATE, key, data);

                String content = value.toString();
                int indexOf = content.indexOf(variable);
                if(indexOf != -1) {
                    int lastIndexOf = indexOf + variable.length();
                    value.replace(indexOf, lastIndexOf, REPLACE_STRING);
                }
            }
        });
    }

    @Override
    public Document<XSSFWorkbook> build(String pathToTemplate, Map<String, String> dataMap) throws DocumentGeneratorException {
        return build(load(pathToTemplate), dataMap);
    }

    public Document<XSSFWorkbook> build(Document<XSSFWorkbook> document, Map<String, String> dataMap) throws DocumentGeneratorException {
        populate(document, dataMap);
        return document;
    }
}