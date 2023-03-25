import {
  ViewEntity, BaseEntity, Column, ManyToOne, JoinColumn,
} from 'typeorm';
import { Instrument } from './instrument';
import { EFeed } from './instrument-feed';

@ViewEntity({ name: 'view_stock_prices_last', schema: 'marketdata', materialized: true })
export class ViewStockPricesLast extends BaseEntity {
  @Column()
  public priceOpen: number;

  @Column()
  public priceClose: number;

  @Column()
  public priceHigh: number;

  @Column()
  public priceLow: number;

  @Column({ type: 'bigint' })
  public instId: BigInt;

  @Column()
  public priceDate: Date;

  @Column()
  public priceFeed: EFeed;

  @ManyToOne(() => Instrument)
  @JoinColumn({ name: 'inst_id', referencedColumnName: 'id' })
  public instrument: Instrument;
}
