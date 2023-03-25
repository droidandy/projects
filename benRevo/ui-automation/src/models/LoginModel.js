import {Selector, t} from 'testcafe';

const LOGIN_TEXT = "[title='Login']";
const LOGIN_EMAIL_INPUT = "[name='email']";
const LOGIN_PSWD_INPUT = "[name='password']";
const LOGIN_BUTTON = "[type='submit']";

export default class Login {
    constructor() {
        this.loginText = Selector(LOGIN_TEXT);
        this.loginEmailInput = Selector(LOGIN_EMAIL_INPUT);
        this.loginPswdInput = Selector(LOGIN_PSWD_INPUT);
        this.loginButton = Selector(LOGIN_BUTTON);
    }

    async fillInputsAndLoginAndLogin() {
        await t
            .typeText(this.loginEmailInput, 'automation@benrevo.com')
            .typeText(this.loginPswdInput, 'aut0mati0n!')
            .click(this.loginButton);
    }

}