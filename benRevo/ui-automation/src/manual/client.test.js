import HomePage from '../models/HomePageModel';
import Login from '../models/LoginModel';
import Client from '../models/ClientModel';
import { BENREVO_WEBSITE } from '../../config.js';

// Page models
const homePage          = new HomePage();
const login             = new Login();
const client            = new Client();

/**
    Tests are below
**/

fixture `Client Test`
    .page `${BENREVO_WEBSITE}`
    .beforeEach( async t => {
        await homePage.clickHomePageLogin();
        await login.fillInputsAndLoginAndLogin();
        const location = await t.eval(() => window.location);
        setTimeout(function(){
            t.expect(location.pathname.indexOf("/clients")).notEql(-1);
        }, 2000);
    });

test('creates a new client successfully', async t => {
    await client.clickAddClientButton();
    await client.completeForm();
    await client.continue();
    let location = await t.eval(() => window.location);
    await t.expect(location.pathname.indexOf("/rfp/medical/information")).notEql(-1);
    await client.clickClientTopNavButton();
    await client.validateClientExistsOnClientPage();
});