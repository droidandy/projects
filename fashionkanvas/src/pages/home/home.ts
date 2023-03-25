import { Component,ViewChild } from '@angular/core';
import { Content,NavController, AlertController, NavParams,Events, App, Platform, ToastController, ModalController,ActionSheetController  } from 'ionic-angular';
import { LogoutProvider } from '../../providers/logout';
import { LoadingProvider } from '../../providers/loading';
import { AlertProvider } from '../../providers/alert';
import { ImageProvider } from '../../providers/image';
import { DataProvider } from '../../providers/data';
import { AngularFireDatabase } from 'angularfire2/database';
import { Validator } from '../../validator';
import * as firebase from 'firebase';
import { Camera } from '@ionic-native/camera';
import { Firebase } from '@ionic-native/firebase';
import { DiscoverPage } from '../discover/discover';
import { UserInfoPage } from '../user-info/user-info';
import { DiscoverfilterPage } from '../../pages/discoverfilter/discoverfilter';

import { ImageLoaderConfig } from 'ionic-image-loader';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private user: any;
  private alert;
  showOnline: any = false;
  isPushEnabled: any = false;
  isBrowser: any = false;
  imagesList:any=[];
  discoverList:any=[];
  tempDiscoverList:any=[];
  pageLimit:number = 20;
  roleList:any=[];
  @ViewChild(Content) content: Content;
  // HomePage
  // This is the page where the user is directed after successful login and email is confirmed.
  // A couple of profile management function is available for the user in this page such as:
  // Change name, profile pic, email, and password
  // The user can also opt for the deletion of their account, and finally logout.
  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public navParams: NavParams, public app: App,
    public logoutProvider: LogoutProvider, public loadingProvider: LoadingProvider, public imageProvider: ImageProvider,
    public angularfire: AngularFireDatabase, public alertProvider: AlertProvider, public dataProvider: DataProvider,
    public camera: Camera, public platform: Platform, public fcm: Firebase, public toast: ToastController, public modal: ModalController,
    public actionSheetCtrl: ActionSheetController,public translate: TranslateService,public events: Events) {



  }

  ionViewDidLoad() {
    // Initialize
    this.roleList=this.dataProvider.getFilterRole();
    console.log('this.roleList===',this.roleList);
    this.getUser();
    this.events.subscribe('home:scrollToTop', () => {
      console.log('home:scrollToTop', 'at');
      setTimeout(() => {this.content.scrollToTop()}, 200);
    });
  }

  ionViewWillEnter(){
      //let jobFilter=JSON.parse(localStorage.getItem('jobfilter'));
      console.log('onPageWillEnter JobsPage');
      //setTimeout(() => {this.content.scrollToTop()}, 200);

      //this.getJobs();
  }

  ngOnDestroy(): void {
    this.events.unsubscribe('home:scrollToTop');
  }


  getUser(){

    this.loadingProvider.show();
    let currentuserSubscription;
    let alluserSubscription;

    currentuserSubscription = this.dataProvider.getCurrentUser().snapshotChanges().subscribe((account:any) => {
      this.user = account.payload.val();
      console.log('this.user===',this.user);
      currentuserSubscription.unsubscribe();
      alluserSubscription = this.dataProvider.getAllUser().snapshotChanges().subscribe((account) => {
        alluserSubscription.unsubscribe();
      //  console.log('account.payload.val().friends===',account.payload.val());
        if(account.payload.val()){
          var tempdiscoverList:any = account.payload.val();
          this.discoverList =[];
          for(let data in tempdiscoverList){
              if(this.roleList.length==0||this.checkAllRole()||this.checkRole(tempdiscoverList[data].role)){
                if(tempdiscoverList.username!=''){
                  var discoverURl = '';
                  if(tempdiscoverList[data].update_at==undefined){
                      tempdiscoverList[data].update_at = 1;
                  }
                  if( tempdiscoverList[data].photos){
                    var count=0;
                    for(let key in tempdiscoverList[data].photos){

                          if(key==tempdiscoverList[data].favouriteimage){

                            discoverURl = tempdiscoverList[data].photos[key].img;
                            tempdiscoverList[data].discoverimg = discoverURl;
                          }

                          if(tempdiscoverList[data].favouriteimage==undefined&&count==0){

                            count = count+1;
                            discoverURl = tempdiscoverList[data].photos[key].img;
                            tempdiscoverList[data].discoverimg = discoverURl;
                          }
                    }
                  }

                  if(discoverURl==''&&tempdiscoverList[data].photos&&tempdiscoverList[data].photos.length>0){

                    tempdiscoverList[data].discoverimg = tempdiscoverList[data].photos[0];

                  }else if(discoverURl==''){

                    tempdiscoverList[data].discoverimg = tempdiscoverList[data].img;
                  }

                  if(tempdiscoverList[data].discoverimg!=''&&tempdiscoverList[data].discoverimg!='http://placehold.it/80X80'&&tempdiscoverList[data].discoverimg!=undefined){

                    this.discoverList.push(tempdiscoverList[data]);
                  }

                }
              }



          }

          this.filterArray();
          console.log(this.discoverList);
          this.loadImage();
        }



        this.loadingProvider.hide();

      });
    })



  }

  checkAllRole(){

    for(let data in this.roleList){
      if(this.roleList[data].checked){
        return false;
      }
    }
    return true;
  }

  checkRole(role){
      if(role){

        for(let data in this.roleList){
          if(this.roleList[data].checked&&this.roleList[data].name==role){
            return true;
          }else if(this.roleList[data].checked&&this.roleList[data].name=='Other'){
            return true;
          }
        }
      }
      return false
  }

  filterArray(){

    this.discoverList.sort(function(a,b){
        var c = a.update_at;
        var d = b.update_at;
        return d-c;
    });
    //console.log('tempList===',this.discoverList)
  }

  loadImage(){

    for(let data in this.discoverList){

      if((this.tempDiscoverList.length-1)<Number(data)&&Number(data)<this.pageLimit){
        this.tempDiscoverList.push(this.discoverList[data]);
      }

    }

    console.log(this.tempDiscoverList);
    //this.tempDiscoverList = this.discoverList;
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    setTimeout(() => {
      this.pageLimit = this.pageLimit +20;
      this.loadImage();
      infiniteScroll.complete();
    }, 500);
  }


  openDiscover(item){

      if(firebase.auth().currentUser.uid!=item.userId){

        this.app.getRootNav().push(DiscoverPage, { userId: item.userId });
      }else{

        this.app.getRootNav().push(UserInfoPage);
      }

  }

  openFilter(){
    this.navCtrl.push(DiscoverfilterPage);
  }

}
