/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Authorized, Field, Float, ID, ObjectType, registerEnumType,
} from 'type-graphql';
import {
  Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToMany, OneToMany, OneToOne, JoinColumn,
} from 'typeorm';
import { EAccessRole } from '../security/auth-checker';
import { InstrumentLogosResult } from '../results/instrument-logos';
import { ECountry } from '../enums/country';
import { Hunch } from './hunch';
import { Stack } from './stack';
import { Theme } from './theme';
import { Exchange } from './exchange';
import { EFeed, InstrumentFeed } from './instrument-feed';
import { InstrumentLogos } from './instrument-logos';

export enum EInstrumentType {
  STOCK = 'STOCK',
  ETF = 'ETF',
}

registerEnumType(EInstrumentType, { name: 'EInstrumentType' });

@ObjectType()
@Entity({ name: 'inst', schema: 'instruments' })
export class Instrument extends BaseEntity {
  @Field((type) => ID)
  @PrimaryGeneratedColumn()
  public id: BigInt;

  @Field()
  @Column({ name: 'symbol' })
  public symbol: string;

  @Field((type) => EInstrumentType) // Without this annotation, the generated GQL type would be String or Float
  @Column({ name: 'type', type: 'enum', enumName: 'instruments.e_inst_type' })
  public type: EInstrumentType;

  @Field((type) => ECountry)
  public country: ECountry;

  @Field({ nullable: true })
  @Column({ name: 'cusip' })
  public cusip?: string;

  @Column({ name: 'sedol' })
  public sedol: string;

  @Field((type) => Float, { nullable: true, description: 'Will return closing price for now' })
  public currentPrice?: number;

  @Field((type) => Date, { nullable: true })
  public currentPriceDate?: Date;

  @Field((type) => EFeed, { nullable: true })
  public currentPriceFeed?: EFeed;

  @Field((type) => Float)
  public priceChangePercentage = -7.1;

  @Field((type) => Float, { nullable: true })
  public yesterdayClosePrice?: number;

  @Field((type) => Date, { nullable: true })
  public yesterdayClosePriceDate?: Date;

  @Field((type) => EFeed, { nullable: true })
  public yesterdayClosePriceFeed?: EFeed;

  @Field((type) => Float)
  public askCurrentPrice?: number;

  @Field((type) => Float)
  public bidCurrentPrice?: number;

  @Field({ nullable: true })
  public isLookupExactMatch?: boolean;

  @Field((type) => [Theme])
  @ManyToMany(() => Theme, (theme) => theme.instruments)
  public themes: Theme[];

  @Field()
  @Column({ name: 'description' })
  public description: string;

  @Field()
  @Column({ name: 'shortdescription' })
  public shortDescription: string;

  @Field()
  public name: string;

  @Column({ name: 'exchange_id', type: 'bigint', nullable: false })
  public exchangeId: number;

  @Field((type) => Exchange)
  @OneToOne(() => Exchange)
  @JoinColumn()
  public exchange: Exchange;

  @Authorized([EAccessRole.IF_LAUNCHPAD_USER_DETERMINED])
  @Field((type) => [Stack])
  @ManyToMany(() => Stack, (stack) => stack.instruments)
  public stacks: Stack[];

  @Authorized([EAccessRole.IF_LAUNCHPAD_USER_DETERMINED])
  @Field((type) => [Hunch])
  @OneToMany((type) => Hunch, (hunch) => hunch.instrument)
  public hunches: Hunch[];

  @Field((type) => [EFeed])
  public feeds: EFeed[];

  @OneToMany((type) => InstrumentFeed, (instFeed) => instFeed.instruments)
  @JoinColumn({ name: 'id' })
  public instrumentFeeds: InstrumentFeed[];

  @Field((type) => InstrumentLogosResult)
  @OneToOne((type) => InstrumentLogos, (logos) => logos.instrument, { cascade: true })
  public logos: typeof InstrumentLogosResult;

  // if filled, used to pass info on userId from parent to children nodes, used in UserIdPropagator middleware
  public userId: BigInt;
}
