import {Component} from '@angular/core';
import {NavController, LoadingController, Config, MenuController, NavParams} from 'ionic-angular';
import {LoginPage} from '../login/login';
import {PostComponent} from '../../custom-components/post/post.component';
import {PostDetailPage} from '../post-detail/post-detail';
import {SearchPage} from '../search/search';
import {CategoryPage} from '../category/category';
import {JsonApiCall} from '../../providers/json-api-call/json-api-call';
@Component({
    templateUrl: 'build/pages/home/home.html',
    directives: [PostComponent],
    providers: [JsonApiCall]
})
export class HomePage {
    login: any;
    detailPage: any;
    searchPage: any;
    categoryPage: any;
    loading: any;
    feedData: any = [{
        feedTitle: <string> null,
        feedImage: <string> null,
        feedCategory: <string> null,
        feedPostID: <number> null
    }];
    pageNum: number = 1;
    canLoad: boolean = true;
    CategoryID: number;
    CategoryName: string;
    didNotLoad: boolean = false;

    constructor(public navCtrl: NavController,
                public jsonApi: JsonApiCall,
                public loadingController: LoadingController,
                public config: Config,
                public params: NavParams,
                public menu: MenuController) {
        this.navCtrl = navCtrl;
        this.login = LoginPage;
        this.detailPage = PostDetailPage;
        this.searchPage = SearchPage;
        this.categoryPage = CategoryPage;
        this.loading = loadingController;
        menu.enable(true, 'sidebarMenu');


        this.pageNum = 1;
        this.feedData = [];
        this.CategoryID = this.params.get("CategoryID");
        this.CategoryName = this.params.get("CategoryName");
        if (this.CategoryID) {
            this.loadCategoryPosts(false)
        } else {
            this.loadFeed(false);
        }
    }

    ionViewWillEnter() {
        //this.pageNum = 1;
        //this.feedData = [];
        //this.CategoryID = this.params.get("CategoryID");
        //this.CategoryName = this.params.get("CategoryName");
        //if (this.CategoryID) {
        //    this.loadCategoryPosts(false)
        //} else {
        //    this.loadFeed(false);
        //}
    }

    loadMore(infiniteScroll) {
        this.CategoryID = this.params.get("CategoryID");
        if (this.CategoryID) {
            this.loadCategoryPosts(infiniteScroll)
        } else {
            this.loadFeed(infiniteScroll);
        }
    }

    doRefresh(refresher) {
        this.pageNum = 1;
        this.feedData = [];
        this.loadFeed(false);
        refresher.complete();
    }

    public loadFeed(infiniteScroll) {
        let loader = this.loadingController.create({
            content: `<div class='app-spinner'></div>`
            //content: `Please wait...`,
            //spinner: 'bubbles'

        });
        if (!infiniteScroll) {
            loader.present();
        }
        this.jsonApi.load("http://rainemagazine.com/wp-json/wp/v2/posts?_embed&page=" + this.pageNum, false).subscribe(
            data => {
                let tmpFeed = [];
                for (var i = 0; i < data[0].length; i++) {
                    let tmpImg;
                    try {
                        tmpImg = data[0][i]._embedded["wp:featuredmedia"][0].media_details.sizes.medium_large.source_url
                    } catch (e) {
                        tmpImg = ""
                        console.warn(e)
                    }
                    tmpFeed.push({
                        feedTitle: data[0][i].title.rendered,
                        feedImage: tmpImg,
                        feedCategory: "",
                        feedPostID: data[0][i].id
                    })
                }
                this.didNotLoad = false;
                console.log(tmpFeed);
                this.feedData = this.feedData.concat(tmpFeed)
                if (infiniteScroll) {
                    infiniteScroll.complete();
                }
                if (tmpFeed.length == 10) {
                    this.pageNum++
                } else {
                    this.canLoad = false;
                }
                if (!infiniteScroll) {
                    loader.dismiss();
                }
            },
            err => {
                this.didNotLoad = true;
                loader.dismiss();
                console.log(err);
            }
        )
    }

    public loadCategoryPosts(infiniteScroll) {
        let loader = this.loadingController.create({
            content: `<div class='app-spinner'></div>`
            //content: `Please wait...`,
            //spinner: 'bubbles'
        });
        if (!infiniteScroll) {
            loader.present();
        }
        this.jsonApi.load("http://rainemagazine.com/wp-json/wp/v2/posts?_embed&categories=" + this.CategoryID + "&page=" + this.pageNum, false).subscribe(
            data => {
                let tmpFeed = [];
                for (var i = 0; i < data[0].length; i++) {
                    let tmpImg;
                    try {
                        tmpImg = data[0][i]._embedded["wp:featuredmedia"][0].media_details.sizes.medium_large.source_url
                    } catch (e) {
                        tmpImg = ""
                        console.warn(e)
                    }
                    tmpFeed.push({
                        feedTitle: data[0][i].title.rendered,
                        feedImage: tmpImg,
                        feedCategory: "",
                        feedPostID: data[0][i].id
                    })
                }
                this.didNotLoad = false;
                console.log(tmpFeed);
                this.feedData = this.feedData.concat(tmpFeed)
                if (infiniteScroll) {
                    infiniteScroll.complete();
                }
                if (tmpFeed.length == 10) {
                    this.pageNum++
                } else {
                    this.canLoad = false;
                }
                if (!infiniteScroll) {
                    loader.dismiss();
                }
            },
            err => {
                this.didNotLoad = true;
                loader.dismiss();
                console.log(err);
            }
        )
    }

    gotoDetailPost($event) {
        // console.log($event);
        this.navCtrl.push(PostDetailPage, {
            id: $event.postID
        })
    }

}
