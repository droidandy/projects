import React, { FC } from 'react';
import { BreadCrumbsItem } from '@marketplace/ui-kit/components/BreadcrumbsList';

export interface BreadcrumbsMicrodataProps {
  data: BreadCrumbsItem[];
}

const ContainerBreadcrumbsMicrodata: FC<BreadcrumbsMicrodataProps> = ({ data }) => {
  return (
    <ul itemScope itemType="http://schema.org/BreadcrumbList">
      {data.map(({ to, label }: any, index: any) => (
        <li key={to} itemScope itemProp="itemListElement" itemType="http://schema.org/ListItem">
          <a href={`https://bankauto.ru${to}`} itemProp="item">
            <meta itemProp="name" content={label} />
          </a>
          <meta itemProp="position" content={`${index}`} />
        </li>
      ))}
    </ul>
  );
};

export default ContainerBreadcrumbsMicrodata;
