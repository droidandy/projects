import React, { FC, memo, useEffect, useMemo, useState } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { Box, ContainerWrapper, Grid, useBreakpoints } from '@marketplace/ui-kit';
import { VEHICLE_SCENARIO, VEHICLE_TYPE } from '@marketplace/ui-kit/types';
import { checkUrlAliases } from 'api/catalog';
import { PagePropsBase } from 'types/PagePropsBase';
import { getSsrStore } from 'store';
import { fetchVehicleReviews, fetchVehicleReviewStats } from 'store/catalog/review/vehicle';
import { fetchVehicleItem, useVehicleItem } from 'store/catalog/vehicle/item';
import { CatalogLayout } from 'layouts';
import { FavoritesLoader } from 'containers/Favorites';
import { ComparisonLoader } from 'containers/PersonalArea/Comparison';
import { AdsCardExpocarContainer } from 'containers/Inspections/AdsCardExpocarContainer';
import {
  GalleryContainer,
  RelativeVehiclesSlider,
  VehicleAvailabilityChecker,
  VehicleChooseColor,
  VehicleHero,
  VehiclePageMeta,
} from 'containers/Vehicle';
import { ReviewsStatistics } from 'containers/ReviewsStatistics';
import { SoldOutLabel } from 'components';
import { SoldOutInfo } from 'containers/Vehicle/components/SoldOutInfo';
import { SectionDivider } from 'components/SectionDivider';
import { VehicleAccordion, VehicleDescription, VehicleInfoShort } from 'components/VehicleDetailComponents';
import { StickersChips } from 'components/StickersChips';
import { VehicleBuyBlockContainer } from 'components/VehicleBuyBlock/VehicleBuyBlockContainer';
import { AdsCardCustom, AdsCardPromo } from 'containers/Vehicles/components';
import { TestDriveBlock } from 'containers/Vehicle/TestDriveBlock/TestDriveBlock';
import { IS_STOCK } from 'constants/specialConstants';
import { deactivatedStatusesForApplications } from 'constants/application';
import { useCheckPresetnExpocarInCity } from 'containers/Inspections/useCheckPresetnExpocarInCity';
import { getPageContextValues } from 'helpers/context/PageContext';
import { checkAndSetCurrentCity } from 'helpers';
import { pushCriteoAnalyticsEvent } from 'helpers/analytics';
import { isBankautoDealerId } from 'helpers/isBankautoDealer';
import { getPromoCardData } from 'helpers/getPromoCardData';

interface Props extends PagePropsBase {}

const VehiclesPage: FC<Props> = () => {
  const { vehicle } = useVehicleItem();
  const { isMobile } = useBreakpoints();
  const [shouldSendEvent, setShouldSendEvent] = useState(true);
  const isPresentExpocarInCity = useCheckPresetnExpocarInCity(vehicle?.city.id);
  // @ts-ignore
  const isForSold = vehicle?.cancelReason !== null;
  useEffect(() => {
    if (vehicle && shouldSendEvent) {
      pushCriteoAnalyticsEvent({
        ecomm_category: vehicle.type === VEHICLE_TYPE.NEW ? 'Новые автомобили' : 'Автомобили с пробегом',
        rtrgAction: 'view_product',
        rtrgData: {
          products: [
            {
              id: vehicle.id,
              price: vehicle.price,
            },
          ],
        },
      });
      setShouldSendEvent(false);
    }
  }, [vehicle, shouldSendEvent]);

  const isForSell =
    vehicle!.scenario.toString() === VEHICLE_SCENARIO.USED_FROM_CLIENT ||
    vehicle!.scenario.toString() === VEHICLE_SCENARIO.USED_AUCTION_AND_CLIENT;

  const adsCard = useMemo(() => {
    if (!vehicle) return null;
    const showExpocarAdsCard =
      isPresentExpocarInCity &&
      [VEHICLE_SCENARIO.USED_BY_NAME, VEHICLE_SCENARIO.USED_BY_ID, VEHICLE_SCENARIO.USED_FROM_CLIENT].includes(
        `${vehicle.scenario}` as VEHICLE_SCENARIO,
      );
    const promoCardData = getPromoCardData(isMobile);
    return showExpocarAdsCard ? (
      <AdsCardExpocarContainer vehicle={vehicle} />
    ) : promoCardData ? (
      <AdsCardPromo {...promoCardData} />
    ) : (
      <AdsCardCustom isHorizontal={!isMobile} />
    );
  }, [isMobile, vehicle, isPresentExpocarInCity, getPromoCardData]);

  const isBankautoDealer = isBankautoDealerId(vehicle?.salesOfficeId || 0);

  return (
    <CatalogLayout>
      <VehiclePageMeta />
      <FavoritesLoader />
      <ComparisonLoader />
      {isMobile ? (
        <>
          <ContainerWrapper mb={2.5} pt={0.625}>
            <VehicleHero withAdditionalInfo={!isForSold} />
          </ContainerWrapper>
          <VehicleAvailabilityChecker>
            <GalleryContainer />
            {isBankautoDealer ? <VehicleChooseColor /> : null}
            {isForSold && <SoldOutLabel />}
            {!!(vehicle?.stickers?.length && !isForSold) && (
              <Box pt={2.5} pl={2.5}>
                <StickersChips items={vehicle.stickers} />
              </Box>
            )}
            <ContainerWrapper py={2.5}>{isForSold ? <SoldOutInfo /> : <VehicleBuyBlockContainer />}</ContainerWrapper>
            {!isBankautoDealer ? (
              <ContainerWrapper py={2.5} overflow="hidden">
                <Box m={IS_STOCK ? 0 : -1.25}>{adsCard}</Box>
              </ContainerWrapper>
            ) : null}
            {vehicle?.comment && isForSell && (
              <ContainerWrapper py={2.5}>
                <VehicleDescription comment={vehicle.comment} />
              </ContainerWrapper>
            )}
            {vehicle?.type === VEHICLE_TYPE.NEW ? (
              <ContainerWrapper py={2.5}>
                <TestDriveBlock vehicle={vehicle} />
              </ContainerWrapper>
            ) : null}
            <ContainerWrapper py={2.5}>
              <VehicleInfoShort vehicle={vehicle} colorVariant={isBankautoDealer ? 'icon' : 'circle'} />
            </ContainerWrapper>
            <SectionDivider style={{ marginTop: '1.25rem 0' }} />
            <ContainerWrapper py={2.5}>
              <VehicleAccordion vehicle={vehicle} />
            </ContainerWrapper>
            <SectionDivider style={{ margin: '1.25rem 0' }} />
          </VehicleAvailabilityChecker>
          <ContainerWrapper pt={2.5} pb={5}>
            {/* @TODO: remove key when slider fixed */}
            <RelativeVehiclesSlider key={vehicle?.id} />
          </ContainerWrapper>
        </>
      ) : (
        <ContainerWrapper pb={7.5} pt={0.625}>
          <VehicleHero withControls withAdditionalInfo={!isForSold} />
          <VehicleAvailabilityChecker>
            <Box pt={2.5} pb={2.5}>
              <Grid container spacing={5}>
                <Grid item xs={9}>
                  <Box display="flex" flexDirection="column">
                    <Grid container spacing={5}>
                      <Grid item xs={8}>
                        <Box position="relative">
                          <GalleryContainer />
                          {isForSold && <SoldOutLabel />}
                          {!!(vehicle?.stickers?.length && !isForSold) && (
                            <Box position="absolute" top={0} left={0} pt={2.5} px={2.5} zIndex={5} width="100%">
                              <StickersChips items={vehicle.stickers} />
                            </Box>
                          )}
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <VehicleInfoShort vehicle={vehicle} colorVariant={isBankautoDealer ? 'icon' : 'circle'} />
                        {isBankautoDealer ? <VehicleChooseColor /> : null}
                        {vehicle?.type === VEHICLE_TYPE.NEW ? (
                          <Grid item>
                            <TestDriveBlock vehicle={vehicle} />
                          </Grid>
                        ) : null}
                      </Grid>
                    </Grid>
                    {!isBankautoDealer ? (
                      <Box m={-1.25} pt={6.25}>
                        {adsCard}
                      </Box>
                    ) : null}
                    {vehicle?.comment && isForSell && (
                      <Box pt={5}>
                        <VehicleDescription comment={vehicle?.comment} />
                      </Box>
                    )}
                    <Box pt={5}>
                      <VehicleAccordion vehicle={vehicle} />
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={3}>
                  <Box position="sticky" top="6rem">
                    <Grid container spacing={5}>
                      <Grid item style={{ width: '100%' }}>
                        {isForSold ? <SoldOutInfo /> : <VehicleBuyBlockContainer />}
                      </Grid>
                      {!isForSold ? (
                        <Grid item style={{ width: '100%' }}>
                          <ReviewsStatistics />
                        </Grid>
                      ) : null}
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </VehicleAvailabilityChecker>
          <Box pt={2.5}>
            {/* @TODO: remove key when slider fixed */}
            <RelativeVehiclesSlider key={vehicle?.id} />
          </Box>
        </ContainerWrapper>
      )}
    </CatalogLayout>
  );
};

interface Params {
  offerId: string;
  brandId: string;
  modelId: string;
}

type QueryParams = {
  page?: string;
};

export const getServerSideProps: GetServerSideProps<Props> = async (context: GetServerSidePropsContext<any>) => {
  const pageContext = getPageContextValues({ context });
  const store = getSsrStore();
  const { dispatch } = store;

  const issetCurrentCity = await checkAndSetCurrentCity(store, dispatch, context);
  const { city } = store.getState();

  if (!issetCurrentCity) {
    return { props: { context: getPageContextValues({ context }), initialState: { city } }, notFound: true };
  }

  const queryParams: Params = context.params;
  const { offerId: vehicleId, brandId: brandAlias, modelId: modelAlias } = queryParams;
  const { page } = context.query as QueryParams;

  try {
    const { data: vehicleInfo } = await checkUrlAliases(brandAlias, modelAlias);

    if (!vehicleInfo || !vehicleInfo.model) {
      throw new Error();
    }

    const {
      brand: { id: brandId },
      model,
    } = vehicleInfo;
    const reviewParams = { brandId, modelId: model!.id };

    await Promise.all([
      dispatch(fetchVehicleItem(brandAlias, modelAlias, vehicleId)),
      dispatch(fetchVehicleReviewStats(reviewParams)),
      dispatch(fetchVehicleReviews({ ...reviewParams, limit: 5, page: Number(page) || 1 })),
    ]);

    const { vehicleItem, vehicleRelatives, vehicleReview } = store.getState();
    if (
      vehicleItem?.vehicle?.cancelReason === null &&
      deactivatedStatusesForApplications.includes(vehicleItem?.vehicle?.status)
    ) {
      context.res.statusCode = 404;
    }
    if (vehicleItem.error) {
      throw new Error();
    }

    return { props: { context: pageContext, initialState: { vehicleItem, vehicleRelatives, city, vehicleReview } } };
  } catch (e) {
    return {
      props: { context: pageContext, initialState: { city } },
      notFound: true,
    };
  }
};

export default memo(VehiclesPage);
