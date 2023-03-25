/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Field, Float, ID, ObjectType,
} from 'type-graphql';
import {
  Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, JoinColumn,
} from 'typeorm';
import { Instrument } from './instrument';
import { DateValueTransformer } from '../utils/date-value-transformer';
import { User } from './user';

@ObjectType()
@Entity({ name: 'hunch', schema: 'launchpad' })
export class Hunch extends BaseEntity {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  public id: BigInt;

  @Field((type) => Float, { defaultValue: 0.0 })
  public priceChangePercentage: number;

  @Field((type) => Float)
  @Column({ name: 'target_price', type: 'numeric' })
  public targetPrice: number;

  @Field((type) => Float, { nullable: true })
  public currentPrice?: number;

  @Column({ name: 'inst_id', type: 'bigint' })
  public instId: BigInt;

  @Field((type) => Instrument)
  @ManyToOne((type) => Instrument, (instrument) => instrument.hunches)
  @JoinColumn({ name: 'inst_id', referencedColumnName: 'id' })
  public instrument: Instrument;

  @Field((type) => Date)
  @Column({ name: 'by_date', type: 'date', transformer: new DateValueTransformer() })
  public byDate: Date;

  @Field({ nullable: true })
  @Column({ name: 'description', type: 'text' })
  public description: string;

  @Column({ name: 'user_id', type: 'bigint' })
  public userId: BigInt;

  @ManyToOne((type) => User, (user) => user.hunches)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  public user: User;
}

@ObjectType()
@Entity({ name: 'hunchfollow', schema: 'launchpad' })
export class HunchFollow extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  public id: BigInt;

  @Field((type) => User)
  public userFollowed: User;

  @Field((type) => User)
  public follower: User;
}
