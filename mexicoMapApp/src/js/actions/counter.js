/**
 * Created by developercomputer on 11.12.15.
 */
export const INCREMENT_COUNTER = 'INCREMENT_COUNTER';
export const DECREMENT_COUNTER = 'DECREMENT_COUNTER';
export const RESET_COUNTER = 'RESET_COUNTER';

export const increment = () => {
  return {
    type: INCREMENT_COUNTER
  }
};

export const decrement = () => {
  return {
    type: DECREMENT_COUNTER
  }
};

export const reset = () => {
  return {
    type: RESET_COUNTER
  }
};
