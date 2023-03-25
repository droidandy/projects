import { DebitCardSmall, FilterKey } from 'store/types';
import { useRouter } from 'next/router';
import { useDebitCards } from 'store/finance/debitCards';

type Query = Record<FilterKey, 'true' | 'false'>;

export function useFilteredItems(additionalFilter?: FilterKey) {
  const { items } = useDebitCards();
  const router = useRouter();
  const query = router.query as Query;

  let filters = query;
  if (additionalFilter === 'mastercard' || additionalFilter === 'mir') {
    filters = {
      ...filters,
      mastercard: 'false',
      mir: 'false',
      [additionalFilter]: 'true',
    };
  } else if (additionalFilter) {
    filters = {
      ...filters,
      [additionalFilter]: 'true',
    };
  }

  let filteredItems: DebitCardSmall[] = [];
  const selectedFilters = Object.entries(filters)
    .filter((v) => v[1] === 'true')
    .map((v) => v[0]) as FilterKey[];

  if (selectedFilters && items) {
    filteredItems = items?.filter((item) => selectedFilters.every((f) => item.filter.includes(f)));
  }
  const isEmpty = filteredItems.length === 0;

  return { filteredItems, isEmpty };
}
