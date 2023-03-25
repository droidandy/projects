import {
  DOWNLOAD_PRESENTATION,
  GET_PRESENTATION_OPTIONS,
  CREATE_ALTERNATIVE,
  UPDATE_ALTERNATIVE_OPTION,
  DELETE_ALTERNATIVE,
  DELETE_ALTERNATIVE_OPTION,
  GET_OPTIONS,
  ADD_DISCOUNT,
  REMOVE_DISCOUNT,
  UPDATE_DISCOUNT,
} from './constants';

export function getOptions(section) {
  return {
    type: GET_OPTIONS,
    payload: { section },
  };
}

export function getPresentationOptions() {
  return {
    type: GET_PRESENTATION_OPTIONS,
  };
}

export function createAlternative() {
  return {
    type: CREATE_ALTERNATIVE,
  };
}

export function updateAlternativeOption(presentationOptionId, product, rfpQuoteOptionId) {
  return {
    type: UPDATE_ALTERNATIVE_OPTION,
    payload: { presentationOptionId, product, rfpQuoteOptionId },
  };
}

export function deleteAlternative(presentationOptionId, index) {
  return {
    type: DELETE_ALTERNATIVE,
    payload: { presentationOptionId, index },
  };
}

export function deleteAlternativeOption(presentationOptionId, product, rfpQuoteOptionId) {
  return {
    type: DELETE_ALTERNATIVE_OPTION,
    payload: { presentationOptionId, product, rfpQuoteOptionId },
  };
}

export function addDiscount(index) {
  return {
    type: ADD_DISCOUNT,
    payload: { index },
  };
}

export function removeDiscount(index) {
  return {
    type: REMOVE_DISCOUNT,
    payload: { index },
  };
}


export function updateDiscount(discountIndex, index, type, value) {
  return {
    type: UPDATE_DISCOUNT,
    payload: {
      discountIndex,
      index,
      type,
      value,
    },
  };
}

export function downloadPresentation(clientId, type) {
  return {
    type: DOWNLOAD_PRESENTATION,
    payload: { clientId, type },
  };
}
