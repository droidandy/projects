import {Component, ViewChild} from '@angular/core';
import {Platform, ionicBootstrap, Nav} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {HomePage} from './pages/home/home';
import {LoginPage} from './pages/login/login';
import {PostDetailPage} from './pages/post-detail/post-detail';
import {SearchPage} from './pages/search/search';
import {CategoryPage} from './pages/category/category';
import {JsonApiCall} from "./providers/json-api-call/json-api-call";
@Component({
    templateUrl: 'build/app.html',
    providers: [JsonApiCall]

})
export class MyApp {
    @ViewChild(Nav) nav: Nav;
    rootPage: any = HomePage;
    pages: Array<{
        title: string,
        component: any,
        categoryID: number,
        countPost: number
    }>

    constructor(platform: Platform, public jsonApi: JsonApiCall) {
        platform.ready().then(() => {
            StatusBar.styleDefault();
        });
        this.pages = [];
        this.jsonApi.load("http://rainemagazine.com/wp-json/wp/v2/categories", false).subscribe(
            data => {
                console.log(data);
                for (var i = 0; i < data[0].length; i++) {
                    this.pages.push({
                        title: data[0][i].name,
                        component: HomePage,
                        categoryID: data[0][i].id,
                        countPost: data[0][i].count
                    })
                }
            },
            err => {
                console.log(err);
            }
        )
    }

    openPage(page) {
        this.nav.setRoot(page.component, {
            CategoryName: page.title,
            CategoryID: page.categoryID,
            CountPosts: page.countPost
        });
    }

    goHome() {
        this.nav.setRoot(HomePage);
    }

}

ionicBootstrap(MyApp, null, {
    apiUrl: 'http://audacitus.com/magaza-json/api'
});
