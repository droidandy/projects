import {Selector} from 'testcafe';

export default class ContributionTab {
    constructor() {
        this.saveContinue = Selector('button').withText('Save & Continue');
        this.medical = Selector('span').withText('Medical');
        this.howMuchDoesTheEmployerContribute = Selector("[name='planTiers-0-0']");
        this.outOfStateContributionValue = Selector("[name='planTiers-oos-0-0']");
        this.outOfStateContribution = Selector("input[type='checkbox']");
   
    }

}