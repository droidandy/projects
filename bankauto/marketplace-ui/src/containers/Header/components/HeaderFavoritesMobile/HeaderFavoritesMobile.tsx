import { HeaderFavoritesProps } from 'containers/Header/types';
import React, { FC } from 'react';
import { Link } from 'components';
import { Box, Button, Icon, Typography } from '@marketplace/ui-kit';
import { ReactComponent as HeartIcon } from 'icons/heart.svg';

export const HeaderFavoritesMobile: FC<HeaderFavoritesProps> = ({ href, textStyle, transparent }) => {
  return (
    <Box px={2.5} py={1.5}>
      <Link href={href} color="inherit">
        <Button
          startIcon={
            <Icon
              viewBox="0 0 24 24"
              component={HeartIcon}
              htmlColor={transparent ? 'white' : 'black'}
              style={{
                stroke: 'currentColor',
                fill: 'none',
              }}
            />
          }
        >
          <Typography className={textStyle} variant="subtitle1" component="div">
            Избранное
          </Typography>
        </Button>
      </Link>
    </Box>
  );
};
