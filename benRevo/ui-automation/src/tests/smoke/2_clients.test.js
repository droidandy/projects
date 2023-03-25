import Login from '../../pages/login';
import ClientsPage from '../../pages/clients/clients'

const login = new Login();
const clientsPage = new ClientsPage();
fixture`Client page`
    .page`https://dev.benrevo.com/uhc/login`
    .beforeEach(async t => {
        await login.loginUser('automation@benrevo.com', 'aut0mati0n!');
    });

test('Verify client page.', async t => {
    await t
        .wait(2000)
        .expect(clientsPage.searchClient.exists).ok()
        .expect(clientsPage.searchClient.getAttribute('placeholder')).eql('Search for a client')
        .expect(clientsPage.header.textContent).eql('Clients')
        .expect(clientsPage.startNewRfp.textContent).eql('Start New RFP')
        .expect(clientsPage.importClient.textContent).eql('Already have a client from BenRevo? Import client')
        .expect(clientsPage.clientTableHeader.textContent).eql('Client')
        .click(clientsPage.clientTableHeader)
        .expect(clientsPage.effectiveDateTableHeader.textContent).eql('Effective Date')
        .click(clientsPage.effectiveDateTableHeader)
        .expect(clientsPage.statusTableHeader.textContent).eql('Status')
        .click(clientsPage.statusTableHeader)
        .expect(clientsPage.actionsTableHeader.textContent).eql('Actions')
        .click(clientsPage.actionBun)
        .expect(clientsPage.rfpItem.textContent).eql('RFP')
        .expect(clientsPage.exportClientItem.textContent).eql('Export Client')
        .expect(clientsPage.quoteItem.textContent).eql('Quote')
        .expect(clientsPage.onBoardingItem.textContent).eql('On-Boarding')
        .expect(clientsPage.teamItem.textContent).eql('Team')


});
