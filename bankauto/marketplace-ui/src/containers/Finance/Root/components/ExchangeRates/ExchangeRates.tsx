import React, { useEffect } from 'react';
import { ContainerWrapper } from '@marketplace/ui-kit';
import { ExchangeRates as ExchangeRatesComponent } from 'components';
import { useExchangeRates } from 'store';
import { useStyles } from './ExchangeRates.styles';

const ExchangeRates = () => {
  const s = useStyles();
  const { rates, fetchExchangeRates } = useExchangeRates();

  useEffect(() => {
    fetchExchangeRates();
  }, [fetchExchangeRates]);

  return (
    <ContainerWrapper className={s.exchangeRatesContainer}>
      <ExchangeRatesComponent rates={rates} />
    </ContainerWrapper>
  );
};

export { ExchangeRates };
