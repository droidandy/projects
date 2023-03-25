import {Selector} from 'testcafe';

export default class PlansQuoteTab {
    constructor() {
        this.saveContinue = Selector('button').withText('Save & Continue');
        this.uploadBenefit = Selector("input[type='file']");
        this.uploadBenefitSummary = Selector("input[type='file']").nth(1);
        this.additionalRequests = Selector(".rfpQuoteTextarea1")
        this.additionalRequestsMedical = Selector(".rfpQuoteTextarea2")
    }

}