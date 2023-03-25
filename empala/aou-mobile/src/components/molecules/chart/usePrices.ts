import { useQuery } from '@apollo/client';
import { useMemo } from 'react';

import { Endpoint } from '~/amplify/types';
import { Period } from '~/components/molecules/chart/types';
import {
  StockPricesDailyDocument,
  StockPricesMonthlyDocument,
  StockPricesWeeklyDocument,
} from '~/graphQL/hasura/generated-types';

export const usePrices = (companyId: number, period: Period): Array<any> => {
  const currentDate = new Date();
  const to = currentDate.toISOString().split('T')[0];

  const [stockPricesQuery, field] = useMemo(() => {
    if ([Period.d, Period.w, Period.m].includes(period)) {
      return [StockPricesDailyDocument, 'marketdata_view_stock_prices_daily'];
    }

    if (period === Period.m) {
      return [StockPricesWeeklyDocument, 'marketdata_view_stock_prices_weekly'];
    }

    return [StockPricesMonthlyDocument, 'marketdata_view_stock_prices_monthly'];
  }, [period]);

  const from = useMemo(() => {
    if (period === Period.d) {
      const dayAgoDate = currentDate.setDate(currentDate.getDate() - 1);
      return (new Date(dayAgoDate)).toISOString().split('T')[0];
    }

    if (period === Period.w) {
      const weekAgoDate = currentDate.setDate(currentDate.getDate() - 7);
      return (new Date(weekAgoDate)).toISOString().split('T')[0];
    }

    if (period === Period.m) {
      const monthAgoDate = currentDate.setMonth(currentDate.getMonth() - 1);
      return (new Date(monthAgoDate)).toISOString().split('T')[0];
    }

    if (period === Period.m6) {
      const sixMonthsAgoDate = currentDate.setMonth(currentDate.getMonth() - 6);
      return (new Date(sixMonthsAgoDate)).toISOString().split('T')[0];
    }

    if (period === Period.y) {
      const twelveMonthsAgoDate = currentDate.setMonth(currentDate.getMonth() - 12);
      return (new Date(twelveMonthsAgoDate)).toISOString().split('T')[0];
    }

    if (period === Period.y3) {
      const treeYearsAgoDate = currentDate.setMonth(currentDate.getMonth() - 36);
      return (new Date(treeYearsAgoDate)).toISOString().split('T')[0];
    }

    if (period === Period.y5) {
      const fiveYearsAgoDate = currentDate.setMonth(currentDate.getMonth() - 60);
      return (new Date(fiveYearsAgoDate)).toISOString().split('T')[0];
    }

    if (period === Period.ytd) {
      const ytdDate = new Date(new Date().getFullYear(), 0, 1);
      return (new Date(ytdDate)).toISOString().split('T')[0];
    }

    const allDate = currentDate.setMonth(currentDate.getMonth() - 120);
    return (new Date(allDate)).toISOString().split('T')[0];
  }, [period]);

  const { data, loading, error } = useQuery(stockPricesQuery, {
    variables: { companyId, from, to },
    context: { clientName: Endpoint.hasura },
  });

  return data?.[field] ?? [];
};
