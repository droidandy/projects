import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';

@Component({
  selector: 'mg-loader-block',
  template: `
  <div class="mg-loader-block">
    <div class="mg-loader-block-overlay" *ngIf="displayLoader">
      <div class="spinner">
        <div class="rect1"></div>
        <div class="rect2"></div>
        <div class="rect3"></div>
        <div class="rect4"></div>
        <div class="rect5"></div>
      </div>
    </div>
    <div class="mg-loader-block--content" *ngIf="loaderComplete">
      <ng-content></ng-content>
    </div>
  </div>
  `
})

export class LoaderBlockComponent {
  @Input() displayLoader : boolean = false;
  @Input() loaderComplete : boolean = false;
}
