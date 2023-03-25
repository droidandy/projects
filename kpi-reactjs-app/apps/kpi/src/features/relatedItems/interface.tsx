import { createModule } from 'typeless';
import { RelatedItemsSymbol } from './symbol';
import { RelatedItemType, RelatedItem } from 'src/types-next';

// --- Actions ---
export const [handle, RelatedItemsActions, getRelatedItemsState] = createModule(
  RelatedItemsSymbol
)
  .withActions({
    show: (type: RelatedItemType, id: number) => ({ payload: { type, id } }),
    loaded: (items: RelatedItem[]) => ({ payload: { items } }),
    created: (item: RelatedItem) => ({ payload: { item } }),
  })
  .withState<RelatedItemsState>();

// --- Types ---
export interface RelatedItemsState {
  type: RelatedItemType;
  id: number;
  items: RelatedItem[];
  isLoaded: boolean;
}
