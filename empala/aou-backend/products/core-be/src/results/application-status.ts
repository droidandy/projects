import { Field, ObjectType } from 'type-graphql';
import { EApplicationStatus } from '../enums/onboarding/application-status';

@ObjectType()
export class ApplicationFormError {
  @Field()
  public fieldName: string;

  @Field(() => [String])
  public errors: string[];
}

@ObjectType()
export class ApplicationStatus {
  @Field(() => EApplicationStatus)
  public status: EApplicationStatus;

  @Field()
  public requestId: string;

  @Field(() => [ApplicationFormError], { nullable: true })
  public validationErrors?: ApplicationFormError[];

  @Field({ nullable: true })
  public tradeAccountId?: string;
}
