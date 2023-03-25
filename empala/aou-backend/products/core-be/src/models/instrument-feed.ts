/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, JoinColumn,
} from 'typeorm';
import {
  Field, ID, ObjectType, registerEnumType,
} from 'type-graphql';
import { Instrument } from './instrument';

export enum EFeed {
  MORNING_STAR = 'MORNING_STAR',
  APEX = 'APEX',
}

registerEnumType(EFeed, { name: 'EFeed' });

@ObjectType()
@Entity({ name: 'inst_feed', schema: 'instruments' })
export class InstrumentFeed extends BaseEntity {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  public id: BigInt;

  @Column({ name: 'inst_id', type: 'bigint' })
  public instId: BigInt;

  @Field((type) => EFeed)
  @Column()
  public feed: EFeed;

  @ManyToOne((type) => Instrument, (instrument) => instrument.instrumentFeeds)
  @JoinColumn({ name: 'inst_id' })
  public instruments: Instrument;
}
