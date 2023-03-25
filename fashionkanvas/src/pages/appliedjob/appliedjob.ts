import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoadingProvider } from '../../providers/loading';
import { DataProvider } from '../../providers/data';
import { AlertProvider } from '../../providers/alert';
import { AngularFireDatabase } from 'angularfire2/database';
import { JobcreateeditPage } from '../jobcreateedit/jobcreateedit';
import { JobofferPage } from '../../pages/joboffer/joboffer';
import * as firebase from 'firebase';


@Component({
  selector: 'page-appliedjob',
  templateUrl: 'appliedjob.html',
})
export class AppliedjobPage {

  appliedJob:any=[];
  uid:any='';

  constructor(public angularfire: AngularFireDatabase,public alertProvider: AlertProvider,public dataProvider: DataProvider,public loadingProvider: LoadingProvider,public navCtrl: NavController, public navParams: NavParams) {


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AppliedjobPage');
    let appliedJob = this.navParams.get('data');
    this.uid = firebase.auth().currentUser.uid;
    console.log(appliedJob);

    for(let data in appliedJob){
      for(let data1 in appliedJob[data].applications){
        if(appliedJob[data].applications[data1].uid==this.uid){
          this.appliedJob.push(appliedJob[data]);
        }
      }
    }

    // this.dataProvider.getJobs().snapshotChanges().subscribe((jobRes:any) => {
    //   this.loadingProvider.hide();
    //   let appliedJob = [];
    //   this.appliedJob=[];
    //   appliedJob = jobRes.map(c => ({ key: c.key, ...c.payload.val()}));
    //   console.log('jobList==',appliedJob);
    // })

  }

  openJoboffer(job){
    this.navCtrl.push(JobofferPage,{data:job});
  }

}
