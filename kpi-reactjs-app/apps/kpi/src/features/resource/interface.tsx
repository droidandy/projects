import { createModule } from 'typeless';
import { ResourceSymbol } from './symbol';

// --- Actions ---
export const [handle, ResourceActions, getResourceState] = createModule(
  ResourceSymbol
)
  .withActions({
    $mounted: null,
    setOptions: (options: ResourceState) => ({ payload: { options } }),
  })
  .withState<ResourceState>();

// --- Types ---
export interface ResourceState {
  name: string;
  parentRequired?: boolean;
}
