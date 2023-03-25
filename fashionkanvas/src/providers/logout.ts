import { Injectable } from '@angular/core';
import { App } from 'ionic-angular';
import { LoadingProvider } from './loading';
import { DataProvider } from './data';
import * as firebase from 'firebase';

@Injectable()
export class LogoutProvider {

  constructor(public app: App, public loadingProvider: LoadingProvider, public dataProvider: DataProvider) {
    console.log("Initializing Logout Provider");
  }

  // Hooks the app to this provider, this is needed to clear the navigation views when logging out.
  setApp(app) {
    this.app = app;
  }

  // Logs the user out on Firebase, and clear navigation stacks.
  // It's important to call setApp(app) on the constructor of the controller that calls this function.
  logout() {
    this.loadingProvider.show();
    // Sign the user out on Firebase
    firebase.auth().signOut().then((success) => {
      // Clear navigation stacks
      this.app.getRootNav().popToRoot().then(() => {
        this.loadingProvider.hide();
        // Restart the entire app
        let page = 'index.html';
        if(window.location.protocol != "file:"){
          page = window.location.protocol+"//"+window.location.hostname+":"+window.location.port;
        }
        document.location.href = page;
      });
    });
  }

}
