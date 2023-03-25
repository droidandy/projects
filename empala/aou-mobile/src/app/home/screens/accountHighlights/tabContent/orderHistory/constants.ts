import { Filter } from './types';

import { FilterOrderItem } from '~/components/molecules/filters';

export const filters: FilterOrderItem[] = [
  { id: Filter.company, label: 'Company' },
  { id: Filter.type, label: 'Type' },
  { id: Filter.status, label: 'Status' },
];
