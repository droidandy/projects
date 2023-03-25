import {Selector} from 'testcafe';


export default class ProductsTab {
    constructor() {
        this.saveContinue = Selector('button').withText('Save & Continue');
        this.errorMessage = Selector(".notification-message");
        this.medicalProduct = Selector('.checked.checkbox').withText('Medical');
        this.dentalProduct = Selector('.checked.checkbox').withText('Dental');
        this.visionVirgin = Selector('.ui.radio.checkbox').nth(4);
        this.medicalVirgin = Selector('.ui.radio.checkbox').nth(0);
        this.dentalVirgin = Selector('.ui.radio.checkbox').nth(2);
        this.visionProduct = Selector('.checked.checkbox').withText('Vision');
    }

}