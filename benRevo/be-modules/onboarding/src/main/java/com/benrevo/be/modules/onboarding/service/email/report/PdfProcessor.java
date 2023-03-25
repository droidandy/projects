package com.benrevo.be.modules.onboarding.service.email.report;


import com.benrevo.common.exception.DocumentGeneratorException;
import org.apache.pdfbox.cos.COSName;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDDocumentCatalog;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.interactive.form.PDAcroForm;
import org.apache.pdfbox.pdmodel.interactive.form.PDField;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import static com.benrevo.common.util.StreamUtils.mapToList;

public class PdfProcessor implements DocumentProcessor<PDDocument> {
    private static final Logger LOGGER = LogManager.getLogger(PdfProcessor.class);

    private Document<PDDocument> load(String path) {
        InputStream inputStream = PdfProcessor.class.getResourceAsStream(path);

        if(inputStream == null) {
            throw new DocumentGeneratorException(String.format("Can not load the '%s' file", path));
        }

        return load(inputStream);
    }

    @Override
    public final Document<PDDocument> load(InputStream inputStream) {
        try {
            return new Document<>(PDDocument.load(inputStream));
        } catch(IOException e) {
            throw new DocumentGeneratorException(e.getMessage(), e);
        }
    }

    @Override
    public Document<PDDocument> build(String pathToTemplate, Map<String, String> dataMap) throws DocumentGeneratorException {
        return build(load(pathToTemplate), dataMap);
    }

    public Document<PDDocument> build(Document<PDDocument> pdDocument, Map<String, String> dataMap) throws DocumentGeneratorException {
        PDDocumentCatalog docCatalog = pdDocument.getDocument().getDocumentCatalog();
        PDAcroForm acroForm = docCatalog.getAcroForm();
        updateDefaultResource(acroForm);

        List<PDField> fieldList = acroForm.getFields();
        List<String> fieldNames = mapToList(fieldList, PDField::getFullyQualifiedName);

        fieldNames.stream().filter(Objects::nonNull).forEach(fieldName -> {
            String value = dataMap.get(fieldName);
            PDField field = acroForm.getField(fieldName);

            try {
                if(field != null && value != null) {
                    field.setValue(value);
                }
            } catch(IOException e) {
                LOGGER.error("Can not update the pdf form", e);
            }
        });

        return pdDocument;
    }

    private void updateDefaultResource(PDAcroForm acroForm) {
        acroForm.getDefaultResources().put(COSName.getPDFName("Helv"), PDType1Font.HELVETICA);
        acroForm.getDefaultResources().put(COSName.getPDFName("HeBo"), PDType1Font.HELVETICA_BOLD);
    }
}