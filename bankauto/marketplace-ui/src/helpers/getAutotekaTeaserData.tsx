import React from 'react';
import * as icons from 'icons/autoteka';
import { AutotekaTeaserData } from '@marketplace/ui-kit';

export type TeaserData = {
  title: string;
  reportAvailable: boolean;
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
};
export const getAutotekaTeaserData = (rawTeaserData: AutotekaTeaserData) => {
  const data: TeaserData[] = [
    {
      title: 'Один владелец по ПТС',
      reportAvailable: rawTeaserData.isOneOwner,
      icon: icons.IconPts,
    },
    {
      title: 'ДТП не обнаружены',
      reportAvailable: rawTeaserData.withoutCrashes,
      icon: icons.IconLightning,
    },
    {
      title: 'Регулярное ТО',
      reportAvailable: rawTeaserData.hasRegularService,
      icon: icons.IconWrench,
    },
    {
      title: 'Реальный пробег',
      reportAvailable: rawTeaserData.isRealMileage,
      icon: icons.IconMileage,
    },
  ];
  return data;
};
