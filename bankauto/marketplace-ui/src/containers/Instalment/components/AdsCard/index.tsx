import React, { FC, Fragment, memo } from 'react';
import { Box, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { YoutubeEmbedded } from 'components/YoutubeEmbedded/YoutubeEmbeded';
import { useStyles } from './AdsCard.styles';

const steps1: string[] = [
  'Выберите автомобиль',
  'Зарегистрируйтесь и забронируйте автомобиль',
  'Получите одобрение рассрочки от Банка',
];
const steps2: string[] = [
  'Дилер свяжется с вами для назначения времени сделки',
  'Заберите ваш автомобиль в дилерском центре',
];

const adsVideoId = '__INEPKfxRc';

type Props = {
  isHorizontal?: boolean;
};

export const AdsCard: FC<Props> = memo(({ isHorizontal = false }) => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();
  const isVertical = !isHorizontal && !isMobile;
  const isVerticalMobile = !isHorizontal && isMobile;

  const getItem = (number: number, title: string) => (
    <Box>
      <Box display="flex" flexWrap="nowrap" pb={isHorizontal ? 2.2 : 1.75}>
        <Box pr={1.25}>
          <Typography variant="caption" component="span" className={s.listItemPointer}>
            <Box className={s.number}>{number}</Box>
          </Typography>
        </Box>
        <Typography component="span" variant="caption" style={{ fontWeight: 600 }}>
          {title}
        </Typography>
      </Box>
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
      <Box className={`${s.video}${isHorizontal ? ' horizontal' : ''}`} mr={!isHorizontal ? 0 : 7.5}>
        <YoutubeEmbedded title="Узнайте, как купить онлайн" videoId={adsVideoId} />
      </Box>
      <Box
        className={s.content}
        pt={(isVertical && 1.25) || (isVerticalMobile && 2.5)}
        pb={(isVertical && 4) || (isVerticalMobile && 0.5)}
        pl={(isVertical && 3.75) || (isVerticalMobile && 2.5)}
        pr={(isVertical && 5.25) || (isVerticalMobile && 5)}
      >
        <Box pb={isMobile ? 2.5 : 3}>
          <Typography component="div" variant={isHorizontal ? 'h3' : 'h5'}>
            5 шагов к покупке в рассрочку
          </Typography>
        </Box>
        <Box display="flex" flexDirection={!isHorizontal ? 'column' : 'row'}>
          <Box mr={isHorizontal ? 12.5 : 0} flexBasis="50%">
            {steps1.map((step: string, index: number) => (
              <Fragment key={index}>{getItem(index + 1, step)}</Fragment>
            ))}
          </Box>
          <Box flexBasis="50%">
            {steps2.map((step: string, index: number) => (
              <Fragment key={index}>{getItem(steps1.length + 1 + index, step)}</Fragment>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
});
