import React, { FC } from 'react';
import cx from 'classnames';
import { SwiperRefNode } from 'react-id-swiper';
import ReactIdSwiper from 'react-id-swiper/lib/ReactIdSwiper.custom';
import { ReactIdSwiperCustomProps } from 'react-id-swiper/lib/types';
import { VEHICLE_TYPE } from '@marketplace/ui-kit/types';
import { Box, Grid, Typography, TabsContent } from '@marketplace/ui-kit';
import { AdsCardCustom } from 'containers/Vehicles/components';
import { TabsWrapper } from 'components';
import { NavButton } from 'components/Swiper/SwiperNavButton';
import { SlideProgress } from './SlideProgress';
import { useStyles } from './Slider.styles';

export type SliderProps = {
  slides?: JSX.Element[] | null;
  title: string;
  activeTab: VEHICLE_TYPE;
  changeTab: (event: React.ChangeEvent<any>, tabIndex: 0 | 1) => void;
  goPrev: () => void;
  goNext: () => void;
  sliderRef: React.RefObject<SwiperRefNode>;
  sliderParamas: ReactIdSwiperCustomProps;
  loading: boolean;
};

const Slider: FC<Omit<SliderProps, 'title' | 'changeTab' | 'activeTab'>> = ({
  slides,
  goPrev,
  goNext,
  sliderRef,
  sliderParamas,
  loading,
}) => {
  const classes = useStyles();
  return (
    <Box position="relative">
      {slides && !loading ? (
        <>
          <ReactIdSwiper {...sliderParamas} ref={sliderRef}>
            {slides}
          </ReactIdSwiper>
          <NavButton direction="prev" onClick={goPrev} className={cx(classes.navButton, classes.buttonPrev)} />
          <NavButton direction="next" onClick={goNext} className={cx(classes.navButton, classes.buttonNext)} />
        </>
      ) : (
        <Grid container alignItems="center">
          <Grid item xs={12} sm={9}>
            <SlideProgress />
          </Grid>
          <Grid item xs={12} sm={3}>
            <AdsCardCustom />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export const DesktopSlider: FC<SliderProps> = ({ title, changeTab, activeTab, slides, loading, children, ...rest }) => {
  const { root } = useStyles();
  return (
    <Box pb={5}>
      <Box pb={2.5}>
        <Typography component="h2" variant="h2" align="center">
          {title}
        </Typography>
      </Box>
      <TabsWrapper
        colorScheme="blackRed"
        tabs={['Новые автомобили', 'Автомобили с пробегом']}
        value={activeTab === VEHICLE_TYPE.NEW ? 0 : 1}
        className={root}
        handleChange={changeTab}
        centered
      />
      {children}
      <Box pt={5}>
        {slides || loading ? (
          <TabsContent value={activeTab === VEHICLE_TYPE.NEW ? 0 : 1}>
            <Slider key={VEHICLE_TYPE.NEW} slides={slides} loading={loading} {...rest} />
            <Slider key={VEHICLE_TYPE.USED} slides={slides} loading={loading} {...rest} />
          </TabsContent>
        ) : null}
      </Box>
    </Box>
  );
};
