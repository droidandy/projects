import {Selector} from 'testcafe';

export default class CurrentOptionsTab {
    constructor() {
        this.saveContinue = Selector('button').withText('Save & Continue');
        this.carrier = Selector("[name='plans'] input").nth(0);
        this.type = Selector("[name='plans'] input").nth(1);
        this.networkName = Selector("[name='plans'] input").nth(2);
        this.incumbentPlanName = Selector("input[name='plans']");
    }

}