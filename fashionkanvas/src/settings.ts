import { TabsPage } from './pages/tabs/tabs';


export namespace Settings {

  export const firebaseConfig = {
    apiKey: "AIzaSyBDIIR_xsEMOcC4nZx_XuRN8YodkpPc3mA",
    authDomain: "spheric-gearing-217516.firebaseapp.com",
    databaseURL: "https://spheric-gearing-217516.firebaseio.com",
    projectId: "spheric-gearing-217516",
    storageBucket: "spheric-gearing-217516.appspot.com",
    messagingSenderId: "839561158123"
  };

  export const facebookLoginEnabled = true;
  export const googleLoginEnabled = true;
  export const phoneLoginEnabled = true;

  export const facebookAppId: string = "246125752917929";
  export const googleClientId: string = "839561158123-0j8n5aoehfrhrgvdcm6dte27ra78eg0k.apps.googleusercontent.com";
  export const customTokenUrl: string = "https://us-central1-spheric-gearing-217516.cloudfunctions.net/getCustomToken";

  export const homePage = TabsPage;
}
