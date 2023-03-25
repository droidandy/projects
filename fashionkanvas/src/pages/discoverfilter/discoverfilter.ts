import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DataProvider } from '../../providers/data';
import { HomePage } from '../../pages/home/home';

@Component({
  selector: 'page-discoverfilter',
  templateUrl: 'discoverfilter.html',
})
export class DiscoverfilterPage {

  roleList:any=[];
  constructor(public dataProvider: DataProvider,public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.roleList=this.dataProvider.getFilterRole();

    console.log('ionViewDidLoad DiscoverfilterPage',this.roleList);
  }

  roleFilter(){
    console.log('this.roleList==',this.roleList);
    this.dataProvider.setFilterRole(this.roleList)
    this.navCtrl.setRoot(HomePage);
  }

}
