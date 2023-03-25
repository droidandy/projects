package com.benrevo.be.modules.shared.service.pptx;

class TextPos {
    TextPos(int beginRun, int beginText, int endRun, int endText) {
        this.beginRun = beginRun;
        this.beginText = beginText;
        this.endRun = endRun;
        this.endText = endText;
    }

    int beginRun;
    int beginText;
    int endRun;
    int endText;
}
