package com.benrevo.be.modules.onboarding.service;

import com.benrevo.be.modules.onboarding.service.document.DocumentService;
import com.benrevo.be.modules.onboarding.service.email.report.Document;
import com.benrevo.common.Constants;
import com.benrevo.common.enums.FormType;
import com.benrevo.common.exception.BaseException;
import com.benrevo.common.exception.DocumentGeneratorException;
import org.apache.commons.io.IOUtils;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Map;

@Service
@Transactional
public class PostSalesDocumentService {
    private static final String FILENAME_QUESTIONNAIRE = "questionnaire";
    private static final String FILENAME_EMPLOYER_ACCESS = "employer-access";
    private static final String FILENAME_EMPLOYER_APPLICATION = "employer-application";
    private static final String FILENAME_COMMON_OWNERSHIP = "common-ownership";
    
    @Autowired
    private DocumentService documentService;

    private Document.Output getXSSFWorkbook(Long clientId, FormType formType, String filename) throws DocumentGeneratorException {
        try {
            Document<XSSFWorkbook> xssfWorkbookDocument = documentService.getXSSFWorkbook(clientId, formType);
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            xssfWorkbookDocument.getDocument().write(byteArrayOutputStream);
            return new Document.Output(byteArrayOutputStream, FILENAME_QUESTIONNAIRE + "." + Constants.EXTENSION_XLSX, Constants.HTTP_HEADER_CONTENT_TYPE_XLSX);
        } catch (IOException e) {
            throw new DocumentGeneratorException(e.getMessage(), e);
        }
    }

    private Document.Output getPDDocument(Long clientId, FormType formType, String filename) throws DocumentGeneratorException {
        return getPDDocument(documentService.getPDDocument(clientId, formType), filename);
    }

    protected Document.Output getPDDocument(Document<PDDocument> pdDocumentDocument, String filename) throws DocumentGeneratorException {
        try {
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            pdDocumentDocument.getDocument().save(byteArrayOutputStream);
            return new Document.Output(byteArrayOutputStream, filename, MediaType.APPLICATION_PDF_VALUE);
        } catch (IOException e) {
            throw new DocumentGeneratorException(e.getMessage(), e);
        } finally {
            closePdfDocument(pdDocumentDocument);
        }
    }

    public Document.Output getDocument(String code, Long clientId) throws DocumentGeneratorException {
        FormType formType = FormType.findByName(code);

        switch (formType) {
            case QUESTIONNAIRE:
                return getXSSFWorkbook(clientId, FormType.QUESTIONNAIRE, FILENAME_QUESTIONNAIRE + "." + Constants.EXTENSION_XLSX);
            case EMPLOYER_APPLICATION:
                return getPDDocument(clientId, FormType.EMPLOYER_APPLICATION, FILENAME_EMPLOYER_APPLICATION + "." + Constants.EXTENSION_PDF);
            case ANTHEM_QUESTIONNAIRE:
                return getPDDocument(clientId, FormType.ANTHEM_QUESTIONNAIRE, FILENAME_QUESTIONNAIRE + "." + Constants.EXTENSION_PDF);
            case ANTHEM_EMPLOYER_ACCESS:
                return getPDDocument(clientId, FormType.ANTHEM_EMPLOYER_ACCESS, FILENAME_EMPLOYER_ACCESS + "." + Constants.EXTENSION_PDF);
            case ANTHEM_EMPLOYER_APPLICATION:
                return getPDDocument(clientId, FormType.ANTHEM_EMPLOYER_APPLICATION, FILENAME_EMPLOYER_APPLICATION + "." + Constants.EXTENSION_PDF);
            case ANTHEM_COMMON_OWNERSHIP:
                return getPDDocument(clientId, FormType.ANTHEM_COMMON_OWNERSHIP, FILENAME_COMMON_OWNERSHIP + "." + Constants.EXTENSION_PDF);
            default:
                return null;
        }
    }

    private void closePdfDocument(Document<PDDocument> pdDocumentDocument) {
        if (pdDocumentDocument != null && pdDocumentDocument.getDocument() != null) {
            try {
                pdDocumentDocument.getDocument().close();
            } catch (IOException e) {
                throw new DocumentGeneratorException(e.getMessage(), e);
            }
        }
    }

    public void download(HttpServletResponse response, Document.Output output) {
        try {
            InputStream is = new ByteArrayInputStream(output.getOutputStream().toByteArray());

            IOUtils.copy(is, response.getOutputStream());

            response.setContentType(output.getContentType());
            response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=" + output.getFilename());
            response.flushBuffer();
        } catch (IOException e) {
            throw new BaseException(e.getMessage(), e);
        }
    }
    
    public Map<String, String> getAvailableFormList(Long clientId) {
        throw new UnsupportedOperationException("Not implemented");
    }
}
