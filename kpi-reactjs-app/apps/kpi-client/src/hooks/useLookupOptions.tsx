import React from 'react';
import { LookupCategory, Lookup } from 'src/types';
import { DisplayTransString } from 'src/components/DisplayTransString';

export function useLookupOptions(lookups: Lookup[], category: LookupCategory) {
  return React.useMemo(() => {
    return lookups
      .filter(x => x.category === category)
      .map(item => ({
        label: <DisplayTransString value={item} />,
        value: item.id,
      }));
  }, [lookups]);
}
