package com.benrevo.be.modules.onboarding.service.email.report;

import java.io.ByteArrayOutputStream;
import java.io.Serializable;

public class Document<T> implements Serializable {

    public static class Output {
        private ByteArrayOutputStream outputStream;
        private String filename;
        private String contentType;

        public Output(ByteArrayOutputStream outputStream, String filename, String contentType) {
            this.outputStream = outputStream;
            this.filename = filename;
            this.contentType = contentType;
        }

        public ByteArrayOutputStream getOutputStream() {
            return outputStream;
        }

        public void setOutputStream(ByteArrayOutputStream outputStream) {
            this.outputStream = outputStream;
        }

        public String getFilename() {
            return filename;
        }

        public void setFilename(String filename) {
            this.filename = filename;
        }

        public String getContentType() {
            return contentType;
        }

        public void setContentType(String contentType) {
            this.contentType = contentType;
        }
    }

    private T document;

    public Document(T document) {
        this.document = document;
    }

    public T getDocument() {
        return document;
    }

    public void setDocument(T document) {
        this.document = document;
    }
}