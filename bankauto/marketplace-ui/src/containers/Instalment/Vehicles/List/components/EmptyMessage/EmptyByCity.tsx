import React, { FC, MouseEvent, useEffect, useState } from 'react';
import { Typography, useBreakpoints } from '@marketplace/ui-kit';
import { getCityFullUrl } from 'containers/ChooseCityContainer/components/ChooseCityModal/ChooseCityModal';
import { setCityCookie } from 'helpers/cookies/city';
import { City } from 'types/City';

const moscow: City = {
  name: 'Москва и МО',
  id: 1,
  alias: 'moskva',
  cases: {
    prepositional: 'Москве и МО',
    seo: null,
  },
};

export const EmptyByCity: FC = () => {
  const { isMobile } = useBreakpoints();
  const [url, setUrl] = useState<string>();

  const handleSetMoscow = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setCityCookie(moscow);
    window.location.assign(e.currentTarget.href);
  };

  useEffect(() => {
    setUrl(getCityFullUrl(moscow));
  }, []);

  return (
    <Typography component={isMobile ? 'p' : 'pre'} variant={isMobile ? 'subtitle2' : 'subtitle1'}>
      {'К сожалению, в вашем городе нет автомобилей в рассрочку.\n Посмотреть автомобили в '}
      <a href={url} onClick={handleSetMoscow} style={{ display: 'inline-block' }}>
        <Typography color="primary" variant="inherit" style={{ cursor: 'pointer' }}>
          других городах
        </Typography>
      </a>
    </Typography>
  );
};
