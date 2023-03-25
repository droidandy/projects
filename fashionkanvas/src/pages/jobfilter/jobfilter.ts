import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data';
import { JobsPage } from '../../pages/jobs/jobs';

@Component({
  selector: 'page-jobfilter',
  templateUrl: 'jobfilter.html',
})
export class JobfilterPage {

  roleList:any=[];
  location:any='';
  jobType:any='';
  minPrice:any=1;
  maxPrice:any=1000;

  constructor(public dataProvider: DataProvider,public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {


    if(localStorage.getItem('jobfilter')){
      let jobFilter=JSON.parse(localStorage.getItem('jobfilter'));
      console.log('jobFilter==',jobFilter);

      this.roleList =jobFilter.roleList;
      this.location =jobFilter.location;
      this.jobType =jobFilter.jobType;
      this.minPrice =jobFilter.minPrice;
      this.maxPrice =jobFilter.maxPrice;

    }else{
      this.roleList=this.dataProvider.getRole();
    }

    console.log('ionViewDidLoad JobfilterPage');
  }

  jobFilter(){
    let data ={
      roleList:this.roleList,
      location:this.location,
      jobType:this.jobType,
      minPrice:this.minPrice,
      maxPrice:this.maxPrice
    }
    //console.log('data==',data);
    localStorage.setItem('jobfilter',JSON.stringify(data))
    this.navCtrl.popToRoot().then(() => {
      //this.app.getRootNav().push(JobsPage);
    });
  }

  selectTypeJob(name){
    if(name==this.jobType){
      this.jobType =''
    }else{
      this.jobType=name
    }

  }

}
