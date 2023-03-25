import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {NavController, LoadingController, Config, NavParams} from 'ionic-angular';
import {SinglePostComponent} from '../../custom-components/single-post/single-post.component';
import {MiniPostComponent} from '../../custom-components/mini-posts/mini-post.component';
import {LikeComponent} from '../../custom-components/like/like.component';
import {CommentSimpleComponent} from '../../custom-components/comment/comment-simple.component';
import {JsonApiCall} from '../../providers/json-api-call/json-api-call';
import {LoaderBlockComponent} from '../../custom-components/loader-block/loader-block.component';

/*
 Generated class for the PostDetailPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    templateUrl: 'build/pages/post-detail/post-detail.html',
    directives: [SinglePostComponent, MiniPostComponent, LikeComponent, CommentSimpleComponent, LoaderBlockComponent],
    providers: [JsonApiCall]
})
export class PostDetailPage {
    // We need to define our properties that match the JSON, else we will get "undefined" errors
    // when using singlePostData.some-property in our template

    singlePostData: Object = {
        postImage: <string> null,
        postTitle: <string> null,
        postCategory: <string> null,
        postContent: <string> null,
        postCommentCount: <number> null,
        postNumberOfShares: <number> null,
        postNumberOfLikes: <number> null
    }

    // define types for our related posts array
    relatedPostsData: any = [
        {
            miniPostImage: <string> null,
            miniPostTitle: <string> null,
            miniPostID: <string> null
        }
    ]

    postComments: any = [
        {
            commentAuthor: <string> null,
            commentTime: <string> null,
            commentText: <string> null
        }
    ]

    // Post Id
    PostID: number;

    // Property for our Error Message. Set to False/true depending on request success/fail
    didNotLoad: boolean = false;

    // Property value for our LoaderBlockComponent. We'll be toggling this when
    // fetching comments in showComments()
    loaderDisplayStatus: boolean = false;
    loaderComplete: boolean = false;

    constructor(private navCtrl: NavController,
                public jsonApi: JsonApiCall,
                public loadingController: LoadingController,
                public config: Config,
                public params: NavParams) {
        // If we get to this page carrying a postID, It will be set here for use
        this.PostID = params.get("id");
    }

    // On entering this page, load the post's data, related posts
    ionViewWillEnter() {
        this.loadPost(true);
        // this.loadRelatedPost();

        if (this.PostID == null) {
            console.warn("Post ID is null. If you need PostID as a query string in your json and it is <null> your api requst may fail")
        }
        else {
            console.log("Post ID is: ", this.PostID);
        }
    }

    // Function Fired on pull-to-refresh
    doRefresh(refresher) {
        this.loadPost(false);
        refresher.complete();
    }

    // Function to liking a post. the $event exposes the PostID
    likePost($event) {
        console.log($event);
        //Manipulate to your needs
    }

    //Load the post's data.
    private loadPost(cache: boolean = false) {
        //A Local variable for configuring our loadingController
        let loader = this.loadingController.create({
            content: `<div class='app-spinner'></div>`
            //content: `Please wait...`,
            //spinner: 'bubbles'
        });

        //Show Loader on screen
        loader.present();

        //Load the data using our http Service. Remember the cache parameter is either true/false
        this.jsonApi.load("http://rainemagazine.com/wp-json/wp/v2/posts/" + this.PostID + "?_embed", false).subscribe(
            data => {
                let tmpImg;
                try {
                    tmpImg = data[0]._embedded["wp:featuredmedia"][0].media_details.sizes.medium_large.source_url
                } catch (e) {
                    tmpImg = ""
                    console.warn(e)
                }
                this.singlePostData = {
                    postTitle: data[0].title.rendered,
                    postContent: data[0].content.rendered,
                    postImage: tmpImg
                };

                this.didNotLoad = false
                loader.dismiss();
            },
            err => {
                // Request Failted
                this.didNotLoad = true;
                loader.dismiss();
                // For Debugging
                console.log(err);
            }
        )
    }


    // Load posts, related the current PostID
    private loadRelatedPost() {
        this.jsonApi.load("http://rainemagazine.com/wp-json/wp/v2/posts/" + this.PostID + "/revisions").subscribe(
            data => {
                // Successful Request
                this.relatedPostsData = data[0];
                console.log(this.relatedPostsData);
            },
            err => {
                // Failed Request
                console.log(err);
            }
        )
    }

    // Mostly for the related posts section. So one can navigate to itself but fetching
    // the new Post id and its data
    gotoDetailPost($event) {
        // console.log($event);
        this.navCtrl.push(PostDetailPage, {
            id: $event.miniPostID
        })
    }

    // Show the post's comments
    showComments() {
        this.loaderDisplayStatus = true; // display our <mg-loader-block> in post-detail.html
        this.jsonApi.load(this.config.get("apiUrl") + "/comment-simple.json?PostID=" + this.PostID).subscribe(
            data => {
                // Successful Request
                this.postComments = data[0];
                this.loaderDisplayStatus = false;
                this.loaderComplete = true;
                console.log("Post Comment Data: ", this.postComments);
            },
            err => {
                // Failed Request
                console.log(err);
            }
        )
    }

}
