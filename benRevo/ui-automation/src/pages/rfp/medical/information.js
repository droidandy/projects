import {Selector} from 'testcafe';

export default class InformationTab {
    constructor() {
        this.saveContinue = Selector('button').withText('Save & Continue');
        this.waitingPeriod = Selector("[name='daysAfterHire'] input");
        this.howDoYouGetPaidPercent= Selector("button").withText("%");
        this.yourCommission= Selector("[name='commission']");
        this.carrierAreYouCurrently = Selector(".rpfMedicalInfoCarriers input");
        this.brokerOfRecordYes= Selector("[name='brokerRecord'][value='yes']");
        this.brokerOfRecordNo= Selector("[name='brokerRecord'][value='no']");
        this.yearsHaveYouBeenWithCarrier = Selector("[name='carriers'] div");
        this.yearsHaveYouBeenWithCarrierSelect = Selector("span").withText("1");
        this.carrierWereYouWithPreviously = Selector(".rpfMedicalInfoCarriers input").nth(1);
        this.yearsHaveYouBeenWithCarrierPreviously = Selector("[name='previousCarriers'] div");
        this.yearsHaveYouBeenWithCarrierPreviouslySelect = Selector("span").withText("2");
    }
}