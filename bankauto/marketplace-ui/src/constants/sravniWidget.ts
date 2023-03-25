import { SravniWidgetConfig } from 'types/SravniWidget';

const osagoConfig: SravniWidgetConfig = {
  src: 'https://www.sravni.ru/widgets/loader.js',
  dataAttributes: [
    {
      name: 'inframe',
      value: 'true',
    },
    {
      name: 'product',
      value: 'osago',
    },
    {
      name: 'layout',
      value: 'full',
    },
    {
      name: 'noHeader',
      value: 'true',
    },
    {
      name: 'themePalette',
      value: '{"color1":"153, 0, 49","color2":"34, 34, 34"}',
    },
    {
      name: 'aff_id',
      value: '2777',
    },
    {
      name: 'offer_id',
      value: '1064',
    },
    {
      name: 'aff_sub',
      value: '9',
    },
    {
      name: 'source',
      value: '4112',
    },
  ],
};

const creditConfig: SravniWidgetConfig = {
  src: 'https://www.sravni.ru/widgets/loader.js',
  dataAttributes: [
    {
      name: 'inframe',
      value: 'true',
    },
    {
      name: 'product',
      value: 'kredity/onlajn-zayavka-na-kredit',
    },
    {
      name: 'aff_id',
      value: '2777',
    },
    {
      name: 'offer_id',
      value: '1206',
    },
    {
      name: 'aff_sub',
      value: '16',
    },
    {
      name: 'source',
      value: '4112',
    },
  ],
};

export { osagoConfig, creditConfig };
