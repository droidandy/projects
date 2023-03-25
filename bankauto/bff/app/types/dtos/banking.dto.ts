export type AdvertiseCountDTO = {
  count: number;
};

export type AdvertiseListItemDTO = {
  id: number;
  name: string;
  description: string;
  url: string;
  created_at: number;
  main_image: string;
};

export type AdvertiseListDTO = {
  items: AdvertiseListItemDTO[];
} & AdvertiseCountDTO;

export type SpecialOfferAdvantageDTO = {
  title: string;
  value_small_text: string | null;
  value_big_text: string | null;
};

export type SpecialOfferImagesDTO = {
  '1580'?: string;
  '500'?: string;
};

export type SpecialOfferDTO = {
  id: number;
  name: string;
  sub_title: string;
  advantages: SpecialOfferAdvantageDTO[];
  description: string;
  title: string;
  alias: string;
  link: string;
  img_desktop: SpecialOfferImagesDTO | null;
  img_mobile: SpecialOfferImagesDTO | null;
};
