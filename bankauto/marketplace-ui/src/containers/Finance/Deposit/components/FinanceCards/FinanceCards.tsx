import React, { useMemo } from 'react';
import { Box } from '@material-ui/core';
import { ContainerWrapper, useBreakpoints } from '@marketplace/ui-kit';
import { FinanceCard } from 'components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { PageInfoBenefits } from '../../../types/PageInfo';
import { useStyles } from './FinanceCards.styles';

const FinanceCards = ({ items }: { items: PageInfoBenefits[] }) => {
  const { isMobile } = useBreakpoints();
  const styles = useStyles();

  const cards = items?.map((item) => ({
    title: item.mainText,
    subTitle: item.additionalText,
    icon: (
      <div
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          // eslint-disable-next-line @typescript-eslint/naming-convention
          __html: isMobile ? item.mobileSvgIcon : item.svgIcon,
        }}
      />
    ),
  }));

  const cardsElements = useMemo(
    () =>
      cards?.map((props) => {
        const card = (
          <FinanceCard
            {...props}
            direction="column"
            transparent={!isMobile}
            className={styles.card}
            key={props.title}
          />
        );
        return isMobile ? <SwiperSlide key={props.title}>{card}</SwiperSlide> : card;
      }),
    [cards, isMobile, styles.card],
  );

  return (
    <ContainerWrapper className={styles.wrapper}>
      <Box className={styles.cards}>
        {isMobile ? (
          <Swiper loop={false} slidesPerView={1.1} spaceBetween={10}>
            {cardsElements}
          </Swiper>
        ) : (
          cardsElements
        )}
      </Box>
    </ContainerWrapper>
  );
};

export { FinanceCards };
