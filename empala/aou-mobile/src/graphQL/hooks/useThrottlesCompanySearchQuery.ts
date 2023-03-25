import { ApolloError } from '@apollo/client';
import {
  useEffect, useMemo, useRef, useState,
} from 'react';

import { Instrument, useCompanySearchLazyQuery } from '~/graphQL/core/generated-types';

const THROTTLE_DELAY = 1000;

export type Company = {
  id: string;
  name: string;
  symbol: string;
  description: string;
  currentPrice: number;
  priceChangePercentage: number;
};

export type CompanySearchQueryResult = {
  companies: Company[];
  loading: boolean;
  error: ApolloError | undefined;
};

const mapInstrumentToCompany = (instrument: Instrument): Company => ({
  id: instrument.id,
  name: instrument.name,
  symbol: instrument.symbol,
  description: instrument.description,
  // TODO remove random when no null prices will remain
  currentPrice: instrument.currentPrice ?? Math.floor(Math.random() * 1000),
  priceChangePercentage: instrument.priceChangePercentage,
});

export const useThrottlesCompanySearchQuery = (searchValue: string): CompanySearchQueryResult => {
  const [getCompanies, { data, loading, error }] = useCompanySearchLazyQuery();
  const [activeThrottleDelay, setActiveThrottleDelay] = useState(false);

  const [pattern, setPattern] = useState(searchValue);

  useEffect(() => {
    getCompanies({
      variables: {
        instrumentsPattern: pattern || 'a',
        instrumentsNMax: 20,
      },
    });
  }, [pattern]);

  const intervalId = useRef<ReturnType<typeof setTimeout> | undefined>();

  useEffect(() => {
    setActiveThrottleDelay(true);
    intervalId.current = setTimeout(() => {
      setPattern(searchValue);
      setActiveThrottleDelay(false);
    }, THROTTLE_DELAY);

    return () => {
      setActiveThrottleDelay(false);
      clearTimeout(intervalId?.current);
    };
  }, [searchValue]);

  const companies = useMemo(
    () => (data?.instruments?.__typename === 'Instruments'
      ? data?.instruments?.instruments.map(mapInstrumentToCompany)
      : []),
    [data],
  );

  return { companies, loading: loading || activeThrottleDelay, error };
};
