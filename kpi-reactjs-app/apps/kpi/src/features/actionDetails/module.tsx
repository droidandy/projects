import {
  ActionDetailsActions,
  ActionDetailsState,
  handle,
  getActionDetailsState,
} from './interface';
import {
  ActionDetailsFormActions,
  getActionDetailsFormState,
} from './actionDetails-form';

// --- Epic ---
handle
  .epic()
  .on(ActionDetailsActions.show, ({ actionData }) => {
    if (!actionData) {
      return ActionDetailsFormActions.reset();
    } else {
      return [
        ActionDetailsFormActions.reset(),
        ActionDetailsFormActions.changeMany({
          name_en: actionData.name.en,
          name_ar: actionData.name.ar,
          startDate: actionData.startDate,
          endDate: actionData.endDate,
        }),
      ];
    }
  })
  .on(ActionDetailsFormActions.setSubmitSucceeded, () => {
    const { actionData } = getActionDetailsState();
    const { values } = getActionDetailsFormState();
    const data = {
      id: 0,
      name: {
        ar: values.name_ar,
        en: values.name_en,
      },
      startDate: values.startDate,
      endDate: values.endDate,
    };

    return [
      actionData
        ? ActionDetailsActions.actionUpdated(data)
        : ActionDetailsActions.actionCreated(data),
    ];
  });

// --- Reducer ---
const initialState: ActionDetailsState = {
  isVisible: false,
  isSaving: false,
  actionData: null,
};

handle
  .reducer(initialState)
  .on(ActionDetailsActions.show, (state, { actionData }) => {
    Object.assign(state, initialState);
    state.isVisible = true;
    state.actionData = actionData;
  })
  .on(ActionDetailsActions.close, state => {
    state.isVisible = false;
  })
  .on(ActionDetailsActions.setSaving, (state, { isSaving }) => {
    state.isSaving = isSaving;
  });

export const useActionDetails = () => handle();
