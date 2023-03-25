import { Filter } from './types';

import { FilterOrderItem } from '~/components/molecules/filters';

export const filters: FilterOrderItem[] = [
  { id: Filter.company, label: 'Company' },
  { id: Filter.date, label: 'Date' },
  { id: Filter.type, label: 'Type' },
];
