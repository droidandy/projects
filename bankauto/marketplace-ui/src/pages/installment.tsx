import React, { FC, memo } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { parseUrl } from 'query-string';
import { VEHICLE_TYPE_ID, VehiclesFilterParams } from '@marketplace/ui-kit/types';
import { PagePropsBase } from 'types/PagePropsBase';
import { HomeTab } from 'types/Home';
import { getSsrStore } from 'store';
import { fetchInstalmentMeta } from 'store/instalment/vehicles/meta';
import { fetchInstalmentVehiclesFilterData, setInstalmentVehiclesFilterValues } from 'store/instalment/vehicles/filter';
import { LandingPageLayout } from 'layouts';
import { FavoritesLoader } from 'containers/Favorites';
import { HeroNew, MetaContainer } from 'containers/Home';
import { HomePageContent as HomePageInstalmentContent } from 'containers/Instalment/components/HomePageContent/HomePageContent';
import { checkAndSetCurrentCity, getPageContextValues, parseQueryFilter } from 'helpers';

const VehiclesPage: FC = () => {
  return (
    <LandingPageLayout>
      <FavoritesLoader />
      <MetaContainer />
      <HeroNew />
      <HomePageInstalmentContent />
    </LandingPageLayout>
  );
};

export const getServerSideProps: GetServerSideProps<PagePropsBase> = async (
  context: GetServerSidePropsContext<any>,
) => {
  const store = getSsrStore();
  const { dispatch } = store;

  const issetCurrentCity = await checkAndSetCurrentCity(store, dispatch, context);
  const { city } = store.getState();

  if (!issetCurrentCity) {
    return {
      props: { context: getPageContextValues({ context }), initialState: { city } },
      notFound: true,
    };
  }

  const reqQuery = {
    ...context.query,
    ...(context.req.headers.referer?.includes('/installment/')
      ? parseUrl(context.req.headers.referer || '').query
      : {}),
  };

  const { brand = [], model = [] } = reqQuery;

  const filterInstalmentDataParams: VehiclesFilterParams = {
    type: VEHICLE_TYPE_ID.USED,
    brandId: Array.isArray(brand) ? brand.map((v) => +v) : [Number(brand)],
    modelId: Array.isArray(model) ? model.map((v) => +v) : [Number(model)],
  };

  await dispatch(fetchInstalmentVehiclesFilterData(filterInstalmentDataParams));

  const installmentFilterData = store.getState().instalmentFilter.data;
  const installmentFilterValues = {
    ...parseQueryFilter(
      {
        ...reqQuery,
        brand: reqQuery.brand as any,
        model: reqQuery.model as any,
      },
      installmentFilterData,
    ),
  };

  await Promise.all([
    dispatch(fetchInstalmentMeta({})),
    dispatch(setInstalmentVehiclesFilterValues(installmentFilterValues)),
  ]);

  const { vehiclesMeta, blog, brandsNew, vehiclesFilter, home, instalmentMeta, instalmentFilter } = store.getState();

  return {
    props: {
      context: getPageContextValues({ context }),
      initialState: {
        vehiclesMeta,
        blog,
        brandsNew,
        vehiclesFilter,
        instalmentMeta,
        home: {
          ...home,
          activeTab: HomeTab.INSTALLMENT,
          meta: { ...home.meta, vehiclesCount: vehiclesMeta.meta.count },
        },
        instalmentFilter,
        city,
      },
    },
  };
};

export default memo(VehiclesPage);
