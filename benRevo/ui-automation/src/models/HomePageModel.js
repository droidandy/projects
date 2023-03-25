import {Selector, t} from 'testcafe';

const HOME_XPATH = '#container-pusher > div > div.ui.centered.grid.block-top > div > div > div.header > div > div.ui.small.secondary.computer.large-screen.only.menu > div > a.active.item';
const LOGIN_XPATH = '#container-pusher > div > div.ui.centered.grid.block-top > div > div > div.header > div > div.ui.small.secondary.computer.large-screen.only.menu > div > a:nth-child(2)';

export default class HomePage {
    constructor() {
        this.homeButton = Selector(HOME_XPATH);
        this.loginButton = Selector(LOGIN_XPATH);
    }

    async clickHomePageLogin() {
        await t.click(this.loginButton);
    }

    async advance() {
        await t.click(this.loginButton);
    }
}