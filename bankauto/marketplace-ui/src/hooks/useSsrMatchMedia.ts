import mediaQuery from 'css-mediaquery';
import { useCallback } from 'react';

export const useSsrMatchMedia = (isMobile: boolean) => {
  return useCallback(
    (query: string) => {
      return {
        matches: mediaQuery.match(query, {
          // The estimated CSS width of the browser.
          width: isMobile ? 500 : 1000,
        }),
      };
    },
    [isMobile],
  );
};
