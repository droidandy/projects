import {Selector} from 'testcafe';

export default class RatesTab {
    constructor() {
        this.saveContinue = Selector('button').withText('Save & Continue');
        this.basePlanTierOne = Selector("[name='PLAN_CURRENT_TIERS-0-0']");
        this.outOfStateRatesValue =Selector("[name='PLAN_CURRENT_TIERS-oos-0-0']");
        this.renewalTierOne =Selector("[name='PLAN_RENEWAL_TIERS-0-0']");
        this.renewalOutOfStateRatesValue =Selector("[name='PLAN_RENEWAL_TIERS-oos-0-0']");
    }



}