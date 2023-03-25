import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validator } from '../../validator';
import { AlertProvider } from '../../providers/alert';
import { LoginProvider } from '../../providers/login';

/**
 * Generated class for the ForgotpasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-forgotpassword',
  templateUrl: 'forgotpassword.html',
})
export class ForgotpasswordPage {

  private emailForm: FormGroup;

  constructor(public loginProvider: LoginProvider,public alertProvider: AlertProvider,public formBuilder: FormBuilder,public navCtrl: NavController, public navParams: NavParams) {

    this.emailForm = formBuilder.group({
      email: Validator.emailValidator
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotpasswordPage');
  }

  openResetpassword(){
    //this.navCtrl.push(ResetpasswordPage);
    if(this.emailForm.valid){

        console.log(this.emailForm.value["email"]);
        this.loginProvider.sendPasswordReset(this.emailForm.value["email"]);
    }else{

      this.alertProvider.showSucessMessage('Email invalid');
    }
  }

}
