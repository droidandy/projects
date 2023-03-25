/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity, Column, Entity, PrimaryGeneratedColumn,
} from 'typeorm';
import { ECountry } from '../enums/country';

@ObjectType()
@Entity({ name: 'exchange', schema: 'instruments' })
export class Exchange extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: BigInt;

  @Field()
  @Column()
  public name: string;

  @Field((country) => ECountry) // Without this annotation, the generated GQL type would be String or Float
  @Column({ name: 'country' })
  public country: ECountry;
}
