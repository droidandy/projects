import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController,Platform,App,ActionSheetController } from 'ionic-angular';
import { DataProvider } from '../../providers/data';
import { LoadingProvider } from '../../providers/loading';
import { FirebaseProvider } from '../../providers/firebase';
import { MessagePage } from '../message/message';
import { BlockedlistPage } from '../blockedlist/blockedlist';
import * as firebase from 'firebase';
import { LogoutProvider } from '../../providers/logout';
import { Firebase } from '@ionic-native/firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { Camera } from '@ionic-native/camera';
import { ImageProvider } from '../../providers/image';
import { AlertProvider } from '../../providers/alert';
import { Validator } from '../../validator';
import { TranslateService } from '@ngx-translate/core';
import { AppRate } from '@ionic-native/app-rate';
import { EmailComposer } from '@ionic-native/email-composer';

import { Instagram } from "ng2-cordova-oauth/core";
import { OauthCordova } from 'ng2-cordova-oauth/platform/cordova';
import { UserService } from '../../providers/user-service';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  showOnline: any = false;
  isPushEnabled: any = false;
  isBrowser: any = false;
  language:any;
  user:any;
   private oauth: OauthCordova = new OauthCordova();
   private instagramProvider: Instagram = new Instagram({
       clientId: "806b9ab60bab4d45a2242be58aa775c3",      // Register you client id from https://www.instagram.com/developer/
       redirectUri: 'http://localhost',  // Let is be localhost for Mobile Apps
       responseType: 'token',   // Use token only
       appScope: ['basic','public_content']

       /*
       appScope options are

       basic - to read a user’s profile info and media
       public_content - to read any public profile info and media on a user’s behalf
       follower_list - to read the list of followers and followed-by users
       comments - to post and delete comments on a user’s behalf
       relationships - to follow and unfollow accounts on a user’s behalf
       likes - to like and unlike media on a user’s behalf

       */
   });

   private apiResponse;
   private instagramImageList:any=[];

  constructor(private userService:UserService,private emailComposer: EmailComposer,private appRate: AppRate,public translate: TranslateService,public alertProvider: AlertProvider,public imageProvider: ImageProvider,public camera: Camera,public angularfire: AngularFireDatabase,public fcm: Firebase,public app:App,public platform: Platform,public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public dataProvider: DataProvider,
    public actionSheetCtrl: ActionSheetController,public logoutProvider: LogoutProvider,public loadingProvider: LoadingProvider, public alertCtrl: AlertController, public firebaseProvider: FirebaseProvider) {

     this.apiResponse = [];

    this.logoutProvider.setApp(this.app);
    if(this.platform.is('core')) this.isBrowser = true;

    if(localStorage.getItem('isPushEnabled') == 'true') this.isPushEnabled = true;
    else this.isPushEnabled = false;

    if(localStorage.getItem('showOnline') == 'true') this.showOnline = true;
    else this.showOnline = false;

    if(localStorage.getItem('isLanguage')) this.language = localStorage.getItem('isLanguage');
    else this.language = 'en';

    if(this.platform.is('cordova')){
      this.appRate.preferences.storeAppURL = {
        ios: '1439586559',
        android: 'market://details?id=com.fashion.kanvas',
        windows: ''
      };
    }



  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
    this.loadingProvider.show();
    this.dataProvider.getCurrentUser().snapshotChanges().subscribe((user:any) => {
      this.loadingProvider.hide();
      this.user = user.payload.val();
      this.instagramImageList =[];
      for(let data in this.user.instagram){
        this.instagramImageList.push({...this.user.instagram[data],id:data});
      }
      console.log('this.user====',this.user);
      this.loadingProvider.hide();
    })
  }

  changeNotification(){

    console.log(this.isPushEnabled);
    if(this.isPushEnabled == true){
      //Registering for push notification
      this.fcm.hasPermission().then((data:any) => {
        if(data.isEnabled != true){
          this.fcm.grantPermission().then( data => {
            console.log(data);
          });
        }
        else{
          this.fcm.getToken().then( token => {
            console.log(token);
            this.angularfire.object('/accounts/' + firebase.auth().currentUser.uid).update({pushToken: token});
            localStorage.setItem('isPushEnabled','true');
            this.isPushEnabled = true;
          }).catch( err=> {
            console.log(err);
          });
          this.fcm.onTokenRefresh().subscribe(token =>{
            console.log(token);
            this.angularfire.object('/accounts/' + firebase.auth().currentUser.uid).update({ pushToken: token });
          });
        }
      });
      this.fcm.onNotificationOpen().subscribe((data:any) => {
        console.log(data);
      });
    }
    else{
      this.isPushEnabled == false;
      this.angularfire.object('/accounts/' + firebase.auth().currentUser.uid).update({ pushToken: '' });
      localStorage.setItem('isPushEnabled','false');
    }
  }

  onSelectChange(language){

    console.log('language===',language);
    localStorage.setItem('isLanguage',language);
    this.translate.setDefaultLang('en');
    this.translate.use(language);
  }

  openBlockList(){

    this.navCtrl.push(BlockedlistPage);
  }

  logOut(){

    this.logoutProvider.logout();
  }

  openAppStore(){
    console.log('openappstore');
    this.appRate.promptForRating(true);
  }

  openMail(){
    console.log('openemail');
    let email = {
      to: 'fashionkanvas@gmail.com',
      cc: '',
      attachments: [],
      subject: 'Help us Improve',
      body: '',
      isHtml: true
    };

// Send a text message using default options
    this.emailComposer.open(email);
  }

  connectInstagram(){

    console.log('this.instagramProvider==',this.instagramProvider);

    this.loadingProvider.show();
    this.oauth.logInVia(this.instagramProvider).then((success) => {

         console.log('connect instagram provider==',JSON.stringify(success));
         //8560265907.f563023.960bbdec338a448ea2de380b58f05f16
         /* Returns User uploaded Photos */
         this.userService.getInstagramUserInfo(success).subscribe(
               getData => {
               this.apiResponse=getData.json();
               console.log(this.apiResponse);
               if(this.apiResponse.data){

                 let postData = this.apiResponse.data
                 this.instagramImageList =[];
                 for(let data in postData){
                     this.instagramImageList.push(postData[data].images.standard_resolution)
                     firebase.database().ref('accounts/'+firebase.auth().currentUser.uid+'/instagram/'+postData[data].id).update(postData[data].images.standard_resolution);

                 }
                 console.log(this.instagramImageList);

               }
         });

     }, (error) => {
          this.loadingProvider.hide();
         console.log(JSON.stringify(error));
     });

  }

}
