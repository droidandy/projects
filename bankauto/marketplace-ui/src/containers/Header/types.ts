import { AppBarProps } from '@material-ui/core/AppBar';
import { MenuLinkItems } from 'hooks/useMenuLinks';
import React from 'react';

type HeaderSectionsMainProps = {
  transparent?: boolean;
  href: string | undefined;
  textStyle?: string;
};
export type HeaderProps = AppBarProps & {
  links: MenuLinkItems;
  transparent?: boolean;
};

export type HeaderCityProps = {
  cityName: string;
  onClick: () => void;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  textStyle: string;
  coverageRadius?: number;
};

export type HeaderFavoritesProps = HeaderSectionsMainProps;
export type HeaderComparisonProps = HeaderSectionsMainProps;
