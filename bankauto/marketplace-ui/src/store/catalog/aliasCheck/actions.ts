import { AsyncAction } from 'types/AsyncAction';
import { checkUrlAliases } from 'api/catalog';
import { actions as aliasCheckActions } from './reducers';

export const fetchAliasCheck = (
  brandAlias: string,
  modelAlias: string | null,
  generationAlias: string | null,
): AsyncAction => {
  return function (dispatch) {
    dispatch(aliasCheckActions.setLoading(true));
    return checkUrlAliases(brandAlias, modelAlias, generationAlias)
      .then(({ data }) => {
        dispatch(aliasCheckActions.setAliasCheck(data));
      })
      .catch((err) => {
        dispatch(aliasCheckActions.setError(err));
      });
  };
};

export const clearAliasData = (): AsyncAction => {
  return function (dispatch) {
    dispatch(aliasCheckActions.setAliasCheck({ brand: null, model: null, generation: null }));
  };
};
