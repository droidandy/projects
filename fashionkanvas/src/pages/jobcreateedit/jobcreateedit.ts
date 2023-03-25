import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, App } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ImageProvider } from '../../providers/image';
import { LoadingProvider } from '../../providers/loading';
import { DataProvider } from '../../providers/data';
import { AlertProvider } from '../../providers/alert';
import { Validator } from '../../validator';
import { Camera } from '@ionic-native/camera';
import { AngularFireDatabase } from 'angularfire2/database';
import { JobsPage } from '../jobs/jobs';
import * as firebase from 'firebase';

@Component({
  selector: 'page-jobcreateedit',
  templateUrl: 'jobcreateedit.html',
})
export class JobcreateeditPage {

  alert:any;
  group:any;
  jobCreate: {
    img?: any;
    title?: any;
    location?: any;
    description?:any;
    date?:any;
    duration?:any;
    amount?:any;
    typeJob?:any;
    currency?:any;
    periodical?:any;
    hiring?:any;
    role?:any;
    uid?:any;
    isPost?:any;
    dateCreated?:any;
    key?:any;
    isEnd?:any;
  } = {};
  todayDate:any;
  roleList:any=[];
  isEdit:boolean=false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public imageProvider: ImageProvider, public dataProvider: DataProvider, public formBuilder: FormBuilder,
    public alertProvider: AlertProvider, public alertCtrl: AlertController, public angularfire: AngularFireDatabase, public app: App, public loadingProvider: LoadingProvider, public camera: Camera) {

      this.jobCreate.img = '';
      this.todayDate = new Date();
      this.todayDate = this.todayDate.getFullYear()+'-'+("0" + (this.todayDate.getMonth() + 1)).slice(-2)+'-'+("0" + (this.todayDate.getDate())).slice(-2);
      console.log('this.todayDate==',this.todayDate);
      this.roleList=this.dataProvider.getRole();
      if(this.navParams.get('data')){
        this.jobCreate = this.navParams.get('data');
        this.isEdit =true;
      }

    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad JobcreateeditPage');

  }

  createJob(isPost){
    console.log('createjob',isPost);
    if(this.jobCreate.img==''){
      this.alertProvider.showSucessMessage('Please upload image');
    }else if(this.jobCreate.title==''||this.jobCreate.title==undefined){
      this.alertProvider.showSucessMessage('Please enter title');
    }else if(this.jobCreate.location==''||this.jobCreate.location==undefined){
      this.alertProvider.showSucessMessage('Please enter location');
    }else if(this.jobCreate.role==''||this.jobCreate.role==undefined){
      this.alertProvider.showSucessMessage('Please select role');
    }else if(this.jobCreate.description==''||this.jobCreate.description==undefined){
      this.alertProvider.showSucessMessage('Please enter description');
    }else if(this.jobCreate.typeJob==''||this.jobCreate.typeJob==undefined){
      this.alertProvider.showSucessMessage('Please select type');
    }else if(this.jobCreate.date==''||this.jobCreate.date==undefined){
      this.alertProvider.showSucessMessage('Please select date');
    }else if(this.jobCreate.duration==''||this.jobCreate.duration==undefined){
      this.alertProvider.showSucessMessage('Please select duration');
    }else if(this.jobCreate.amount==''||this.jobCreate.amount==undefined){
      this.alertProvider.showSucessMessage('Please enter amount');
    }else if(this.jobCreate.currency==''||this.jobCreate.currency==undefined){
      this.alertProvider.showSucessMessage('Please enter currency');
    }else if(this.jobCreate.periodical==''||this.jobCreate.periodical==undefined){
      this.alertProvider.showSucessMessage('Please select periodical');
    }else if(this.jobCreate.hiring==''||this.jobCreate.hiring==undefined){
      this.alertProvider.showSucessMessage('Please enter hiring');
    }else{

      this.jobCreate.uid=firebase.auth().currentUser.uid;
      this.jobCreate.isPost = isPost;
      this.jobCreate.dateCreated = new Date().toString();
      this.jobCreate.isEnd = false;
      console.log('this.jobCreate',this.jobCreate);
      this.loadingProvider.show();
      if(this.isEdit){
        this.angularfire.object('/jobs/' + this.jobCreate.key ).update(this.jobCreate);
        this.navCtrl.popToRoot().then(() => {
          this.loadingProvider.hide();
          //this.app.getRootNav().push(JobsPage);
        });

      }else{
        this.angularfire.list('jobs').push(this.jobCreate).then((success) => {
          //let groupId = success.key;
          console.log('success.key==',success.key);
          this.navCtrl.popToRoot().then(() => {
            this.loadingProvider.hide();
            //this.app.getRootNav().push(JobsPage);
          });
        })
      }


    }
  }

  setJobPhoto() {
    this.alert = this.alertCtrl.create({
      title: 'Set Job Photo',
      message: 'Do you want to take a photo or choose from your photo gallery?',
      buttons: [
        {
          text: 'Cancel',
          handler: data => { }
        },
        {
          text: 'Choose from Gallery',
          handler: () => {

            this.getImageUrl(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Take Photo',
          handler: () => {
            this.getImageUrl(this.camera.PictureSourceType.CAMERA);
          }
        }
      ]
    }).present();
  }

  getImageUrl(type){
    this.loadingProvider.show();
    this.imageProvider.setJobPhotoPromise(this.jobCreate, type).then((image) => {
      console.log('image==',image);
      console.log('this.jobCreate==',this.jobCreate);
      this.loadingProvider.hide();
    })
  }

  selectRole(name){
    this.jobCreate.role =name
  }

  selectTypeJob(name){
    this.jobCreate.typeJob =name
  }


}
