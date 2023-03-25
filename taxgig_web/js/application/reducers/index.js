import { combineReducers } from "redux";
import { connectRouter } from 'connected-react-router';

// All reducers
import general from "./general";
import landing from "../../pages/landing/reducers";

const createRootReducer = (history) => combineReducers({
  router: connectRouter(history),
  general: general,
  landing: landing,

});

export default createRootReducer;