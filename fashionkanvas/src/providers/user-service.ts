import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { map } from 'rxjs/operators';

@Injectable()
export class UserService {

  constructor(public http: Http) {
  }
  //Below Instagrm API is taken from  https://www.instagram.com/developer/endpoints/

  getInstagramUserInfo(response) {
    //GET USER PHOTOS
    console.log('response==',response);
    return this.http.get('https://api.instagram.com/v1/users/self/media/recent?access_token=' + response.access_token + '&count=5')


  }

}
