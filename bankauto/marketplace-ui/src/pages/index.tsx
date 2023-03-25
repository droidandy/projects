import React, { FC, memo, useEffect, useState } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { parseUrl } from 'query-string';
import { VehiclesFilterParams } from '@marketplace/ui-kit/types';
import { ComparisonLoader } from 'containers/PersonalArea/Comparison';
import { HeroNew, MetaContainer, HomeContent } from 'containers/Home';
import { FavoritesLoader } from 'containers/Favorites';
import { MAIN_PAGE_REQUESTS_TIMEOUT } from 'api/request';
import { PagePropsBase } from 'types/PagePropsBase';
import { HomeTab } from 'types/Home';
import { getSsrStore } from 'store/ssr';
import { useHomeState } from 'store/home';
import { fetchBlogPosts } from 'store/blog';
import { fetchVehiclesMeta } from 'store/catalog/vehicles/meta';
import { fetchVehiclesFilterData, setVehiclesFilterValues, useVehiclesFilter } from 'store/catalog/vehicles/filter';
import { fetchBrandsAction } from 'store/catalog/brands';
import { LandingPageLayout } from 'layouts/LandingPageLayout';
import { checkAndSetCurrentCity, stringifyFilterQuery, getPageContextValues, parseQueryFilter } from 'helpers';

const RouterSaver = () => {
  const router = useRouter();
  const { activeTab, initial: initialTab } = useHomeState();
  const { values, initial: initialFilter } = useVehiclesFilter();
  const [prevQuery, setPrevQuery] = useState('');

  useEffect(() => {
    if (!(initialTab && initialFilter)) {
      const path = '';
      const query = activeTab === HomeTab.BUY ? stringifyFilterQuery(values) : '';
      if (query !== prevQuery || path.replace(/\//g, '') !== window.location.pathname.replace(/\//g, '')) {
        setPrevQuery(query);
        router.push('/', { pathname: `/${path}`, query }, { shallow: true, scroll: false });
      }
    }
  }, [values, activeTab, initialTab, initialFilter]);
  return null;
};

const VehiclesPage: FC = () => {
  return (
    <LandingPageLayout>
      <FavoritesLoader />
      <ComparisonLoader />
      <RouterSaver />
      <MetaContainer />
      <HeroNew />
      <HomeContent />
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
    ...(context.req.url?.includes('/installment/') ? {} : parseUrl(context.req.url || '').query),
  };

  const { brand = [], model = [] } = reqQuery;

  const filterVehicleDataParams: VehiclesFilterParams = {
    brandId: Array.isArray(brand) ? brand.map((v) => +v) : [Number(brand)],
    modelId: Array.isArray(model) ? model.map((v) => +v) : [Number(model)],
  };

  // Для заполнения фильтров
  await dispatch(fetchVehiclesFilterData(filterVehicleDataParams));

  const vehiclesFilterData = store.getState().vehiclesFilter.data;

  const vehiclesFilterValues = {
    ...parseQueryFilter(
      {
        ...reqQuery,
        brand: reqQuery.brand as any,
        model: reqQuery.model as any,
      },
      vehiclesFilterData,
    ),
  };

  await Promise.all([
    dispatch(fetchVehiclesMeta({}, { timeout: MAIN_PAGE_REQUESTS_TIMEOUT })),
    dispatch(setVehiclesFilterValues(vehiclesFilterValues, false)),
    dispatch(fetchBrandsAction()),
    dispatch(fetchBlogPosts({ timeout: MAIN_PAGE_REQUESTS_TIMEOUT })),
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
          meta: { ...home.meta, activeTab: HomeTab.BUY, vehiclesCount: vehiclesMeta.meta.count },
        },
        instalmentFilter,
        city,
      },
    },
  };
};

export default memo(VehiclesPage);
