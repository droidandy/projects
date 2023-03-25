import { Images, ImagesSized } from '@marketplace/ui-kit/types/Image';
import { ImagesDTO, ImagesSizedDTO } from '../../types/dtos/images.dto';

export const ImagesMapper = <T>(item: T, dto: ImagesDTO): T & Images => ({
  ...item,
  images: [...(dto.exterior_images || []), ...(dto.interior_images || [])],
});

export const ImagesSizedMapper = <T>(item: T, dto: ImagesSizedDTO): T & ImagesSized => ({
  ...item,
  // eslint-disable-next-line no-underscore-dangle
  imagesSized: [...(dto._exterior_images || []), ...(dto._interior_images || [])],
});
