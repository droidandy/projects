import React, { ChangeEvent, Fragment, memo, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/router';
import { Box, Divider, Grid, useBreakpoints } from '@marketplace/ui-kit';
import { VehicleShort, VEHICLE_TYPE_ID } from '@marketplace/ui-kit/types';
import { SELLER_TYPE } from 'types/VehiclesFilterValues';
import { useCity } from 'store/city';
import { useVehiclesFilter } from 'store/catalog/vehicles/filter';
import { useVehiclesList } from 'store/catalog/vehicles/list';
import { useVehiclesMeta } from 'store/catalog/vehicles/meta';
import { MicrodataProps, SchemaName, STRUCTURED_DATA_MAP } from 'constants/structuredData';
import { Organization } from 'containers/MicrodataContainer/components/OrganizationMicrodata';
import { useCheckPresetnExpocarInCity } from 'containers/Inspections/useCheckPresetnExpocarInCity';
import { MicrodataContainer } from 'containers/MicrodataContainer';
import { WrapperLoader } from 'components/WrapperLoader/WrapperLoader';
import { SeoTextBlock } from 'components/SeoTextBlock';
import { Pagination } from 'components/Pagination';
import { AdsCardCustom, AdsCardPromo, AdsCardExpocar } from '../components';
import { VehicleCard } from '../components/Card/VehicleCard';
import { EmptyMessage } from './components';
import { getPagedUrl } from 'helpers/getPagedUrl';
import { sendCatalogViewAnalytics } from 'helpers/analytics';
import { getPromoCardData } from 'helpers/getPromoCardData';
import { getFromLocalStorage } from 'helpers/localStorage';
import { useStyles } from './VehiclesList.styles';

export const VehiclesListContainer = memo(() => {
  const s = useStyles();
  const { push, asPath, query } = useRouter();
  const {
    values,
    sort,
    initial: initialFilter,
    data: { priceFrom, priceTo },
  } = useVehiclesFilter();
  const { current: city, extraCoverageRadius } = useCity();
  const { items, setVehiclesListItems, loading, currentPage, pageLimit } = useVehiclesList();
  const isPresentExpocarInCity = useCheckPresetnExpocarInCity(city.id);
  const { fetchVehiclesMeta, meta } = useVehiclesMeta();
  const { isMobile } = useBreakpoints();
  // Костыль. Убрать, после починки лишнего обновления items
  const savedItems = useRef<VehicleShort[] | null>(null);

  const adsCard = useMemo(() => {
    const showExpocarAdsCard =
      isPresentExpocarInCity &&
      (values.sellerType === SELLER_TYPE.PERSON || `${values.type}` === `${VEHICLE_TYPE_ID.USED}`);
    const promoCardData = getPromoCardData(isMobile);

    return showExpocarAdsCard ? (
      <AdsCardExpocar isHorizontal={!isMobile} />
    ) : promoCardData ? (
      <AdsCardPromo {...promoCardData} />
    ) : (
      <AdsCardCustom isHorizontal={!isMobile} />
    );
  }, [isPresentExpocarInCity, isMobile, values.sellerType, values.type, getPromoCardData]);

  const priceRange = { priceFrom, priceTo };
  const microdataProps: MicrodataProps<Organization, SchemaName> = {
    data: { ...STRUCTURED_DATA_MAP[SchemaName.ORGANIZATION]?.data, ...priceRange },
    additionalData: items,
    type: SchemaName.SERVICE,
  };

  const handlePageChange = (_: ChangeEvent<unknown>, p: number) => {
    if (p === currentPage) return;
    push(getPagedUrl(asPath, p), undefined, { shallow: true, scroll: false });
    // @ts-ignore
    setVehiclesListItems(values, sort, p).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  useEffect(() => {
    if (
      !savedItems.current ||
      items.some(
        ({ id }: VehicleShort, index: number) => !savedItems.current![index] || savedItems.current![index].id !== id,
      )
    ) {
      savedItems.current = items;
      sendCatalogViewAnalytics(items);
    }
    sendCatalogViewAnalytics(items);
  }, [items, values]);

  useEffect(() => {
    if (initialFilter) return;
    setVehiclesListItems(values, sort);
    fetchVehiclesMeta(values);
  }, [values, initialFilter, sort, city, extraCoverageRadius, setVehiclesListItems, fetchVehiclesMeta]);

  useEffect(() => {
    const LSValue = getFromLocalStorage('visitedWithGift');
    if (!query.withGift && LSValue !== null) {
      const preparedValues = { ...values, withGift: LSValue };
      setVehiclesListItems(preparedValues, sort);
      fetchVehiclesMeta(preparedValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pageCount = Math.ceil(meta.count / pageLimit);
  const showPagination = !!items.length && pageCount !== 1;

  return (
    <>
      {items.length !== 0 && <MicrodataContainer {...microdataProps} />}

      {!items.length && !loading && (
        <Box width="100%" pt={isMobile ? 3 : 0}>
          <EmptyMessage />
        </Box>
      )}

      <WrapperLoader loading={loading}>
        <Grid container spacing={isMobile ? 0 : 1}>
          {items.map((item, index) => (
            <Fragment key={item.id}>
              <Grid item xs={12} sm={4}>
                <VehicleCard {...item} withSlider />
                {isMobile && index < items.length - 1 && <Divider className={s.itemDivider} />}
              </Grid>
              {index + 1 === 6 ? (
                <Grid item xs={12} sm={12}>
                  {/* Box нужен иначе почему-то вываливается немного из контейнера */}
                  <Box>{adsCard}</Box>
                </Grid>
              ) : null}
            </Fragment>
          ))}
        </Grid>
      </WrapperLoader>

      {showPagination && (
        <Box width="100%" pt={2.5}>
          <Pagination page={currentPage} disabled={loading} count={pageCount} onChange={handlePageChange} />
        </Box>
      )}
      {!loading && meta.seoText && (
        <Box pt={4}>
          <SeoTextBlock />
        </Box>
      )}
    </>
  );
});
