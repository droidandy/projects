import HomePage from '../models/HomePageModel';
import Login from '../models/LoginModel';
import Runner from '../utils/Runner';
import {Constants} from '../Constants';
import {BENREVO_WEBSITE} from '../../config.js';

// Page models
const homePage = new HomePage();
const login = new Login();
const runner = new Runner();

/**
 Tests are below
 **/

fixture `RFP Test`
    .page `${BENREVO_WEBSITE}`
    .beforeEach(async t => {
        await homePage.clickHomePageLogin();
        await login.fillInputsAndLoginAndLogin();
        const location = await t.eval(() => window.location);
        setTimeout(function () {
            t.expect(location.pathname.indexOf("/clients")).notEql(-1);
        }, 2000);
    });

test('successfully completes the entire RFP process', async t => {
    await runner.runUntil(Constants.RUNNER.PAGES.HOMEPAGE, Constants.RUNNER.PAGES.RFP_MEDICAL_OPTIONS);

});