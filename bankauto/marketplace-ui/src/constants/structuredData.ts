import { VehicleShort } from '@marketplace/ui-kit/types';

export enum SchemaName {
  CAR = 'car',
  BREADCRUMBS = 'breadcrumbs',
  ORGANIZATION = 'organization',
  SERVICE = 'service',
}

export interface MicrodataProps<T, U> {
  data: T;
  type: U;
  additionalData?: VehicleShort[];
}

export const STRUCTURED_DATA_MAP = {
  [SchemaName.ORGANIZATION]: {
    data: {
      name: 'Росгосстрах Банк',
      legalName: 'ПАО «РГС Банк»',
      streetAddress: 'Киевская улица, 7',
      postalCode: '121059',
      addressLocality: 'Москва',
      telephone: '8 800 700-40-40',
      email: 'consult@rgsbank.ru',
      url: 'https://bankauto.ru',
      promo: 'https://www.youtube.com/embed/__INEPKfxRc',
    },
    jsonLD: `{
      "@context":"https://schema.org",
      "@type":"Organization",
      "name":"Росгосстрах Банк",
      "legalName": "ПАО «РГС Банк»",
      "url":"https://bankauto.ru",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Киевская улица, 7",
        "addressLocality": "Москва",
        "postalCode": "121059"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "support",
        "telephone": "[8 800 700-40-40]",
        "email": "consult@rgsbank.ru"
      },
      "sameAs":[
        "https://www.youtube.com/embed/__INEPKfxRc"
      ]
    }`,
  },
};
