import React, { FC, memo, useCallback, useEffect } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { parse, parseUrl } from 'query-string';
import { Box, ContainerWrapper, Grid, useBreakpoints } from '@marketplace/ui-kit';
import { VEHICLE_TYPE, VEHICLE_TYPE_ID } from '@marketplace/ui-kit/types';
import { PagePropsBase } from 'types/PagePropsBase';
import { VehicleSortType } from 'types/VehicleSortTypes';
import { getSsrStore } from 'store';
import {
  fetchInstalmentVehiclesFilterData,
  setInstalmentVehiclesFilterValues,
  useInstalmentFilter,
} from 'store/instalment/vehicles/filter';
import { fetchInstalmentMeta } from 'store/instalment/vehicles/meta';
import { setInstalmentListItems } from 'store/instalment/vehicles/list';
import {
  VehiclesMetaContainer,
  VehiclesHero,
  SortContainer,
  VehiclesListContainer,
  FilterContainer,
} from 'containers/Instalment';
import { CatalogLayout } from 'layouts';
import { parseQueryFilter, stringifyFilterQuery } from 'helpers/filter';
import { VehiclesFilterParams } from 'types/VehicleFilterParams';
import { checkAndSetCurrentCity, getPageContextValues } from 'helpers';

interface Props extends PagePropsBase {}

const QueryFilterSaver = () => {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const { values, data, initial, setInstalmentVehiclesFilterValues } = useInstalmentFilter();
  const router = useRouter();

  const carType = (values.type != null && (Number(values.type) === VEHICLE_TYPE_ID.USED ? 'used' : 'new')) || null;

  const isNotEmptyValues = Object.entries(values).find((item) => !!item[1]);

  const queryItems = typeof window !== 'undefined' ? parse(window.location.search) : {};

  const setFilterData = useCallback(async () => {
    const vehiclesFilterValues = parseQueryFilter({ ...queryItems, type: `${VEHICLE_TYPE_ID.USED}` }, data);
    // const vehiclesFilterValues = parseQueryFilter({ ...queryItems, type: `${VEHICLE_TYPE_ID.USED}` }, data);
    await setInstalmentVehiclesFilterValues(vehiclesFilterValues, true);
  }, [queryItems]);

  useEffect(() => {
    if (!initial) {
      const q = stringifyFilterQuery(values);
      router.push(
        `/installment/vehicles${carType ? '/[type]' : ''}`,
        { pathname: `/installment/vehicles${carType ? `/${carType}` : ''}`, query: q },
        { shallow: true },
      );
    } else if (Object.entries(queryItems).length && !isNotEmptyValues) {
      setFilterData();
    }
  }, [values, initial]);

  return null;
};

const InstalmentListPage: FC<Props> = () => {
  const { isMobile } = useBreakpoints();

  return (
    <>
      <QueryFilterSaver />
      <VehiclesMetaContainer />
      <CatalogLayout>
        {isMobile ? (
          <>
            <ContainerWrapper bgcolor="grey.200" pb={2.5}>
              <Box pt={1.5} pb={2.5}>
                <VehiclesHero />
              </Box>
              <FilterContainer />
              <Box display="flex" pt={2.5} justifyContent="center" alignItems="center">
                <SortContainer />
              </Box>
            </ContainerWrapper>
            <ContainerWrapper>
              <Box pb={3.125}>
                <VehiclesListContainer />
              </Box>
            </ContainerWrapper>
          </>
        ) : (
          <ContainerWrapper mb={7.5} pt={0.625}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-end">
              <VehiclesHero />
              <SortContainer />
            </Box>

            <Box mt={2.5}>
              <Grid container spacing={5}>
                <Grid item xs={3}>
                  <Box position="sticky" top="6rem">
                    <FilterContainer />
                  </Box>
                </Grid>
                <Grid item xs={9}>
                  <VehiclesListContainer />
                </Grid>
              </Grid>
            </Box>
          </ContainerWrapper>
        )}
      </CatalogLayout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (context: GetServerSidePropsContext<any>) => {
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

  const reqQuery = { ...context.query, ...parseUrl(context.req.headers.referer || '').query };

  const slug = (reqQuery.slug || []) as string[];

  const slugWithType = [...(slug[0] === VEHICLE_TYPE.NEW || slug[0] === VEHICLE_TYPE.USED ? [] : [null]), ...slug];

  if (slugWithType.length > 1) {
    return {
      props: { context: getPageContextValues({ context }), initialState: { city } },
      notFound: true,
    };
  }

  const [type] = slugWithType;

  const typeId: any =
    type === VEHICLE_TYPE.NEW ? VEHICLE_TYPE_ID.NEW : (type === VEHICLE_TYPE.USED && VEHICLE_TYPE_ID.USED) || undefined;

  const { brand = [], model = [], page } = context.query;

  const filterDataParams: VehiclesFilterParams = {
    // type: VEHICLE_TYPE_ID.USED,
    type: typeId,
    brandId: Array.isArray(brand) ? brand.map((v) => +v) : [+brand],
    modelId: Array.isArray(model) ? model.map((v) => +v) : [+model],
  };

  await dispatch(fetchInstalmentVehiclesFilterData(filterDataParams));
  const vehiclesFilterValues = parseQueryFilter(
    // { ...context.query, type: `${VEHICLE_TYPE_ID.USED}` },
    { ...context.query, type: typeId ? `${typeId}` : typeId },
    store.getState().instalmentFilter.data,
  );

  const currentPage = page ? +page : undefined;
  await dispatch(setInstalmentVehiclesFilterValues(vehiclesFilterValues, false));
  await Promise.all([
    dispatch(fetchInstalmentMeta(vehiclesFilterValues)),
    dispatch(setInstalmentListItems(vehiclesFilterValues, VehicleSortType.PRICE_ASC, currentPage)),
  ]);

  const { instalmentFilter, instalmentList, instalmentMeta } = store.getState();

  return {
    props: {
      context: getPageContextValues({
        context,
        basePath: '/installment/vehicles/',
      }),
      initialState: { instalmentFilter, instalmentList, instalmentMeta, city },
    },
  };
};

export default memo(InstalmentListPage);
