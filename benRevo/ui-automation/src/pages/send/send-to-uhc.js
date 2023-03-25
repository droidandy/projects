import {Selector} from 'testcafe';

export default class SendToUhc {
    constructor() {
        this.warningMessage = Selector('.ui.warning.message >.header');
        this.hint = Selector('.include-hint');
        this.missingInfo = Selector('.error-link');
        this.errorMessage = Selector('div').withText('To send selected RFP, you need to fill in all the fields.');
        this.submitToUhc = Selector('button').withText('Submit to UHC');
        this.submitToAnthem = Selector('button').withText('Submit to Anthem');
        this.jumpToPage = Selector('a').withText('Jump to page');
    }


}