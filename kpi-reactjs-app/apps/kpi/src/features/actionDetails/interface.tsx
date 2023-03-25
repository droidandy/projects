import { createModule } from 'typeless';
import { ActionDetailsSymbol } from './symbol';
import { TransString } from 'src/types-next';

// --- Actions ---
export const [
  handle,
  ActionDetailsActions,
  getActionDetailsState,
] = createModule(ActionDetailsSymbol)
  .withActions({
    show: (actionData: ActionData | null) => ({
      payload: { actionData },
    }),
    actionCreated: (actionData: ActionData) => ({ payload: { actionData } }),
    actionUpdated: (actionData: ActionData) => ({ payload: { actionData } }),
    close: null,
    setSaving: (isSaving: boolean) => ({ payload: { isSaving } }),
  })
  .withState<ActionDetailsState>();

// --- Types ---
export interface ActionDetailsState {
  isVisible: boolean;
  isSaving: boolean;
  actionData: ActionData | null;
}

export interface ActionData {
  id: number;
  name: TransString;
  startDate: string;
  endDate: string;
}
