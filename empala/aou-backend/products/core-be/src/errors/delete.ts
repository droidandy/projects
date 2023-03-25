/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, ObjectType } from 'type-graphql';
import { EValidationErrorCode, TypeWithMessageAndRequestId } from '../utils/graphql/common';

@ObjectType({ implements: TypeWithMessageAndRequestId })
export class DeleteInvalidInputError extends TypeWithMessageAndRequestId {
  @Field((type) => EValidationErrorCode, { nullable: false })
  public errorCode: EValidationErrorCode;
}
