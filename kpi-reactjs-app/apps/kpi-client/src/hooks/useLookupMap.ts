import * as R from 'remeda';
import { getGlobalState } from 'src/features/global/interface';
import React from 'react';

export function useLookupMap() {
  const { lookups } = getGlobalState.useState();
  return React.useMemo(() => R.indexBy(lookups, x => x.id), [lookups]);
}
