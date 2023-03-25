import {
  createUnionType, Field, ID, ObjectType,
} from 'type-graphql';
import { EUnsupportedAccountErrorReason } from '../enums/onboarding/unsupported-account-error-reason';
import { TypeWithMessageAndRequestId } from '../utils/graphql/common';
import { CreateApplicationInput } from '../inputs/create-application';
import { EAccountValidationErrorType } from '../enums/onboarding/account-validation-error-type';

export const CreateApplicationResult = createUnionType({
  name: 'CreateApplicationResult',
  types: () => [CreateApplicationSuccess, UnsupportedAccountTypeError, AccountInputValidationError, TradeAccountAlreadyExistsError, InternalProcessingError],
});

@ObjectType()
export class CreateApplicationSuccess {
  @Field(() => ID)
  public applicationId: BigInt;

  @Field()
  public requestId: string;
}

@ObjectType()
export class InternalProcessingError implements TypeWithMessageAndRequestId {
  @Field()
  public requestId: string;

  @Field()
  public message: string;
}

@ObjectType()
export class UnsupportedAccountParameter {
  @Field()
  public message: string;

  @Field(() => EUnsupportedAccountErrorReason)
  public reason: EUnsupportedAccountErrorReason;

  @Field(() => String)
  public fieldName: keyof CreateApplicationInput;
}

@ObjectType()
export class UnsupportedAccountTypeError {
  @Field(() => [UnsupportedAccountParameter])
  public errors: UnsupportedAccountParameter[];

  @Field()
  public requestId: string;
}

@ObjectType()
export class AccountInputValidationError {
  @Field(() => [AccountInputValidationErrorMessage])
  public errors: AccountInputValidationErrorMessage[];

  @Field()
  public requestId: string;
}

@ObjectType()
export class AccountInputValidationErrorMessage {
  @Field()
  public message: string;

  @Field(() => EAccountValidationErrorType)
  public reason: EAccountValidationErrorType;

  @Field(() => String)
  public fieldName: keyof CreateApplicationInput;
}

@ObjectType()
export class TradeAccountAlreadyExistsError {
  @Field()
  public message: string;

  @Field()
  public requestId: string;
}
