import React, { FC } from 'react';
import { HeaderFavoritesProps } from 'containers/Header/types';
import { Icon, IconButton } from '@marketplace/ui-kit';
import { ReactComponent as HeartIcon } from 'icons/heart.svg';
import { Link } from 'components';

export const HeaderFavoritesDesktop: FC<HeaderFavoritesProps> = ({ href }) => {
  return (
    <Link href={href} style={{ marginRight: '2.625rem' }} shallow>
      <IconButton arial-label="перейти в избранное" size="small" color="inherit">
        <Icon
          component={HeartIcon}
          htmlColor="black"
          style={{
            stroke: 'currentColor',
            fill: 'none',
          }}
        />
      </IconButton>
    </Link>
  );
};
