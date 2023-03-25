import React, { FC } from 'react';
import { Img, OmniLink } from '@marketplace/ui-kit';
import { VehicleShort } from '@marketplace/ui-kit/types';
import OrganizationMicrodata, { Organization } from './OrganizationMicrodata';

export interface IServiceMicrodata {
  data: Organization & { priceFrom: number | null; priceTo: number | null };
  additionalData: VehicleShort[];
}
const ServiceMicrodata: FC<IServiceMicrodata> = ({ data, additionalData }) => {
  return (
    <div itemScope itemType="https://schema.org/Service" style={{ display: 'none' }}>
      <meta itemProp="serviceType" content="Продажа авто" />
      <OrganizationMicrodata data={data} />
      <div itemProp="hasOfferCatalog" itemScope itemType="http://schema.org/OfferCatalog">
        {additionalData.map((item) => (
          <div itemProp="itemListElement" itemScope itemType="https://schema.org/Offer">
            <OmniLink
              href={`https://bankauto.ru/offer/${item.brand.alias}/${item.model.alias}/${item.id}`}
              itemProp="url"
            >
              {item.photos.map((photo) => (
                <Img itemProp="image" src={photo[750]} />
              ))}
              <span itemProp="name">
                {item.brand.name} {item.model.name}
              </span>
            </OmniLink>
            <meta
              itemProp="price"
              content={`${item.price - (item.discounts.market + item.discounts.credit + item.discounts.tradeIn)}`}
            />
            <meta itemProp="priceCurrency" content="RUB" />
            <link itemProp="availability" href="https://schema.org/InStock" />
          </div>
        ))}
        <div itemProp="offers" itemScope itemType="https://schema.org/AggregateOffer">
          <meta itemProp="lowPrice" content={`${data.priceFrom}`} />
          <meta itemProp="highPrice" content={`${data.priceTo}`} />
          <meta itemProp="priceCurrency" content="RUB" />
        </div>
      </div>
    </div>
  );
};
export default ServiceMicrodata;
