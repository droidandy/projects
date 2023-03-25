import { AdvertiseListItem, AdvertiseList, BDASpecialOffer, SpecialOfferAdvantage } from '@marketplace/ui-kit/types';
import {
  AdvertiseListDTO,
  AdvertiseListItemDTO,
  AdvertiseCountDTO,
  SpecialOfferDTO,
  SpecialOfferAdvantageDTO,
  SpecialOfferImagesDTO,
} from 'types/dtos/banking.dto';

export const AdvertiseItemMapper = <T>(item: T, dto: AdvertiseListItemDTO): T & AdvertiseListItem => {
  return {
    ...item,
    id: dto.id,
    name: dto.name,
    description: dto.description,
    url: dto.url,
    createdAt: dto.created_at,
    mainImage: dto.main_image,
  };
};

export const AdvertiseListMapper = (dto: AdvertiseListDTO & AdvertiseCountDTO): AdvertiseList => {
  return {
    items: dto.items.map((item) => AdvertiseItemMapper({}, item)),
    count: dto.count,
  };
};

const SpecialOfferImagesMapper = (images: SpecialOfferImagesDTO | null) => ({
  '500': images?.['500'],
  '1580': images?.['1580'],
});

const SpecialOfferAdvantagesMapper = (dtos: SpecialOfferAdvantageDTO[]): SpecialOfferAdvantage[] => {
  return dtos.map((dto) => ({
    title: dto.title,
    valueSmallText: dto.value_small_text,
    valueBigText: dto.value_big_text,
  }));
};

export const SpecialOfferMapper = (dto: SpecialOfferDTO): BDASpecialOffer => {
  return {
    id: dto.id,
    name: dto.name,
    title: dto.title,
    subTitle: dto.sub_title,
    description: dto.description,
    advantages: SpecialOfferAdvantagesMapper(dto.advantages),
    alias: dto.alias,
    imgDesktop: SpecialOfferImagesMapper(dto.img_desktop),
    imgMobile: SpecialOfferImagesMapper(dto.img_mobile),
    link: dto.link,
  };
};
