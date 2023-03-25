import { Photo } from '@marketplace/ui-kit/types';

export interface ColorChooseBase {
  id: number;
  name: string;
  code: string;
}

export interface ColorChooseItem extends ColorChooseBase {
  images: Photo[];
}
