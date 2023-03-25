/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, Float, ObjectType } from 'type-graphql';
import { PortfolioEntriesResult } from '../results/portfolio';
import { Instrument } from './instrument';

@ObjectType()
export class Portfolio {
  @Field((type) => PortfolioEntriesResult)
  public portfolioEntries: typeof PortfolioEntriesResult;
}

@ObjectType()
export class PortfolioEntries {
  @Field((type) => [PortfolioEntry])
  public entries: PortfolioEntry[];
}

@ObjectType()
export class PortfolioEntry {
  @Field((type) => Instrument)
  public instrument: Instrument;

  @Field((type) => Float, { description: 'The number of shares owned of the current instrument' })
  public quantity: number;

  @Field((type) => Float, { description: 'The amount that was originally paid for this instrument' })
  public costBasis: number;

  @Field((type) => Float, { description: 'The total value of all shares held in this instrument' })
  public currentValue: number;

  @Field((type) => Float, { description: 'The gain/loss in value since the shares of this instrument were purchased' })
  public gain: number;

  @Field((type) => Float, { description: 'The gain/loss percentage in value since the shares of this instrument were purchased' })
  public gainPercentage: number;

  public symbol: string;

  public static createFromData(data: any): PortfolioEntry {
    const entry = new PortfolioEntry();
    entry.symbol = data.quote.symbol;
    entry.quantity = data.quantity;
    entry.costBasis = data.costValue;
    entry.currentValue = data.value;
    entry.gain = data.gain;
    entry.gainPercentage = data.gainPercent;
    return entry;
  }
}
