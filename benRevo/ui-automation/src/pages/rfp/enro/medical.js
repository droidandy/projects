import {Selector} from 'testcafe';

export default class EnroTab {
    constructor() {
        this.saveContinue = Selector('button').withText('Save & Continue');
        this.basePlanTierOne = Selector("[name='PLAN_ENROLLMENT_TIERS-0-0']");
        this.outOfStateRatesValue = Selector("[name='PLAN_ENROLLMENT_TIERS-oos-0-0']");
    }

}