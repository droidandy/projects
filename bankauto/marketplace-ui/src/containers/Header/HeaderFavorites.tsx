import { useBreakpoints } from '@marketplace/ui-kit';
import React, { FC, memo } from 'react';
import { HeaderFavoritesProps } from 'containers/Header/types';
import { HeaderFavoritesDesktop } from './components/HeaderFavoritesDesktop/HeaderFavoritesDesktop';
import { useStyles } from './components/HeaderMobile/Header.styles';
import { HeaderFavoritesMobile } from './components/HeaderFavoritesMobile/HeaderFavoritesMobile';

const FavoritesRoot: FC<HeaderFavoritesProps> = ({ href, transparent }) => {
  const { isMobile } = useBreakpoints();
  const classes = useStyles();

  return (
    <>
      {isMobile ? (
        <HeaderFavoritesMobile href={href} textStyle={classes.profileButtonText} transparent={transparent} />
      ) : (
        <HeaderFavoritesDesktop href={href} />
      )}
    </>
  );
};

export const HeaderFavorites = memo(FavoritesRoot);
