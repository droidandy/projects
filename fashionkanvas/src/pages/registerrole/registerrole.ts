import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LocationbasePage } from '../../pages/locationbase/locationbase';
import { DataProvider } from '../../providers/data';
import { AlertProvider } from '../../providers/alert';

@Component({
  selector: 'page-registerrole',
  templateUrl: 'registerrole.html',
})
export class RegisterrolePage {

  registerData:any;
  selectedArray :any = [];
  selectRoleName:any='';
  newRoleName:any='';
  roleList: {
		 data?: any;
	 } = {};
  constructor(public alertProvider: AlertProvider,public navCtrl: NavController, public navParams: NavParams,public dataProvider: DataProvider) {

  }

  ionViewDidLoad() {
    this.registerData = this.navParams.get('data');
    this.roleList.data=this.dataProvider.getRole();
    this.selectRoleName =this.roleList.data[0].name;
    console.log('ionViewDidLoad RegisterrolePage',this.registerData);
  }

  openLocationbase(){
    if(this.selectRoleName!=''){
      if(this.selectRoleName=='Other'){
          if(this.newRoleName==''){
            this.alertProvider.showSucessMessage('Please select new role');
          }else{
            this.registerData.role = this.newRoleName;
            this.navCtrl.push(LocationbasePage,{data:this.registerData});
          }
      }else{
        this.registerData.role = this.selectRoleName;
        this.navCtrl.push(LocationbasePage,{data:this.registerData});
      }

    }else{
      this.alertProvider.showSucessMessage('Please select one role');
    }

  }



  selectRole(name){
    this.selectRoleName =name
  }

}
