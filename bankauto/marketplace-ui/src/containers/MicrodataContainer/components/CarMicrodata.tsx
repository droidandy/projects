import React, { FC } from 'react';
import { Vehicle } from '@marketplace/ui-kit/types';

export interface CarMicrodataProps {
  data: Vehicle;
}

const ContainerCarMicrodata: FC<CarMicrodataProps> = ({ data }) => {
  const { bodyType, brand, color, engine, equipment, model, generation, price, productionYear, transmission } = data;
  const image = data.images[0];
  const modelName = `${brand.name} ${generation.vendorName || model.name} ${equipment.name}`;

  return (
    <span itemScope itemType="http://schema.org/Car">
      <meta itemProp="bodyType" content={bodyType.name} />
      <meta itemProp="brand" content={brand.name} />
      <meta itemProp="color" content={color.name} />
      <meta itemProp="fuelType" content={engine.name} />
      <meta itemProp="image" content={image} />
      <meta itemProp="modelDate" content={`${generation.yearStart}`} />
      <meta itemProp="name" content={modelName} />
      <meta itemProp="productionDate" content={`${productionYear}`} />
      <meta itemProp="vehicleConfiguration" content={model.name} />
      <meta itemProp="vehicleTransmission" content={transmission.name} />

      <span itemScope itemProp="offers" itemType="http://schema.org/Offer">
        <meta itemProp="availability" content="http://schema.org/InStock" />
        <meta itemProp="name" content={modelName} />
        <meta itemProp="price" content={`${price}`} />
        <meta itemProp="priceCurrency" content="RUB" />
      </span>
      <span itemScope itemProp="vehicleEngine" itemType="http://schema.org/EngineSpecification">
        <meta itemProp="name" content={`${equipment.volume} ${transmission.code}`} />
        <meta itemProp="engineDisplacement" content={`${equipment.volume} LTR`} />
        <meta itemProp="enginePower" content={`${equipment.power} л.с.`} />
        <meta itemProp="fuelType" content={engine.name} />
      </span>
    </span>
  );
};

export default ContainerCarMicrodata;
