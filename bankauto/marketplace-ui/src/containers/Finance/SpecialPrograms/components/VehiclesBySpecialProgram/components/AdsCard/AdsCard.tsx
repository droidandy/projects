import React, { memo, FC } from 'react';
import { Box, Typography } from '@marketplace/ui-kit';
import { YoutubeEmbedded } from 'components/YoutubeEmbedded/YoutubeEmbeded';
import { useStyles } from './AdsCard.styles';

const steps1 = [
  'Выберите автомобиль',
  'Зарегистрируйтесь и забронируйте автомобиль',
  'Выберите и рассчитайте подходящие для вас условия покупки в кредит и трейд-ин',
];
const steps2 = ['Дилер свяжется с вами для назначения даты сделки', 'Заберите ваш автомобиль в дилерском центре'];

const sellStep1 = [
  'Выберите автомобиль',
  'Получите онлайн-одобрение кредита на этот или любой другой автомобиль',
  'Свяжитесь с продавцом и осмотрите автомобиль',
];
const sellStep2 = [
  'Договоритесь с продавцом об условиях сделки',
  'Приезжайте в офис РГС Банка вместе с продавцом для заключения безопасной сделки бесплатно',
];

const adsVideoId = '__INEPKfxRc';

type Props = {
  isHorizontal?: boolean;
  isForSell?: boolean;
};

export const AdsCard: FC<Props> = memo(({ isHorizontal = false, isForSell }) => {
  const s = useStyles();

  const getItem = (number: number, title: string) => (
    <Box pt={!isHorizontal ? 1.25 : 2} display="flex" flexWrap="nowrap">
      <Box pr={1.25}>
        <Typography variant="subtitle2" component="span" className={s.listItemPointer}>
          <Box className={s.number}>{number}</Box>
        </Typography>
      </Box>
      <Typography component="span" variant="subtitle2" style={{ lineHeight: '1.1rem' }}>
        {title}
      </Typography>
    </Box>
  );

  return (
    <Box
      flexDirection={!isHorizontal ? 'column' : 'row'}
      display="flex"
      flexWrap="nowrap"
      p={!isHorizontal ? 0 : 3.75}
      className={s.root}
    >
      <Box className={`${s.video}${isHorizontal ? ' gorisontal' : ''}`} mr={!isHorizontal ? 0 : 7.5}>
        <YoutubeEmbedded title="Узнайте, как купить онлайн" videoId={adsVideoId} />
      </Box>
      <Box className={s.content} p={!isHorizontal ? 3.75 : 0} pt={!isHorizontal ? 1.25 : 0} pb={!isHorizontal ? 5 : 0}>
        <Typography variant={isHorizontal ? 'h3' : 'h5'}>5 шагов к покупке онлайн</Typography>
        <Box display="flex" pt={!isHorizontal ? 1.75 : 0} flexDirection={!isHorizontal ? 'column' : 'row'}>
          <Box mr={isHorizontal ? 8 : 0} flexBasis="50%">
            {isForSell
              ? sellStep1.map((step, index) => <>{getItem(index + 1, step)}</>)
              : steps1.map((step, index) => <>{getItem(index + 1, step)}</>)}
          </Box>
          <Box flexBasis="50%">
            {isForSell
              ? sellStep2.map((step, index) => <>{getItem(steps1.length + 1 + index, step)}</>)
              : steps2.map((step, index) => <>{getItem(steps1.length + 1 + index, step)}</>)}
          </Box>
        </Box>
      </Box>
    </Box>
  );
});
