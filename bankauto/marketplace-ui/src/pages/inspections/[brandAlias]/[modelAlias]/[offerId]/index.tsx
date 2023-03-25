import React, { FC, memo, useMemo } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getSsrStore } from 'store';
import { checkAndSetCurrentCity, getPageContextValues } from 'helpers';
import { Meta } from 'components';
import { SellInspectionsContainer } from 'containers/Inspections';
import { LandingLayout } from 'layouts';
import { useBreakpoints } from '@marketplace/ui-kit';
import { useCity } from 'store/city';
import { getFormattedCity } from 'helpers/getFormattedCity';

const InspectionsInfo: FC = () => {
  const { isMobile } = useBreakpoints();
  const { current } = useCity();

  const meta = useMemo(() => {
    const city = getFormattedCity(current) === '\n в Москве и МО' ? 'в Москве' : getFormattedCity(current);
    return {
      title: `Выездная диагностика автомобиля перед покупкой ${city} - проверить авто с #банкавто`,
      description: 'Закажите выездную диагностику авто перед покупкой у специалистов #банкавто - быстро и недорого!',
    };
  }, [current]);
  return (
    <>
      <Meta {...meta} />
      <LandingLayout withNavigation={!isMobile}>
        <SellInspectionsContainer />
      </LandingLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext<any>) => {
  const store = getSsrStore();
  const { dispatch } = store;
  const issetCurrentCity = await checkAndSetCurrentCity(store, dispatch, context);
  const { city } = store.getState();

  if (!issetCurrentCity) {
    return { props: { context: getPageContextValues({ context }), initialState: { city } }, notFound: true };
  }

  return { props: { context: getPageContextValues({ context }), initialState: { city } } };
};

export default memo(InspectionsInfo);
