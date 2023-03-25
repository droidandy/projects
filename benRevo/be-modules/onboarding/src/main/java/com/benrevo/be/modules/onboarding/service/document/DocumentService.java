package com.benrevo.be.modules.onboarding.service.document;

import com.benrevo.be.modules.onboarding.service.email.report.Document;
import com.benrevo.be.modules.onboarding.service.email.report.PdfProcessor;
import com.benrevo.be.modules.onboarding.service.email.report.XSSFWorkbookProcessor;
import com.benrevo.common.enums.FormType;
import com.benrevo.data.persistence.entities.Client;
import com.benrevo.data.persistence.repository.ClientRepository;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.benrevo.common.enums.CarrierType.*;
import static java.lang.String.format;
import static org.apache.commons.lang3.ArrayUtils.isNotEmpty;

@Service
@Transactional
public class DocumentService {

    private static final String TEMPLATE_DIR = "/templates/%s/";

    private static final String TEMPLATE_QUESTIONNAIRE = "postsales/questionnaire.xlsx";
    private static final String TEMPLATE_GROUP_DOCUMENT = "postsales/employer-application.pdf";
    private static final String TEMPLATE_ANTHEM_QUESTIONNAIRE = "postsales/anthem-questionnaire.pdf";
    private static final String TEMPLATE_ANTHEM_EMPLOYER_ACCESS = "postsales/anthem-employer-access.pdf";
    private static final String TEMPLATE_ANTHEM_EMPLOYER_APPLICATION = "postsales/anthem-employer-application.pdf";
    private static final String TEMPLATE_ANTHEM_COMMON_OWNERSHIP = "postsales/anthem-common-ownership.pdf";

    @Value("${app.carrier}")
    String[] appCarrier;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private DocumentDataContext dataContext;

    public Document<XSSFWorkbook> getXSSFWorkbook(Long clientId, FormType formType) {
        Client client = clientRepository.findOne(clientId);

        switch (formType) {
            case QUESTIONNAIRE:
                return new XSSFWorkbookProcessor().build(getPrefix() + TEMPLATE_QUESTIONNAIRE, dataContext.getData(client, formType));
            default:
                return null;
        }
    }

    public Document<PDDocument> getPDDocument(Long clientId, FormType formType) {
        Client client = clientRepository.findOne(clientId);

        switch (formType) {
            case EMPLOYER_APPLICATION:
                return new PdfProcessor().build(getPrefix() + TEMPLATE_GROUP_DOCUMENT, dataContext.getData(client, formType));
            case ANTHEM_QUESTIONNAIRE:
                return new PdfProcessor().build(getPrefix() + TEMPLATE_ANTHEM_QUESTIONNAIRE, dataContext.getData(client, formType));
            case ANTHEM_EMPLOYER_APPLICATION:
                return new PdfProcessor().build(getPrefix() + TEMPLATE_ANTHEM_EMPLOYER_APPLICATION, dataContext.getData(client, formType));
            case ANTHEM_EMPLOYER_ACCESS:
                return new PdfProcessor().build(getPrefix() + TEMPLATE_ANTHEM_EMPLOYER_ACCESS, dataContext.getData(client, formType));
            case ANTHEM_COMMON_OWNERSHIP:
                return new PdfProcessor().build(getPrefix() + TEMPLATE_ANTHEM_COMMON_OWNERSHIP, dataContext.getData(client, formType));
            default:
                return null;
        }
    }

    String getPrefix() {
        String[] s = findCarriers(appCarrier);
        return isNotEmpty(s) ? format(TEMPLATE_DIR, s[0].toLowerCase()) : null;
    }
}
