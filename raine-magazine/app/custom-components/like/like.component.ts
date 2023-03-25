import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';

@Component({
  selector: 'like',
  template:`
  <div class="vote-section">
    <div class="post-social-stats" (click)="onLikeClick()">
        <ion-icon [name]="iconName"></ion-icon> <span class="post-stat">{{voteCount}}</span>
    </div>
  </div>
  `
})

export class LikeComponent implements OnInit {
  @Input() isClicked : boolean = false;
  @Input() voteCount = 0;
  @Output() onVote = new EventEmitter();
  @Input() PostID: number = 0;
  iconName : string = "heart-outline";

  ngOnInit() {
      // Depending on if the post was like before or not, set to heart/heart-outline
      this.iconName = this.isClicked ? "heart" : "heart-outline";
  }

  onLikeClick() {
    // console.log('clicked!', this.isClicked);
    if (this.isClicked) {
      this.isClicked = !this.isClicked;
      this.iconName = "heart-outline";
      this.voteCount--;
      this.onVote.emit({PostID : this.PostID});
    }
    else {
      this.isClicked = !this.isClicked;
      this.iconName = "heart";
      this.voteCount++;
      this.onVote.emit({PostID : this.PostID});
    }

  }

}
