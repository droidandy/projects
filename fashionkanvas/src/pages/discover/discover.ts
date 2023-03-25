import { Component } from '@angular/core';
import { NavController, NavParams,ModalController } from 'ionic-angular';
import { MessagePage } from '../message/message';
import { DataProvider } from '../../providers/data';
import { AlertProvider } from '../../providers/alert';
import { LoadingProvider } from '../../providers/loading';
/**
 * Generated class for the DiscoverPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@Component({
  selector: 'page-discover',
  templateUrl: 'discover.html',
})
export class DiscoverPage {

  userId:any;
  userDetails:any;
  imagesList:any=[];
  expereince:any=[];
  education:any=[];
  constructor(public alertProvider: AlertProvider,public modalCtrl: ModalController,public navCtrl: NavController, public navParams: NavParams, public dataProvider: DataProvider, public loadingProvider: LoadingProvider) {

    this.userId = this.navParams.get('userId');
    console.log(this.userId);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DiscoverPage');
    this.getUser();
  }

  ionViewWillEnter(){
    console.log('ionViewWillEnter DiscoverPage');
  }

  getUser(){

    this.loadingProvider.show();

    this.dataProvider.getUser(this.userId).snapshotChanges().subscribe((account) => {

      if(account.payload.val()){

        this.userDetails = account.payload.val();
        this.expereince =[];
        for(let data in this.userDetails.expereince){
          let diff ='';
          console.log('=====',this.userDetails.expereince[data]);
          if(!this.userDetails.expereince[data].isLast){
            diff = this.dataProvider.calcDate(new Date(),new Date(this.userDetails.expereince[data].endDate));
          }else{
            diff = this.dataProvider.calcDate(new Date(),new Date(this.userDetails.expereince[data].startDate));
          }
          this.userDetails.expereince[data].isFullDescription = false;
          this.userDetails.expereince[data].shortDescription = this.userDetails.expereince[data].description.substring(0, 150);
          this.userDetails.expereince[data].diffDate = "NOW("+diff+")";
          this.expereince.push({...this.userDetails.expereince[data],id:data});
        }
        this.expereince.reverse();
        this.education =[];
        for(let data in this.userDetails.education){
          this.userDetails.education[data].isFullDescription = false;
          this.userDetails.education[data].shortDescription = this.userDetails.education[data].description.substring(0, 150);
          this.education.push({...this.userDetails.education[data],id:data});
        }
        this.education.reverse();
        if(this.userDetails.photos){

            this.imagesList = [];
            for(let data in this.userDetails.photos){

                let subdata ={
                    key:data,
                    img:this.userDetails.photos[data].img,
                }

                this.imagesList.push(subdata);
            }

            console.log(this.imagesList);
        }
        console.log(this.userDetails);
      }
      this.loadingProvider.hide();

    });

  }

  enlargeImage(img) {
    let imageModal = this.modalCtrl.create("ImageModalPage", { img: img });
    imageModal.present();
  }

  openMessage(){
    this.navCtrl.push(MessagePage,{userId:this.userId});
  }

  block(){
    console.log("block function");
    this.dataProvider.block(this.userId);
    this.alertProvider.showSucessMessage('user blocked');
  }

  reportSpam(){

    console.log("reportSpam");
    this.dataProvider.spamUser(this.userId);
    this.alertProvider.showSucessMessage("This user has been marked as spam. We will review the appeal for any objectionable content. Thank you");
  }

}
