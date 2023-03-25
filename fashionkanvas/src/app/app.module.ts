import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { LoginPage } from '../pages/login/login';
import { ForgotpasswordPage } from '../pages/forgotpassword/forgotpassword';
import { ResetpasswordPage } from '../pages/resetpassword/resetpassword';
import { ResetconfirmpasswordPage } from '../pages/resetconfirmpassword/resetconfirmpassword';
import { DiscoverPage } from '../pages/discover/discover';
import { RegisterPage } from '../pages/register/register';
import { LandingPage } from '../pages/landing/landing';
import { TermsPage } from '../pages/terms/terms';
import { RegisterrolePage } from '../pages/registerrole/registerrole';
import { LocationbasePage } from '../pages/locationbase/locationbase';
import { DiscoverfilterPage } from '../pages/discoverfilter/discoverfilter';
import { SettingsPage } from '../pages/settings/settings';
import { EditprofilePage } from '../pages/editprofile/editprofile';
import { AddexperiencePage } from '../pages/addexperience/addexperience';
import { AddeducationPage } from '../pages/addeducation/addeducation';
import { JobsPage } from '../pages/jobs/jobs';
import { JobcreateeditPage } from '../pages/jobcreateedit/jobcreateedit';
import { JobfilterPage } from '../pages/jobfilter/jobfilter';
import { AppliedjobPage } from '../pages/appliedjob/appliedjob';



import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { MessagesPage } from '../pages/messages/messages';
import { GroupsPage } from '../pages/groups/groups';
import { FriendsPage } from '../pages/friends/friends';
import { MessagePage } from '../pages/message/message';
import { GroupPage } from '../pages/group/group';
import { GroupInfoPage } from '../pages/group-info/group-info';
import { NewGroupPage } from '../pages/new-group/new-group';
import { AddMembersPage } from '../pages/add-members/add-members';
import { UserInfoPage } from '../pages/user-info/user-info';
import { BlockedlistPage } from '../pages/blockedlist/blockedlist';
import { JobofferPage } from '../pages/joboffer/joboffer';


import { LoginProvider } from '../providers/login';
import { LogoutProvider } from '../providers/logout';
import { LoadingProvider } from '../providers/loading';
import { AlertProvider } from '../providers/alert';
import { ImageProvider } from '../providers/image';
import { DataProvider } from '../providers/data';
import { FirebaseProvider } from '../providers/firebase';
import { UserService } from '../providers/user-service';


import * as firebase from 'firebase';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { Settings } from '../settings';

import { FriendPipe } from '../pipes/friend';
import { SearchPipe } from '../pipes/search';
import { ConversationPipe } from '../pipes/conversation';
import { DateFormatPipe } from '../pipes/date';
import { GroupPipe } from '../pipes/group';
import { CurrencySymbolPipe } from '../pipes/currency-symbol';
import { CapitalizeFirstLetterPipe } from '../pipes/capitalize-first-letter';


import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { GooglePlus } from '@ionic-native/google-plus';
import { Camera } from '@ionic-native/camera';
import { Keyboard } from '@ionic-native/keyboard';
import { Contacts } from '@ionic-native/contacts';
import { MediaCapture } from '@ionic-native/media-capture';
import { File } from '@ionic-native/file';
import { Geolocation } from '@ionic-native/geolocation';
import { Firebase } from '@ionic-native/firebase';
import { Facebook } from '@ionic-native/facebook';
import { Badge } from '@ionic-native/badge';
import { AppRate } from '@ionic-native/app-rate';

import { BrowserModule } from '@angular/platform-browser';
import { IonicImageLoader } from 'ionic-image-loader';
import { HttpModule, Http } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { EmailComposer } from '@ionic-native/email-composer';
import { InAppBrowser } from '@ionic-native/in-app-browser';

export function createTranslateLoader(http: HttpClient) {
  console.log('ininin============');
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

firebase.initializeApp(Settings.firebaseConfig);

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    HomePage,
    TabsPage,
    MessagesPage,
    GroupsPage,
    GroupInfoPage,
    FriendsPage,
    MessagePage,
    GroupPage,
    NewGroupPage,
    AddMembersPage,
    FriendPipe,
    ConversationPipe,
    SearchPipe,
    DateFormatPipe,
    GroupPipe,
    CurrencySymbolPipe,
    CapitalizeFirstLetterPipe,
    ForgotpasswordPage,
    ResetpasswordPage,
    ResetconfirmpasswordPage,
    DiscoverPage,
    RegisterPage,
    LandingPage,
    UserInfoPage,
    BlockedlistPage,
    TermsPage,
    RegisterrolePage,
    LocationbasePage,
    DiscoverfilterPage,
    SettingsPage,
    EditprofilePage,
    AddexperiencePage,
    AddeducationPage,
    JobsPage,
    JobofferPage,
    JobcreateeditPage,
    JobfilterPage,
    AppliedjobPage
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
      platforms:{
        ios:{
          scrollAssist: true,
          autoFocusAssist: true,
          scrollPadding: true,
        },
        android:{
          scrollAssist: false,
          autoFocusAssist: false,
        }
      },
      mode: 'ios',
      tabsPlacement: 'top'
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    HttpClientModule,
    HttpModule,
    BrowserModule,
    AngularFireModule.initializeApp(Settings.firebaseConfig,'ionic3chat'),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    IonicImageLoader.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    HomePage,
    TabsPage,
    MessagesPage,
    GroupsPage,
    FriendsPage,
    MessagePage,
    GroupPage,
    GroupInfoPage,
    NewGroupPage,
    AddMembersPage,
    ForgotpasswordPage,
    ResetpasswordPage,
    ResetconfirmpasswordPage,
    DiscoverPage,
    RegisterPage,
    LandingPage,
    UserInfoPage,
    BlockedlistPage,
    TermsPage,
    RegisterrolePage,
    LocationbasePage,
    DiscoverfilterPage,
    SettingsPage,
    EditprofilePage,
    AddexperiencePage,
    AddeducationPage,
    JobsPage,
    JobofferPage,
    JobcreateeditPage,
    JobfilterPage,
    AppliedjobPage
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    SplashScreen,
    StatusBar,
    GooglePlus,
    AppRate,
    EmailComposer,
    Camera,
    Keyboard,
    Contacts,
    InAppBrowser,
    MediaCapture,
    File,
    Geolocation,
    Firebase,
    Badge,
    Facebook,
    UserService,
    LoginProvider,
    LogoutProvider,
    LoadingProvider,
    AlertProvider,
    ImageProvider,
    DataProvider,
    FirebaseProvider
  ]
})
export class AppModule { }
