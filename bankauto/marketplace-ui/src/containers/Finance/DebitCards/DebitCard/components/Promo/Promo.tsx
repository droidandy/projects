import React, { FC, useCallback, memo } from 'react';
import { Box, useBreakpoints, Typography, Button } from '@marketplace/ui-kit';
import cx from 'classnames';
import { Swiper } from 'components/Swiper';
import { Banner } from 'store/types';
import { CardMedia } from '@material-ui/core';
import { useStyles } from './Promo.styles';

interface Props {
  banners: Banner[];
  buttonClickHandler: () => void;
}

export const Promo: FC<Props> = memo(({ banners, buttonClickHandler }) => {
  const { isMobile } = useBreakpoints();
  const s = useStyles();
  const renderBanner = useCallback(
    (banner: Banner, isMini = false) => {
      const subtitileDesktopVariant = isMini ? 'subtitle2' : 'subtitle1';
      return (
        <CardMedia image={banner.imageUrl} className={cx(s.banner, isMini && s.miniBanner)}>
          {banner.percent && (
            <Box textAlign="right">
              <Typography component="span" variant={isMobile ? 'h3' : 'h2'} className={s.percent}>
                {banner.percent}
              </Typography>
              <Typography component="span" variant={isMobile ? 'h3' : 'h2'}>
                %
              </Typography>
            </Box>
          )}
          <Box>
            <Typography component="h3" variant={isMini || isMobile ? 'subtitle2' : 'h3'} className={s.title}>
              {banner.title}
            </Typography>
            {banner.subtitile && (
              <Typography
                component="p"
                variant={isMobile ? 'body2' : subtitileDesktopVariant}
                className={isMini ? '' : s.subTitle}
              >
                {banner.subtitile}
              </Typography>
            )}
            {!isMini && !isMobile && (
              <Box pt="1.375rem" width="50%">
                <Button variant="contained" fullWidth color="primary" size="large" onClick={buttonClickHandler}>
                  <Typography variant="h5" component="span">
                    Заказать карту
                  </Typography>
                </Button>
              </Box>
            )}
          </Box>
        </CardMedia>
      );
    },
    [isMobile, s.banner, s.miniBanner, s.percent, s.subTitle, s.title],
  );

  return (
    <Box m={isMobile ? '0 0 1.25rem 0' : '0 auto'} width="98.75rem" maxWidth="100%">
      {isMobile ? (
        <>
          <Box className={s.mobileRoot}>
            <Swiper loop={false} slidesPerView="auto" spaceBetween={0}>
              {banners.map((banner) => renderBanner(banner))}
            </Swiper>
          </Box>
          {isMobile && (
            <Box p="1.375rem 1.25rem 0">
              <Button variant="contained" fullWidth color="primary" size="large" onClick={buttonClickHandler}>
                <Typography variant="h5" component="span">
                  Заказать карту
                </Typography>
              </Button>
            </Box>
          )}
        </>
      ) : (
        <Box display="flex" height="30rem" width="100%" justifyContent="space-between">
          {renderBanner(banners[0])}
          <Box display="flex" flexWrap="wrap" width="calc(50% + 1.25rem)" flexGrow="1" flexShrink="0">
            {banners.map((banner, index) => index > 0 && renderBanner(banner, true))}
          </Box>
        </Box>
      )}
    </Box>
  );
});
