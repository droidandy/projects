package com.benrevo.be.modules.presentation.util;

import static com.benrevo.be.modules.shared.util.PlanCalcHelper.doubleValue;
import static org.apache.commons.lang.StringUtils.isBlank;
import com.benrevo.common.dto.QuoteOptionAltPlanDto;
import com.benrevo.common.dto.QuoteOptionAltPlanDto.Benefit;
import com.benrevo.common.dto.QuoteOptionAltPlanDto.Cost;
import com.benrevo.common.dto.QuoteOptionAltPlanDto.Rx;
import com.benrevo.common.dto.QuoteOptionPlanComparisonDto;
import com.benrevo.common.dto.QuoteOptionPlanComparisonDto.PlanByNetwork;
import com.benrevo.common.dto.ancillary.AncillaryClassDto;
import com.benrevo.common.dto.ancillary.AncillaryRateAgeDto;
import com.benrevo.common.dto.ancillary.AncillaryRateDto;
import com.benrevo.common.dto.ancillary.RfpQuoteAncillaryPlanComparisonDto;
import com.benrevo.common.dto.ancillary.VoluntaryRateDto;
import com.benrevo.common.enums.AncillaryPlanType;
import com.benrevo.common.enums.CarrierType;
import com.benrevo.common.enums.PlanCategory;
import com.benrevo.common.enums.PlanRateType;
import com.benrevo.common.dto.RiderDto;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.ClientException;
import com.benrevo.common.util.DateHelper;
import com.benrevo.common.util.MapBuilder;
import com.benrevo.common.util.MathUtils;
import com.benrevo.common.util.ObjectMapperUtils;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.entities.RFP;
import com.benrevo.data.persistence.entities.RfpCarrier;
import com.benrevo.data.persistence.entities.RfpQuote;
import com.benrevo.data.persistence.entities.RfpQuoteSummary;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.util.BeanUtil;
import com.google.common.base.Joiner;
import com.google.common.base.MoreObjects;
import com.google.common.base.MoreObjects.ToStringHelper;
import com.google.common.collect.Lists;
import com.google.common.collect.Sets;
import org.apache.commons.beanutils.PropertyUtils;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.poi.hssf.usermodel.*;
import org.apache.poi.hssf.util.CellReference;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellCopyPolicy;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.PaperSize;
import org.apache.poi.ss.usermodel.RichTextString;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Row.MissingCellPolicy;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.InvocationTargetException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.StringTokenizer;
import java.util.TreeSet;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import org.apache.poi.ss.util.CellAddress;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.ss.util.WorkbookUtil;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFFormulaEvaluator;
import org.apache.poi.xssf.usermodel.XSSFRichTextString;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.xssf.usermodel.extensions.XSSFCellBorder.BorderSide;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Attribute;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.nodes.Node;
import org.jsoup.nodes.TextNode;
import org.jsoup.select.Elements;
import org.springframework.beans.BeanUtils;
import org.springframework.web.util.HtmlUtils;
import static com.benrevo.common.Constants.*;
import static com.benrevo.common.util.MapBuilder.entry;
import static org.apache.poi.ss.util.CellReference.convertColStringToIndex;
import static com.benrevo.be.modules.shared.service.SharedRfpQuoteService.*;
import static java.util.Optional.ofNullable;


public class PoiUtil {
    
    private short DOLLAR_NUMBER_FORMAT_INDEX;
    private short INTEGER_PERCENT_FORMAT_INDEX; // 1%, not 1.00%
    
    private static final String DOLLAR_NUMBER_FORMAT = "$#,##0.00;-$#,##0.00;$0";
    private static final String INTEGER_PERCENT_FORMAT = "0%";
    public static final int MAX_OPTION_NUMBER = 9;
    public static final int MAX_PLAN_NUMBER = 6;
    public static final int MAX_AGES_NUMBER = 15;
    
    private static final String MONTHLY_TOTAL = "Monthly Total";
    private static final String HSA_EMPLOYER_FUND = "HSA Employer Fund";
    private static final String HSA_ADMINISTRATIVE_FEE = "HSA Administrative Fee";
    private static final String HMO_TEMPLATE = "HMO_template";
    private static final String HMO_HSA_TEMPLATE = "HMO_HSA_template";
    private static final String LIFE_TEMPLATE = "LIFE_template";
    private static final String VOL_LIFE_TEMPLATE = "VOL_LIFE_template";
    private static final String STD_TEMPLATE = "STD_template";
    private static final String VOL_STD_TEMPLATE = "VOL_STD_template";
    private static final String LTD_TEMPLATE = "LTD_template";
    private static final String VOL_LTD_TEMPLATE = "VOL_LTD_template";
    private static final String COVER_PAGE_TEMPLATE = "Cover Page";
    private static final String SUMMARY_PAGE_TEMPLATE = "Quote Summary";
    
    private static final Map<String, String> DISCLOSURE_TAB_NAME_BY_CARRIER = MapBuilder.build(
        entry(CarrierType.ANTHEM_BLUE_CROSS.displayName, "Standard Proposal Disclosures"),
        entry(CarrierType.ANTHEM_CLEAR_VALUE.displayName, "Clear Value Disclosures"),
        entry(CarrierType.UHC.displayName, "UnitedHealthcare Disclosures"));
    
    private static final List<String> rateValueCostNames = Arrays.asList(TIER1_PLAN_NAME, TIER2_PLAN_NAME, TIER2_PLAN_NAME_SPECIAL, 
        TIER3_PLAN_NAME, TIER3_PLAN_NAME_SPECIAL, TIER4_PLAN_NAME);

    public static class ComparisonNetwork {
        public ComparisonNetwork(String name, String type) {
            this.name = name;
            this.type = type;
        }
        public String name;
        public String type;
        
        @Override
        public String toString() {
            return name + " " + type;
        }
    }
    
    /**
     * A <code>FormattingRun</code> holds information about one "run" of a
     * <code>RichTextString</code> that is of the same <code>Font</code>.
     */
    private class FormattingRun
    {
        private int beginIdx;
        private int length;
        private XSSFFont font;
       
        private FormattingRun(int beginIdx, int length, XSSFFont font) {
            this.beginIdx = beginIdx;
            this.length = length;
            this.font = font;
        }
       
    }

    private static Long findCensus(List<QuoteOptionPlanComparisonDto> comparisonDtos, ComparisonNetwork network, String censusName) {
        for(QuoteOptionPlanComparisonDto dto : comparisonDtos) {
            for(PlanByNetwork plan : dto.getPlans()) {
                if(plan != null && plan.networkPlan != null && plan.networkPlan.getCensus() != null
                    && plan.networkName != null && plan.networkName.equals(network.name) && plan.networkType.equals(network.type)) {
                    for(com.benrevo.common.dto.QuoteOptionAltPlanDto.Census c : plan.networkPlan.getCensus()) {
                        if(c != null && c.name != null && c.name.equals(censusName)) {
                            return c.value;
                        }
                    }
                }
            }
        }

        return null;
    }

    private static List<String> listAllBenefitsForNetwork(List<QuoteOptionPlanComparisonDto> comparisonDtos, ComparisonNetwork network) {
        
        List<Benefit> benefits = new ArrayList<>();
        for(QuoteOptionPlanComparisonDto dto : comparisonDtos) {
            for(PlanByNetwork plan : dto.getPlans()) {
                if(plan != null && plan.networkName != null && plan.networkName.equals(network.name) &&
                    plan.networkType.equals(network.type) && plan.networkPlan != null) {
                    benefits.addAll(plan.networkPlan.getBenefits());
                }
            }
        }
        List<String> benefitNames = benefits.stream()
            .sorted((b1, b2) -> Integer.compare(b1.ordinal, b2.ordinal)) 
            .map(b -> b.name)
            .distinct()
            .collect(Collectors.toList());
        return benefitNames;
    }
    
    private static List<String> listAllRxsForNetwork(List<QuoteOptionPlanComparisonDto> comparisonDtos, ComparisonNetwork network) {
        List<String> rxNames = new ArrayList<>();
        for (QuoteOptionPlanComparisonDto dto : comparisonDtos) {
            for (PlanByNetwork plan : dto.getPlans()) {
                if (plan != null && plan.networkName != null && plan.networkName.equals(network.name) 
                    && plan.networkType.equals(network.type) && plan.networkPlan != null) {
                    for (com.benrevo.common.dto.QuoteOptionAltPlanDto.Rx rx : plan.networkPlan.getRx()) {
                        if (!rxNames.contains(rx.name)) {
                            rxNames.add(rx.name);
                        }
                    }
                }
            }
        }

        return rxNames;
    }
    
    private static List<String> listAllCostsForNetwork(List<QuoteOptionPlanComparisonDto> comparisonDtos, ComparisonNetwork network) {
        List<String> costs = new ArrayList<>();
        for (QuoteOptionPlanComparisonDto dto : comparisonDtos) {
            for (PlanByNetwork plan : dto.getPlans()) {
                if (plan != null && plan.networkName != null && plan.networkName.equals(network.name) 
                    && plan.networkType.equals(network.type) && plan.networkPlan != null) {
                    for (Cost cost : plan.networkPlan.getCost()) {
                        if (rateValueCostNames.contains(cost.name) && !costs.contains(cost.name)) {
                            costs.add(cost.name);
                        }
                    }
                }
            }
        }
        if (costs.size() > 4) {
            throw new ClientException("Cannot compare options having different tiers count");
        }
        return costs;
    }
    
    private static List<String> listAllRidersForNetwork(List<QuoteOptionPlanComparisonDto> comparisonDtos, ComparisonNetwork network) {
        List<String> riders = new ArrayList<>();
        for (QuoteOptionPlanComparisonDto dto : comparisonDtos) {
            for (PlanByNetwork plan : dto.getPlans()) {
                if (plan != null && plan.networkName != null && plan.networkName.equals(network.name) 
                    && plan.networkType.equals(network.type) && plan.networkPlan != null) {
                    for (RiderDto rider : plan.networkPlan.getRiders()) {
                        if (!riders.contains(rider.getRiderCode())) {
                            riders.add(rider.getRiderCode());
                        }
                    }
                }
            }
        }
        return riders;
    }
    
    private static RiderDto findRider(PlanByNetwork plan, String riderCode) {
        for(RiderDto rider : plan.networkPlan.getRiders()) {
            if(rider.getRiderCode().equals(riderCode)) {
                return rider;
            }
        }
        return null;
    }

    private static com.benrevo.common.dto.QuoteOptionAltPlanDto.Benefit findBenefit(PlanByNetwork plan, String benefitName) {
        for(com.benrevo.common.dto.QuoteOptionAltPlanDto.Benefit benefit : plan.networkPlan.getBenefits()) {
            if(benefit.name.equals(benefitName)) {
                return benefit;
            }
        }

        return null;
    }
    
    private static com.benrevo.common.dto.QuoteOptionAltPlanDto.Rx findRx(PlanByNetwork plan, String rxName) {
      for(com.benrevo.common.dto.QuoteOptionAltPlanDto.Rx rx : plan.networkPlan.getRx()) {
          if(rx.name.equals(rxName)) {
              return rx;
          }
      }
      return null;
  }

    private static ComparisonNetwork[] listAllNetworks(List<QuoteOptionPlanComparisonDto> comparisonDtos) {
    	if(comparisonDtos.isEmpty()) {
    		return new ComparisonNetwork[0];
    	}
    	ComparisonNetwork[] result = new ComparisonNetwork[comparisonDtos.get(0).getPlans().size()];
 
        for(QuoteOptionPlanComparisonDto dto : comparisonDtos) {
        	int index = 0;
        	for(PlanByNetwork plan : dto.getPlans()) {
                if(plan.networkName != null && result[index] == null) {
                	result[index] = new ComparisonNetwork(plan.networkName, plan.networkType);
                }
                index++;
            }
        }

        return result;
    }
    
    private XSSFRow findFirstRow(XSSFSheet networkSheet, String cellValue) {
        return findFirstRow(networkSheet, cellValue, "A");
    }
    
    private XSSFRow findFirstRow(XSSFSheet networkSheet, String cellValue, String columnName) {
        for(Iterator<Row> it = networkSheet.rowIterator(); it.hasNext();) {
            Row r = (Row) it.next();
            Cell cell = r.getCell(convertColStringToIndex(columnName));
            if(cell != null && cell.getCellTypeEnum() == CellType.STRING && cell.getStringCellValue().trim().equals(cellValue)) {
                return (XSSFRow) r;
            }
        }
        return null;
    }
    
    private void populateRowKeys(XSSFSheet sheet, int columnNumber, Map<String, Object> data) {
        for(Iterator<Row> it = sheet.rowIterator(); it.hasNext();) {
            Row r = (Row) it.next();
            XSSFCell cell = (XSSFCell) r.getCell(columnNumber);
            if(cell != null && cell.getCellTypeEnum() == CellType.STRING) {
                String cellValue = cell.getStringCellValue().trim();
                int beginPos = cellValue.indexOf("<<");
                int endPos = cellValue.indexOf(">>", beginPos);
                if (beginPos != -1 && endPos != -1) { 
                    String key = cellValue.substring(beginPos + 2, endPos);
                    Object value = data.get(key);
                    if((value instanceof String) || (value instanceof Boolean) || (value instanceof Integer)) {
                        cell.setCellValue(value.toString());
                    } else if((value instanceof Float) || (value instanceof Double)) {
                        cell.setCellValue(((Number) value).doubleValue());
                    } else {
                        cell.setCellValue(StringUtils.EMPTY);
                    }
                }
            }
        }
    }
    
    private void removeRowsByName(XSSFSheet networkSheet, String cellValue) {
        List<Row> toRemove = new ArrayList<>();
        for(Iterator<Row> it = networkSheet.rowIterator(); it.hasNext();) {
            Row r = (Row) it.next();
            Cell cell = r.getCell(convertColStringToIndex("A"));
            if(cell != null && cell.getStringCellValue().equals(cellValue)) {
                toRemove.add(r);
            }
        }
        if(toRemove.isEmpty()) {
            return;
        }
        removeRows(networkSheet, toRemove);
    }
    
    private void removeRows(XSSFSheet networkSheet, List<Row> toRemove) {
    	for(Row row : toRemove) {
            int removeRowNum = row.getRowNum();
            int lastRowNum = networkSheet.getLastRowNum();
            networkSheet.removeRow(row);
            networkSheet.shiftRows(removeRowNum + 1, lastRowNum, -1);

        }
    }
    
    private XSSFWorkbook readComparisonTemplate() {
        try {
            InputStream is = this.getClass().getResourceAsStream("/templates/quote_option_comparison.xlsx");
            return new XSSFWorkbook(is);
        } catch(IOException e) {
            throw new BaseException("Cannot read option comparison template file", e);
        }
    }
    
    public void fillDisclaimerSheet(String disclaimerHtml, XSSFSheet sheet) {
        if(StringUtils.isBlank(disclaimerHtml)) {
            return;
        }
        if(disclaimerHtml.contains("&lt;")) {
            disclaimerHtml = HtmlUtils.htmlUnescape(disclaimerHtml);
        }
        // System.out.println(disclaimerHtml);
        Document doc = Jsoup.parse(disclaimerHtml);

        Elements elements = doc.body().children();

        if(elements.size() == 1) { // skip root <dev> tag
            elements = elements.get(0).children();
        }

        XSSFCellStyle defStyle = sheet.getWorkbook().createCellStyle();
        defStyle.setWrapText(true);

        sheet.setDefaultColumnStyle(0, defStyle); // not working
        sheet.setColumnWidth(0, 165 * 256);
        XSSFCellStyle centerAlignmentStyle = (XSSFCellStyle) defStyle.clone();
        centerAlignmentStyle.setAlignment(HorizontalAlignment.CENTER);

        XSSFFont boldFont = sheet.getWorkbook().createFont();
        boldFont.setBold(true);

        int rowNum = 0;
        for(Element element : elements) {
            if(!element.hasText()) {
                if(element.tagName().equals("br")) {
                    sheet.createRow(rowNum++);
                }
                continue;
            }

            XSSFCellStyle currentCellStyle = defStyle;
            String style = element.attr("style");
            if(!style.isEmpty() && style.contains("center")) {
                currentCellStyle = centerAlignmentStyle;
            }

            XSSFCell cell = null;
            switch(element.tagName()) {
                case "p":
                    // add empty row before <p>
                    sheet.createRow(rowNum++);
                    cell = sheet.createRow(rowNum++).createCell(0, CellType.STRING);
                    cell.setCellStyle(currentCellStyle);
                    cell.setCellValue(parseTagText(element, boldFont));
                    break;
                case "div":
                    if(element.children().size() > 0) {
                        for(Element ch : element.children()) {
                            if(!ch.hasText()) {
                                continue;
                            }
                            if(ch.tagName().equals("p")) {
                                // add empty row before <p>
                                sheet.createRow(rowNum++);
                            }
                            cell = sheet.createRow(rowNum++).createCell(0, CellType.STRING);
                            cell.setCellStyle(currentCellStyle);
                            cell.setCellValue(parseTagText(ch, boldFont));
                        }
                    } else {
                        cell = sheet.createRow(rowNum++).createCell(0, CellType.STRING);
                        cell.setCellStyle(currentCellStyle);
                        cell.setCellValue(parseTagText(element, boldFont));
                    }
                    break;
                case "ul":
                    // add empty row before <ul>
                    sheet.createRow(rowNum++);
                    for(Element li : element.children()) {
                        cell = sheet.createRow(rowNum++).createCell(0, CellType.STRING);
                        cell.setCellStyle(currentCellStyle);
                        cell.setCellValue("- " + li.text());
                    }
                    break;
                default:
                    cell = sheet.createRow(rowNum++).createCell(0);
                    cell.setCellStyle(currentCellStyle);
                    cell.setCellValue(element.text());
                    break;
            }
        }
        sheet.setActiveCell(new CellAddress(0, 0));
        sheet.getPrintSetup().setPaperSize(PaperSize.A4_PAPER);
        sheet.getPrintSetup().setScale((short) 100);
        sheet.setPrintGridlines(false);
        sheet.setDisplayGridlines(false);
        sheet.setPrintRowAndColumnHeadings(false);
    }
    
    private XSSFRichTextString parseTagText(Element element, XSSFFont boldFont) {
        XSSFRichTextString richText = new XSSFRichTextString();
        if (element.tagName().equals("b") || element.tagName().equals("strong")) {
            richText.append(element.text(), boldFont);
            return richText;
        }
        String html = element.html();
        if (element.children().size() > 0 && (html.contains("<strong>") || html.contains("<b>"))) {
            List<Node> children = new ArrayList<>();
            for(Node span : element.childNodes()) {
                if (span.nodeName().equals("span")) {
                    children.addAll(span.childNodes());
                    break;
                }
            }
            if (children.isEmpty()) {
                children.addAll(element.childNodes());
            }
            for(Node ch : children) {
                if (ch.nodeName().equals("strong") || ch.nodeName().equals("b")) {
                    richText.append(((Element) ch).text(), boldFont);
                } else if (ch instanceof TextNode) {
                    richText.append(((TextNode) ch).text());
                }
            }
            return richText;
        } else {
           return new XSSFRichTextString(element.text());
        }
    }
    
    private void fillCoverPage(XSSFWorkbook workbook, Client client, List<RFP> rfps) {
        String effectiveDate = DateHelper.fromDateToString(client.getEffectiveDate());
        XSSFSheet coverSheet = workbook.getSheet(COVER_PAGE_TEMPLATE);
        
        XSSFRow clientRow = findFirstRow(coverSheet, "<<INSERT CLIENT NAME>>");
        clientRow.getCell(0).setCellValue(client.getClientName());
        
        XSSFRow effDateRow = findFirstRow(coverSheet, "Effective Date:");
        effDateRow.getCell(0).setCellValue("Effective Date:  " + effectiveDate);

        XSSFRow brokerRow = findFirstRow(coverSheet, "Brokerage:");
        brokerRow.getCell(0).setCellValue("Brokerage:  " + client.getBroker().getName());
        
        String medicalCommission = null, dentalCommission = null, visionCommission = null,
            lifeCommission = null, volLifeCommission = null,
            stdCommission = null, volStdCommission = null,
            ltdCommission = null, volLtdCommission = null;
        
        for(RFP rfp : rfps) {
            PlanCategory category = PlanCategory.valueOf(rfp.getProduct());
            switch(category) {
                case MEDICAL:
                    medicalCommission = buildCommission(rfp);
                    break;
                case DENTAL:
                    dentalCommission = buildCommission(rfp);
                    break;
                case VISION:
                    visionCommission = buildCommission(rfp);
                    break;
                case LIFE:
                    lifeCommission = buildCommission(rfp);
                    break;
                case VOL_LIFE:
                    volLifeCommission = buildCommission(rfp);
                    break;
                case STD:
                    stdCommission = buildCommission(rfp);
                    break;
                case VOL_STD:
                    volStdCommission = buildCommission(rfp);
                    break;
                case LTD:
                    ltdCommission = buildCommission(rfp);
                    break;
                case VOL_LTD:
                    volLtdCommission = buildCommission(rfp);
                    break;
                default:
                    break;
            }
        }
        setCommission(coverSheet, "Medical Commission:", medicalCommission);
        setCommission(coverSheet, "Dental Commission:", dentalCommission);
        setCommission(coverSheet, "Vision Commission:", visionCommission);
        setCommission(coverSheet, "Basic Life/AD&D Commission:", lifeCommission);
        setCommission(coverSheet, "Voluntary Life Commission:", volLifeCommission);
        setCommission(coverSheet, "Basic STD Commission:", stdCommission);
        setCommission(coverSheet, "Voluntary STD Commission:", volStdCommission);
        setCommission(coverSheet, "Basic LTD Commission:", ltdCommission);
        setCommission(coverSheet, "Voluntary LTD Commission:", volLtdCommission);
    }

    private void setCommission(XSSFSheet coverSheet, String name, String commission) {
        XSSFRow commissionRow = findFirstRow(coverSheet, name);
        if (commission == null) {
            commissionRow.getCell(0).setCellValue(name + "  N/A");
            commissionRow.setZeroHeight(true); // hide row
        } else {
            commissionRow.getCell(0).setCellValue(name + "  " + commission);
        }
    }
    
    private String buildCommission(RFP rfp) {
        if (rfp == null || rfp.getPaymentMethod() == null || rfp.getCommission() == null) {
            return null;
        }
        switch(rfp.getPaymentMethod()) {
            case "COMMISSION":
                return "Net of Commission";
            case "PEPM":
                return "$" + rfp.getCommission() + " PEPM";
            default:
            	return rfp.getCommission()  + "%";
        }
    }

    private String buildSheetName(String sheetName, XSSFWorkbook workbook) {
        sheetName = WorkbookUtil.createSafeSheetName(sheetName);
        if (sheetName.length() == 31) { // see WorkbookUtil.createSafeSheetName for details
            /* if sheet name was truncated, add counnet suffix: _N to prevent error:
             * "The workbook already contains a sheet named..." */
            sheetName = sheetName.substring(0, 31 - 2);
            for(int i = 1; i < 10; i++) {
                // try to find next sheet counter
                String newSheetName = sheetName + "_" + i;
                if(workbook.getSheetIndex(newSheetName) == -1) {
                    sheetName = newSheetName;
                    break;
                }
            }  
        }
        return sheetName;
    }
    
    public byte[] convertAncillaryPlanComparisonDtoToExcel(Client client, PlanCategory category, 
            List<RfpQuoteAncillaryPlanComparisonDto> comparisonDtos, List<RfpQuote> rfpQuotes, 
            List<RFP> rfps, RfpQuoteSummary rqs) {
        
        XSSFWorkbook workbook = buildWorkbook();

        if(comparisonDtos.size() > MAX_PLAN_NUMBER) {
            throw new ClientException("Too many plans for comparison. Max allowed: " + MAX_PLAN_NUMBER);
        }
        
        fillCoverPage(workbook, client, rfps);
        fillQuoteSummarySheet(workbook, client, rqs);

        final CellCopyPolicy cellCopyPolicy = new CellCopyPolicy();

        // all Rate ages
        Set<String> ageRanges = new TreeSet<>();
        for(RfpQuoteAncillaryPlanComparisonDto dto : comparisonDtos) {
            if(dto.getRates() != null && dto.getPlanType() == AncillaryPlanType.VOLUNTARY) {
                List<AncillaryRateAgeDto> ages = ((VoluntaryRateDto) dto.getRates()).getAges();
                if(CollectionUtils.isNotEmpty(ages)) {
                    for(AncillaryRateAgeDto age : ages) {
                        ageRanges.add(String.valueOf(age.getFrom()) + '-' + age.getTo());
                    }
                }
            }
        }
        if(ageRanges.size() > MAX_AGES_NUMBER) {
            //get sub-collection with limited size: MAX_AGES_NUMBER
            ageRanges = new TreeSet<>(Arrays.asList(ageRanges.toArray(new String[0])).subList(0, MAX_AGES_NUMBER));
        }

        int maxClassCount = comparisonDtos.stream().mapToInt(c -> c.getClasses().size()).max().orElse(0);
        for(int classNumber = 1; classNumber <= maxClassCount; classNumber++) {

            String sheetName = buildSheetName(category.name() + " - Class " + classNumber, workbook);
            XSSFSheet classSheet = workbook.cloneSheet(workbook.getSheetIndex(category.name() + "_template"), sheetName);
            
            final int columnsPerPlan = category == PlanCategory.VOL_LIFE ? 3 : 1;
            
            workbook.setSheetOrder(classSheet.getSheetName(), classNumber);

            fillSheetHeader(classSheet, client);
            
            XSSFRow optNameRow = findFirstRow(classSheet, "Option Name");
            XSSFRow planNameRow = findFirstRow(classSheet, "Plan Name");
            XSSFRow classRow = findFirstRow(classSheet, "Class");
            XSSFRow classDescrRow = findFirstRow(classSheet, "Class Name/Description");

            // all age ranges for this class
            Map<String, XSSFRow> rowsByName = new HashMap<>();
 
            if(category.name().startsWith("VOL_")) { // <<AGE>> only in VOLUNTARY templates
                XSSFRow ageRow = findFirstRow(classSheet, "<<AGE>>-<<AGE>>");
                int currentRow = ageRow.getRowNum();
                for(String ageRange : ageRanges) {
                    XSSFRow row = classSheet.getRow(currentRow++);
                    row.getCell(0).setCellValue(ageRange);
                    rowsByName.put(ageRange, row);
                }
                if(ageRanges.size() < MAX_AGES_NUMBER) {
                    removeRowsByName(classSheet, "<<AGE>>-<<AGE>>");
                }
            }
            
            for(int planNumber = 0; planNumber < comparisonDtos.size(); planNumber++) {
                
                int columnIndex = 2 + (planNumber * columnsPerPlan);
                
                RfpQuoteAncillaryPlanComparisonDto compPlanDto = comparisonDtos.get(planNumber);
                
                optNameRow.getCell(columnIndex).setCellValue(compPlanDto.getOptionName());
                planNameRow.getCell(columnIndex).setCellValue(compPlanDto.getPlanName());
                classRow.getCell(columnIndex).setCellValue("Class " + classNumber);
                
                Map<String, Object> cellValues = new HashMap<>(); 
                AncillaryRateDto rates = compPlanDto.getRates();
                if(rates != null) {
                    copyProperties(rates, cellValues);
                    
                    if(compPlanDto.getPlanType() == AncillaryPlanType.VOLUNTARY) {
                        List<AncillaryRateAgeDto> ages = ((VoluntaryRateDto) rates).getAges();
                        if(CollectionUtils.isNotEmpty(ages)) {
                            for(AncillaryRateAgeDto age : ages) {
                                XSSFRow row = rowsByName.get(String.valueOf(age.getFrom()) + '-' + age.getTo());
                                row.getCell(columnIndex).setCellValue(doubleValue(age.getCurrentEmp()));
                                if(columnsPerPlan == 3) {
                                    row.getCell(columnIndex + 1).setCellValue(doubleValue(age.getCurrentEmpTobacco()));
                                    row.getCell(columnIndex + 2).setCellValue(doubleValue(age.getCurrentSpouse()));
                                }
                            }
                        }
                    }
                }
                if(compPlanDto.getClasses().size() >= classNumber) {
                    AncillaryClassDto ancClass = compPlanDto.getClasses().get(classNumber - 1); 
                    classDescrRow.getCell(columnIndex).setCellValue(ancClass.getName());
                    copyProperties(ancClass, cellValues);
                    // xlsx template contains only "conditionExclusion" key
                    if(cellValues.get("conditionExclusion") == null) {
                        cellValues.put("conditionExclusion", cellValues.get("conditionExclusionOther"));
                    }
                    // xlsx template contains only "occupationDefinition" key
                    if(cellValues.get("occupationDefinition") == null) {
                        cellValues.put("occupationDefinition", cellValues.get("occupationDefinitionOther"));
                    }
                    // xlsx template contains only "abuseLimitation" key
                    if(cellValues.get("abuseLimitation") == null) {
                        cellValues.put("abuseLimitation", cellValues.get("abuseLimitationOther"));
                    }
                }
                populateRowKeys(classSheet, columnIndex, cellValues);
            }
            // hide unused columns for options
            int startColumnToHide = 2 + comparisonDtos.size() * columnsPerPlan;
            int endColumnToHide = 2 + (MAX_PLAN_NUMBER * columnsPerPlan);
            
            hideColumnsAndSetBorderStyle(classSheet, startColumnToHide, endColumnToHide);
        }

        // clean up and final updates
        cleanUpTemplates(workbook);
        
        // find carrier Disclosures in DB
        Set<String> currentCarriers = comparisonDtos.stream()
            .filter(c -> c.getCarrierName() != null)
            .map(c -> CarrierType.fromString(c.getCarrierName()).displayName)
            .collect(Collectors.toSet());
        filldDisclosureSheet(workbook, rfpQuotes, currentCarriers);
        
        return writeWorkbook(workbook);
    }
    
    private Map<String, Object> copyProperties(Object bean, Map<String, Object> target) {
        try {
            if(target == null) {
                return PropertyUtils.describe(bean);
            } else {
                target.putAll(PropertyUtils.describe(bean));
                return target;
            }
        } catch(Exception e) {
            throw new BaseException("Unable to create comparison file", e);
        }
    }
    
    public byte[] convertQuoteOptionPlanComparisonDtoToExcel_2(Client client, List<RfpQuote> rfpQuotes, List<RFP> rfps, List<QuoteOptionPlanComparisonDto> comparisonDtos, RfpQuoteSummary rqs) {

        XSSFWorkbook workbook = buildWorkbook();

        if(comparisonDtos.size() > MAX_OPTION_NUMBER) {
            throw new ClientException("Too many options for comparison. Max allowed: " + MAX_OPTION_NUMBER);
        }
        
        fillCoverPage(workbook, client, rfps);
        fillQuoteSummarySheet(workbook, client, rqs);
        
        ComparisonNetwork[] networks = listAllNetworks(comparisonDtos);
        for(int n = 0; n < networks.length; n++) {
            ComparisonNetwork network = networks[n];

            boolean hasBothInOutBenefits = hasBothInOutBenefits(comparisonDtos, network);
            XSSFSheet networkSheet;
            XSSFRow empFundRow = null, admFeeRow = null;
            
            String sheetName = buildSheetName(network.toString(), workbook);
               
            if(hasBothInOutBenefits) {
                networkSheet = workbook.cloneSheet(workbook.getSheetIndex(HMO_HSA_TEMPLATE), sheetName);
                empFundRow = findFirstRow(networkSheet, HSA_EMPLOYER_FUND);
                admFeeRow = findFirstRow(networkSheet, HSA_ADMINISTRATIVE_FEE);
            } else {
                networkSheet = workbook.cloneSheet(workbook.getSheetIndex(HMO_TEMPLATE), sheetName);
            }
            workbook.setSheetOrder(networkSheet.getSheetName(), n);

            fillSheetHeader(networkSheet, client);

            XSSFRow optNameRow = findFirstRow(networkSheet, "Option Name");
            XSSFRow planNameRow = findFirstRow(networkSheet, "Plan Name");
            XSSFRow carrierRow = findFirstRow(networkSheet, "Carrier");
            XSSFRow networkRow = findFirstRow(networkSheet, "Network");

            boolean hasHsaPlans = hasHsaPlans(comparisonDtos, network);

            if(!hasHsaPlans && hasBothInOutBenefits) {
                XSSFRow delimiterEmptyRow = networkSheet.getRow(empFundRow.getRowNum() - 1);
                networkSheet.removeRow(delimiterEmptyRow);
                networkSheet.removeRow(empFundRow);
                networkSheet.removeRow(admFeeRow);
                empFundRow = null;
                admFeeRow = null;
            }

            // all benefit names for this network
            Map<String, XSSFRow> rowsByName = new HashMap<>();

            final CellCopyPolicy cellCopyPolicy = new CellCopyPolicy();

            // Benefits
            List<String> benefitNames = listAllBenefitsForNetwork(comparisonDtos, network);
            XSSFRow benRow = findFirstRow(networkSheet, "<<BENEFIT NAME>>");
            int currentRow = benRow.getRowNum();
            for(String benefitName : benefitNames) {
                XSSFRow row = networkSheet.getRow(currentRow++);
                row.getCell(0).setCellValue(benefitName);
                rowsByName.put(benefitName, row);
            }
            removeRowsByName(networkSheet, "<<BENEFIT NAME>>");

            // Rx
            List<String> rxNames = listAllRxsForNetwork(comparisonDtos, network);
            XSSFRow rxRow = findFirstRow(networkSheet, "<<RX NAME>>");
            if(!rxNames.isEmpty()) {
                currentRow = rxRow.getRowNum();
                for(String rxName : rxNames) {
                    XSSFRow row = networkSheet.getRow(currentRow++);
                    if(row.getRowNum() != rxRow.getRowNum()) {
                        row.copyRowFrom(rxRow, cellCopyPolicy);
                    }
                    row.getCell(0).setCellValue(rxName);
                    rowsByName.put(rxName, row);
                }
                XSSFRow row = networkSheet.getRow(currentRow++);
                row.getCell(0).setCellValue(StringUtils.EMPTY);
            } else {
                removeRowsByName(networkSheet, "Rx");
            }
            removeRowsByName(networkSheet, "<<RX NAME>>");

            // Riders
            List<String> riderNames = listAllRidersForNetwork(comparisonDtos, network);
            XSSFRow riderRow = findFirstRow(networkSheet, "<<RIDER NAME>>");
            if(!riderNames.isEmpty()) {
                currentRow = riderRow.getRowNum();
                for(String riderName : riderNames) {
                    XSSFRow row = networkSheet.getRow(currentRow++);
                    if(row.getRowNum() != riderRow.getRowNum()) {
                        row.copyRowFrom(riderRow, cellCopyPolicy);
                    }
                    row.getCell(0).setCellValue(riderName);
                    rowsByName.put(riderName, row);
                }
                XSSFRow row = networkSheet.getRow(currentRow++);
                row.getCell(0).setCellValue(StringUtils.EMPTY);
            } else {
                removeRowsByName(networkSheet, "Riders");
            }
            removeRowsByName(networkSheet, "<<RIDER NAME>>");

            // Enrollment
            List<String> costNames = listAllCostsForNetwork(comparisonDtos, network);
            XSSFRow costRow = findFirstRow(networkSheet, "<<COST NAME>>");
            currentRow = costRow.getRowNum();
            for(String costName : costNames) {
                XSSFRow row = networkSheet.getRow(currentRow++);
                row.getCell(0).setCellValue(costName);
                rowsByName.put(costName, row);
                Long census = findCensus(comparisonDtos, network, costName);
                if(census != null) {
                    row.getCell(1).setCellValue(census);
                }
            }

            // walk through each quote option and populate data
            for(int i = 0; i < comparisonDtos.size(); i++) {
                QuoteOptionPlanComparisonDto quoteOption = comparisonDtos.get(i);

                int columnIndex = 2 + (i * (hasBothInOutBenefits ? 2 : 1));
                optNameRow.getCell(columnIndex).setCellValue(quoteOption.getName());

                PlanByNetwork plan = quoteOption.getPlans().get(n);
                if(plan.networkName == null) {
                    continue;
                }

                planNameRow.getCell(columnIndex).setCellValue(plan.networkPlan.getName());
                carrierRow.getCell(columnIndex).setCellValue(plan.networkPlan.getCarrier());
                networkRow.getCell(columnIndex).setCellValue(plan.networkPlan.getNetworkName());
                
                // fill main data: benefits, rx, riders and costs
                for(String benefitName : benefitNames) {
                    Benefit benefit = findBenefit(plan, benefitName);
                    if(benefit != null) {
                        benRow = rowsByName.get(benefitName);
                        setCellValue(benRow.getCell(columnIndex), getBenefitValue(benefit, false), getBenefitType(benefit, false));
                        if(hasBothInOutBenefits) {
                            String outValue = getBenefitValue(benefit, true);
                            if(outValue != null) {
                                setCellValue(benRow.getCell(columnIndex + 1), outValue, getBenefitType(benefit, true));
                            } else {
                                networkSheet.addMergedRegion(new CellRangeAddress(
                                    benRow.getRowNum(), benRow.getRowNum(), columnIndex, columnIndex + 1));
                            } 
                        }
                    }
                }
                for(String rxName : rxNames) {
                    Rx rx = findRx(plan, rxName);
                    if(rx != null) {
                        rxRow = rowsByName.get(rxName);
                        setCellValue(rxRow.getCell(columnIndex), rx.value, rx.type);
                        if(hasBothInOutBenefits) {
                            networkSheet.addMergedRegion(new CellRangeAddress(
                                rxRow.getRowNum(), rxRow.getRowNum(), columnIndex, columnIndex + 1));
                        }
                    }
                }
                for(String riderName : riderNames) {
                    RiderDto rider = findRider(plan, riderName);
                    riderRow = rowsByName.get(riderName);
                    if(rider == null || !rider.isSelected()) {
                        riderRow.getCell(columnIndex).setCellValue("N/A");
                    } else {
                        riderRow.getCell(columnIndex).setCellValue("INCLUDED");
                    }
                    if(hasBothInOutBenefits) {
                        networkSheet.addMergedRegion(new CellRangeAddress(
                            riderRow.getRowNum(), riderRow.getRowNum(), columnIndex, columnIndex + 1));
                    }
                }
                for(Cost cost : plan.networkPlan.getCost()) {
                    XSSFRow r = rowsByName.get(cost.name);
                    if(r != null) {
                        setCellValue(r.getCell(columnIndex), cost.value, cost.type);
                    }
                }
                // add HSA specified rows
                if(empFundRow != null) {
                    double val = MoreObjects.firstNonNull(plan.networkPlan.getEmployerFund(), 0.0f);
                    empFundRow.getCell(columnIndex).setCellValue(val);
                }
                if(admFeeRow != null) {
                    double val = MoreObjects.firstNonNull(plan.networkPlan.getAdministrativeFee(), 0.0f);
                    admFeeRow.getCell(columnIndex).setCellValue(val);
                }
            }
            // hide unused columns for options
            int startColumnToHide = 2 + comparisonDtos.size() * (hasBothInOutBenefits ? 2 : 1);
            int endColumnToHide = 2 + (hasBothInOutBenefits ? (MAX_OPTION_NUMBER * 2) : MAX_OPTION_NUMBER);
            
            hideColumnsAndSetBorderStyle(networkSheet, startColumnToHide, endColumnToHide);
            
            // apply style
            int endVisibleColumn = startColumnToHide - 1;
            XSSFRow ratesRow = findFirstRow(networkSheet, "Rates", "C");
            networkSheet.addMergedRegion(new CellRangeAddress(
                ratesRow.getRowNum(), ratesRow.getRowNum(), convertColStringToIndex("C"), endVisibleColumn));
        }
        
        // clean up and final updates
        cleanUpTemplates(workbook);
        
        // find carrier Disclosures in DB
        Set<String> currentCarriers = comparisonDtos.stream().map(c -> c.getCarrier()).collect(Collectors.toSet());
        filldDisclosureSheet(workbook, rfpQuotes, currentCarriers);

        return writeWorkbook(workbook);
    }

    private byte[] writeWorkbook(XSSFWorkbook workbook) {
        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            IOUtils.closeQuietly(out, workbook);
            return out.toByteArray();
        } catch(IOException e) {
            throw new ClientException("Unable to create comparison file");
        }
    }
    
    private void hideColumnsAndSetBorderStyle(XSSFSheet networkSheet, int startColumnToHide, int endColumnToHide) {
        for(int i = startColumnToHide; i < endColumnToHide; i++) {
            networkSheet.setColumnHidden(i, true);
        }
        // apply style
        int startRowToRightBorder = findFirstRow(networkSheet, "Option Name").getRowNum();
        int endRowToRightBorder = networkSheet.getLastRowNum();
        int oldEndVisibleColumn = endColumnToHide - 1;
        int newEndVisibleColumn = startColumnToHide - 1;
        for(int rowNum = startRowToRightBorder; rowNum <= endRowToRightBorder; rowNum++) {
            XSSFCellStyle srcStyle = (XSSFCellStyle) networkSheet.getRow(rowNum).getCell(oldEndVisibleColumn).getCellStyle();
            XSSFCell targetCell = networkSheet.getRow(rowNum).getCell(newEndVisibleColumn);
            XSSFCellStyle targetStyle = (XSSFCellStyle) targetCell.getCellStyle().clone();
            targetStyle.setBorderRight(srcStyle.getBorderRightEnum());
            targetStyle.setBorderColor(BorderSide.RIGHT, srcStyle.getRightBorderXSSFColor());
            targetCell.setCellStyle(targetStyle); 
        }
        networkSheet.setActiveCell(new CellAddress(2, 0));
        networkSheet.getPrintSetup().setLandscape(true);
        networkSheet.getPrintSetup().setPaperSize(PaperSize.A4_PAPER);
        networkSheet.getPrintSetup().setScale((short) 63); // to put all the lines in one page on vertical
    }
    
    private void cleanUpTemplates(XSSFWorkbook workbook) {
        workbook.setSheetOrder(COVER_PAGE_TEMPLATE, 0);
        if (workbook.getSheetIndex(SUMMARY_PAGE_TEMPLATE) != -1) {
        	workbook.setSheetOrder(SUMMARY_PAGE_TEMPLATE, 1);
        }
        workbook.removeSheetAt(workbook.getSheetIndex(HMO_HSA_TEMPLATE));
        workbook.removeSheetAt(workbook.getSheetIndex(HMO_TEMPLATE));
        workbook.removeSheetAt(workbook.getSheetIndex(LIFE_TEMPLATE));
        workbook.removeSheetAt(workbook.getSheetIndex(VOL_LIFE_TEMPLATE));
        workbook.removeSheetAt(workbook.getSheetIndex(STD_TEMPLATE));
        workbook.removeSheetAt(workbook.getSheetIndex(VOL_STD_TEMPLATE));
        workbook.removeSheetAt(workbook.getSheetIndex(LTD_TEMPLATE));
        workbook.removeSheetAt(workbook.getSheetIndex(VOL_LTD_TEMPLATE));
        workbook.setActiveSheet(0);
        workbook.setSelectedTab(0);
        
        XSSFFormulaEvaluator.evaluateAllFormulaCells(workbook);
    }
    
    private XSSFWorkbook buildWorkbook() {
        XSSFWorkbook workbook = readComparisonTemplate();
        workbook.setMissingCellPolicy(MissingCellPolicy.RETURN_NULL_AND_BLANK);

        DOLLAR_NUMBER_FORMAT_INDEX = workbook.createDataFormat().getFormat(DOLLAR_NUMBER_FORMAT);
        INTEGER_PERCENT_FORMAT_INDEX = workbook.createDataFormat().getFormat(INTEGER_PERCENT_FORMAT);
        
        return workbook;
    }
    
    private void fillSheetHeader(XSSFSheet networkSheet, Client client) {
        
        String createdDate = DateHelper.fromDateToString(new Date());
        String effectiveDate = DateHelper.fromDateToString(client.getEffectiveDate());
        
        XSSFRow groupRow = findFirstRow(networkSheet, "Group Name:");
        groupRow.getCell(0).setCellValue(groupRow.getCell(0).getStringCellValue() + client.getClientName());

        XSSFRow effDateRow = findFirstRow(networkSheet, "Effective Date:");
        effDateRow.getCell(0).setCellValue(effDateRow.getCell(0).getStringCellValue() + effectiveDate);

        XSSFRow brokerRow = findFirstRow(networkSheet, "Broker Name:");
        brokerRow.getCell(0).setCellValue(brokerRow.getCell(0).getStringCellValue() + client.getBroker().getName());

        XSSFRow createDateRow = findFirstRow(networkSheet, "Proposal Created Date:");
        createDateRow.getCell(0).setCellValue(createDateRow.getCell(0).getStringCellValue() + createdDate);
    }
    
    private void filldDisclosureSheet(XSSFWorkbook workbook, List<RfpQuote> rfpQuotes, 
            Set<String> currentCarrierDisplayNames) {
        Map<String, String> parsedDisclosuresByCarrier = new HashMap<>();
        for(RfpQuote rfpQuote : rfpQuotes) {
            if(rfpQuote.getDisclaimer() == null) {
                continue;
            }
            RfpCarrier rc = rfpQuote.getRfpSubmission().getRfpCarrier();
            if((rc.getCarrier().getName().equals(CarrierType.ANTHEM_BLUE_CROSS.name()) 
                    || rc.getCarrier().getName().equals(CarrierType.ANTHEM_CLEAR_VALUE.name()))
                    && !rc.getCategory().equals(MEDICAL)) {
                // for ANTHEM only DENTAL and VISION disclosures should load from DB
                parsedDisclosuresByCarrier.put(rc.getCarrier().getDisplayName(), rfpQuote.getDisclaimer());
            } else {
                // for UHC all disclosures should load from DB
                parsedDisclosuresByCarrier.put(rc.getCarrier().getDisplayName(), rfpQuote.getDisclaimer());
            }
        }
        
        // use prepared Disclosures tabs for MEDICAL Anthem and Clear Value
        if(!rfpQuotes.isEmpty() && rfpQuotes.get(0).getRfpSubmission().getRfpCarrier().getCategory().equals(MEDICAL)) {
            for(String carrierDispName : Arrays.asList(CarrierType.ANTHEM_BLUE_CROSS.displayName, CarrierType.ANTHEM_CLEAR_VALUE.displayName)) { 
                if(!currentCarrierDisplayNames.contains(carrierDispName)) {
                    workbook.removeSheetAt(workbook.getSheetIndex(carrierDispName));
                } else {
                    String sheetName = DISCLOSURE_TAB_NAME_BY_CARRIER.get(carrierDispName);
                    workbook.setSheetName(workbook.getSheetIndex(carrierDispName), sheetName);
                }
            }
        } else {
            // remove from template MEDICAL Disclosures if current export is not MEDICAL
            workbook.removeSheetAt(workbook.getSheetIndex(CarrierType.ANTHEM_BLUE_CROSS.displayName));
            workbook.removeSheetAt(workbook.getSheetIndex(CarrierType.ANTHEM_CLEAR_VALUE.displayName));
        }
        // build and add parsed Disclosures tabs
        currentCarrierDisplayNames.forEach(carrierDispName -> {
            String parsedDisclosure = parsedDisclosuresByCarrier.get(carrierDispName);
            if(parsedDisclosure != null) {
                String disclosureSheetName = DISCLOSURE_TAB_NAME_BY_CARRIER.get(carrierDispName);
                if(disclosureSheetName == null) {
                    // use default name UnitedHealthcare Disclosures
                    disclosureSheetName = buildSheetName(carrierDispName + " Disclosures", workbook);
                }
                if(workbook.getSheetIndex(disclosureSheetName) == -1) {
                    XSSFSheet disclosureSheet = workbook.createSheet(disclosureSheetName);
                    fillDisclaimerSheet(parsedDisclosure, disclosureSheet);
                }
            }  
        });
    }
    
    public Map<String, String> prepareSummaryPageData(Client client, RfpQuoteSummary rqs) {
    	if (rqs == null || (isBlank(rqs.getMedicalNotes()) && isBlank(rqs.getMedicalWithKaiserNotes()) 
    			&& isBlank(rqs.getDentalNotes()) && isBlank(rqs.getVisionNotes()) && isBlank(rqs.getLifeNotes()))) {
    		return Collections.emptyMap();
    	}
        Map<String, String> dataMap = new HashMap<>();
        dataMap.put("BROKER NAME", client.getBroker().getName());
        dataMap.put("CLIENT NAME", client.getClientName());
        dataMap.put("EFFECTIVE DATE", DateHelper.fromDateToString(client.getEffectiveDate()));
       
        dataMap.put("MEDICAL SUMMARY", rqs.getMedicalNotes());
        dataMap.put("MEDICAL KAISER SUMMARY", rqs.getMedicalWithKaiserNotes());
        dataMap.put("DENTAL SUMMARY", rqs.getDentalNotes());
        dataMap.put("VISION SUMMARY", rqs.getVisionNotes());
        dataMap.put("L&D SUMMARY", rqs.getLifeNotes());
        
        dataMap.put("DISCOUNT DENTAL", Float.toString(DENTAL_BUNDLE_DISCOUNT_PERCENT));
        dataMap.put("DISCOUNT VISION", Float.toString(VISION_BUNDLE_DISCOUNT_PERCENT));
        float discountLife = CV_PRODUCT_DISCOUNT_PERCENT.getOrDefault(LIFE,0F);
        float discountStd = CV_PRODUCT_DISCOUNT_PERCENT.getOrDefault(STD,0F);
        float discountLtd = CV_PRODUCT_DISCOUNT_PERCENT.getOrDefault(LTD,0F);
        dataMap.put("DISCOUNT LIFE", Float.toString(discountLife));
        dataMap.put("DISCOUNT STD", Float.toString(discountStd));
        dataMap.put("DISCOUNT LTD", Float.toString(discountLtd));

        dataMap.put("DISCOUNT SUM", Float.toString(
                DENTAL_BUNDLE_DISCOUNT_PERCENT +
                VISION_BUNDLE_DISCOUNT_PERCENT +
                discountLife +
                discountStd +
                discountLtd ));
        return dataMap;
    }
    
    private void fillQuoteSummarySheet(XSSFWorkbook workbook, Client client, RfpQuoteSummary rqs) {
    	Map<String, String> pageData = prepareSummaryPageData(client, rqs);
    	if (pageData.isEmpty()) {
    		// empty Quote Summary sheet not required in excel output
    		workbook.removeSheetAt(workbook.getSheetIndex(SUMMARY_PAGE_TEMPLATE));
    		return;
    	}
    	XSSFSheet sheet = workbook.getSheet(SUMMARY_PAGE_TEMPLATE);
    	if (isBlank(rqs.getMedicalWithKaiserNotes())) {
    		boolean kaiserRowFound = false;
    		
    		for (Row row : sheet) {
    			if (row.getCell(1) == null) {
    				continue;
    			}
    			String cellValue = row.getCell(1).getStringCellValue();
    			if (cellValue.contains("MEDICAL KAISER SUMMARY")) {
    				// it is very hard to remove rows with merged cells... using ZeroHeight
    				row.setZeroHeight(true);
    				kaiserRowFound = true;
    			} else if (kaiserRowFound) {
    				row.setZeroHeight(true);
    			}
    			if (cellValue.contains("DENTAL SUMMARY")) {
    				break;
    			}
    		}
    	}
    	fillSheet(sheet, pageData);
    }
    
    private void fillSheet(XSSFSheet sheet, Map<String, String> dataMap) {

        for (Row row : sheet) {
            for (Cell cell : row) {
                if(cell != null && cell.getCellTypeEnum() == CellType.STRING) {
                    
                    XSSFRichTextString richTextString = (XSSFRichTextString) cell.getRichStringCellValue();
                    StringBuilder value = new StringBuilder(richTextString.getString());
                    int numFormattingRuns = richTextString.numFormattingRuns();
                    if (numFormattingRuns > 0) {
                        // collect formatting
                        List<FormattingRun> runs = IntStream
                            .range(0, numFormattingRuns)
                            .mapToObj(idx -> new FormattingRun(
                                    richTextString.getIndexOfFormattingRun(idx),
                                    richTextString.getLengthOfFormattingRun(idx),
                                    richTextString.getFontOfFormattingRun(idx)))
                            .collect(Collectors.toList());
                        
                        findAndReplaceKeyText(dataMap, value, runs);
                        richTextString.setString(value.toString());
                        // put formatting back
                        runs.stream()
                            .filter(run -> run.font != null)
                            .forEach(run ->{
                                richTextString.applyFont(run.beginIdx, run.beginIdx + run.length, run.font);
                            });
                    } else { // no formatting
                        findAndReplaceKeyText(dataMap, value, null);    
                        richTextString.setString(value.toString());
                    }    
                }
            }
        }
    }

    private void findAndReplaceKeyText(Map<String, String> dataMap, StringBuilder text, List<FormattingRun> runs) {

        int beginPos = text.indexOf("<<");
        while (beginPos >= 0) {

            int endPos = text.indexOf(">>", beginPos);
            if (endPos == -1) { 
                // end not found
                break;
            }

            // found key
            String key = text.substring(beginPos + 2, endPos);
            String value = ofNullable(dataMap.get(key)).orElse("");
            text.replace(beginPos, endPos + 2, value);
            endPos = beginPos + value.length();
            
            // adjust runs formatting
            if (runs != null) {
                int changeLen = value.length() - (key.length() + 4);
                for (FormattingRun run : runs) {
                    if (beginPos < run.beginIdx + run.length) {
                        if (beginPos < run.beginIdx) {
                            run.beginIdx += changeLen;
                        } else { // beginPos >= run.beginIdx
                            run.length += changeLen;
                        }
                    } 
                }
            }
            
            // find next begin starting from new endPos
            beginPos = text.indexOf("<<", endPos);
        }
    }

    
    private String getBenefitValue(Benefit benefit, boolean useOutValue) {
        if(!useOutValue) {
            if(benefit.valueIn != null) {
                return benefit.valueIn;
            }

            return benefit.value;
        } else {
            return benefit.valueOut;
        }
    }
    
    private String getBenefitType(Benefit benefit, boolean useOutValue) {
        if(!useOutValue) {
            if(benefit.typeIn != null) {
                return benefit.typeIn;
            }

            return benefit.type;
        } else {
            return benefit.typeOut;
        }
    }

    private boolean hasBothInOutBenefits(List<QuoteOptionPlanComparisonDto> comparisonDtos, ComparisonNetwork network) {
        for(QuoteOptionPlanComparisonDto dto : comparisonDtos) {
            for(PlanByNetwork plan : dto.getPlans()) {
                if(plan != null && plan.networkName != null && plan.networkName.equals(network.name) &&
                    plan.networkType.equals(network.type) && plan.networkPlan != null) {

                    for(com.benrevo.common.dto.QuoteOptionAltPlanDto.Benefit b : plan.networkPlan.getBenefits()) {
                        if(b != null) {
                            if(b.valueOut != null)
                                return true;
                        }
                    }
                }
            }
        }

        return false;
    }
    
    private boolean hasHsaPlans(List<QuoteOptionPlanComparisonDto> comparisonDtos, ComparisonNetwork network) {
    	for(QuoteOptionPlanComparisonDto dto : comparisonDtos) {
            for(PlanByNetwork plan : dto.getPlans()) {
            	if(plan != null && plan.networkName != null && plan.networkName.equals(network.name) && 
            	        plan.networkType.equals(network.type) &&
            			(plan.networkPlan.getAdministrativeFee() != null || plan.networkPlan.getEmployerFund() != null)) {
                    return true;
                }
            }
        }	
        return false;
    }

    private void setCellValue(XSSFCell cell, String value, String type) {
        if("DOLLAR".equals(type)) {
            if(value != null) {
                if (cell.getCellStyle().getDataFormat() == 0) {
                    XSSFCellStyle newStype = (XSSFCellStyle) cell.getCellStyle().clone();     
                    newStype.setDataFormat(DOLLAR_NUMBER_FORMAT_INDEX);    
                    cell.setCellStyle(newStype); // "$"#,##0.00
                }
                cell.setCellValue(Double.parseDouble(value));
            }
        } else if("PERCENT".equals(type)) {
            if(value != null) {
                if (cell.getCellStyle().getDataFormat() == 0) {
                    XSSFCellStyle newStype = (XSSFCellStyle) cell.getCellStyle().clone();
                    newStype.setDataFormat(INTEGER_PERCENT_FORMAT_INDEX);
                    cell.setCellStyle(newStype);
                }
                cell.setCellValue(Double.parseDouble(value) / 100);
            }
        } else {
            cell.setCellValue(value);
        }
    }
}
