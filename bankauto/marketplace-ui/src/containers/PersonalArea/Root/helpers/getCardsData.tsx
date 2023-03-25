import React from 'react';
import { MenuItems } from 'constants/menuItems';
import {
  ComparisonsIcon,
  HardIcon,
  OfferIcon,
  OrderIcon,
  PoliciesIcon,
  ProfileIcon,
  ReportIcon,
} from 'icons/profileRoot';
import { IconWrench } from 'icons/inspections';
import { ProfileCards } from 'containers/PersonalArea/Root/types';
import { CARDS } from '../constants';

export const getCardsData = (userFullName?: string, isMobile?: boolean): ProfileCards => {
  const viewBoxSize = isMobile ? 32 : 64;
  return {
    mainCards: [
      {
        id: CARDS.PERSONAL_INFO,
        title: userFullName || 'Личная информация',
        link: MenuItems.PersonalInfo.href,
        icon: <ProfileIcon width={viewBoxSize} height={viewBoxSize} />,
      },
      {
        id: CARDS.APPLICATIONS,
        title: 'Мои заявки',
        link: MenuItems.Applications.href,
        icon: <OrderIcon width={viewBoxSize} height={viewBoxSize} />,
      },
      {
        id: CARDS.OFFERS,
        title: 'Мои объявления',
        link: MenuItems.Offers.href,
        icon: <OfferIcon width={viewBoxSize} height={viewBoxSize} />,
      },
      {
        id: CARDS.FAVORITES,
        title: 'Избранное',
        link: MenuItems.Favorites.href,
        icon: <HardIcon width={viewBoxSize} height={viewBoxSize} />,
      },
    ],
    subCards: [
      {
        id: CARDS.SERVICE,
        title: 'Запись на сервис',
        link: MenuItems.Remont.href,
        icon: <IconWrench width={viewBoxSize} height={viewBoxSize} viewBox="0 0 64 64" />,
      },
      {
        id: CARDS.POLICIES,
        title: 'ОСАГО',
        link: MenuItems.Policies.href,
        icon: <PoliciesIcon width={viewBoxSize} height={viewBoxSize} />,
      },
      {
        id: CARDS.COMPARISONS,
        title: 'Сравнения',
        link: MenuItems.Comparison.href,
        icon: <ComparisonsIcon width={viewBoxSize} height={viewBoxSize} />,
      },
      {
        id: CARDS.REVIEWS,
        title: 'Отзывы',
        link: MenuItems.Reviews.href,
        icon: <ReportIcon width={viewBoxSize} height={viewBoxSize} />,
      },
    ],
  };
};
