import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';

@Component({
  selector: 'like',
  template:`
  <div class="post-social-stats" (click)="onClick()">
      <ion-icon [name]="iconName"></ion-icon> <span class="post-stat">{{voteCount}}</span>
  </div>
  `
})

export class LikeComponent implements OnInit {
  @Input() isClicked : boolean = false;
  @Input() voteCount = 20;
  @Output() onvote = new EventEmitter();
  @Input() PostID: number = 0;
  iconName : string = "heart-outline";

  ngOnInit() {
      // Depending on if the post was like before or not, set to heart/heart-outline
      this.iconName = this.isClicked ? "heart" : "heart-outline";
  }

  onClick() {
    // console.log('clicked!', this.isClicked);
    if (this.isClicked) {
      this.isClicked = !this.isClicked;
      this.iconName = "heart-outline";
      this.voteCount--;
      this.onvote.emit({PostID : 1});
    }
    else {
      this.isClicked = !this.isClicked;
      this.iconName = "heart";
      this.voteCount++;
      this.onvote.emit({PostID : 2});
    }

  }

}
