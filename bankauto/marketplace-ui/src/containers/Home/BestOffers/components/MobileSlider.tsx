import React, { FC } from 'react';
import ReactIdSwiper from 'react-id-swiper/lib/ReactIdSwiper.custom';
import { VEHICLE_TYPE } from '@marketplace/ui-kit/types';
import { Box, Divider, Typography, TabsContent } from '@marketplace/ui-kit';
import { AdsCardCustom } from 'containers/Vehicles/components/AdsCard';
import { TabsWrapper } from 'components';
import { NavButton } from 'components/Swiper/SwiperNavButton';
import { SliderProps } from './DesktopSlider';
import { SlideProgress } from './SlideProgress';
import { useStyles } from './Slider.styles';

const Slider: FC<Pick<SliderProps, 'slides' | 'sliderRef' | 'sliderParamas' | 'loading'>> = ({
  slides,
  sliderRef,
  sliderParamas,
  loading,
}) => {
  return (
    <Box position="relative" ml={-1.25} mr={-1.25}>
      {slides && !loading ? (
        <ReactIdSwiper {...sliderParamas} ref={sliderRef}>
          {slides}
        </ReactIdSwiper>
      ) : (
        <SlideProgress />
      )}
      <AdsCardCustom />
    </Box>
  );
};

export const MobileSlider: FC<SliderProps> = ({
  title,
  changeTab,
  activeTab,
  goPrev,
  goNext,
  slides,
  loading,
  children,
  ...rest
}) => {
  const { root, divider, sliderTitle } = useStyles();
  return (
    <>
      <Box display="flex" alignItems="flex-end" justifyContent="space-between" flexWrap="nowrap" pb={1.25}>
        <Typography component="h2" variant="h4" align="left" className={sliderTitle}>
          {title}
        </Typography>
        <Box display="flex" flexWrap="nowrap">
          <NavButton direction="prev" onClick={goPrev} />
          <NavButton direction="next" onClick={goNext} style={{ marginLeft: '1.125rem' }} />
        </Box>
      </Box>
      <TabsWrapper
        colorScheme="blackRed"
        tabs={['Новые', 'C пробегом']}
        value={activeTab === VEHICLE_TYPE.NEW ? 0 : 1}
        className={root}
        handleChange={changeTab}
      />
      <Divider className={divider} />
      {children}
      <Box pt={1.25} pb={2.5}>
        {slides || loading ? (
          <TabsContent value={activeTab === VEHICLE_TYPE.NEW ? 0 : 1}>
            <Slider key={VEHICLE_TYPE.NEW} slides={slides} loading={loading} {...rest} />
            <Slider key={VEHICLE_TYPE.USED} slides={slides} loading={loading} {...rest} />
          </TabsContent>
        ) : null}
      </Box>
    </>
  );
};
