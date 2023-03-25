import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import {TabForgotPage} from '../tab-forgot/tab-forgot';
import {HomePage} from '../home/home';
import {App} from 'ionic-angular';

/*
  Generated class for the TabLoginPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/tab-login/tab-login.html',
})
export class TabLoginPage {
  forgotPage = TabForgotPage;
  homePage = HomePage;
  constructor(private navCtrl: NavController, private toastController : ToastController, private app: App, public loadingController: LoadingController) {

  }

  presentToast() {
    let toast = this.toastController.create({
      message: 'Invalid Login',
      duration: 4000,
      position: 'top',
      cssClass: 'toast-message-error',
      showCloseButton : true
    })

    toast.present();

  }

  openPage(page) {
    // this.navCtrl.push(page);
    this.app.getRootNav().setRoot(HomePage, {}, {animate: true, direction: 'forward'});
  }

  presentLoading() {
    let loader = this.loadingController.create({
      content: `<div class='app-spinner'></div>`,
      //content: `Please wait...`,
      //spinner: 'bubbles',
      dismissOnPageChange: true //very important.
    });

    loader.present();

    //TimeOut to simulate loggin in. When done use the openPage(HomePage) function
    //the '=>' is to maintain context
    setTimeout(()=>{
      loader.dismiss();
      this.authenticateUser();
    }, 500);

  }

  authenticateUser() {
    //Up to you in implementing an authentication system.

        //On Successful authentication, Proceed to Homepage by setting it as root
        this.openPage(HomePage);

        //On Faliure, presentToast(). Commented out
        // this.presentToast();
  }

}
