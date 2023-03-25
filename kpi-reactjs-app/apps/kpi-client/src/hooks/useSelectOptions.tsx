import React from 'react';
import { useLanguage } from './useLanguage';
import { TransString } from 'src/types';
import { DisplayTransString } from 'src/components/DisplayTransString';

export function useSelectOptions<
  T extends { name: TransString; id: string | number }
>(items: T[] | null) {
  const lang = useLanguage();

  return React.useMemo(() => {
    if (!items) {
      return [];
    }
    return items.map(item => ({
      label: <DisplayTransString value={item.name} />,
      value: item.id,
      filterName: item.name[lang],
    }));
  }, [items]);
}
