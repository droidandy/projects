import { ContainerWrapper, Img, useBreakpoints } from '@marketplace/ui-kit';
import { Box, Link, Typography } from '@material-ui/core';
import React, { useEffect, useMemo } from 'react';
import { useAdvertiseList } from 'store/finance/advertiseList';
import { Swiper } from 'components/Swiper';
import { useStyles } from './AdvertiseList.styles';

const AdvertiseList = () => {
  const styles = useStyles();
  const { isMobile } = useBreakpoints();
  const { items, fetchAdvertiseList } = useAdvertiseList();

  useEffect(() => {
    if (!items.length) {
      fetchAdvertiseList(4);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const slides = useMemo(
    () =>
      items?.map(({ id, url, name, description, mainImage }) => (
        <Link href={url} target="_blank" underline="none" className={styles.card} key={id}>
          <Img src={mainImage} width="100%" />
          <Typography variant="h4" className={styles.title}>
            {name}
          </Typography>
          <Typography variant="subtitle1" className={styles.subtitle}>
            {description}
          </Typography>
        </Link>
      )),
    [items, styles],
  );

  return items?.length ? (
    <ContainerWrapper className={styles.root} pb={5}>
      <Typography align="center" variant="h2" className={styles.header}>
        #автомаркет
      </Typography>
      <Box className={styles.list}>
        {isMobile ? (
          <Swiper loop={false} slidesPerView="auto" spaceBetween={10}>
            {slides}
          </Swiper>
        ) : (
          slides
        )}
      </Box>
    </ContainerWrapper>
  ) : null;
};

export { AdvertiseList };
