import {Selector} from 'testcafe';

export default class InformationTab {
    constructor() {
        this.saveContinue = Selector("button").withText('Save & Continue');
        this.clientNameHeader = Selector(".clientName span");
        this.clientName = Selector("[name='clientName']");
        this.sicCode = Selector("[name='sicCode']");
        this.employeeCount = Selector("[name='employeeCount']");
        this.eligibleEmployees = Selector("[name='eligibleEmployees']");
        this.participatingEmployees = Selector("[name='participatingEmployees']");
        this.membersCount = Selector("[name='membersCount']");
        this.retireesCount = Selector("[name='retireesCount']");
        this.cobraCount = Selector("[name='cobraCount']");
        this.address = Selector("[name='address']");
        this.city = Selector("[name='city']");
        this.state = Selector("[name='state'] input");
        this.zip = Selector("[name='zip']");
        this.minimumHours = Selector("[name='minimumHours']");
        this.domesticPartner = Selector("[name='domesticPartner'] input");
        this.outToBidReason = Selector("[name='outToBidReason']");
        this.effectiveDate = Selector("[name='effectiveDate'].datepicker");
        this.dueDate = Selector("[name='dueDate'].datepicker");
        this.predominantCounty = Selector("[name='predominantCounty'] input");
        this.averageAge = Selector("[name='averageAge']");
    }
}