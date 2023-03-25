import React, { ComponentType } from 'react';
import { SchemaName, MicrodataProps } from 'constants/structuredData';
import OrganizationMicrodata from './components/OrganizationMicrodata';
import CarMicrodata from './components/CarMicrodata';
import BreadcrumbsMicrodata from './components/BreadcrumbsMicrodata';
import ServiceMicrodata from './components/ServiceMicrodata';

const componentsList: {
  [key: string]: ComponentType<any>;
} = {
  [SchemaName.ORGANIZATION]: OrganizationMicrodata,
  [SchemaName.CAR]: CarMicrodata,
  [SchemaName.BREADCRUMBS]: BreadcrumbsMicrodata,
  [SchemaName.SERVICE]: ServiceMicrodata,
};

export const MicrodataContainer = ({
  data,
  type,
  additionalData,
}: MicrodataProps<{ [key: string]: any }, SchemaName>) => {
  const Microdata = componentsList[type];

  return <Microdata data={data} additionalData={additionalData} />;
};
