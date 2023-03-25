import { FC, SVGProps } from 'react';

export type Amenity = {
  [key: string]: {
    title: string;
    icon: FC<SVGProps<SVGSVGElement>>;
  };
};

export type WorkType = {
  id: number;
  name: string;
};

export type Image = {
  id: number;
  'mime-type'?: string;
  thumb_preview: string;
  thumb_view: string;
};

export type File = {
  id: number;
  'mime-type'?: string;
  url: string;
};
