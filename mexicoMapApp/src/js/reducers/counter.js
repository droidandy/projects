/**
 * Created by developercomputer on 06.12.15.
 */
import { INCREMENT_COUNTER, DECREMENT_COUNTER, RESET_COUNTER } from "./../actions/counter.js";

const counter = (state = 1, action = {}) => {
  switch (action.type) {
    case INCREMENT_COUNTER:
      return state + 1;
    case DECREMENT_COUNTER:
      return state - 1;
    case RESET_COUNTER:
      return 0;
    default:
      return state;
  }
};

export default counter;
