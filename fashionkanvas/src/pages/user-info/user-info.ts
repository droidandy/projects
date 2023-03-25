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
import { SettingsPage } from '../../pages/settings/settings';
import { EditprofilePage } from '../../pages/editprofile/editprofile';
import { AddexperiencePage } from '../../pages/addexperience/addexperience';
import { AddeducationPage } from '../../pages/addeducation/addeducation';

import { Instagram } from "ng2-cordova-oauth/core";
import { OauthCordova } from 'ng2-cordova-oauth/platform/cordova';
import { UserService } from '../../providers/user-service';

@Component({
  selector: 'page-user-info',
  templateUrl: 'user-info.html'
})
export class UserInfoPage {
  private user: any;
  private userId: any;
  private friendRequests: any;
  private requestsSent: any;
  private friends: any;
  private alert: any;
  showOnline: any = false;
  isPushEnabled: any = false;
  isBrowser: any = false;
  language:any;
  imagesList:any=[];
  expereince:any=[];
  education:any=[];
  instagramImageList:any=[];
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

  // UserInfoPage
  // This is the page where the user can view user information, and do appropriate actions based on their relation to the current logged in user.
  constructor(private userService:UserService,public translate: TranslateService,public alertProvider: AlertProvider,public imageProvider: ImageProvider,public camera: Camera,public angularfire: AngularFireDatabase,public fcm: Firebase,public app:App,public platform: Platform,public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public dataProvider: DataProvider,
    public actionSheetCtrl: ActionSheetController,public logoutProvider: LogoutProvider,public loadingProvider: LoadingProvider, public alertCtrl: AlertController, public firebaseProvider: FirebaseProvider) {

      this.logoutProvider.setApp(this.app);
      if(this.platform.is('core')) this.isBrowser = true;

      if(localStorage.getItem('isPushEnabled') == 'true') this.isPushEnabled = true;
      else this.isPushEnabled = false;

      if(localStorage.getItem('showOnline') == 'true') this.showOnline = true;
      else this.showOnline = false;

      if(localStorage.getItem('isLanguage')) this.language = localStorage.getItem('isLanguage');
      else this.language = 'en';

      console.log('this.language===',this.language);
    }

    ionViewDidLoad() {
      // Observe the userData on database to be used by our markup html.
      // Whenever the userData on the database is updated, it will automatically reflect on our user variable.
      this.loadingProvider.show();
      this.dataProvider.getCurrentUser().snapshotChanges().subscribe((user:any) => {
        this.loadingProvider.hide();
        this.user = user.payload.val();
        if(this.user.expereince){
          this.expereince =[];
          for(let data in this.user.expereince){
            console.log(this.user.expereince[data])
            let diff ='';
            if(!this.user.expereince[data].isLast){
              diff = this.dataProvider.calcDate(new Date(),new Date(this.user.expereince[data].endDate));
            }else{
              diff = this.dataProvider.calcDate(new Date(),new Date(this.user.expereince[data].startDate));
            }
            this.user.expereince[data].isFullDescription = false;
            this.user.expereince[data].shortDescription = this.user.expereince[data].description.substring(0, 150);
            this.user.expereince[data].diffDate = "NOW("+diff+")";
            this.expereince.push({...this.user.expereince[data],id:data});
          }
          this.expereince.reverse();
          this.education =[];
          for(let data in this.user.education){
            this.user.education[data].isFullDescription = false;
            this.user.education[data].shortDescription = this.user.education[data].description.substring(0, 150);
            this.education.push({...this.user.education[data],id:data});
          }
          this.education.reverse();
          this.instagramImageList =[];
          for(let data in this.user.instagram){
            this.instagramImageList.push({...this.user.instagram[data],id:data});
          }
          console.log('this.instagramImageList,',this.instagramImageList);

        }
        console.log('this.user====',this.user);
        if(this.user.photos){

            this.imagesList = [];
            var tempList=[];
            for(let data in this.user.photos){

                let subdata ={
                    key:data,
                    img:this.user.photos[data].img,
                }

                tempList.push(subdata);
            }
            var firstindexKey =-1;
            for(let key in tempList){

                  if(tempList[key].key==this.user.favouriteimage){

                      console.log('keymatched======',key);
                      firstindexKey = Number(key);
                      this.imagesList.push(tempList[key]);
                  }
            }
            for(let key in tempList){

                  if(firstindexKey!=Number(key)){

                      this.imagesList.push(tempList[key]);
                  }
            }
        }

        console.log('inn====',this.imagesList);
      });
    }

  block(){
    console.log("block function");
    firebase.database().ref('accounts/'+firebase.auth().currentUser.uid+'/conversations/'+this.userId).update({
      blocked: true
    });

  }

  onSelectChange(language){

    console.log('language===',language);
    localStorage.setItem('isLanguage',language);
    this.translate.setDefaultLang('en');
    this.translate.use(language);
  }

  changeStatus(){
    console.log(this.showOnline);
    localStorage.setItem('showOnline',this.showOnline);
    this.angularfire.object('accounts/'+this.user.userId).update({
      online: this.showOnline
    });
  }

  updateProfile(){

    console.log(this.user);
    let data ={
        username:this.user.username,
        name:this.user.name==undefined ? "" : this.user.name,
        role:this.user.role==undefined ? "" : this.user.role,
        city:this.user.city==undefined ? "" : this.user.city
    }

    this.angularfire.object('accounts/'+this.user.userId).update(data);
    this.alertProvider.showSucessMessage('Profile updated');

    //console.log(data);
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

  connectInstagram(){

    console.log('this.instagramProvider==',this.instagramProvider);

    this.loadingProvider.show();
    this.oauth.logInVia(this.instagramProvider).then((success) => {
      this.loadingProvider.hide();
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

  editExpereince(data){
    this.navCtrl.push(AddexperiencePage,{data:data});
  }

  openAddexperience(){
    this.navCtrl.push(AddexperiencePage);
  }

  openBlockList(){

    this.navCtrl.push(BlockedlistPage);
  }

  openSettings(){

    this.navCtrl.push(SettingsPage);
  }


  editEducation(data){
    this.navCtrl.push(AddeducationPage,{data:data});
  }

  openAddeducation(){
    this.navCtrl.push(AddeducationPage);
  }



  setName() {
    this.alert = this.alertCtrl.create({
      title: 'Change LastName',
      message: "Please enter a new name.",
      inputs: [
        {
          name: 'name',
          id: "autofocusname",
          placeholder: 'Your Last Name',
          value: this.user.name
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Save',
          handler: data => {
            let name = data["name"];
            // Check if entered description is different from the current description
            if (this.user.name != name) {
              this.angularfire.object('/accounts/' + this.user.userId).update({
                name: name
              }).then((success) => {
                this.alertProvider.showProfileUpdatedMessage();
              }).catch((error) => {
                this.alertProvider.showErrorMessage('profile/error-update-profile');
              });
            }
          }
        }
      ]
    }).present({
      keyboardClose: false
    })
    .then(() => {
        console.log('autofocus name========');
        document.getElementById('autofocusname').focus();
    })
  }



  //Set username
  setFirstname() {
    this.alert = this.alertCtrl.create({
      title: 'Change Username',
      message: "Please enter a new username.",
      inputs: [
        {
          id:'autofocususername',
          name: 'username',
          placeholder: 'Your Username',
          value: this.user.username
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Save',
          handler: data => {
            let username = data["username"];
            // Check if entered username is different from the current username
            if (this.user.username != username) {
              this.dataProvider.getUserWithUsername(username).snapshotChanges().take(1).subscribe((userList) => {
                if (userList.length > 0) {
                  this.alertProvider.showErrorMessage('profile/error-same-username');
                } else {
                  this.angularfire.object('/accounts/' + this.user.userId).update({
                    username: username
                  }).then((success) => {
                    this.alertProvider.showProfileUpdatedMessage();
                  }).catch((error) => {
                    this.alertProvider.showErrorMessage('profile/error-update-profile');
                  });
                }
              });
            }
          }
        }
      ]
    }).present({
      keyboardClose: false
    })
    .then(() => {
        console.log('autofocus name========');
        document.getElementById('autofocususername').focus();
    })
  }

  //Set description
  setRole() {
    this.alert = this.alertCtrl.create({
      title: 'Change Role',
      message: "Please enter a new role.",
      inputs: [
        {
          id:'autofocusrole',
          name: 'role',
          placeholder: 'Your Role',
          value: this.user.role
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Save',
          handler: data => {
            let role = data["role"];
            // Check if entered description is different from the current description
            if (this.user.role != role) {
              this.angularfire.object('/accounts/' + this.user.userId).update({
                role: role
              }).then((success) => {
                this.alertProvider.showProfileUpdatedMessage();
              }).catch((error) => {
                this.alertProvider.showErrorMessage('profile/error-update-profile');
              });
            }
          }
        }
      ]
    }).present({
      keyboardClose: false
    })
    .then(() => {
        console.log('autofocus name========');
        document.getElementById('autofocusrole').focus();
    })
  }

  setCity() {
    this.alert = this.alertCtrl.create({
      title: 'Change City',
      message: "Please enter a new city.",
      inputs: [
        {
          id:'autofocuscity',
          name: 'city',
          placeholder: 'Your City',
          value: this.user.city
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Save',
          handler: data => {
            let city = data["city"];
            // Check if entered description is different from the current description
            if (this.user.city != city) {
              this.angularfire.object('/accounts/' + this.user.userId).update({
                city: city
              }).then((success) => {
                this.alertProvider.showProfileUpdatedMessage();
              }).catch((error) => {
                this.alertProvider.showErrorMessage('profile/error-update-profile');
              });
            }
          }
        }
      ]
    }).present({
      keyboardClose: false
    })
    .then(() => {
        console.log('autofocus name========');
        document.getElementById('autofocuscity').focus();
    })
  }

  // Enlarge user's profile image.
  enlargeImage(img) {
    let imageModal = this.modalCtrl.create("ImageModalPage", { img: img });
    imageModal.present();
  }

  presentActionSheet(image,index) {
    console.log('image===',image,this.user);
    var text = '';
    var isFavourite = true;
    if(image.key==this.user.favouriteimage){
      text = 'Set as unfavorite';
      isFavourite=false;
    }else{
      text = 'Set as favorite';
      isFavourite=true;
    }
    const actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: text,
          role: '',
          handler: () => {
            console.log('favourite clicked');
            if(isFavourite){
              this.setFavourite(index);
            }else{
              this.setUnFavourite(index);
            }

          }
        },{
          text: 'Delete',
            role: 'destructive',
          handler: () => {
            console.log('Delete clicked');
            this.deleteImage(image,index);

          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }



  deleteImage(image,index){

    this.imagesList.splice(index,1);
    console.log('image===',image);
    firebase.database().ref('accounts/'+firebase.auth().currentUser.uid+'/photos/'+image.key).remove();
    this.alertProvider.showSucessMessage('image deleted');

  }

  setUnFavourite(index){

    this.angularfire.object('/accounts/' + firebase.auth().currentUser.uid+'/favouriteimage').update({favouriteimage:''});
    this.alertProvider.showSucessMessage('Favourite image updated');
  }

  setFavourite(index){

    console.log('index====',this.imagesList[index]);
    this.angularfire.object('/accounts/' + firebase.auth().currentUser.uid).update({update_at:new Date().getTime()});
    this.angularfire.object('/accounts/' + firebase.auth().currentUser.uid).update({favouriteimage:this.imagesList[index].key});
    this.alertProvider.showSucessMessage('Favourite image updated');

  }

  setPhoto() {
    // Ask if the user wants to take a photo or choose from photo gallery.
    this.alert = this.alertCtrl.create({
      title: 'Set Profile Photo',
      message: 'Do you want to take a photo or choose from your photo gallery?',
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Choose from Gallery',
          handler: () => {
            // Call imageProvider to process, upload, and update user photo.
            this.imageProvider.setProfilePhoto(this.user, this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Take Photo',
          handler: () => {
            // Call imageProvider to process, upload, and update user photo.
            this.imageProvider.setProfilePhoto(this.user, this.camera.PictureSourceType.CAMERA);
          }
        }
      ]
    }).present();
  }


  addPhoto() {
    // Ask if the user wants to take a photo or choose from photo gallery.


    this.alert = this.alertCtrl.create({
      title: 'Add Photo',
      message: 'Do you want to take a photo or choose from your photo gallery?',
      buttons: [
        {
          text: 'Take Photo',
          handler: () => {
            // Call imageProvider to process, upload, and update user photo.
            this.imageProvider.setAddPhoto(this.user, this.camera.PictureSourceType.CAMERA).then((url) => {

                  console.log('url=====',url);
                  let subdata ={
                      key:url.key,
                      img:url.img,
                  }

                  //this.imagesList.push(subdata);
                  console.log(this.imagesList);

            });

          }
        },
        {
          text: 'Choose from Gallery',
          handler: () => {
            // Call imageProvider to process, upload, and update user photo.
            this.imageProvider.setAddPhoto(this.user, this.camera.PictureSourceType.PHOTOLIBRARY).then((url) => {

                  console.log('url=====',url);

                  let subdata ={
                      key:url.key,
                      img:url.img,
                  }

              //    this.imagesList.push(subdata);
                  console.log(this.imagesList);
            });

          }
        },

        {
          text: 'Cancel',
          handler: data => { }
        }
      ]
    }).present();
  }

  // Open chat with this user.
  sendMessage() {
    this.navCtrl.push(MessagePage, { userId: this.userId });
  }

  editProfile(){
    this.navCtrl.push(EditprofilePage);
  }

  logOut(){

    this.logoutProvider.logout();
  }

  // Check if user can be added, meaning user is not yet friends nor has sent/received any friend requests.
  canAdd() {
    if (this.friendRequests) {
      if (this.friendRequests.indexOf(this.userId) > -1) {
        return false;
      }
    }
    if (this.requestsSent) {
      if (this.requestsSent.indexOf(this.userId) > -1) {
        return false;
      }
    }
    if (this.friends) {
      if (this.friends.indexOf(this.userId) > -1) {
        return false;
      }
    }
    return true;
  }
}
