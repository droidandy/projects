import React from 'react';
import { Box, Typography, useBreakpoints, ContainerWrapper } from '@marketplace/ui-kit';
import { Swiper } from 'components/Swiper';
import { ServiceItem, FaceType } from './ServiceItem';
import { useStyles } from './ServiceCatalog.styles';

const ITEMS = [
  {
    id: 1,
    title: 'Техническое обслуживание',
    text: 'Побор и проведение работ по техническому обслуживанию вашего автомобиля ',
    source: '/images/service/maintenance.jpg',
  },
  {
    id: 2,
    title: 'Ремонт автомобиля',
    text: 'Поиск и устранение неисправностей автомобиля',
    source: '/images/service/carRepair.jpg',
  },
  {
    id: 3,
    title: 'Шиномонтаж',
    text: 'Побор удобного центра с учетом типа и размера колес',
    source: '/images/service/tireFitting.jpg',
  },
  {
    id: 4,
    title: 'Диагностика',
    text: 'Поиск и рекомендации по устранению неисправностей',
    source: '/images/service/diagnostics.jpg',
  },
  {
    id: 5,
    title: 'Кузовной ремонт',
    text: 'Качественный кузовной ремонт с попаданием в цвет',
    source: '/images/service/bodyRepair.jpg',
  },
];

export const ServiceCatalog = React.memo(() => {
  const { isMobile } = useBreakpoints();
  const s = useStyles();

  return (
    <ContainerWrapper className={s.container}>
      <Typography align="center" variant={isMobile ? 'h4' : 'h2'} className={s.header}>
        Наши услуги
      </Typography>
      {isMobile ? (
        <Swiper loop={false} slidesPerView="auto" spaceBetween={0}>
          {ITEMS.map((post) => (
            <Box width="90%" position="relative" key={post.id} mr={1.25}>
              <ServiceItem {...post} href="#" />
            </Box>
          ))}
        </Swiper>
      ) : (
        <Box className={s.gridContainer}>
          {ITEMS.map((post, i) => {
            const className = `gridItem${i}` as 'gridItem0' | 'gridItem1' | 'gridItem2' | 'gridItem3' | 'gridItem4';
            return (
              <Box className={s[className]} key={post.id}>
                <ServiceItem {...post} href="#" face={i === 0 ? FaceType.SECONDARY : FaceType.PRIMARY} />
              </Box>
            );
          })}
        </Box>
      )}
    </ContainerWrapper>
  );
});
