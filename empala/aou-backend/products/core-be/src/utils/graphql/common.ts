import {
  InterfaceType, Field, registerEnumType, createParamDecorator,
} from 'type-graphql';
import { parseResolveInfo, simplifyParsedResolveInfoFragmentWithType, ResolveTree } from 'graphql-parse-resolve-info';

export enum EValidationErrorCode {
  DUPLICATE, // union constraint violation
  REFERENTIAL_INTEGRITY, // foreign key constraint violation
  NULL, // for null constraint violation
  CHECK, // used for check constraint violation
}

registerEnumType(EValidationErrorCode, { name: 'EValidationErrorCode' });
@InterfaceType()
export class TypeWithMessageAndRequestId {
  @Field({ nullable: false })
  public message: string;

  @Field({ nullable: false })
  public requestId: string;

  public constructor(msg: string, requestId: string) {
    this.message = msg;
    this.requestId = requestId;
  }
}

// Transactions need to throw an exception to get rolled back but we don't always want the exception to bubble all the way up and get returned to the client
// This exception can be used to wrap an error response that should be returned to the front end
export default class TransactionError extends Error {
  public graphQlError: TypeWithMessageAndRequestId;

  public constructor(error: TypeWithMessageAndRequestId) {
    super();
    this.graphQlError = error;
  }
}

export const getFields = (info: any): ResolveTree => {
  const parsedResolveInfoFragment = parseResolveInfo(info);

  /* istanbul ignore if */
  if (!parsedResolveInfoFragment) {
    throw new Error('Failed to parse resolve info.');
  }

  return simplifyParsedResolveInfoFragmentWithType(parsedResolveInfoFragment as ResolveTree, info.returnType);
};

export const Fields = (): ParameterDecorator => createParamDecorator(({ info }): ResolveTree => getFields(info));
