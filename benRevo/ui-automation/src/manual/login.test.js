import HomePage from '../models/HomePageModel';
import Login from '../models/LoginModel';
import {BENREVO_WEBSITE} from '../../config.js';

fixture `User Authentication Test`
    .page `${BENREVO_WEBSITE}`;

// Page models
const homePage = new HomePage();
const login = new Login();

/**
 Tests are below
 **/
test('opens login page', async t => {
    await homePage.clickHomePageLogin();
    const location = await t.eval(() => window.location);
    await t.expect(location.pathname.indexOf("/login")).notEql(-1);
});

test('sign in a user', async t => {
    await homePage.clickHomePageLogin();
    await login.fillInputsAndLoginAndLogin();
    const location = await t.eval(() => window.location);
    setTimeout(function () {
        t.expect(location.pathname.indexOf("/clients")).notEql(-1);
    }, 2000);
});