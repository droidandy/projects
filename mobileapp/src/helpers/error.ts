import { GraphQLError } from 'graphql';

export const errors = {
  error_user_none_exists_table: 'Пользователь не найден',
  internal_error: 'Произошла непредвиденная ошибка, попробуйте повторить попытку позднее',
};

const breakRowRegExp = /<br\s?\/?>/;

export function getErrorFromGQLError(error: GraphQLError): string {
  const extensions = error.extensions;
  const langRu = extensions?.langRu;
  const params = extensions?.params;

  let result: string;

  if (typeof langRu === 'string') {
    result = langRu;
  } else if (Array.isArray(params) && typeof params[0] === 'string') {
    result = params[0];
  } else {
    const localizedError = errors[error.message];

    if (typeof localizedError === 'string' && localizedError.length > 0) {
      result = localizedError;
    } else {
      result = errors.internal_error;
    }
  }

  return result.replace(breakRowRegExp, '');
}
