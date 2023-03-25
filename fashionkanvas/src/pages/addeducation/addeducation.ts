import { Component } from '@angular/core';
import { NavController, NavParams,AlertController } from 'ionic-angular';
import { AlertProvider } from '../../providers/alert';
import { AngularFireDatabase } from 'angularfire2/database';
import { LoadingProvider } from '../../providers/loading';
import { UserInfoPage } from '../../pages/user-info/user-info';
import * as firebase from 'firebase';


@Component({
  selector: 'page-addeducation',
  templateUrl: 'addeducation.html',
})
export class AddeducationPage {

  education: {
		 study?: any;
     id?:any;
		 schoolName?: any;
     location?: any;
     startDate?: any;
     degree?:any;
     endDate?:any;
     description?:any;
	 } = {};

   isEdit:any;
  constructor(
    public alertProvider: AlertProvider,public angularfire: AngularFireDatabase,public loadingProvider: LoadingProvider,public alertCtrl: AlertController,public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddeducationPage',this.navParams.get('data'));
    if(this.navParams.get('data')){
      this.education = this.navParams.get('data');
      this.isEdit = true;
    }else{
      this.isEdit = false;
    }
  }

  saveEducation(){

    if(this.education.study==undefined||this.education.study==''){
      this.alertProvider.showSucessMessage('Study field required');
    }else if(this.education.schoolName==undefined||this.education.schoolName==''){
        this.alertProvider.showSucessMessage('schoolName field required');
    }else if(this.education.location==undefined||this.education.location==''){
      this.alertProvider.showSucessMessage('Location field required');
    }else if(this.education.degree==undefined||this.education.degree==''){
      this.alertProvider.showSucessMessage('Degree field required');
    }else if(this.education.startDate==undefined||this.education.startDate==''){
      this.alertProvider.showSucessMessage('StartDate field required');
    }else if((this.education.endDate==undefined||this.education.endDate=='')){
      this.alertProvider.showSucessMessage('EndDate field required');
    }else if((this.education.description==undefined||this.education.description=='')){
      this.alertProvider.showSucessMessage('Description field required');
    }else{
      console.log('this.education==',this.education);
      if(this.education.id){

        firebase.database().ref('accounts/'+firebase.auth().currentUser.uid+'/education/'+this.education.id).update(this.education);
        //this.alertProvider.showSucessMessage('Education Updated');
      }else{
        firebase.database().ref('accounts/'+firebase.auth().currentUser.uid+'/education/').push(this.education);
        //this.alertProvider.showSucessMessage('Education Added');
      }


      this.navCtrl.setRoot(UserInfoPage);

    }


  }

  deleteEducation(){
    console.log('delete ecpereince==');
    firebase.database().ref('accounts/'+firebase.auth().currentUser.uid+'/education/'+this.education.id).remove();
    //this.alertProvider.showSucessMessage('Successfully Education Deleted');
    this.navCtrl.setRoot(UserInfoPage);
  }

  changedDate(event){

    console.log('expereince.startDate==',this.education.startDate);
    this.education.endDate =''
  }


}
