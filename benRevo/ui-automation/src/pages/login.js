import {Selector, t} from 'testcafe';

export default class Login {
    constructor() {
        this.logoImg = Selector("[alt='Logo']");
        this.homeBtn = Selector("span").withText("Home");
        this.loginHeaderBtn = Selector("span").withText("Login");
        this.loginTitle = Selector("[title='Login']");
        this.resetPassword = Selector(".auth0-lock-alternative-link");
        this.loginEmailInput = Selector("[name='email']");
        this.loginPswdInput = Selector("[name='password']");
        this.loginButton = Selector(".auth0-lock-submit");
        this.warning = Selector(".fadeInUp span");
    }
    async loginUser(login, password) {
        await t
            .typeText(this.loginEmailInput, login)
            .typeText(this.loginPswdInput, password)
            .click(this.loginButton);
    }
    async checkWarningMessage(message) {
        await t.expect(Selector(this.warning).textContent).eql(message);
    }
}