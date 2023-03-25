import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import * as firebase from 'firebase';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { LandingPage } from '../pages/landing/landing';
import { ImageLoaderConfig } from 'ionic-image-loader';
import { TranslateService } from '@ngx-translate/core';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = LandingPage;
  constructor(translate: TranslateService,private imageLoaderConfig: ImageLoaderConfig,platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      this.imageLoaderConfig.enableDebugMode();
      this.imageLoaderConfig.setCacheDirectoryName('fashionkanvas');
      this.imageLoaderConfig.enableFallbackAsPlaceholder(true);
      this.imageLoaderConfig.setFallbackUrl('assets/imgs/loadlogos.png');
      this.imageLoaderConfig.setMaximumCacheAge(24 * 60 * 60 * 1000);

      console.log('localStorage.getItem',localStorage.getItem('isLanguage'),'translate======',translate);
      if(localStorage.getItem('isLanguage')){

        translate.setDefaultLang(localStorage.getItem('isLanguage'));
        translate.use(localStorage.getItem('isLanguage'));

      } else{

        localStorage.setItem('isLanguage','en');
        translate.setDefaultLang('en');
        translate.use('en');
      }


    //   translate.get('DISCOVER').subscribe(
    //   value => {
    //     // value is our translated string
    //     console.log('value=========',value);
    //   }
    // )

      platform.pause.subscribe(()=>{
        if(firebase.auth().currentUser)
          firebase.database().ref('accounts/'+firebase.auth().currentUser.uid).update({'online': false});
      });
      platform.resume.subscribe(()=>{
        if(firebase.auth().currentUser && localStorage.getItem('showOnline') == 'true')
          firebase.database().ref('accounts/'+firebase.auth().currentUser.uid).update({'online': true});
      })
    });
  }
}
