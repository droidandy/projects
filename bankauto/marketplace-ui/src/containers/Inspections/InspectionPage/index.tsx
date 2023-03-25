import React, { FC } from 'react';
import { Grid, ContainerWrapper, useBreakpoints } from '@marketplace/ui-kit';
import { Hero } from '../Hero';
import { StepsBlock } from '../Steps';
import { Info } from '../Info';
import { Plank } from '../Plank';
import { INSPECTIONS_PAYMENT_RULES, INSPECTIONS_REFUSAL_OF_SERVISE } from 'constants/expocar';
import { MethodOfPayment } from '../MethodOfPayment';

export const InspectionPage: FC = ({ children }) => {
  const { isMobile } = useBreakpoints();

  return (
    <>
      <Hero />
      <ContainerWrapper pb={isMobile ? 0 : 3} pt={isMobile ? 3 : 0} bgcolor={!isMobile ? 'secondary.light' : undefined}>
        <Grid container justify="center">
          <Grid item xs={12} sm={10}>
            <StepsBlock />
          </Grid>
        </Grid>
      </ContainerWrapper>
      <ContainerWrapper
        pt={isMobile ? 2 : 5}
        pb={isMobile ? 3.75 : 5}
        boxShadow={isMobile && '0 0.5rem 3rem rgba(0, 0, 0, 0.1)'}
      >
        <Grid container spacing={isMobile ? 3 : 5}>
          <Grid item xs={12} sm={9}>
            <Info />
          </Grid>
          <Grid item xs={12} sm={3}>
            {children}
          </Grid>
        </Grid>
      </ContainerWrapper>
      <ContainerWrapper pt={5} pb={10}>
        <Grid container spacing={isMobile ? 3 : 5}>
          <Grid item xs={12} sm={9}>
            <Grid container spacing={isMobile ? 3 : 5}>
              <Grid item xs={12} sm={4}>
                <Plank title="Правила оплаты" link={INSPECTIONS_PAYMENT_RULES} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Plank title="Отказ от услуги" link={INSPECTIONS_REFUSAL_OF_SERVISE} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <MethodOfPayment />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </ContainerWrapper>
    </>
  );
};
