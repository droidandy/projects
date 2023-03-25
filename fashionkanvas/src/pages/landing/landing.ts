import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../../pages/login/login';
import { TermsPage } from '../../pages/terms/terms';
import { RegisterPage } from '../../pages/register/register';
import { LoginProvider } from '../../providers/login';
import { AlertProvider } from '../../providers/alert';
import { Platform } from 'ionic-angular';
/**
 * Generated class for the LandingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-landing',
  templateUrl: 'landing.html',
})
export class LandingPage {

  isTerms:boolean = false;
  isIos:boolean = false;
  constructor(public plt: Platform,public alertProvider: AlertProvider,public loginProvider: LoginProvider,public navCtrl: NavController, public navParams: NavParams) {

    this.loginProvider.setNavController(this.navCtrl);
    if(localStorage.getItem('isTerms') == 'true') this.isTerms = true;
    else this.isTerms = false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LandingPage');
    if(this.plt.is('ios')){
      this.isIos = true;
    }else{
      this.isIos = false;
    }
  }

  openLogin(){
    this.navCtrl.push(LoginPage);
  }

  openRegister(){
    this.navCtrl.push(RegisterPage);
  }

  openTerms(){
    this.navCtrl.push(TermsPage);
  }

  facebookLogin(){
    if(this.isTerms||!this.isIos){
      localStorage.setItem('isTerms','true');
      this.loginProvider.facebookLogin();
    }else{
      this.alertProvider.showSucessMessage('you must agree to the terms and conditions.');

    }

    //this.loginProvider.facebookLogin();

  }

}
