package com.benrevo.be.modules.shared.service.pptx;

import com.benrevo.common.exception.BaseException;
import com.google.common.collect.Lists;
import java.awt.geom.Rectangle2D;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.NumberFormat;
import java.util.AbstractMap.SimpleEntry;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.apache.commons.lang3.tuple.Pair;
import org.apache.poi.openxml4j.opc.PackageRelationship;
import org.apache.poi.sl.usermodel.ShapeType;
import org.apache.poi.xslf.usermodel.XMLSlideShow;
import org.apache.poi.xslf.usermodel.XSLFAutoShape;
import org.apache.poi.xslf.usermodel.XSLFPictureShape;
import org.apache.poi.xslf.usermodel.XSLFRelation;
import org.apache.poi.xslf.usermodel.XSLFShape;
import org.apache.poi.xslf.usermodel.XSLFSimpleShape;
import org.apache.poi.xslf.usermodel.XSLFSlide;
import org.apache.poi.xslf.usermodel.XSLFSlideLayout;
import org.apache.poi.xslf.usermodel.XSLFSlideMaster;
import org.apache.poi.xslf.usermodel.XSLFTable;
import org.apache.poi.xslf.usermodel.XSLFTableCell;
import org.apache.poi.xslf.usermodel.XSLFTableRow;
import org.apache.poi.xslf.usermodel.XSLFTextBox;
import org.apache.poi.xslf.usermodel.XSLFTextParagraph;
import org.apache.poi.xslf.usermodel.XSLFTextRun;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class PptxGenerator {

    private static final int BASIC_LIFE_SLIDE_INDEX = 16;
    private static final int VOLUNTARY_LIFE_SLIDE1_INDEX = 19;
    private static final int VOLUNTARY_LIFE_SLIDE2_INDEX = 20;
    private static final int BASIC_LIFE_MARKETING_SLIDE_INDEX = 18;
    private static final int BASIC_STD_SLIDE_INDEX = 22;
    private static final int BASIC_STD_MARKETING_SLIDE_INDEX = 24;
    private static final int BASIC_LTD_SLIDE_INDEX = 26;
    private static final int BASIC_LTD_MARKETING_SLIDE_INDEX = 28;
    private static final int FINANCIAL_SLIDE_INDEX = 2;
    private static final int MEDICAL_RENEWAL_ANALYSIS_SLIDE_INDEX = 4;
    private static final int MEDICAL_MARKETING_SLIDE_INDEX = 6;
    private static final int DENTAL_RENEWAL_ANALYSIS_SLIDE_INDEX = 8;
    private static final int DENTAL_MARKETING_SLIDE_INDEX = 10;
    private static final int VISION_RENEWAL_ANALYSIS_SLIDE_INDEX = 12;
    private static final int VISION_MARKETING_SLIDE_INDEX = 14;

    protected static final Logger logger = LoggerFactory.getLogger(PptxGenerator.class);

    private Map<String, Integer> renewalAnalysisSlideIndexes;
    private Map<String, Integer> marketingSlideIndexes;

    private final NumberFormat currencyFormatter = NumberFormat.getCurrencyInstance(Locale.CANADA);
    private final Data data;
    private final Map<String, Object> viewData;
    private int newSlideNum = 0; //shift relative to the default page's positions on the template
    private ArrayList<String> slideSuffixes;

    private PptxGenerator(Data data, Map<String, Object> viewData) {

        this.data = data;
        this.viewData = viewData;

        renewalAnalysisSlideIndexes = Collections.unmodifiableMap(Stream.of(
            new SimpleEntry<>(data.medical.prefix, MEDICAL_RENEWAL_ANALYSIS_SLIDE_INDEX),
            new SimpleEntry<>(data.dental.prefix, DENTAL_RENEWAL_ANALYSIS_SLIDE_INDEX),
            new SimpleEntry<>(data.vision.prefix, VISION_RENEWAL_ANALYSIS_SLIDE_INDEX),
            new SimpleEntry<>(data.life.prefix, BASIC_LIFE_SLIDE_INDEX),
            new SimpleEntry<>(data.std.prefix, BASIC_STD_SLIDE_INDEX),
            new SimpleEntry<>(data.ltd.prefix, BASIC_LTD_SLIDE_INDEX)
        ).collect(Collectors.toMap(SimpleEntry::getKey, SimpleEntry::getValue)));

        marketingSlideIndexes = Collections.unmodifiableMap(Stream.of(
            new SimpleEntry<>(data.medical.prefix, MEDICAL_MARKETING_SLIDE_INDEX),
            new SimpleEntry<>(data.dental.prefix, DENTAL_MARKETING_SLIDE_INDEX),
            new SimpleEntry<>(data.vision.prefix, VISION_MARKETING_SLIDE_INDEX),
            new SimpleEntry<>(data.life.prefix, BASIC_LIFE_MARKETING_SLIDE_INDEX),
            new SimpleEntry<>(data.std.prefix, BASIC_STD_MARKETING_SLIDE_INDEX),
            new SimpleEntry<>(data.ltd.prefix, BASIC_LTD_MARKETING_SLIDE_INDEX)
        ).collect(Collectors.toMap(SimpleEntry::getKey, SimpleEntry::getValue)));
    }

    public static byte[] generate(String path, Data data, Map<String, Object> viewData, byte[] brokerLogoData) {
        return new PptxGenerator(data, viewData).generate(path, brokerLogoData);
    }

    private byte[] generate(String path, byte[] brokerLogoData) {
        try (InputStream is = PptxGenerator.class.getResourceAsStream(path);
            XMLSlideShow ppt = new XMLSlideShow(is);) {

            // process layouts
            for(XSLFSlideMaster master : ppt.getSlideMasters()) {
                for(XSLFSlideLayout layout : master.getSlideLayouts()) {
                    for (XSLFShape shape : layout.getShapes()) {
                        if (shape instanceof XSLFPictureShape) {
                            XSLFPictureShape picture = (XSLFPictureShape) shape;
                            if ("broker_logo".equals(picture.getShapeName())
                                && brokerLogoData != null) {
                                picture.getPictureData().setData(brokerLogoData);
                            }
                        }
                    }
                }
            }

            int TEMPLATE_LAST_PAGE_INDEX = ppt.getSlides().size() - 1;
            slideSuffixes = (ArrayList<String>) Stream.generate(String::new)
                .limit(TEMPLATE_LAST_PAGE_INDEX + 1)
                .collect(Collectors.toList());

            boolean allCurrentsAndRenewalsAreEmpty = data.products.stream()
                .allMatch(product -> product.current.plans.isEmpty()
                    && product.renewal.plans.isEmpty());
            if(allCurrentsAndRenewalsAreEmpty) {
                ppt.removeSlide(FINANCIAL_SLIDE_INDEX - 1 + newSlideNum--);
            }

            // add dynamic pages for alternatives
            boolean allAlternativesAreEmpty = data.products.stream().
                allMatch(product -> product.alternatives.list.isEmpty()
                    && product.renewalAlternatives.list.isEmpty());
            if (allAlternativesAreEmpty) {
                ppt.removeSlide(FINANCIAL_SLIDE_INDEX + newSlideNum--);
            } else {
                addPages(FINANCIAL_SLIDE_INDEX, data.medical.alternatives.list.size(), ppt);
            }

            preparePagesForProduct(data.medical, ppt);
            preparePagesForProduct(data.dental, ppt);
            preparePagesForProduct(data.vision, ppt);
            preparePagesForProduct(data.life, ppt);

            // add dynamic pages for voluntary ancillary classes
            if (viewData.get("hhide") != null) {
                // remove voluntary life slides
                ppt.removeSlide(VOLUNTARY_LIFE_SLIDE1_INDEX + newSlideNum--);
                ppt.removeSlide(VOLUNTARY_LIFE_SLIDE2_INDEX + newSlideNum--);
            } else {
                XSLFSlide voluntaryLifeSlide1 = ppt.getSlides().get(VOLUNTARY_LIFE_SLIDE1_INDEX + newSlideNum);
                XSLFSlide voluntaryLifeSlide2 = ppt.getSlides().get(VOLUNTARY_LIFE_SLIDE2_INDEX + newSlideNum);
                slideSuffixes.set(VOLUNTARY_LIFE_SLIDE1_INDEX + newSlideNum, "-0");
                slideSuffixes.set(VOLUNTARY_LIFE_SLIDE2_INDEX + newSlideNum, "-0");
                int voluntaryLifeClassNum = data.volLife.pageNum;
                // we already have "-0", so skip i=0
                for(int i = 1; i < voluntaryLifeClassNum; i++) {
                    XSLFSlide newSlide1 = ppt.createSlide().importContent(voluntaryLifeSlide1);
                    XSLFSlide newSlide2 = ppt.createSlide().importContent(voluntaryLifeSlide2);

                    newSlideNum += 2;

                    ppt.setSlideOrder(newSlide1, VOLUNTARY_LIFE_SLIDE1_INDEX + newSlideNum);
                    slideSuffixes.add(VOLUNTARY_LIFE_SLIDE1_INDEX + newSlideNum, "-" + i);
                    ppt.setSlideOrder(newSlide2, VOLUNTARY_LIFE_SLIDE2_INDEX + newSlideNum);
                    slideSuffixes.add(VOLUNTARY_LIFE_SLIDE2_INDEX + newSlideNum, "-" + i);
                }
            }

            preparePagesForProduct(data.std, ppt);
            preparePagesForProduct(data.ltd, ppt);

            // PowerPoint does not have auto "MaxPageNum" feature
            viewData.put("max_page_num", Integer.toString(TEMPLATE_LAST_PAGE_INDEX + newSlideNum) );

            // process slides
            for (int slideIndex = 0; slideIndex < ppt.getSlides().size(); slideIndex ++) {
                XSLFSlide slide = ppt.getSlides().get(slideIndex);
                String slideSuffix = slideSuffixes.get(slideIndex);
                List<XSLFSimpleShape> shapesToRemove = new ArrayList<>();
                Map<String, XSLFPictureShape> pictures = new HashMap<>();
                for (XSLFShape shape : slide.getShapes()) {
                    if (shape instanceof XSLFPictureShape) {
                        XSLFPictureShape picture = (XSLFPictureShape) shape;
                        if ("broker_logo".equals(picture.getShapeName())
                            && brokerLogoData != null) {
                            picture.getPictureData().setData(brokerLogoData);
                        }
                        preparePicture(picture, data.medical, false, pictures, shapesToRemove);
                        preparePicture(picture, data.dental, false, pictures, shapesToRemove);
                        preparePicture(picture, data.vision, false, pictures, shapesToRemove);
                        preparePicture(picture, data.medical, true, pictures, shapesToRemove);
                        preparePicture(picture, data.dental, true, pictures, shapesToRemove);
                        preparePicture(picture, data.vision, true, pictures, shapesToRemove);
                    }
                    if (shape instanceof XSLFAutoShape) {
                        XSLFAutoShape auto = (XSLFAutoShape) shape;
                        findAndReplaceKeyText(viewData, auto.getTextParagraphs(), slideSuffix);
                        // adjust bars
                        if (auto.getShapeType() == ShapeType.RECT) {
                            String shapeName = shape.getShapeName();
                            Boolean hide = (Boolean) viewData.getOrDefault(shapeName + "_hide", false);
                            if (hide) {
                                shapesToRemove.add(auto);
                            } else {
                                Float factor = (Float) viewData.get(shapeName);
                                if(factor != null) {
                                    Rectangle2D rect = auto.getAnchor();
                                    rect.setRect(
                                        rect.getX(), rect.getY(), rect.getWidth() * factor,
                                        rect.getHeight()
                                    );
                                    auto.setAnchor(rect);
                                }
                            }
                        }
                    }
                    if (shape instanceof XSLFTextBox) {
                        XSLFTextBox text = (XSLFTextBox) shape;
                        findAndReplaceKeyText(viewData, text.getTextParagraphs(), slideSuffix);
                    }
                    if (shape instanceof XSLFTable) {
                        List<Integer> rowsToHide = new ArrayList<>();
                        XSLFTable table = (XSLFTable) shape;

                        List<XSLFTableRow> rows = table.getRows();
                        for (int rowIndex=0; rowIndex < rows.size() ; rowIndex++) {
                            XSLFTableRow row = rows.get(rowIndex);
                            List<XSLFTableCell> cells = row.getCells();
                            int beginCellIndexToMerge = -1;
                            int endCellIndexToMerge = -1;
                            for (int cellIndex=0; cellIndex < cells.size() ; cellIndex++) {
                                XSLFTableCell cell = cells.get(cellIndex);
                                if (cellIndex > endCellIndexToMerge) {
                                    Integer colSpan = findAndReplaceKeyText(viewData, cell.getTextParagraphs(), slideSuffix);
                                    if (colSpan != null) {
                                        if (colSpan == 0) {
                                            // hide row
                                            rowsToHide.add(rowIndex);
                                        } else {
                                            beginCellIndexToMerge = cellIndex;
                                            endCellIndexToMerge = cellIndex + colSpan - 1;
                                        }
                                    }
                                } else {
                                    cell.clearText();
                                    //cell.setText("");
                                    cell.addNewTextParagraph();
                                    if (cellIndex == endCellIndexToMerge) {
                                        table.mergeCells(rowIndex, rowIndex, beginCellIndexToMerge, endCellIndexToMerge);
                                    }
                                }
                            }
                        }
                        Lists.reverse(rowsToHide).forEach(row -> table.getCTTable().removeTr(row));
                    }
                }
                //move icons while deleting rows
                XSLFPictureShape medicalIcon = pictures.get(data.medical.prefix);
                XSLFPictureShape dentalIcon = pictures.get(data.dental.prefix);
                XSLFPictureShape visionIcon = pictures.get(data.vision.prefix);
                if (medicalIcon != null && shapesToRemove.contains(medicalIcon)) {
                    if (dentalIcon != null && !shapesToRemove.contains(dentalIcon)) {
                        movePicture(visionIcon, dentalIcon);
                        movePicture(dentalIcon, medicalIcon);
                    } else {
                        movePicture(visionIcon, medicalIcon);
                    }
                } else if (dentalIcon != null && shapesToRemove.contains(dentalIcon)) {
                    movePicture(visionIcon, dentalIcon);
                }

                shapesToRemove.forEach(this::hideShape);
            }
            //workaround to avoid broken relations after removing slides
            ppt.getSlides().forEach(slide -> {
                String slideLayoutRelationType = XSLFRelation.SLIDE_LAYOUT.getRelation();
                PackageRelationship rId1 = slide.getPackagePart().getRelationship("rId1");
                PackageRelationship rId2 = slide.getPackagePart().getRelationship("rId2");
                if(rId1 != null && rId2 != null &&
                    slideLayoutRelationType.equals(rId1.getRelationshipType()) &&
                    slideLayoutRelationType.equals(rId2.getRelationshipType()))
                {
                    slide.getPackagePart().removeRelationship("rId2");
                }
            });

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ppt.write(baos);
            return baos.toByteArray();

        } catch (IOException e) {
            throw new BaseException("Can't process PowerPoint presentation file", e);
        }
    }

    private void preparePicture(XSLFPictureShape picture, Product product, boolean isAlt,
        Map<String, XSLFPictureShape> pictures, List<XSLFSimpleShape> shapesToRemove)
    {
        String prefix = product.prefix + (isAlt ? "alt" : "");
        if ((prefix + "_icon").equals(picture.getShapeName())) {
            if(viewData.get(prefix + "hide") != null) {
                shapesToRemove.add(picture);
            }
            pictures.put(product.prefix, picture);
        }
    }

    private void movePicture(XSLFPictureShape picture, XSLFPictureShape targetPosition){
        if (picture != null && targetPosition != null) {
            Rectangle2D targetAnchor = targetPosition.getAnchor();
            Rectangle2D currentAnchor = picture.getAnchor();
            picture.setAnchor(new Rectangle2D.Double(
                currentAnchor.getX(),
                targetAnchor.getY() + (targetAnchor.getHeight() - currentAnchor.getHeight()) / 2,
                // ^ align on central line
                currentAnchor.getWidth(), currentAnchor.getHeight()
            ));
        }
    }

    private void hideShape(XSLFSimpleShape shape){
        if (shape != null) {
            Rectangle2D currentAnchor = shape.getAnchor();
            // Workaround: set size to 0
            shape.setAnchor(new Rectangle2D.Double(currentAnchor.getX(), currentAnchor.getY(), 0,0));
        }
    }

    private void addPages(int basicSlideIndex, int pageNum, XMLSlideShow ppt) {
        XSLFSlide basicSlide = ppt.getSlides().get(basicSlideIndex + newSlideNum);
        slideSuffixes.set(basicSlideIndex + newSlideNum, "-0");
        // we already have "-0", so skip i=0
        for (int pageIndex = 1; pageIndex < pageNum; pageIndex++ ) {
            XSLFSlide newSlide = ppt.createSlide().importContent(basicSlide);
            ppt.setSlideOrder(newSlide, basicSlideIndex + ++newSlideNum);
            slideSuffixes.add(basicSlideIndex + newSlideNum, "-" + pageIndex);
        }
    }

    private void addMultiPlanPages(int basicSlideIndex, List<Integer> pageNumPerPlan, String pagePrefix, XMLSlideShow ppt) {
        XSLFSlide basicSlide = ppt.getSlides().get(basicSlideIndex + newSlideNum);
        int pageShift = pagePrefix == null || pagePrefix.isEmpty() ? 0 : -2;
        if (pageShift == 0) {
            //actual only for marketing analysis
            slideSuffixes.set(basicSlideIndex + newSlideNum + pageShift, pagePrefix + "-0-0");
        }
        for(int planIndex = 0; planIndex < pageNumPerPlan.size(); planIndex++) {
            int pageNum = pageNumPerPlan.get(planIndex);
            // we already have slide "-0-0" for marketing analysis, so skip it
            for(int pageIndex = (planIndex == 0 && pageShift == 0) ? 1 : 0; pageIndex < pageNum; pageIndex++) {
                XSLFSlide newSlide = ppt.createSlide().importContent(basicSlide);
                ppt.setSlideOrder(newSlide, basicSlideIndex + ++newSlideNum + pageShift);
                slideSuffixes.add(basicSlideIndex + newSlideNum + pageShift,
                    pagePrefix + "-" + pageIndex + "-" + planIndex);
            }
        }
    }

    private void preparePagesForProduct(Product product, XMLSlideShow ppt) {
        Integer renewalAnalysisSlideIndex = renewalAnalysisSlideIndexes.get(product.prefix);
        Integer marketingSlideIndex = marketingSlideIndexes.get(product.prefix);
        if (renewalAnalysisSlideIndex != null) {
            if(viewData.get(product.prefix + "hide") != null) {
                ppt.removeSlide(renewalAnalysisSlideIndex + newSlideNum--);
                ppt.removeSlide(renewalAnalysisSlideIndex + newSlideNum--); //remove product renewal overview page
            } else {
                addPages(renewalAnalysisSlideIndex, product.pageNum, ppt);
            }
        }
        if (marketingSlideIndex != null) {
            if (product.renewalAlternatives.list.stream().anyMatch(Objects::nonNull)) {
                addMultiPlanPages(marketingSlideIndex, product.renewalAlternatives.pageNumPerPlan,
                    "-" + AlternativesHolder.RENEWAL_ALTERNATIVE_PREFIX, ppt);
            }
            if (product.alternatives.list.stream().noneMatch(Objects::nonNull)) {
                ppt.removeSlide(marketingSlideIndex + newSlideNum--);
                ppt.removeSlide(marketingSlideIndex + newSlideNum--); //remove product marketing summary page
            } else {
                addMultiPlanPages(marketingSlideIndex, product.alternatives.pageNumPerPlan, "", ppt);
            }
        }
    }

    /**
     * Find key text like ${key} and replace it with value from data
     *
     *
     * @param data
     * @param paragraphs
     * @param slideSuffix
     * @return colSpan if present
     */
    private Integer findAndReplaceKeyText(Map<String, Object> data,
        List<XSLFTextParagraph> paragraphs, String slideSuffix) {

        Integer result = null;

        if (paragraphs == null) {
            return null;
        }

        for (XSLFTextParagraph p : paragraphs) {
            TextPos beginPos = findText(p.getTextRuns(), "${", new TextPos(0,0,0,0));
            while (beginPos != null) {

                TextPos endPos = findText(p.getTextRuns(), "}", beginPos);
                if (endPos == null) {
                    // end not found
                    break;
                }

                // found key
                String key = getText(p.getTextRuns(), beginPos, endPos).replace("#", slideSuffix);
                String text = null;
                Object value = data.get(key);
                if (value != null) {
                    if (value instanceof String) {
                        text = (String) value;
                    } else if (value instanceof Long) {
                        text = ((Long) value).toString();
                    } else if (value instanceof Float || value instanceof Double) {
                        text = currencyFormatter.format(value);
                    } else if (value instanceof Pair) {
                        Pair<String, Integer> pair = (Pair<String, Integer>) value;
                        text = pair.getLeft();
                        result = pair.getRight();
                    } else {
                        throw new BaseException("Unexpected object type=" + value.getClass());
                    }
                }
                endPos = replaceText(p.getTextRuns(), beginPos, endPos, text);

                // find next begin starting from endPos
                beginPos = findText(p.getTextRuns(), "${", endPos);
            }
        }
        return result;
    }


    /**
     * Finds text in TextRun list
     * Text can be split to several TextRuns
     *
     * @param textRuns
     * @param findText
     * @param beginPos
     * @return TextPos
     */
    private TextPos findText(List<XSLFTextRun> textRuns, String findText, TextPos beginPos) {
        int findIndex = 0;
        int beginRun = 0;
        int beginText = 0;
        int startIndexRun = beginPos.endRun; // starting from last run
        int startIndexText = beginPos.endText; // starting from last pos

        if (textRuns == null) {
            return null;
        }

        for (int runIndex = startIndexRun; runIndex < textRuns.size(); runIndex++) {
            XSLFTextRun textRun = textRuns.get(runIndex);
            String rawText = textRun.getRawText();
            for (int textIndex = startIndexText; textIndex < rawText.length(); textIndex++) {
                if (findText.charAt(findIndex) == rawText.charAt(textIndex)) {
                    if (findIndex == 0) {
                        // keep begin position
                        beginRun = runIndex;
                        beginText = textIndex;
                    }
                    findIndex++;
                    if (findIndex == findText.length()) {
                        // found
                        return new TextPos(beginRun, beginText, runIndex, textIndex + 1);
                    }
                } else {
                    findIndex = 0;
                }
            }
            startIndexText = 0; // for next runText start with 0
        }
        return null;
    }

    /**
     * Returns text from TextRun list between beginPos and endPos
     *
     * @param textRuns
     * @param beginPos
     * @param endPos
     * @return
     */
    private String getText(List<XSLFTextRun> textRuns, TextPos beginPos, TextPos endPos) {

        StringBuilder sb = new StringBuilder();

        int startIndexRun = beginPos.endRun;
        int startIndexText = beginPos.endText;

        int stopIndexRun = endPos.beginRun;
        int stopIndexText;

        for (int runIndex = startIndexRun; runIndex <= stopIndexRun; runIndex++) {
            XSLFTextRun textRun = textRuns.get(runIndex);
            String rawText = textRun.getRawText();

            stopIndexText = (runIndex == stopIndexRun) ? endPos.beginText : rawText.length();
            for (int textIndex = startIndexText; textIndex < stopIndexText; textIndex++) {
                sb.append(rawText.charAt(textIndex));
                if (sb.length() > 50) {
                    // key can't be that long
                    return null;
                }
            }
            startIndexText = 0; // for next runText start with 0
        }
        return sb.toString();
    }

    /**
     * Replaces text in TextRun list with value in position between beginPos and endPos.
     * Places value in the first textRun.
     * Setting empty string for others except for the last one.
     *
     * @param textRuns
     * @param beginPos
     * @param endPos
     * @param value
     * @return New endPos
     */
    private TextPos replaceText(List<XSLFTextRun> textRuns, TextPos beginPos, TextPos endPos,
        String value) {

        int startIndexRun = beginPos.beginRun;
        int startIndexText = beginPos.beginText;

        int stopIndexRun = endPos.endRun;
        int stopIndexText = endPos.endText;

        StringBuilder newText = new StringBuilder();

        for (int runIndex = startIndexRun; runIndex <= stopIndexRun; runIndex++) {
            XSLFTextRun textRun = textRuns.get(runIndex);
            String rawText = textRun.getRawText();

            newText.setLength(0);

            if (runIndex == startIndexRun) {
                // adding part from the first textRun
                newText.append(rawText.substring(0, startIndexText));
                if (value != null) {
                    newText.append(value);
                }
            }

            if (runIndex == stopIndexRun) {
                // adding part from the last textRun
                newText.append(rawText.substring(stopIndexText));
                endPos.endText = 0;
            }

            textRun.setText(newText.toString());
        }
        return endPos;
    }
}
