import { Field, ObjectType } from 'type-graphql';
import { EValidationErrorCode, TypeWithMessageAndRequestId } from '../utils/graphql/common';

@ObjectType({ implements: TypeWithMessageAndRequestId })
export class CreateInvalidInputError extends TypeWithMessageAndRequestId {
  @Field(() => EValidationErrorCode, { nullable: false })
  public errorCode: EValidationErrorCode;
}
