import { Component } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { LoginProvider } from '../../providers/login';
import { TermsPage } from '../../pages/terms/terms';
import { RegisterrolePage } from '../../pages/registerrole/registerrole';
import { Validator } from '../../validator';

import { LoadingProvider } from '../../providers/loading';
import { AlertProvider } from '../../providers/alert';
import { ImageProvider } from '../../providers/image';
import { Validators } from '@angular/forms';
import * as firebase from 'firebase';



@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  private emailPasswordForm: FormGroup;
  private emailForm: FormGroup;
  img = "http://placehold.it/80X80";
  isTerms:boolean = false;

  constructor(private keyboard: Keyboard, public loadingProvider: LoadingProvider, public alertProvider: AlertProvider, public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public loginProvider: LoginProvider,  public imageProvider: ImageProvider, public formBuilder: FormBuilder,
  public alertCtrl: AlertController,
  ) {
    this.keyboard.hideFormAccessoryBar(false);

    if(localStorage.getItem('isTerms') == 'true') this.isTerms = true;
    else this.isTerms = false;

    this.emailPasswordForm = formBuilder.group({
      email: Validator.emailValidator,
      password: ['', [Validators.required]],
      firstname: Validator.fullnameValidator,
      lastname: ['', [Validators.required]],
      isTerms:[this.isTerms,[]]
    });
    this.emailForm = formBuilder.group({
      email: Validator.emailValidator,
      password: Validators.required,
      firstname: Validator.fullnameValidator,
      lastname: Validator.usernameValidator
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  register(){
    //this.navCtrl.push(RegisterrolePage,{data:{}});
    if(this.emailPasswordForm.valid){

        //this.loadingProvider.show();
        var email = this.emailPasswordForm.value["email"].charAt(0).toLowerCase() + this.emailPasswordForm.value["email"].slice(1);
        let dateCreated= new Date();
        let data ={
          dateCreated,
          email:email,
          username: this.emailPasswordForm.value["firstname"],
          name: this.emailPasswordForm.value["lastname"],
          img:this.img,
          password:this.emailPasswordForm.value["password"],
          provider:'Email'
        }
        this.navCtrl.push(RegisterrolePage,{data:data});



    }else{

        if(!this.emailPasswordForm.controls.firstname.valid){
            this.alertProvider.showSucessMessage('Firstname required');
        }else if(!this.emailPasswordForm.controls.lastname.valid){
            this.alertProvider.showSucessMessage('Lastname required');
        }else if(!this.emailPasswordForm.controls.email.valid){
            this.alertProvider.showSucessMessage('Email invalid');
        }else if(!this.emailPasswordForm.controls.password.valid){
            this.alertProvider.showSucessMessage('Password required');
        }
    }
  }

  closeModel(){
    this.viewCtrl.dismiss();
  }

  openTerms(){
    this.navCtrl.push(TermsPage);
  }

  openRoleregister(){
    this.navCtrl.push(RegisterrolePage);
  }
}
