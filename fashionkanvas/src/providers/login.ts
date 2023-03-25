import { Injectable, NgZone } from '@angular/core';
import { Settings } from '../settings';
import { NavController, Platform, ToastController, AlertController } from 'ionic-angular';
import { LoadingProvider } from './loading';
import { AlertProvider } from './alert';
import { DataProvider } from './data';
import { RegisterrolePage } from '../pages/registerrole/registerrole';

import { LoginPage } from '../pages/login/login';

// import { Http } from '@angular/http';

import * as firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';

import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook } from '@ionic-native/facebook';

@Injectable()
export class LoginProvider {

  private navCtrl: NavController;
  constructor(public dataProvider: DataProvider,public loadingProvider: LoadingProvider, public alertProvider: AlertProvider, public zone: NgZone, public googleplus: GooglePlus,
    public platform: Platform, public afAuth: AngularFireAuth, public toastCtrl: ToastController, public facebook: Facebook, public alert: AlertController) {
      console.log('nav',this.navCtrl);
      this.loadingProvider.show();
      let that =this;
      firebase.auth().onAuthStateChanged((user) => {

        console.log('user===',user);
        if (user&&user.emailVerified) {
          that.loadingProvider.hide();
          that.zone.run(() => {
            that.navCtrl.setRoot(Settings.homePage, { animate: false });
          });
        }else if(user&&!user.emailVerified){
          //alert('please verfiy this email');
          user.providerData.forEach(function (profile:any) {
            console.log('Sign-in provider: ' + profile.providerId);
            if(profile.providerId!=='facebook.com'){
              that.loadingProvider.hide();
              user.sendEmailVerification();
              that.alertProvider.showSucessMessage('A verification link has been sent to your email account');
              firebase.auth().signOut()
            }else{

              firebase.database().ref('/accounts/' + firebase.auth().currentUser.uid).once('value').then(function(user) {
                let currentUser = user.val();
                console.log('currentUser====',user);
                that.loadingProvider.hide();
                if(currentUser.role==null){
                  let data ={
                    dateCreated:currentUser.dateCreated,
                    email:currentUser.email,
                    username: currentUser.username,
                    name: currentUser.name,
                    img:currentUser.img,
                    provider:currentUser.provider
                  }
                  that.navCtrl.push(RegisterrolePage,{data:data});
                }else{
                  that.zone.run(() => {
                    that.navCtrl.setRoot(Settings.homePage, { animate: false });
                  });
                }


              });

            }
          });


        }else{
          that.loadingProvider.hide();
        }
      });
  }

  setNavController(navCtrl) {
    this.navCtrl = navCtrl;
  }

  facebookLogin() {

    if(this.platform.is('core')){
      // let fbCredential;
      this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider()).then((fbRes:any)=>{
        console.log(fbRes);

        let fbcredential = firebase.auth.FacebookAuthProvider.credential(fbRes.credential.accessToken);
        console.log(fbcredential);
        this.loadingProvider.show();
        firebase.auth().signInWithCredential(fbcredential).then((success:any) => {

          let data = fbRes.additionalUserInfo.profile;
          let uid = firebase.auth().currentUser.uid;
          console.log('success=====',success.photoURL+"?width=400&height=400");
          console.log('fbRes===',data);
          if(fbRes.additionalUserInfo.isNewUser == true)
            this.createNewUser(uid,data.first_name,data.email,uid,'I am available','Facebook',success.photoURL+"?width=400&height=400",data.last_name);

          this.loadingProvider.hide();
        })
        .catch((error) => {
          console.log(error);
          this.loadingProvider.hide();
          this.alertProvider.showErrorMessage(error["code"]);
        });
      }).catch( error=>{
        console.log(error);
      });
    } else{
      this.facebook.login(['public_profile', 'email']).then( res => {
        console.log(res);
        let credential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        this.loadingProvider.show();
        firebase.auth().signInWithCredential(credential)
        .then((success) => {
          console.log('success=====',success.photoURL+"?width=400&height=400");
          this.facebook.api("me/?fields=id,email,first_name,last_name,picture",["public_profile","email"])
          .then( data => {
            console.log(data)
            let uid = firebase.auth().currentUser.uid;
            this.createNewUser(uid,data.first_name,data.email,uid,'I am available','Facebook',success.photoURL+"?width=400&height=400",data.last_name);
          })
          .catch( err => {
            console.log(err);
            this.loadingProvider.hide();
          })

        })
        .catch((error) => {
          this.loadingProvider.hide();
          this.alertProvider.showErrorMessage(error["code"]);
        });

      }).catch( err=> console.log(err));
    }
  }

  googleLogin() {
    if(this.platform.is('core')){
      this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then((gpRes:any) =>{
        console.log(gpRes);
        let credential = firebase.auth.GoogleAuthProvider.credential(gpRes.credential.idToken,gpRes.credential.accessToken);
        firebase.auth().signInWithCredential(credential)
          .then((success) => {
            console.log(success);
            let uid = firebase.auth().currentUser.uid;
            let data = gpRes.additionalUserInfo.profile;
            if(gpRes.additionalUserInfo.isNewUser == true)
              this.createNewUser(uid,name,data.email,uid,'I am available','Facebook',data.picture,'');
            this.loadingProvider.hide();
          })
          .catch((error) => {
            this.loadingProvider.hide();
            this.alertProvider.showErrorMessage(error["code"]);
          });
      }).catch( err=>{
        console.log(err)
      });
    }
    else{
      this.loadingProvider.show();
      this.googleplus.login({
        'webClientId': Settings.googleClientId
      }).then((success) => {
        console.log(success);
        let credential = firebase.auth.GoogleAuthProvider.credential(success['idToken'], null);
        firebase.auth().signInWithCredential(credential)
          .then((success) => {
            console.log(success);
            this.loadingProvider.hide();

          })
          .catch((error) => {
            this.loadingProvider.hide();
            this.alertProvider.showErrorMessage(error["code"]);
          });
      }, error => {
        console.log(error);
        this.loadingProvider.hide();
      });
    }
  }


  // Login on Firebase given the email and password.
  emailLogin(email, password) {
    this.loadingProvider.show();
    firebase.auth().signInWithEmailAndPassword(email, password).then((success) => {
        this.loadingProvider.hide();
    }).catch((error) => {
        this.loadingProvider.hide();
        this.alertProvider.showErrorMessage(error["code"]);
    });
  }

  phoneLogin(){
    // if(this.platform.is('core'))
    //   this.toastCtrl.create({message: 'AccountKit only works on device', duration: 3000}).present();
    // else{
    //   (<any>window).AccountKitPlugin.loginWithPhoneNumber({
    //     useAccessToken: true,
    //     defaultCountryCode: "IN",
    //     facebookNotificationsEnabled: true,
    //   }, data => {
    //
    //   (<any>window).AccountKitPlugin.getAccount(
    //     info => { // getting user info
    //       let phoneNumber = info.phoneNumber;
    //       this.http.get(Settings.customTokenUrl+"?access_token="+info.token).subscribe((data:any)=>{
    //         let token = data['_body'];
    //         this.loadingProvider.show();
    //         firebase.auth().signInWithCustomToken(token).then( data=>{
    //           let uid = firebase.auth().currentUser.uid;
    //           this.createNewUser(uid,phoneNumber,uid,null,'I am available','Phone','assets/images/profile.png')
    //           this.loadingProvider.hide();
    //         }).catch( err=> {
    //           this.loadingProvider.hide();
    //           console.log(err)
    //         });
    //
    //       }, err=>{
    //         console.log(err);
    //       });
    //     },
    //     err =>  console.log(err) );
    //   });
    // }
  }
  // Register user on Firebase given the email and password.
  register(name, username, email, password,img) {
    this.loadingProvider.show();
    firebase.auth().createUserWithEmailAndPassword(email, password).then((success) => {
        let user=firebase.auth().currentUser;
        this.createNewUser(user.uid, name , username,user.email,"I am available","Firebase",img,'');
        this.loadingProvider.hide();
      }).catch((error) => {
        this.loadingProvider.hide();
        this.alertProvider.showErrorMessage(error["code"]);
      });
  }

  // Send Password Reset Email to the user.
  sendPasswordReset(email) {
    console.log(email);
    if(email != null || email != undefined || email != ""){
      this.loadingProvider.show();
      firebase.auth().sendPasswordResetEmail(email).then((success) => {
          this.loadingProvider.hide();
          this.alertProvider.showPasswordResetMessage(email);
          this.navCtrl.setRoot(LoginPage, { animate: false });
        }).catch((error) => {
          this.loadingProvider.hide();
          this.alertProvider.showErrorMessage(error["code"]);
        });
    }
  }

  // Creating new user after signed up
  createNewUser(userId,username,email,socialid,description = "I'm available",provider,img="assets/images/profile.png",last_name){
    let dateCreated= new Date();
    let data ={
      userId:userId,
      username:username,
      name:last_name,
      socialid:socialid,
      email:email,
      description:description,
      provider:provider,
      img:img,
      update_at:new Date().getTime(),
      dateCreated:dateCreated
    }

    console.log(data);
    firebase.database().ref('accounts/'+userId).update(data);
  }

}
