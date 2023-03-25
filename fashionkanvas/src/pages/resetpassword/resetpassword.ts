import { Component } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';
import { ResetconfirmpasswordPage } from '../../pages/resetconfirmpassword/resetconfirmpassword';
/**
 * Generated class for the ResetpasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-resetpassword',
  templateUrl: 'resetpassword.html',
})
export class ResetpasswordPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResetpasswordPage');
  }

  openResetconfirmpassword(){
    this.navCtrl.push(ResetconfirmpasswordPage);
  }

}
