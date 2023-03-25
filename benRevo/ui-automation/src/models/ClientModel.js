import {Selector, t} from 'testcafe';
import Util from '../utils/Util';
import {Constants} from '../Constants';

const ADD_CLIENT_SELECTOR = "#container-pusher > div:nth-child(2) > div > div > div > div > div > a";
const CONTINUE_SELECTOR = "#container-pusher > div.rfpBlock > div.ui.container.stackable.two.column.grid.medicalRfpMainContainer.section-wrap > div > div.thirteen.wide.column > div > div > div:nth-child(4) > div.pageFooterActions > button";
const CLIENTS_SELECTOR = "#container-pusher > div.jZrORm > div > div > div.ui.small.secondary.computer.large-screen.only.menu > div > a";


const date = new Date();
const util = new Util();


const clientFields = {
    "input": {
        "clientName": "Benrevo-UI-Automation-#" + date.getTime(),
        "sicCode": "112233",
        "employeesTotal": "10",
        "employeesCount": "10",
        "participatingEmployees": "10",
        "totalMembers": "10",
        "totalRetirees": "10",
        "cobraEnrollees": "10",
        "clientsHeadquarters": "101 Broadway Street",
        "city": "San Diego",
        "hqState-search": "California",
        "zipCode": "92101",
        "situsState-search": "California",
        "minimumHours": "10",
        "effectiveDate": util.getTodaysDate(),
        "dueDate": util.getTodaysDate(),
        "domesticPartner-search": "Broad"
    }
}


export default class ClientPage {
    constructor() {
        this.addClientButton = Selector(ADD_CLIENT_SELECTOR);
        this.continueButton = Selector(CONTINUE_SELECTOR);
        this.clientsTopNavButton = Selector(CLIENTS_SELECTOR);

        this.clientInfo = clientFields['input'];
    }

    async clickAddClientButton() {
        await t.click(this.addClientButton);
    }

    async completeForm() {
        await t.setTestSpeed(0.7);
        for (var elem in clientFields) {
            for (var key in clientFields[elem]) {
                if (clientFields[elem].hasOwnProperty(key)) {
                    if (elem == "input") {
                        var options = {
                            withAttribute: {
                                attributeName: "name",
                                attributeValue: key
                            }
                        };
                        let inputField = util.getElementsByTagName(elem, options);
                        await t.typeText(inputField, clientFields[elem][key]);
                    }
                }
            }
        }
        await t.setTestSpeed(1);
    }

    async continue() {
        await t.click(this.continueButton);
    }

    async clickClientTopNavButton() {
        await t.click(this.clientsTopNavButton);
    }

    async validateClientExistsOnClientPage() {
        var options = {
            withText: {
                textValue: this.clientInfo.clientName,
            }
        }
        let field = util.getElementsByTagName(Constants.TAGS.STRONG, options);
        await t.expect(field).ok("Client exists on clients page");
    }
}