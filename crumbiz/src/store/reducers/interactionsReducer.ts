import { InteractionsTypes } from '../constants';
import { createInteractionsReducer } from './utils';

export default createInteractionsReducer(InteractionsTypes.GET_INTERACTIONS);
