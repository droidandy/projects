import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController  } from 'ionic-angular';
import { JobofferPage } from '../../pages/joboffer/joboffer';
import { JobcreateeditPage } from '../../pages/jobcreateedit/jobcreateedit';
import { JobfilterPage } from '../../pages/jobfilter/jobfilter';
import { AppliedjobPage } from '../../pages/appliedjob/appliedjob';
import { LoadingProvider } from '../../providers/loading';
import { DataProvider } from '../../providers/data';
import { AlertProvider } from '../../providers/alert';
import * as firebase from 'firebase';

@Component({
  selector: 'page-jobs',
  templateUrl: 'jobs.html',
})
export class JobsPage {

  jobType:any='myjob';
  jobList:any=[];
  isJobLoading:boolean=true;

  constructor(public alertProvider: AlertProvider,public dataProvider: DataProvider,public loadingProvider: LoadingProvider,public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl: ActionSheetController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad JobsPage');
    this.getJobs();
  }

  ionViewWillEnter(){
      //let jobFilter=JSON.parse(localStorage.getItem('jobfilter'));
      console.log('onPageWillEnter JobsPage');
      this.jobType='myjob';
      this.getJobs();
  }



  getJobs(){
    this.loadingProvider.show();
    this.dataProvider.getJobs().snapshotChanges().subscribe((jobRes:any) => {
      this.loadingProvider.hide();
      let jobList = [];
      this.jobList=[];
      jobList = jobRes.map(c => ({ key: c.key, ...c.payload.val()}));
      this.isJobLoading = false;
      let uid = firebase.auth().currentUser.uid;
      let jobFilter=JSON.parse(localStorage.getItem('jobfilter'));
      console.log('jobFilter==',jobFilter);
      for(let data in jobList){

          jobList[data].applicationCount = jobList[data].applications ? Object.keys(jobList[data].applications).length : 0 ;
          if(this.jobType=='searchjob'){
            if(jobList[data].uid!=uid&&jobList[data].isPost){

              if(jobFilter!=null){
                //check role
                if(this.checkAllRole(jobFilter.roleList)||this.checkRole(jobFilter.roleList,jobList[data].role)){
                    //check amount
                    if(Number(jobFilter.minPrice)<Number(jobList[data].amount)&&Number(jobFilter.maxPrice)>=Number(jobList[data].amount)){
                      //check job type
                      if(jobFilter.jobType==jobList[data].typeJob||jobFilter.jobType==''){
                        //check location
                          if(jobList[data].location.toLowerCase().indexOf(jobFilter.location) !== -1){
                            this.jobList.push(jobList[data]);
                          }
                      }

                    }
                }
              }else{
                this.jobList.push(jobList[data]);
              }

            }
          }else{
            if(jobList[data].uid==uid){
              this.jobList.push(jobList[data]);
            }
          }

      }
      console.log('jobRes===',this.jobList,'this.jobType==',this.jobType);
    })
  }

  checkRole(roleList,role){
    for(let data in roleList){
      if(roleList[data].name==role&&roleList[data].checked){
        return true;
      }
    }
    return false;
  }

  checkAllRole(roleList){

    for(let data in roleList){
      if(roleList[data].checked){
        return false;
      }
    }
    return true;
  }

  presentActionSheet() {
    let name ='Job Searcher Mode';
    if(this.jobType=='searchjob'){
      name ='Hirer Mode';

    }
    const actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: name,
          handler: () => {
            console.log('Archive clicked');
            if(this.jobType=='searchjob'){
              this.jobType ='myjob';
              this.getJobs();
            }else{
              this.jobType ='searchjob';
              this.getJobs();
            }
          }
        },{
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

  openJoboffer(job){
    this.navCtrl.push(JobofferPage,{data:job});
  }

  openJobcreateedit(){
    this.navCtrl.push(JobcreateeditPage);
  }

  openJobfilter(){
    this.navCtrl.push(JobfilterPage);
  }

  openAppliedjob(){
    this.navCtrl.push(AppliedjobPage,{data:this.jobList});
  }


}
