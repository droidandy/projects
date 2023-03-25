package com.benrevo.be.modules.shared.service;

import com.benrevo.common.exception.BaseException;
import com.google.common.collect.Iterables;
import com.itextpdf.text.DocumentException;

import org.docx4j.convert.in.xhtml.XHTMLImporterImpl;
import org.docx4j.jaxb.Context;
import org.docx4j.openpackaging.exceptions.Docx4JException;
import org.docx4j.openpackaging.packages.WordprocessingMLPackage;
import org.docx4j.wml.Br;
import org.docx4j.wml.P;
import org.docx4j.wml.STBrType;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.List;

@Service
@Transactional
public class DocumentGeneratorService {
    
    @Value("${pdf.use150DPI:false}")
    private boolean use150DPI;

    public ByteArrayOutputStream stringArrayToPdfOS(String[] inputs) {
        return stringArrayToPdfOS(inputs, false);
    }
    
    public ByteArrayOutputStream stringArrayToPdfOS(String[] inputs, boolean use150DpiParam) {
    	ByteArrayOutputStream os = new ByteArrayOutputStream();
    	
    	// default 96 DPI
        ITextRenderer renderer = (use150DPI || use150DpiParam) ? new ITextRenderer(125f/3f, 20) : new ITextRenderer();

        renderer.setDocumentFromString(inputs[0]);
        renderer.layout();

        try {
            renderer.createPDF(os, false);

            for(int i = 1; i < inputs.length; i++) {
                renderer.setDocumentFromString(inputs[i]);
                renderer.layout();
                renderer.writeNextDocument();
            }
        } catch(DocumentException | IOException e) {
            throw new BaseException("Error converting string inputs to byte stream");
        }

        renderer.finishPDF();

        return os;
    }
    
    public ByteArrayOutputStream stringArrayToDocxOS(String[] inputs) {
    	ByteArrayOutputStream os = new ByteArrayOutputStream();
		try {
			WordprocessingMLPackage wordMLPackage = WordprocessingMLPackage.createPackage();
			XHTMLImporterImpl xHTMLImporter = new XHTMLImporterImpl(wordMLPackage);
			org.docx4j.wml.ObjectFactory factory = Context.getWmlObjectFactory();
	
			for (int i = 0; i < inputs.length; i++) {
	
				String current = inputs[i];
				List<Object> pages = xHTMLImporter.convert(current, null);
	
				wordMLPackage.getMainDocumentPart().getContent().add(Iterables.getLast(pages));
				if (i < inputs.length - 1) {
					Br breakObj = new Br();
					breakObj.setType(STBrType.PAGE);
					P parag = factory.createP();
					parag.getContent().add(breakObj);
					wordMLPackage.getMainDocumentPart().addObject(parag);
				}
			}
			wordMLPackage.save(os);
		} catch (Docx4JException e) {
			throw new BaseException("Error converting string inputs to byte stream");
		}
		return os;
    }

}
