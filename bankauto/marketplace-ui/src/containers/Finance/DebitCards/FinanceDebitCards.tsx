import React, { FC, useMemo } from 'react';
import { Box, useBreakpoints } from '@marketplace/ui-kit';
import { Meta } from 'components';
import { FinanceLayout } from 'layouts';
import { useLinks } from 'store';
import { usePageContext } from 'helpers';
import { Hero, Documents } from '../components';
import { DataSubmit, DebitCards } from './containers';
import { PageInfo } from '../types/PageInfo';
import { useStyles } from './FinanceDebitCards.styles';

const FinanceDebitCards: FC<{ pageInfo: PageInfo }> = ({ pageInfo }) => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();
  const { items } = useLinks();
  const { canonical, isCanonical } = usePageContext();

  const bgImage = useMemo(
    () => (isMobile ? pageInfo.imgMobile : pageInfo.imgDesktop),
    [isMobile, pageInfo.imgMobile, pageInfo.imgDesktop],
  );

  return (
    <>
      <Meta
        title={pageInfo.mainText}
        description={`${pageInfo.mainText} ${pageInfo.additionalText}`}
        canonical={!isCanonical ? canonical : undefined}
      />
      <FinanceLayout>
        <Hero
          title={pageInfo.mainText}
          subTitle={pageInfo.additionalText}
          isShowButton={false}
          className={s.hero}
          bgImage={bgImage}
        />
        <DebitCards />
        <Box mb={isMobile ? '1.25rem' : '3.75rem'} mt={isMobile ? '1.125rem' : '0'}>
          <DataSubmit title="Помощь в выборе карты" />
        </Box>
        {items && <Documents type="cards" data={items} />}
      </FinanceLayout>
    </>
  );
};

export { FinanceDebitCards };
