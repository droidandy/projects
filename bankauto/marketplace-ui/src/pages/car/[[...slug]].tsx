import React, { FC, memo } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { Box, ContainerWrapper, Grid, useBreakpoints } from '@marketplace/ui-kit';
import { VEHICLE_TYPE, VEHICLE_TYPE_ID } from '@marketplace/ui-kit/types';
import { parseUrl } from 'query-string';
import { FavoritesLoader } from 'containers/Favorites';
import { ComparisonLoader } from 'containers/PersonalArea/Comparison';
import { VehiclesHero } from 'containers/Vehicles/Hero/VehiclesHero';
import { VehiclesListContainer, VehiclesMetaContainer, SortContainer } from 'containers/Vehicles';
import { FilterContainer } from 'containers/Vehicles/Filter/FilterContainer';
import { CatalogLayout } from 'layouts';
import { fetchVehiclesFilterData, setVehiclesFilterValues } from 'store/catalog/vehicles/filter';
import { fetchVehiclesMeta } from 'store/catalog/vehicles/meta';
import { setVehiclesListItems } from 'store/catalog/vehicles/list';
import { setBreadCrumbsData } from 'store/breadcrumbs';
import { fetchAliasCheck } from 'store/catalog/aliasCheck';
import { getSsrStore } from 'store';
import { VehiclesFilterParams } from 'types/VehicleFilterParams';
import { PagePropsBase } from 'types/PagePropsBase';
import { useSaveFilterQuery } from 'hooks/filter';
import { checkUrlAliases } from 'api/catalog';
import { getVehicleBreadCrumbs } from 'helpers/getBreadCrumbs';
import { parseQueryFilter } from 'helpers/filter';
import { getPageContextValues } from 'helpers/context/PageContext';
import { checkAndSetCurrentCity } from 'helpers/checkAndSetCurrentCity';

interface Props extends PagePropsBase {}

const QueryFilterSaver = () => {
  useSaveFilterQuery();
  return <></>;
};

const VehiclesPage: FC<Props> = () => {
  const { isMobile } = useBreakpoints();

  return (
    <>
      <QueryFilterSaver />
      <VehiclesMetaContainer />
      <FavoritesLoader />
      <ComparisonLoader />
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
            <Box display="flex" justifyContent="space-between" alignItems="flex-end" mb={5}>
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

  const reqQuery = { ...context.query, ...parseUrl(context.req.url || '').query };

  const slug = (typeof reqQuery.slug === 'string' ? [reqQuery.slug] : reqQuery.slug || []) as string[];

  const slugWithType = [...(slug[0] === VEHICLE_TYPE.NEW || slug[0] === VEHICLE_TYPE.USED ? [] : [null]), ...slug];

  if (slugWithType.length > 4) {
    return {
      props: { context: getPageContextValues({ context }), initialState: { city } },
      notFound: true,
    };
  }

  const [type, slugBrand, slugModel, slugGeneration] = slugWithType;

  let resolvedAlias = null;

  if (slugBrand) {
    const { data } = await checkUrlAliases(slugBrand, slugModel, slugGeneration);
    resolvedAlias = data;

    if (!resolvedAlias?.toString() || (typeof resolvedAlias === 'object' && !resolvedAlias.brand)) {
      return { props: {}, notFound: true };
    }
  }

  const { brand = [], model = [] } = reqQuery;

  const typeId: any =
    type === VEHICLE_TYPE.NEW ? VEHICLE_TYPE_ID.NEW : (type === VEHICLE_TYPE.USED && VEHICLE_TYPE_ID.USED) || undefined;

  const slugBrandId = resolvedAlias?.brand?.id ?? null;
  const slugModelId = resolvedAlias?.model?.id ?? null;
  const slugGenerationId = resolvedAlias?.generation?.id ?? null;

  // if (slugBrand !== 'all' && slugBrand) {
  //   await dispatch(fetchBrandDataAction(type as VEHICLE_TYPE, slugBrand));
  // }

  const pageContext = getPageContextValues({
    context,
    basePath: `/car/${type ? `${type}/` : ''}${slugBrand !== 'all' && slugBrand ? `${slugBrand}/` : ''}${
      slugBrand !== 'all' && slugBrand && slugModel ? `${slugModel}/` : ''
    }`,
  });

  const filterDataParams: VehiclesFilterParams = {
    type: typeId,
    brandId: Array.isArray(brand) && !slugBrandId ? brand.map((v) => +v) : [slugBrandId || Number(brand)],
    modelId: Array.isArray(model) && !slugModelId ? model.map((v) => +v) : [slugModelId || Number(model)],
  };

  await dispatch(fetchVehiclesFilterData(filterDataParams));
  const vehiclesFilterData = store.getState().vehiclesFilter.data;
  const vehiclesFilterValues = {
    ...parseQueryFilter(
      {
        ...reqQuery,
        type: typeId ? `${typeId}` : typeId,
        brand: slugBrandId ? [`${slugBrandId}`] : (reqQuery.brand as any),
        model: slugModelId ? [`${slugModelId}`] : (reqQuery.model as any),
        generation: slugGenerationId ? [`${slugGenerationId}`] : (reqQuery.generation as any),
      },
      vehiclesFilterData,
    ),
  };

  const { equipmentId, withGift } = reqQuery;

  const preparedFilterValues = {
    ...vehiclesFilterValues,
    ...(equipmentId ? { equipmentId: equipmentId as string } : {}),
    ...(withGift ? { withGift: withGift as string } : {}),
  };

  const currentPage = reqQuery.page ? +reqQuery.page : undefined;
  await dispatch(setVehiclesFilterValues(vehiclesFilterValues, false));
  await Promise.all([
    dispatch(fetchVehiclesMeta(preparedFilterValues)),
    dispatch(setVehiclesListItems(preparedFilterValues, null, currentPage)),
    dispatch(fetchAliasCheck(slugBrand!, slugModel, slugGeneration)),
  ]);

  const { vehiclesFilter, vehiclesList, vehiclesMeta, aliasCheck } = store.getState();
  const breadCrumbsData = getVehicleBreadCrumbs(type, resolvedAlias, vehiclesFilter.values);

  await dispatch(setBreadCrumbsData(breadCrumbsData));
  const { breadCrumbs } = store.getState();

  return {
    props: {
      context: pageContext,
      initialState: {
        vehiclesFilter,
        vehiclesList,
        vehiclesMeta,
        city,
        aliasCheck,
        breadCrumbs,
      },
    },
  };
};

export default memo(VehiclesPage);
