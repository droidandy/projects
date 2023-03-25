import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TermsPage } from '../../pages/terms/terms';
import { DataProvider } from '../../providers/data';
import { AlertProvider } from '../../providers/alert';
import { LoadingProvider } from '../../providers/loading';
import { LoginPage } from '../../pages/login/login';
import { HomePage } from '../../pages/home/home';


import * as firebase from 'firebase';

@Component({
  selector: 'page-locationbase',
  templateUrl: 'locationbase.html',
})
export class LocationbasePage {
  registerData:any;
  isTerms:boolean=false;
  location:any='';
  constructor(public loadingProvider: LoadingProvider,public alertProvider: AlertProvider,public dataProvider: DataProvider,public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.registerData = this.navParams.get('data');
    console.log('ionViewDidLoad LocationbasePage',this.registerData);
  }

  openTerms(){
    this.navCtrl.push(TermsPage);
  }

  register(){

    if(this.location==''){
      this.alertProvider.showSucessMessage('please enter location');
    }else if(!this.isTerms){
      this.alertProvider.showSucessMessage('you must agree to the terms and conditions.');

    }else{
      this.loadingProvider.show();
      localStorage.setItem('isTerms','true');
      if(this.registerData.provider=='Facebook'){
        let user=firebase.auth().currentUser;
        console.log('user1===',user);
        let dateCreated= new Date();
        firebase.database().ref('accounts/'+user.uid).set({
          dateCreated,
          username:this.registerData.username,
          name: this.registerData.name,
          role: this.registerData.role,
          city:this.location,
          userId:user.uid,
          email:user.email,
          description:"I am available",
          provider:this.registerData.provider,
          img:this.registerData.img,
          update_at:new Date().getTime()
        });
        this.loadingProvider.hide();
        this.navCtrl.setRoot(HomePage);

      }else{

        firebase.auth().createUserWithEmailAndPassword(this.registerData.email, this.registerData.password)
          .then((success) => {

            let user=firebase.auth().currentUser;
            console.log('user===',user);
            user.sendEmailVerification();
            let dateCreated= new Date();
            firebase.database().ref('accounts/'+user.uid).set({
              dateCreated,
              username:this.registerData.username,
              name: this.registerData.name,
              role: this.registerData.role,
              city:this.location,
              userId:user.uid,
              email:user.email,
              description:"I am available",
              provider:this.registerData.provider,
              img:this.registerData.img,
              update_at:new Date().getTime()
            });
            this.loadingProvider.hide();
            this.navCtrl.setRoot(LoginPage);
          })
          .catch((error) => {
            this.loadingProvider.hide();
            let code = error["code"];
            this.alertProvider.showErrorMessage(code);
          });
      }

    }

    //this.loginProvider.facebookLogin();

  }

}
