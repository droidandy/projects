import React from 'react';
import { ContainerWrapper, useBreakpoints } from '@marketplace/ui-kit';
import { StepsBlock, ServiceCatalog, AccordionFAQ, Reviews, AutoRepairShopList } from './components';
import { TurnByTurnNavigation, TurnByTurnNavigationFromMap } from './containers';
import { useStyles } from './ServiceLandingPage.styles';
import { useReviews } from './hooks/api';

export const ServiceLandingPage = () => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();
  const { data } = useReviews();
  const reviews = (data as any)?.data?.reviews || [];

  return (
    <>
      <TurnByTurnNavigation />
      <StepsBlock />
      <ServiceCatalog />
      <ContainerWrapper className={s.container}>
        <Reviews
          reviews={reviews}
          titleTypographyProps={{ align: 'center', variant: isMobile ? 'h4' : 'h2' }}
          classNames={{ title: s.title }}
        />
      </ContainerWrapper>
      <AccordionFAQ />
    </>
  );
};

export const ServiceMapPage = () => <TurnByTurnNavigationFromMap />;
