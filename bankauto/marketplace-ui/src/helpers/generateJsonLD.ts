import { SchemaName, MicrodataProps } from '../constants/structuredData';
import { BreadCrumbsItem } from '../components/Breadcrumbs';

const generateJsonLD = ({ data, type }: MicrodataProps<{ [key: string]: any }, SchemaName>): string => {
  let structuredData;

  if (type === 'car') {
    const image = data.images[0]?.url;
    const modelName = `${data.brand?.name} ${data.generation?.vendorName || data.model?.name} ${data.equipment?.name}`;

    structuredData = {
      '@context': 'http://schema.org',
      '@type': 'Car',
      bodyType: data.bodyType?.name,
      brand: data.brand?.name,
      color: data.color?.name,
      fuelType: data.engine?.name,
      image,
      modelDate: data.generation?.yearStart,
      name: modelName,
      productionDate: data.productionYear,
      vehicleConfiguration: data.model?.name,
      vehicleTransmission: data.transmission?.name,

      offers: {
        '@type': 'Offer',
        availability: 'http://schema.org/InStock',
        name: modelName,
        price: data.price,
        priceCurrency: 'RUB',
      },

      vehicleEngine: {
        '@type': 'EngineSpecification',
        name: `${data.equipment?.volume} ${data.transmission?.code}`,
        engineDisplacement: `${data.equipment?.volume} LTR`,
        enginePower: `${data.equipment?.power} л.с.`,
        fuelType: data.engine?.name,
      },
    };
  }

  if (type === 'breadcrumbs') {
    structuredData = {
      '@context': 'http://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: null,
    };
    const listItems = data.map(({ to, label }: BreadCrumbsItem, index: number) => {
      return {
        '@type': 'ListItem',
        position: index + 1,
        name: label,
        item: `https://bankauto.ru/${to}`,
      };
    });

    structuredData.itemListElement = listItems;
  }

  return JSON.stringify(structuredData);
};

export { generateJsonLD };
