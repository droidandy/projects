import React from 'react';
import * as R from 'remeda';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { TransString } from 'src/types';
import { useLanguage } from './useLanguage';

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

export function useSelectOptionsNoParent<
  T extends { name: TransString; id: string; parent: string }
>(items: T[] | null, entity: T) {
  const lang = useLanguage();
  return React.useMemo(() => {
    if (!items) {
      return [];
    }
    const index = R.indexBy(items, x => x.id);
    const allowed: Record<string, boolean> = {};
    const checkAllowed = (item: T): boolean => {
      if (!entity) {
        return true;
      }
      if (allowed[item.id] != null) {
        return allowed[item.id];
      }
      if (item.id === entity.id) {
        return (allowed[item.id] = false);
      }
      if (!item.parent) {
        return (allowed[item.id] = true);
      }
      return (allowed[item.id] = checkAllowed(index[item.parent]));
    };
    return items.filter(checkAllowed).map(item => ({
      label: <DisplayTransString value={item.name} />,
      value: item.id,
      filterName: item.name[lang],
    }));
  }, [items]);
}
