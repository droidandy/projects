import React, { FC } from 'react';
import { Box, Grid } from '@material-ui/core';
import { ContainerWrapper, useBreakpoints } from '@marketplace/ui-kit';
import { Swiper, SwiperSlide } from 'swiper/react';
import { KeyConditionType } from 'containers/Finance/types/KeyConditionType';
import { KeyConditionItem } from './KeyConditionItem';
import { useStyles } from './KeyConditions.styles';

interface Props {
  keyConditions: KeyConditionType[];
  align?: 'center' | 'left';
}

const KeyConditions: FC<Props> = React.memo(({ keyConditions, align = 'left' }) => {
  const { isMobile } = useBreakpoints();
  const s = useStyles();

  return isMobile ? (
    <Box overflow="hidden" className={s.container} p="0 0.625rem">
      <Swiper loop={false} slidesPerView={1.1} spaceBetween={10} style={{ overflow: 'visible', zIndex: 2 }}>
        {keyConditions.map((card, index) => (
          <SwiperSlide key={index}>
            <KeyConditionItem item={card} align={align} />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  ) : (
    <ContainerWrapper>
      <Grid container>
        {keyConditions.map((card, index) => (
          <Grid item sm={3}>
            <KeyConditionItem item={card} key={index} align={align} />
          </Grid>
        ))}
      </Grid>
    </ContainerWrapper>
  );
});

export { KeyConditions };
