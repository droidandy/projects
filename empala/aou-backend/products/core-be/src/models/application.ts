import { Field, ID, ObjectType } from 'type-graphql';
import {
  Entity, BaseEntity, Column, PrimaryGeneratedColumn,
} from 'typeorm';
import { EApplicationStatus } from '../enums/onboarding/application-status';
import { ApplicationFormError } from '../results/application-status';
import { EAccountType } from '../enums/onboarding/account-type';

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

BigInt.prototype.toJSON = function toJSON() {
  return this.toString();
};

@ObjectType()
@Entity({ name: 'application', schema: 'launchpad_ae_onboarding' })
export class Application extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: BigInt;

  @Column({ type: 'bigint' })
  public apexApplicationId: BigInt;

  @Field(() => EApplicationStatus)
  @Column()
  public status: EApplicationStatus;

  @Field(() => [ApplicationFormError], { nullable: true })
  @Column({ type: 'jsonb' })
  public validationErrors: ApplicationFormError[];

  @Field(() => ID)
  @Column({ type: 'bigint' })
  public userId: BigInt;

  @Field(() => EAccountType)
  @Column()
  public accountType: EAccountType;

  @Field({ nullable: true })
  @Column()
  public tradeAccountId?: string;
}
