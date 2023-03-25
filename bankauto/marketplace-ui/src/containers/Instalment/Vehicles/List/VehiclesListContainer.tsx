import React, { ChangeEvent, Fragment, memo, useEffect } from 'react';
import { Box, Grid, useBreakpoints } from '@marketplace/ui-kit';
import { useRouter } from 'next/router';
import { useInstalmentFilter } from 'store/instalment/vehicles/filter';
import { useInstalmentList } from 'store/instalment/vehicles/list';
import { useInstalmentMeta } from 'store/instalment/vehicles/meta';
import { Pagination } from 'components/Pagination';
import { WrapperLoader } from 'components/WrapperLoader/WrapperLoader';
import { getPagedUrl } from 'helpers/getPagedUrl';
import { EmptyMessage } from 'containers/Instalment/Vehicles/List/components';
import { useCity } from 'store/city';
import { AdsCard, VehicleCard } from '../../components';

export const VehiclesListContainer = memo(() => {
  const { push, asPath } = useRouter();
  const { values, sort, initial: initialFilter } = useInstalmentFilter();
  const { items, setInstalmentListItems, loading, currentPage, pageLimit } = useInstalmentList();
  const { fetchInstalmentMeta, meta } = useInstalmentMeta();
  const { isMobile } = useBreakpoints();
  const {
    current: { id: cityId },
  } = useCity();

  useEffect(() => {
    if (initialFilter) return;
    setInstalmentListItems(values, sort);
    fetchInstalmentMeta(values);
  }, [values, initialFilter, sort, setInstalmentListItems, fetchInstalmentMeta]);

  const handlePageChange = (_: ChangeEvent<unknown>, p: number) => {
    if (p === currentPage) return;
    push(getPagedUrl(asPath, p), undefined, { shallow: true, scroll: false });
    // @ts-ignore
    setInstalmentListItems(values, sort, p).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const showList = !!cityId && [1, 2, 17849].includes(cityId);
  const pageCount = Math.ceil(meta.count / pageLimit);
  const showPagination = !!items.length && pageCount !== 1;

  return (
    <>
      {showList ? (
        <>
          {!items.length && !loading && (
            <Box width="100%" pt={isMobile ? 3 : 0}>
              <EmptyMessage isMoscow />
            </Box>
          )}

          <WrapperLoader loading={loading}>
            <Grid container spacing={1}>
              {items.map((item, index) => (
                <Fragment key={item.id}>
                  <Grid item xs={12} sm={4}>
                    <VehicleCard {...item} />
                  </Grid>
                  {(index + 1) % 6 === 0 ? (
                    <Grid item xs={12} sm={12}>
                      {/* Box нужен иначе почему-то вываливается немного из контейнера */}
                      <Box>
                        <AdsCard isHorizontal={!isMobile} />
                      </Box>
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
        </>
      ) : (
        <EmptyMessage isMoscow={false} />
      )}
    </>
  );
});
