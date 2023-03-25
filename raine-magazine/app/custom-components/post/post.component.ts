import {Component, Input, Output, EventEmitter} from '@angular/core';
import {ImagePreloader} from '../../attribute-directives/image-preloader';


@Component ({
  selector: 'app-post',
  // Template Html. For styling of this component refer to sibling file post.scss
  template: `<div class="post-feed animated pulse" (click)="onClick()">
    <!--<img src="feedImage" class="feed-image" mg-img-preloader="{{feedImage}}">-->
    <div class="feed-image" [ngStyle]="getStyle(feedImage)" mg-img-preloader="{{feedImage}}" ></div>
    <h1 class="primary-font bold-weight post-feed-title animated fadeInUp" [innerHTML]="feedTitle"></h1>
    <h6 class="post-feed-category divider divider-text-right secondary-font semi-bold">{{feedCategory}}</h6>
  </div>`,
  directives: [ImagePreloader]
})

export class PostComponent {
  constructor() {
  }
  @Input() feedTitle: string = 'Something I knew';
  @Input() feedCategory: string = 'Miscellaneous';
  @Input() feedImage: string = 'build/assets/blank-default-feed-bg.png';
  @Input() feedPostID : number;
  @Output() onPostClick = new EventEmitter;

  // Output Function on click (Provides the PostID for each component)
  getStyle(feedImage) {
    let myStyles = {
      'background': 'url(' + feedImage + ')  center center / cover no-repeat',
    };
    return myStyles;
  }
  onClick() {
    this.onPostClick.emit({
      postID : this.feedPostID
    });
  }
}
