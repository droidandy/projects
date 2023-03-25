import React from 'react';
import { LookupCategory, Lookup } from 'src/types-next';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { useLanguage } from './useLanguage';

export function useLookupOptions(lookups: Lookup[], category: LookupCategory) {
  const lang = useLanguage();
  return React.useMemo(() => {
    return lookups
      .filter(x => x.category === category)
      .map(item => ({
        label: <DisplayTransString value={item} />,
        value: item.id,
        filterName: item[lang],
      }));
  }, [lookups]);
}
