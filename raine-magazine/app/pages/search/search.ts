import { Component } from '@angular/core';
import { NavController, LoadingController, Config } from 'ionic-angular';
import {MiniPostComponent} from '../../custom-components/mini-posts/mini-post.component';
import {JsonApiCall} from '../../providers/json-api-call/json-api-call';

/*
  Generated class for the SearchPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/search/search.html',
  directives: [MiniPostComponent],
  providers: [JsonApiCall]
})
export class SearchPage {
  didNotLoad: boolean = false;
  searchReturnedResults : boolean = false;
  searchTerm: string;
  relatedPostsData : any
  searchResultsData : any = [
    {
      miniPostImage: <string> null,
      miniPostTitle: <string> null,
      miniPostID: <string> null
    }
  ]

  constructor(
    private navCtrl: NavController,
    public jsonApi: JsonApiCall,
    public loadingController: LoadingController,
    public config: Config) {

  }

  // Load the most featured posts on page enter
  ionViewWillEnter() {
     this.loadRelatedPosts();
   }

  // Fired on hitting enter in the searchbox.
  loadSearchResults() {
    //A Local variable for configuring our loadingController
    let loader = this.loadingController.create({
      content: `<div class='app-spinner'></div>`
      //content: `Please wait...`,
      //spinner: 'bubbles'
    });

    // For Debugging
    console.log("You searched for: ",this.searchTerm);

    // Show loader on screen
    loader.present();

    // Load the data using our http Service. Remember the cache parameter is either true/false.
    // If not specified, the service assumes false. Which is okay, we don't want to cache search results
    this.jsonApi.load(this.config.get("apiUrl")+"/search-results.json").subscribe(
      data => {
        // Successful Request
        this.searchResultsData = data[0];
        this.didNotLoad = false
        console.log(this.searchResultsData);
        this.searchReturnedResults = true;  //Flag to show/hide the search results section
        loader.dismiss();
      },
      err => {
        // Failed Request
        this.didNotLoad = true;
        loader.dismiss();
        console.log(err);
      }
    )
  }

  private loadRelatedPosts() {
      this.jsonApi.load(this.config.get("apiUrl")+"/related-posts.json").subscribe(
        data => {
          this.relatedPostsData = data[0];
          console.log(this.relatedPostsData);
        },
        err => {
          console.log(err);
        }
      )
  }


}
