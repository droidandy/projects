// @flow
// TODO: probably need to switch to ducks
// TODO: refactor reducers structure

// declarations
export type State = {
  activeTab: 'documents' | 'quality' | 'reference',
};

export type Action = { type: 'SHOW_DOCUMENT_TAB' | 'SHOW_QUALITY_TAB' | 'SHOW_REFERENCE_TAB' };

//
const initialState = {
  activeTab: 'documents',
};

// reducer
export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case 'SHOW_DOCUMENT_TAB':
      return {
        ...state,
        activeTab: 'documents',
      };

    case 'SHOW_QUALITY_TAB':
      return {
        ...state,
        activeTab: 'quality',
      };

    case 'SHOW_REFERENCE_TAB':
      return {
        ...state,
        activeTab: 'reference',
      };

    default:
      return state;
  }
};

// action creators
export const showDocumentsTab = (): Action => ({ type: 'SHOW_DOCUMENT_TAB' });
export const showQualityTab = (): Action => ({ type: 'SHOW_QUALITY_TAB' });
export const showReferenceTab = (): Action => ({ type: 'SHOW_REFERENCE_TAB' });
