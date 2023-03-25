import {Component, Input, Output, EventEmitter} from '@angular/core';

// <!--Actual Html Usage of this component in your pages-->
// <div class="mini-post-section">
//   <h6 class="mini-post-section--title">related articles</h6>
//   <ion-list>
//      <mini-post>....</mini-post>
//   </ion-list>
// </div>
// <!--End Wrapping!-->

// For Styling, refer to sibling file mini-post.scss

@Component({
    selector: 'mini-post',
    template: `
  <ion-item (click)="onClick()">
    <ion-thumbnail item-left>
      <img src="{{miniPostImage}}">
    </ion-thumbnail>
    <h1 [innerHTML]="miniPostTitle"></h1>
  </ion-item>
  `
})


export class MiniPostComponent {
    @Input() miniPostImage: string = "build/assets/blank-default-mini-pic.png";
    @Input() miniPostTitle: string = "Default Post Title";
    @Input() miniPostID: number = 0;
    @Output() onPostClick = new EventEmitter;

    // Make the PostID every <mini-post> is carrying accessible outside the component
    onClick() {
        this.onPostClick.emit({
            miniPostID: this.miniPostID
        });
    }
}
