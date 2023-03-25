import React, { memo } from 'react';
import useBreakpoints from '@marketplace/ui-kit/hooks/useBreakpoints';
import { useCity } from 'store/city';
import { ReactComponent as LocationWhite } from 'icons/iconLocationWhite.svg';
import { ReactComponent as LocationDark } from 'icons/iconLocation.svg';
import { HeaderCityDesktop } from './components/HeaderCityDesktop/HeaderCityDesktop';
import { HeaderCityMobile } from './components/HeaderCityMobile/HeaderCityMobile';
import { useStyles } from './components/HeaderDesktop/Header.styles';

const CityRoot = ({ transparent }: { transparent?: boolean }) => {
  const { isMobile } = useBreakpoints();
  const {
    current: { name: cityName },
    changeCityModalVisibility,
    extraCoverageRadius,
  } = useCity();
  const classes = useStyles({ transparent });
  const onCityButtonClick = () => {
    changeCityModalVisibility(true);
  };

  return (
    <>
      {isMobile ? (
        <HeaderCityMobile
          cityName={cityName}
          coverageRadius={extraCoverageRadius}
          onClick={onCityButtonClick}
          icon={transparent ? LocationWhite : LocationDark}
          textStyle={classes.profileButtonText}
        />
      ) : (
        <HeaderCityDesktop
          cityName={cityName}
          onClick={onCityButtonClick}
          icon={LocationDark}
          textStyle={classes.profileButtonText}
          coverageRadius={extraCoverageRadius}
        />
      )}
    </>
  );
};

export const HeaderCity = memo(CityRoot);
