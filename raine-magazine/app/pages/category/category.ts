import {Component} from '@angular/core';
import {NavController, LoadingController, NavParams, Config} from 'ionic-angular';
import {MiniPostComponent} from '../../custom-components/mini-posts/mini-post.component';
import {JsonApiCall} from '../../providers/json-api-call/json-api-call';
import {PostDetailPage} from '../post-detail/post-detail';

/*
 Generated class for the CategoryPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    templateUrl: 'build/pages/category/category.html',
    directives: [MiniPostComponent],
    providers: [JsonApiCall]
})
export class CategoryPage {
    CategoryTitle: string;
    CategoryID: number;
    CountPosts: number;
    relatedPostsData: any = [
        {
            miniPostImage: <string> null,
            miniPostTitle: <string> null,
            miniPostID: <number> null
        }
    ]
    didNotLoad: boolean = false;

    constructor(private navCtrl: NavController,
                public jsonApi: JsonApiCall,
                public loadingController: LoadingController,
                public params: NavParams,
                public config: Config) {
        // We're getting our CategoryTitle and CategoryID from our app/app.ts file.
        // The title is for display. The ID is for fetching posts based on their CategoryID.
        // Refer to app/app.ts
        this.CategoryTitle = this.params.get("CategoryName");
        this.CategoryID = this.params.get("CategoryID");
        this.CountPosts = this.params.get("CountPosts");
    }

    // On entering this page, Load Category Posts and Check if CategoryID is null
    ionViewWillEnter() {
        this.loadCategoryPosts(true);
        console.log("CategoryTitle is: ", this.CategoryTitle);
        console.log("CategoryID is: ", this.CategoryID);
        if (this.CategoryID === null) {
            console.warn("Category ID is null. If you need CategoryID as a query string in your json and it is <null> your api requst may fail")
        }
    }

    //

    // Function Fired on pull-to-refresh
    doRefresh(refresher) {
        this.loadCategoryPosts(false);
        refresher.complete();
    }

    loadCategoryPosts(cache: boolean = false) {
        //A Local variable for configuring our loadingController
        let loader = this.loadingController.create({
            content: `<div class='app-spinner'></div>`
            //content: `Please wait...`,
            //spinner: 'bubbles'
        });

        //Show Loader on screen
        loader.present();

        //Load the data using our http Service. Remember the cache parameter is either true/false
        this.jsonApi.load("http://rainemagazine.com/wp-json/wp/v2/posts?_embed&categories=" + this.CategoryID, cache).subscribe(
            data => {
                // Successful Request
                this.relatedPostsData = [];
                for (var i = 0; i < data[0].length; i++) {
                    let tmpImg;
                    try {
                        tmpImg = data[0][i]._embedded["wp:featuredmedia"][0].media_details.sizes.thumbnail.source_url
                    } catch (e) {
                        tmpImg = "";
                        console.warn(e)
                    }
                    this.relatedPostsData.push({
                        miniPostTitle: data[0][i].title.rendered,
                        miniPostImage: tmpImg,
                        miniPostID: data[0][i].id
                    })
                }
                this.didNotLoad = false;
                console.log(this.relatedPostsData);
                // Remove Loader on screen
                loader.dismiss();
            },
            err => {
                // Failed Request
                this.didNotLoad = true;
                // Remove Loader on screen
                loader.dismiss();

                // For Debugging
                console.log(err);
            }
        )

    }

    gotoDetailPost($event) {
        // console.log($event);
        // Method navigation to PostDetailPage, using the PostID of the <mini-post>
        // Component
        this.navCtrl.push(PostDetailPage, {
            id: $event.miniPostID
        })
    }

}
