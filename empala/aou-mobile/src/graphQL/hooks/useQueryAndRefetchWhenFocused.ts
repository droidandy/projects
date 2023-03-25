import { useIsFocused } from '@react-navigation/native';
import { useEffect } from 'react';

import {
  useGetCurrentUserQuery,
} from '~/graphQL/core/generated-types';

export enum QueryKeys {
  GetCurrentUserDocument = 'GetCurrentUserDocument',
}

type QueryKey = {
  [QueryKeys.GetCurrentUserDocument]?: Date;
};

const REFETCH_ON_FOCUS_INTERVAL_MS = 10000;
const LONG_TIME_AGO = new Date(0);

const lastQueryFetchDate: QueryKey = {};

/**
 * Same as useQuery but refetches data each time component is focused.
 * @param {Parameters<useQuery>[0]} query
 * @param {Parameters<useQuery>[1]} queryOptions
 * @param {string} queryKey Used for tracking last query fetch date and throttling refetches.
 * If undefined, refetches are not throttled. Should be unique per request and parameters.
 * @return {ReturnType<useQuery>}
 */
export const useQueryAndRefetchWhenFocused = (
  queryKey: QueryKeys,
) => {
  const {
    data, loading, error, refetch,
  } = useGetCurrentUserQuery();
  const isFocused = useIsFocused();

  const fetchIfNeeded = () => {
    if (loading) return;

    let shouldFetch = true;
    if (queryKey) {
      const now = new Date();
      const lastFetchDate: Date = lastQueryFetchDate[queryKey] || LONG_TIME_AGO;
      const diff = now.getTime() - lastFetchDate.getTime();
      shouldFetch = diff > REFETCH_ON_FOCUS_INTERVAL_MS;
      if (shouldFetch) {
        lastQueryFetchDate[queryKey] = now;
      }
    }

    if (shouldFetch) {
      refetch().catch(() => {});
    }
  };

  // refetch when focused

  useEffect(() => {
    if (isFocused) {
      fetchIfNeeded();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  return {
    data, loading, error, refetch,
  };
};
