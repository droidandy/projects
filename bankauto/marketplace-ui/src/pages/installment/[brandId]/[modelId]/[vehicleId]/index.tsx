import React, { FC, memo } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { Box, ContainerWrapper, Grid, useBreakpoints } from '@marketplace/ui-kit';
import { PagePropsBase } from 'types/PagePropsBase';
import { getSsrStore } from 'store';
import { fetchVehicleItem, useInstalmentOffer } from 'store/instalment/vehicle/item';
import { CatalogLayout } from 'layouts';
import {
  BuyBlockContainer,
  GalleryContainer,
  RelativeVehiclesSlider,
  VehicleAvailabilityChecker,
  VehicleHero,
  VehiclePageMeta,
} from 'containers/Instalment/Vehicle';
import { AdsCard } from 'containers/Instalment/components';
import { VehicleInfoShort, VehicleAccordion } from 'components/VehicleDetailComponents';
import { checkAndSetCurrentCity, getPageContextValues } from 'helpers';
import { useRouter } from 'next/router';
import { FooterInstallmentInfoBlock } from 'components/FooterInstallmentInfoBlock';

interface Props extends PagePropsBase {}

const VehicleDetailPage: FC<Props> = () => {
  const { vehicle } = useInstalmentOffer();
  const { isMobile } = useBreakpoints();
  const router = useRouter();
  const isInstallmentGeelyProgram =
    router.query.brandId === 'geely' && router.query.modelId === 'atlas' && vehicle?.type === 'new';
  // useEffect(() => {
  //   if (vehicle) {
  //     pushCriteoAnalyticsEvent({
  //       rtrgAction: 'view_product',
  //       rtrgData: {
  //         products: [
  //           {
  //             id: vehicle.id,
  //             price: vehicle.price,
  //           },
  //         ],
  //       },
  //     });
  //   }
  // }, [vehicle]);

  return (
    <>
      <CatalogLayout>
        <VehiclePageMeta />
        {isMobile ? (
          <>
            <ContainerWrapper mb={2.5} pt={0.625}>
              <VehicleHero />
            </ContainerWrapper>
            <VehicleAvailabilityChecker>
              <GalleryContainer />
              <ContainerWrapper py={2.5}>
                <BuyBlockContainer />
              </ContainerWrapper>
              <ContainerWrapper py={2.5}>
                <Box m={-1.25}>
                  <AdsCard />
                </Box>
              </ContainerWrapper>
              <ContainerWrapper py={2.5}>
                <VehicleInfoShort vehicleInstalment={vehicle} />
              </ContainerWrapper>
              <ContainerWrapper py={2.5}>
                <VehicleAccordion vehicle={vehicle} />
              </ContainerWrapper>
            </VehicleAvailabilityChecker>
            <ContainerWrapper pt={2.5} pb={5}>
              {/* @TODO: remove key when slider fixed */}
              <RelativeVehiclesSlider key={vehicle?.id} />
            </ContainerWrapper>
          </>
        ) : (
          <ContainerWrapper pb={7.5} pt={0.625}>
            <VehicleHero />
            <VehicleAvailabilityChecker>
              <Box pt={5} pb={2.5}>
                <Grid container spacing={5}>
                  <Grid item xs={9}>
                    <Box display="flex" flexDirection="column">
                      <Grid container spacing={5}>
                        <Grid item xs={8}>
                          <GalleryContainer />
                        </Grid>
                        <Grid item xs={4}>
                          <VehicleInfoShort vehicleInstalment={vehicle} />
                        </Grid>
                      </Grid>
                      <Box m={-1.25} pt={6.25}>
                        <AdsCard isHorizontal />
                      </Box>
                      <Box pt={5}>
                        <VehicleAccordion vehicle={vehicle} />
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={3}>
                    <Box position="sticky" top="6rem">
                      <BuyBlockContainer />
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
      {isInstallmentGeelyProgram && <FooterInstallmentInfoBlock />}
    </>
  );
};

interface Params {
  vehicleId: string;
  brandId: string;
  modelId: string;
}

export const getServerSideProps: GetServerSideProps<Props> = async (context: GetServerSidePropsContext<any>) => {
  const store = getSsrStore();
  const { dispatch } = store;

  const issetCurrentCity = await checkAndSetCurrentCity(store, dispatch, context);
  const { city } = store.getState();

  if (!issetCurrentCity) {
    return { props: { context: getPageContextValues({ context }), initialState: { city } }, notFound: true };
  }

  const queryParams: Params = context.params;
  const { vehicleId, brandId: brandAlias, modelId: modelAlias } = queryParams;

  try {
    await dispatch(fetchVehicleItem(brandAlias, modelAlias, vehicleId));
    const { instalmentOffer, instalmentRelatives } = store.getState();
    if (instalmentOffer.error) {
      throw new Error();
    }
    return {
      props: {
        context: getPageContextValues({ context }),
        initialState: { instalmentOffer, instalmentRelatives, city },
      },
    };
  } catch (e) {
    return {
      props: { context: getPageContextValues({ context }) },
      initialState: { city },
      notFound: true,
    };
  }
};

export default memo(VehicleDetailPage);
