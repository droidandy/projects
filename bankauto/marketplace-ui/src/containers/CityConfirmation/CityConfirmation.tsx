import { getCityCookie, setCityCookie } from 'helpers/cookies/city';
import React, { FC, useEffect } from 'react';
import { useCity } from 'store/city';
import { analyticsCityConfirm } from 'helpers/analytics/events/analyticsCityConfirm';
import { ChoseCityPopup } from './ChoseCityPopup/ChoseCityPopup';

export const CityConfirmation: FC = () => {
  const {
    showCityConfirmation,
    setShowCityConfirmation,
    setCityModalOpen,
    current,
    current: { name: cityName },
  } = useCity();
  const cookieCity = getCityCookie();

  useEffect(() => {
    const {
      location: { host, pathname },
    } = window;

    const lowestDomainName = host.split('.')[0];

    const domainAlias = !(
      lowestDomainName.includes('localhost') ||
      lowestDomainName.includes('marketplace') ||
      lowestDomainName.includes('bankauto')
    )
      ? lowestDomainName
      : 'moskva';

    const shouldShowPopup =
      !pathname.startsWith('/finance') &&
      (!cookieCity ||
        (!(cookieCity.alias === 'moskva' || cookieCity.alias === 'russia') && domainAlias !== cookieCity.alias) ||
        (domainAlias !== 'moskva' && domainAlias !== cookieCity.alias));

    setShowCityConfirmation(shouldShowPopup);
  }, []);

  const handleConfirmCity = () => {
    setShowCityConfirmation(false);
    setCityCookie(current);
    analyticsCityConfirm();
  };

  const handleChangeCity = () => {
    setShowCityConfirmation(false);
    setCityModalOpen({ isCityModalOpen: true, initial: false });
    analyticsCityConfirm();
  };

  return showCityConfirmation ? (
    <ChoseCityPopup
      changeCity={handleChangeCity}
      confirmCity={handleConfirmCity}
      opened={showCityConfirmation}
      toggleVisibility={setShowCityConfirmation}
      cityName={cityName}
    />
  ) : null;
};
