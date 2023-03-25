import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';

@Component({
  selector: 'mg-comment',
  template: `
  <div class="mg-comment">
    <h5>{{commentAuthor}}</h5>
    <h6>{{commentTime}}</h6>
    <div className="comment-content">
      <ng-content></ng-content>
    </div>
  </div>
  `
})

export class CommentSimpleComponent implements OnInit {
  //Post ID of post (Taken from parent Component)
  @Input() postID : number = 0;
  @Input() commentID : number = 0;
  @Input() commentAuthor : string = null;
  @Input() commentTime : any = null;  //Date format up you to decide.
  @Input() commentText : string = "Default Comment";
  ngOnInit() {

  }
}

// Load A list of Comments in JSON [] array format
