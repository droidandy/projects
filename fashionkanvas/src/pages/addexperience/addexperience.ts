import { Component } from '@angular/core';
import { NavController, NavParams,AlertController } from 'ionic-angular';
import { AlertProvider } from '../../providers/alert';
import { AngularFireDatabase } from 'angularfire2/database';
import { LoadingProvider } from '../../providers/loading';
import { UserInfoPage } from '../../pages/user-info/user-info';
import * as firebase from 'firebase';

@Component({
  selector: 'page-addexperience',
  templateUrl: 'addexperience.html',
})
export class AddexperiencePage {

  expereince: {
		 role?: any;
     id?:any;
     agency?: any;
		 event?: any;
     location?: any;
     startDate?: any;
     isLast?:any;
     endDate?:any;
     description?:any;

	 } = {};
    isEdit?:any;
  constructor(public alertProvider: AlertProvider,public angularfire: AngularFireDatabase,public loadingProvider: LoadingProvider,public alertCtrl: AlertController,public navCtrl: NavController, public navParams: NavParams) {

    this.expereince.isLast = false;
  }

  ionViewDidLoad() {

    if(this.navParams.get('data')){
      this.expereince = this.navParams.get('data');
      this.isEdit = true;
    }else{
      this.isEdit = false;
    }
    console.log('ionViewDidLoad AddexperiencePage',this.expereince);

  }

  deleteExperience(){
    console.log('delete ecpereince==');
    firebase.database().ref('accounts/'+firebase.auth().currentUser.uid+'/expereince/'+this.expereince.id).remove();
    //  this.alertProvider.showSucessMessage('Successfully Expereince Deleted');
    this.navCtrl.setRoot(UserInfoPage);
  }

  saveExpereince(){

    if(this.expereince.role==undefined||this.expereince.role==''){
      this.alertProvider.showSucessMessage('Role field required');
    }else if(this.expereince.agency==undefined||this.expereince.agency==''){
        this.alertProvider.showSucessMessage('Agency field required');
    }else if(this.expereince.event==undefined||this.expereince.event==''){
        this.alertProvider.showSucessMessage('Event field required');
    }else if(this.expereince.location==undefined||this.expereince.location==''){
      this.alertProvider.showSucessMessage('Location field required');
    }else if(this.expereince.startDate==undefined||this.expereince.startDate==''){
      this.alertProvider.showSucessMessage('StartDate field required');
    }else if(!this.expereince.isLast&&(this.expereince.endDate==undefined||this.expereince.endDate=='')){
      this.alertProvider.showSucessMessage('EndDate field required');
    }else{
      console.log('this.expereince==',this.expereince);
      if(this.expereince.id){
        firebase.database().ref('accounts/'+firebase.auth().currentUser.uid+'/expereince/'+this.expereince.id).update(this.expereince);
        //this.alertProvider.showSucessMessage('Expereince Updated');
      }else{
        firebase.database().ref('accounts/'+firebase.auth().currentUser.uid+'/expereince/').push(this.expereince);
        //this.alertProvider.showSucessMessage('Expereince Added');
      }


      this.navCtrl.setRoot(UserInfoPage);

    }


  }

  changedDate(event){

    console.log('expereince.startDate==',this.expereince.startDate);
    this.expereince.endDate =''
  }

}
