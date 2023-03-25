import { Instrument, EInstrumentType } from '~/graphQL/core/generated-types';

export type InstrumentsType = {
  symbol: string,
  name: string,
  closePrice: number,
  currentPrice: number,
  priceChangePercentage: number,
};

export const data = [
  {
    symbol: 'SWIM',
    name: 'LATHAM GROUP IN',
    closePrice: 379.06,
    currentPrice: 349.06,
    priceChangePercentage: 1.3,
    id: '8000',
  },
  {
    symbol: 'DBBS',
    name: 'Dibbert and Sons',
    closePrice: 48.67,
    currentPrice: 41.67,
    priceChangePercentage: 1.35,
    id: '2662',
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Motors Inc.',
    closePrice: 689.06,
    currentPrice: 692.06,
    priceChangePercentage: 1.4,
    id: '2662',
  },
  {
    symbol: 'SCHM',
    name: 'Schumm Inc.',
    closePrice: 637.55,
    currentPrice: 674.06,
    priceChangePercentage: 3.5,
    id: '2662',
  },
  {
    symbol: 'BHS',
    name: 'Schumm Inc.',
    closePrice: 637.55,
    currentPrice: 674.06,
    priceChangePercentage: 3.5,
    id: '2662',
  },
  {
    symbol: 'WHS',
    name: 'Schumm Inc.',
    closePrice: 637.55,
    currentPrice: 674.06,
    priceChangePercentage: 3.5,
    id: '2662',
  },
  {
    symbol: 'MRT',
    name: 'Schumm Inc.',
    closePrice: 637.55,
    currentPrice: 674.06,
    priceChangePercentage: 3.5,
    id: '2662',
  },
  {
    symbol: 'NIKE',
    name: 'Schumm Inc.',
    closePrice: 637.55,
    currentPrice: 674.06,
    priceChangePercentage: 3.5,
    id: '2662',
  },
];

export const EmptyInstrument: Instrument = {
  id: '',
  symbol: '',
  type: EInstrumentType.Stock,
  cusip: '',
  name: '',
  currentPrice: 0,
  priceChangePercentage: 0,
  themes: [],
  description: '',
  shortDescription: '',
  exchange: {
    __typename: undefined,
    id: '',
    name: '',
  },
  stacks: [],
  hunches: [],
  feeds: [],
};
