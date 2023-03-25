import {Selector} from 'testcafe';


export default class ClientsPage {

    constructor() {
        this.startNewRfp = Selector('.new-client-button');
        this.frameChat = Selector("[data-test-id='ChatWidgetWindow-iframe']");
        this.closeHelpDesk = Selector("[title='Minimize']");
        this.searchClient = Selector('input');
        this.continue = Selector('button').withText('Continue');
        this.header = Selector('.page-heading');
        this.importClient = Selector('.import-client-button');
        this.clientTableHeader = Selector('thead th:nth-child(1)');
        this.effectiveDateTableHeader = Selector('thead th:nth-child(2)');
        this.statusTableHeader = Selector('thead th:nth-child(3)');
        this.membersTableHeader = Selector('thead th:nth-child(4)');
        this.actionsTableHeader = Selector('thead th:nth-child(5)');
        this.actionBun = Selector('.ui.button >div');
        this.rfpItem = Selector('.menu.transition.visible a:nth-child(1)');
        this.exportClientItem = Selector('.menu.transition.visible a:nth-child(2)');
        this.quoteItem = Selector('.menu.transition.visible a:nth-child(3)');
        this.onBoardingItem = Selector('.menu.transition.visible a:nth-child(4)');
        this.teamItem = Selector('.menu.transition.visible a:nth-child(6)');

    }
}

