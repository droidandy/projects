import { StateModel } from 'store/types';
import { ParsedUrlQuery } from 'querystring';
import { PageContextType } from 'helpers/context/PageContext';

export interface PagePropsBase<Q extends ParsedUrlQuery = ParsedUrlQuery> {
  context?: PageContextType<Q>;
  initialState?: Partial<StateModel>;
}
