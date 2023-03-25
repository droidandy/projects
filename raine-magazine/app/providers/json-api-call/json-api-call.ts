import { Injectable, Output } from '@angular/core';
import { Http } from '@angular/http';
import {Observable} from 'rxjs/Rx';

/*
  Generated class for the JsonApiCall provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

// Todo: concurrent http calls. endpoint parameter could be an array to take many urls and return data as an array
// refer to http://www.metaltoad.com/blog/angular-2-http-observables

@Injectable()
export class JsonApiCall {
  private data : any = null;
  loader : any;
  error: any;
  timeout: number = 15000;

  constructor(private http: Http) {

  }

  // Simple http request. hits the endpoint everytime.
  // Useful for when you need to fetch search results or do a pull-to-refresh
  loadFresh(endpoint) {
    return Observable.forkJoin(
      this.http.get(endpoint).map(res => res.json())
      .timeout(this.timeout) //Timeout at 15 Seconds
    );
  }


  // load and preserve the results so It doesn't hit the end point everytime.
  // Since we're importing this per Component basis, every page
  // would have it's own this.data per every instance of JsonApiCall.
  // Useful when you need to cache results while navigating pages.
  loadWithCache(endpoint) {
    if (!this.data) {
      this.data = Observable.forkJoin(this.http.get(endpoint)
          .timeout(this.timeout)
          .map(res => res.json())
          .publishReplay(1)
          .refCount()
        )
      return this.data;
    }
    else {
      return this.data;
    }
  }

  load(endpoint, cache : boolean = false) {
    //If caching is enabled:
    if (cache) {
      // Run http call with caching approach
      return this.loadWithCache(endpoint)
    }
    else {
      // run fresh call everytime
      return this.loadFresh(endpoint)
    }
  }

}
