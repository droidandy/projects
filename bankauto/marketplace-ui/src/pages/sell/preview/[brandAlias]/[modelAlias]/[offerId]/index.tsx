import React, { FC, useEffect, useMemo } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useSelector } from 'react-redux';
import { Box, CircularProgress, ContainerWrapper, Grid, useBreakpoints } from '@marketplace/ui-kit';
import { PagePropsBase } from 'types/PagePropsBase';
import { StateModel } from 'store/types';
import { getSsrStore } from 'store';
import { useVehicleItem } from 'store/catalog/vehicle/item';
import { PersonalAreaLayout } from 'layouts';
import { StickersChips } from 'components/StickersChips';
import {
  BuyBlockContainer,
  GalleryContainer,
  RelativeVehiclesSlider,
  VehicleAvailabilityChecker,
  VehicleHero,
  VehiclePageMeta,
} from 'containers/Sell/Preview';
import { SoldOutInfo } from 'containers/Vehicle/components/SoldOutInfo';
import { AdsCardCustom } from 'containers/Vehicles/components';
import { VehicleInfoShort, VehicleAccordion, VehicleDescription } from 'components/VehicleDetailComponents';
import { unauthorizedGuard } from 'guards';
import { checkAndSetCurrentCity, getPageContextValues, usePageContext } from 'helpers';
import { SoldOutLabel } from 'components';
import { useRouter } from 'next/router';

interface Props extends PagePropsBase {}

const SellPreviewVehicle: FC = () => {
  const router = useRouter();
  const { isLogout, isAuthorized } = useSelector((state: StateModel) => state.user);
  React.useEffect(() => {
    if (!isAuthorized && router.pathname.includes('profile') && !isLogout) {
      unauthorizedGuard();
    }
  }, [isAuthorized, router.pathname, isLogout]);

  const { isMobile } = useBreakpoints();
  const {
    params: { brandAlias, modelAlias, offerId },
  } = usePageContext();
  const user = useSelector(({ user: userState }: StateModel) => userState);
  const { vehicle, fetchVehicleItem, loading } = useVehicleItem();
  const isForSold = vehicle?.cancelReason !== null;

  useEffect(() => {
    const brand = brandAlias as string;
    const model = modelAlias as string;
    const id = offerId as string;

    if (isAuthorized) {
      fetchVehicleItem(brand, model, id);
    }
  }, [fetchVehicleItem, brandAlias, modelAlias, offerId, isAuthorized]);

  if (!vehicle || loading) {
    return (
      <PersonalAreaLayout>
        <ContainerWrapper py={20}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center">
              <CircularProgress />
            </Box>
          ) : null}
        </ContainerWrapper>
      </PersonalAreaLayout>
    );
  }

  return (
    <PersonalAreaLayout>
      <VehiclePageMeta />
      {isMobile ? (
        <>
          <ContainerWrapper mb={2.5} pt={0.625}>
            <VehicleHero />
          </ContainerWrapper>
          <VehicleAvailabilityChecker>
            <GalleryContainer />
            {!!vehicle?.stickers?.length && (
              <Box pt={2.5} pl={2.5}>
                <StickersChips items={vehicle.stickers} />
              </Box>
            )}
            <ContainerWrapper py={2.5}>{isForSold ? <SoldOutInfo /> : <BuyBlockContainer />}</ContainerWrapper>
            {vehicle.comment && (
              <ContainerWrapper py={2.5}>
                <VehicleDescription comment={vehicle.comment} />
              </ContainerWrapper>
            )}
            <ContainerWrapper py={2.5}>
              <Box m={-1.25}>
                <AdsCardCustom isForSell />
              </Box>
            </ContainerWrapper>
            <ContainerWrapper py={2.5}>
              <VehicleInfoShort vehicle={vehicle} />
            </ContainerWrapper>
            <ContainerWrapper py={2.5}>
              <VehicleAccordion vehicle={vehicle} />
            </ContainerWrapper>
          </VehicleAvailabilityChecker>
          <ContainerWrapper pt={2.5} pb={5}>
            <RelativeVehiclesSlider key={vehicle?.id} />
          </ContainerWrapper>
        </>
      ) : (
        <ContainerWrapper pb={7.5} pt={0.625}>
          <VehicleHero />
          <VehicleAvailabilityChecker>
            <Box py={2.5}>
              <Grid container spacing={5}>
                <Grid item xs={9}>
                  <Box display="flex" flexDirection="column">
                    <Grid container spacing={5}>
                      <Grid item xs={8}>
                        <Box position="relative">
                          <GalleryContainer />
                          {isForSold && <SoldOutLabel />}
                          {!!vehicle?.stickers?.length && (
                            <Box position="absolute" top={0} left={0} pt={2.5} px={2.5} zIndex={5} width="100%">
                              <StickersChips items={vehicle.stickers} />
                            </Box>
                          )}
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <VehicleInfoShort vehicle={vehicle} />
                      </Grid>
                    </Grid>
                    {vehicle.comment && (
                      <Box pt={3.75}>
                        <VehicleDescription comment={vehicle.comment} />
                      </Box>
                    )}
                    <Box m={-1.25} pt={6.25}>
                      <AdsCardCustom isHorizontal isForSell />
                    </Box>
                    <Box pt={5}>
                      <VehicleAccordion vehicle={vehicle} />
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={3}>
                  <Box position="sticky" top="6rem">
                    {isForSold ? <SoldOutInfo /> : <BuyBlockContainer />}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </VehicleAvailabilityChecker>
          <Box pt={2.5}>
            <RelativeVehiclesSlider key={vehicle?.id} />
          </Box>
        </ContainerWrapper>
      )}
    </PersonalAreaLayout>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async (context: GetServerSidePropsContext<any>) => {
  const store = getSsrStore();
  const { dispatch } = store;
  const issetCurrentCity = await checkAndSetCurrentCity(store, dispatch, context);
  const { city } = store.getState();

  if (!issetCurrentCity) {
    return { props: { context: getPageContextValues({ context }), initialState: { city } }, notFound: true };
  }

  return {
    props: {
      context: getPageContextValues({ context, basePath: '/sell/preview/' }),
      initialState: { city },
    },
  };
};

export default SellPreviewVehicle;
