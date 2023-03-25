import React, { useMemo } from 'react';
import { Box } from '@material-ui/core';
import { ContainerWrapper, useBreakpoints } from '@marketplace/ui-kit';
import { FinanceCard } from 'components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ReactComponent as IconShieldCheckColor } from 'icons/iconShieldCheckColor.svg';
import { ReactComponent as IconForm } from 'icons/iconFormDark.svg';
import { ReactComponent as IconFileText } from 'icons/iconFileText.svg';
import { ReactComponent as IconNoMoney } from 'icons/iconNoMoney.svg';

import { useStyles } from './FinanceCards.styles';

const cards = [
  {
    title: 'Кредитное решение онлайн',
    subTitle: 'Сертификат подтверждает готовность банка предоставить вам кредит',
    icon: <IconFileText />,
  },
  {
    title: 'Проверка автомобиля банком',
    subTitle: 'Наши эксперты проверят юридическую чистоту автомобиля',
    icon: <IconForm />,
  },
  {
    title: 'Мы подготовим весь комплект документов',
    subTitle: 'Документы для сделки купли-продажи, кредитная документация, финансовые расчёты ',
    icon: <IconShieldCheckColor />,
  },
  {
    title: 'Это совершенно бесплатно!',
    subTitle: 'Не возьмем никакой платы за помощь в организации сделки',
    icon: <IconNoMoney />,
  },
];

const FinanceCards = () => {
  const { isMobile } = useBreakpoints();
  const styles = useStyles();

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
        return isMobile ? <SwiperSlide>{card}</SwiperSlide> : card;
      }),
    [isMobile, styles.card],
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
