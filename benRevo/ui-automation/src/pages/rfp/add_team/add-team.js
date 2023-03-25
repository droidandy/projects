import {Selector} from 'testcafe';

export default class AddTeamTab {
    constructor() {
        this.setTeam = Selector("input[type='checkbox']");
        this.saveContinue = Selector('button').withText('Save & Continue');
        this.errorManageTeam = Selector(".header");
        this.selectTeamHeader = Selector('.ui.header.sub-heading');
    }


}