import { PostgresError } from 'pg-error-enum';
import { CreateInvalidInputError } from '../errors/create';
import { DeleteInvalidInputError } from '../errors/delete';
import { EValidationErrorCode } from './graphql/common';

//
// generic function which can map PG SQL error codes to
// EValidationErrorCode enum and can be used for
//   - Hunches
//   - Stacks
//
const mapErrorCodesToMessages = (e: any, context: any): any => {
  let errorCode;
  let message;

  switch (e.code) {
    case PostgresError.UNIQUE_VIOLATION:
      errorCode = EValidationErrorCode.DUPLICATE;
      message = `${e.message || 'One of the arguments would have caused a duplicate creation and was rejected.'
      }${e.detail ? `. ${e.detail}` : ''}`;
      break;

    case PostgresError.NOT_NULL_VIOLATION:
      errorCode = EValidationErrorCode.NULL;
      message = `${e.detail || 'One of the obligatory arguments was not specified.'}`;
      break;

    case PostgresError.CHECK_VIOLATION:
      errorCode = EValidationErrorCode.CHECK;
      message = `${e.message || 'One of the data checks failed, please ensure all required arguments have the correct data.'}`;
      break;

    case PostgresError.FOREIGN_KEY_VIOLATION:
      errorCode = EValidationErrorCode.REFERENTIAL_INTEGRITY;
      message = `${e.detail || 'Some of the referenced entities do not exist.'}`;
      break;

    default:
      throw e;
  }

  const localError = new CreateInvalidInputError(message, context.requestId);
  localError.errorCode = errorCode;
  return localError;
};

export const generateCreateErrorMessage = (e: any, fieldName: string, context: any): typeof CreateInvalidInputError => {
  let error: typeof CreateInvalidInputError = null;

  /* istanbul ignore else */
  if (e && e.code) {
    error = mapErrorCodesToMessages(e, context);
  } else {
    throw e;
  }

  return error;
};

export const generateDeleteErrorMessage = (e: any, fieldName: string, context: any): typeof DeleteInvalidInputError => {
  let error: typeof DeleteInvalidInputError = null;

  /* istanbul ignore else */
  if (e && e.code) {
    error = mapErrorCodesToMessages(e, context);
  } else {
    throw e;
  }

  return error;
};
