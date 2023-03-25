package com.benrevo.be.modules.admin.domain.quotes.parsers.uhc;

import static java.util.Objects.isNull;

import com.benrevo.be.modules.admin.domain.plans.GenericPlanDetails;
import com.benrevo.data.persistence.entities.BenefitName;
import java.text.NumberFormat;
import java.text.ParseException;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFColor;

/**
 * Created by ojas.sitapara on 5/18/17.
 */
abstract class UHCBaseParser {

    protected final DataFormatter objDefaultFormat = new DataFormatter();
    protected String disclaimer = null;
    protected NumberFormat currencyFormatter = NumberFormat.getCurrencyInstance(Locale.US);

    public String getValueOrDefault(String value, String defaultValue) {
        return value != null ? value : defaultValue;
    }

    protected String getColumnValues(Row row, int startColumn, int endColumn) {

        String value = "";
        if(row != null) {
            for(int column = startColumn; column <= endColumn; column++) {
                value += getColumn(row, column);
            }
        }

        value = replaceAllSpecialCharacters(value);
        return value;
    }

    protected String getColumn(Row row, int columnIndex) {
        String value = "";
        if(row != null) {
            Cell cell = row.getCell(columnIndex);
            if(cell != null && cell.getCellType() != Cell.CELL_TYPE_BLANK) {
                XSSFCellStyle style = (XSSFCellStyle) cell.getCellStyle();
                if (style != null) {
                    XSSFColor cellColor = style.getFillForegroundColorColor();
                    XSSFColor fontColor = style.getFont().getXSSFColor();
                    if (fontColor !=  null 
                            && cellColor !=  null 
                            && fontColor.getARGBHex().equals(cellColor.getARGBHex())) {
                        // cell and font have the same color
                        // invisible value
                        return "";
                    }
                }
                value += cell.getStringCellValue();
                value = getCurrencyAsString(value);
            }
        }
        value = replaceAllSpecialCharacters(value);
        return value;
    }

    private String getCurrencyAsString(String value) {
        try {
            if(value.contains("$") && !value.contains("/")) {
                value = "$" + currencyFormatter.parse(value).toString();
            }
        }catch(ParseException e){
            return value;
        }
        return value;
    }

    protected String replaceAllSpecialCharacters(String string) {
        String result = "";
        if(string != null && !string.isEmpty()) {
            if (string.trim().equalsIgnoreCase("Not Applicable")) { 
                return "N/A";
            }
            result = string.replaceAll("\\n", "");
            result = result.replaceAll("\\t", "");
        }
        return result;
    }

    protected boolean isCategory(Row row, String param) {
        String firstColumn = getColumn(row, 0);
        if(!firstColumn.isEmpty() && firstColumn.equals(param)) {
            return true;
        } else {
            return false;
        }
    }

    protected boolean isCategory(Row row, String param, int format) {
        int columnIndex = format == 1 ? 0 : 1;
        String column = getColumn(row, columnIndex).trim();
        return !column.isEmpty() && column.equals(param);
    }

    public String getDisclaimer() {
        return disclaimer;
    }

    protected String getColumnAsString(Row row, int columnIndex, boolean replaceSpecial) {
        String value = "";

        if(row != null) {
            Cell cell = row.getCell(columnIndex);
            if(cell != null && cell.getCellType() != Cell.CELL_TYPE_BLANK) {
                value += objDefaultFormat.formatCellValue(cell);
                value = getCurrencyAsString(value);
            }
        }

        if(replaceSpecial) {
            value = replaceAllSpecialCharacters(value);
        }

        return value;
    }

    protected String getColumnAsRawString(Row row, int columnIndex) {
        if(row != null) {
            Cell cell = row.getCell(columnIndex);
            if(cell != null && cell.getCellType() != Cell.CELL_TYPE_BLANK) {
                return objDefaultFormat.formatCellValue(cell);
            }
        }
        return "";
    }

    protected String getColumnAsString(Row row, int columnIndex) {
        return getColumnAsString(row, columnIndex, true);
    }

    protected UHCNetworkDetails defaultBenefitsNotFound(UHCNetworkDetails net, Map<String, String> benefits, List<BenefitName> benefitNames){
        if("DHMO".equals(net.getNetworkType())){
            return net;
        }

        // only applies to DPPOs as we do not parse benefits for DHMOs
        GenericPlanDetails planDetails = net.getGenericPlanDetails();
        for(String benefitName : benefits.keySet()){
            if(!planDetails.getBenefitKeysAdded().containsKey(benefitName)){
                String[] inputTypes = benefits.get(benefitName).split("_");
                for(String inputType : inputTypes){
                    net.getGenericPlanDetails()
                        .addBenefit(benefitNames,
                            benefitName,
                            inputType,
                            "N/A"
                        );
                }
            }
        }
        return net;
    }
    
    protected boolean contains(String value, Pattern pattern, List<String> values) {
        Matcher m = pattern.matcher(value);
        if (m.find()) {
            if (values != null) {
                values.clear();
                for (int i=1; i <= m.groupCount(); i++) {
                    values.add(m.group(i).trim());
                }
            }
            return true;
        }
        return false;
    }

    protected String parseDualColumns(String row) {
        Pattern p = Pattern.compile("(-\\s[a-zA-Z0-9\\+\\-\\.\\s\\/%]+)\\s+(-\\s[a-zA-Z0-9\\+\\-\\.\\s\\/%]+)");
        Matcher m = p.matcher(row);

        if(m.find() && m.groupCount() >= 1) {
            StringBuilder r = new StringBuilder("<div>")
                .append("<div>")
                .append(m.group(1))
                .append("</div>");

            if(m.groupCount() > 1) {
                r.append("<div>")
                 .append(m.group(2))
                 .append("</div>");
            }
            r.append("</div>");

            return r.toString();
        }

        return row;
    }

}
