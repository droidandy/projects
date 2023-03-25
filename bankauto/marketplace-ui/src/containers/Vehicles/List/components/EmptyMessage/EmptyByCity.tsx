import React, { FC, MouseEvent, useEffect, useState } from 'react';
import { Typography, useBreakpoints } from '@marketplace/ui-kit';
import { VEHICLE_TYPE_ID } from '@marketplace/ui-kit/types';
import { setCityCookie } from 'helpers/cookies/city';
import { City } from 'types/City';

interface Props {
  type: VEHICLE_TYPE_ID;
}

const unsetCity: City = {
  name: 'Вся Россия',
  id: null,
  alias: 'all',
  cases: {
    prepositional: 'Всей России',
    seo: null,
  },
};

const getUnsetCityUrl = () => {
  const {
    location: { host, protocol, pathname, search },
  } = window;
  const splitHost = host.split('.');
  const hasCitySubdomain = host.includes('localhost') ? splitHost.length > 1 : splitHost.length > 2;
  const nextDomain = hasCitySubdomain ? splitHost.slice(1).join('.') : host;
  return `${protocol}//${nextDomain}${pathname}${search}`;
};

export const EmptyByCity: FC<Props> = ({ type }) => {
  const { isMobile } = useBreakpoints();
  const [url, setUrl] = useState<string>();

  const handleResetCity = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setCityCookie(unsetCity);
    window.location.assign(e.currentTarget.href);
  };

  useEffect(() => {
    setUrl(getUnsetCityUrl());
  }, []);

  return (
    <Typography component={isMobile ? 'p' : 'pre'} variant={isMobile ? 'subtitle2' : 'subtitle1'}>
      {`К сожалению, в вашем городе нет автомобилей${+type ? ' с пробегом' : ''}.\n Посмотреть автомобили в `}
      <a href={url} onClick={handleResetCity} style={{ display: 'inline-block' }}>
        <Typography color="primary" variant="inherit" style={{ cursor: 'pointer' }}>
          других городах
        </Typography>
      </a>
    </Typography>
  );
};
