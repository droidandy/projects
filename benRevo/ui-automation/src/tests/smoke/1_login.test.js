import Login from '../../pages/login';
import {BENREVO_WEBSITE} from '../../../config.js';

const login = new Login();

fixture `Login page`
    .page `${BENREVO_WEBSITE}/uhc/login`

;

test('Verify login page', async t => {

    await t
        .wait(3000)
        .expect(login.logoImg.exists).ok()
        .expect(login.homeBtn.exists).ok()
        .expect(login.loginHeaderBtn.exists).ok()
        .expect(login.loginTitle.textContent).eql("Login")
        .expect(login.resetPassword.textContent).eql("Click here to reset your password")
    ;

});

test('Login with invalid credentials', async t => {
    await login.loginUser('auto__test_invalid@mail.com', 'pwds');
    await login.checkWarningMessage('Wrong email or password.');
});

test('Login with valid credentials', async t => {

    await login.loginUser('automation@benrevo.com', 'aut0mati0n!');
    const location = await t.eval(() => window.location);
    setTimeout(function () {
        t.expect(location.pathname.indexOf("/clients")).notEql(-1);
    }, 2000);

});


