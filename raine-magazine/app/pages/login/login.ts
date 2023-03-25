import { Component } from '@angular/core';
import { NavController, MenuController} from 'ionic-angular';
import { TabLoginPage } from '../tab-login/tab-login';
import { TabForgotPage } from '../tab-forgot/tab-forgot';
import { TabSignupPage } from '../tab-signup/tab-signup';


/*
  Generated class for the LoginPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/login/login.html',
})
export class LoginPage {
  tabLogin : any;
  tabForgot : any;
  tabSignup : any;

  constructor(private navCtrl: NavController, public menu: MenuController) {
    this.tabLogin = TabLoginPage;
    this.tabSignup = TabSignupPage;

    // Disable the sidebarMenu in the login page (We'll re-enable it in pages/home.ts)
    menu.enable(false, 'sidebarMenu');
  }

}
