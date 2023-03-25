import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoadingProvider } from '../../providers/loading';
import { DataProvider } from '../../providers/data';
import { AlertProvider } from '../../providers/alert';
import { AngularFireDatabase } from 'angularfire2/database';
import { JobcreateeditPage } from '../jobcreateedit/jobcreateedit';
import * as firebase from 'firebase';
import { DiscoverPage } from '../discover/discover';

@Component({
  selector: 'page-joboffer',
  templateUrl: 'joboffer.html',
})
export class JobofferPage {

  jobDetails:any=[];
  uid:any='';
  isJobApplied:boolean=false;
  applications:any=[];
  constructor(public angularfire: AngularFireDatabase,public alertProvider: AlertProvider,public dataProvider: DataProvider,public loadingProvider: LoadingProvider,public navCtrl: NavController, public navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad JobofferPage');
    this.jobDetails = this.navParams.get('data');
    this.uid = firebase.auth().currentUser.uid;
    console.log('this.jobDetails==',this.jobDetails);
    if(this.jobDetails.applications){
      this.getAppliedUser()
    }


  }

  getAppliedUser(){

    for(let data in this.jobDetails.applications){
      this.jobDetails.applications[data].key = data;
      if(this.jobDetails.applications[data].uid==this.uid){
        this.isJobApplied = true;
      }
      this.dataProvider.getUser(this.jobDetails.applications[data].uid).snapshotChanges().subscribe((member:any) => {
        if(member.key != null){
          member = { $key: member.key, ... member.payload.val(),dateCreated:this.jobDetails.applications[data].dateCreated};
          this.applications.push(member);
          console.log('this.applications==',this.applications);
        }
      });


    }


  }

  postJob(){

    this.angularfire.object('/jobs/' + this.jobDetails.key ).update({
      isPost:true
    });

    this.alertProvider.showSucessMessage('Job Posted Successfully');
    this.jobDetails.isPost = true;

  }

  endJob(){

    this.angularfire.object('/jobs/' + this.jobDetails.key ).update({
      isEnd:true,
      jobClosedDate:new Date().toString()
    });

    this.alertProvider.showSucessMessage(' Job Closed Successfully');
    this.navCtrl.popToRoot().then(() => {
      //this.app.getRootNav().push(JobsPage);
    });

  }

  viewUser(data) {

    this.navCtrl.push(DiscoverPage, { userId: data.uid });
  }

  applyJob(){
    let data ={
      uid:this.uid,
      dateCreated:new Date().toString()
    }
    this.angularfire.list('/jobs/' + this.jobDetails.key+'/applications').push(data).then((success) => {

        this.isJobApplied = true;
        this.dataProvider.getUser(this.uid).snapshotChanges().subscribe((member:any) => {
          if(member.key != null){
            member = { $key: member.key, ... member.payload.val(),dateCreated:new Date().toString()};
            this.applications.push(member);
            console.log('this.applications==',this.applications);
          }
        });

        //this.applications.push({uid:this.uid,key:applicationId});
        console.log(this.applications);
        this.alertProvider.showSucessMessage('Job Applied Successfully');
    })
  }

  editJob(){
    this.navCtrl.push(JobcreateeditPage,{data:this.jobDetails});
  }

}
