import { ImageSizes, PhotosFixedSize } from '@marketplace/ui-kit/types/Image';

export interface ImagesDTO {
  interior_images?: string[] | null;
  exterior_images?: string[] | null;
}

export interface ImagesSizedDTO {
  _exterior_images?: ImageSizes[] | null;
  _interior_images?: ImageSizes[] | null;
}

export type PhotoDTO = Record<PhotosFixedSize, string>;
export type PhotoDTOShort = Record<Extract<PhotosFixedSize, '750'>, string>;
