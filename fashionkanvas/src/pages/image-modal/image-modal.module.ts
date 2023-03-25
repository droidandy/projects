import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImageModalPage } from './image-modal';
import { IonicImageLoader } from 'ionic-image-loader';
@NgModule({
  declarations: [
    ImageModalPage,
  ],
  imports: [
    IonicPageModule.forChild(ImageModalPage),
    IonicImageLoader
  ],
})
export class ImageModalPageModule {}
