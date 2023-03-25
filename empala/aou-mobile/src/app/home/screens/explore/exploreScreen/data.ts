export const investacks = [
  {
    id: 1,
    name: 'TEST',
    currentPrice: 6.5,
    closePrice: 10.23,
    percentageChange: 12.2,
    count: 10,
    instruments: [
      {
        symbol: 'APPL', name: 'Apple', currentPrice: 5.6, priceChangePercentage: 2.1,
      },
    ],
  },
  {
    id: 2,
    name: 'My stack',
    currentPrice: 12.5,
    closePrice: 10.23,
    count: 4,
    percentageChange: 12.2,
    instruments: [
      {
        symbol: 'APPL', name: 'Apple', currentPrice: 5.6, priceChangePercentage: 2.1,
      },
    ],
  },
  {
    id: 3,
    name: 'My stack 2',
    currentPrice: 15.5,
    closePrice: 4.23,
    count: 7,
    percentageChange: 12.2,
    instruments: [
      {
        symbol: 'APPL', name: 'Apple', currentPrice: 5.6, priceChangePercentage: 2.1,
      },
    ],
  },
];

export const hunches = [
  {
    id: 1,
    symbol: 'APPL',
    targetPrice: 2.5,
    byDate: new Date().toISOString(),
    priceChangePercentage: 7.2,
    source: { uri: 'https://picsum.photos/200/300' },
    author: { avatar: { uri: 'https://picsum.photos/200/300' } },
    instrument: {
      symbol: 'APPL', name: 'Apple', currentPrice: 5.6, priceChangePercentage: 2.1,
    },
  },
  {
    id: 2,
    symbol: 'TAL',
    targetPrice: 6.5,
    byDate: new Date().toISOString(),
    priceChangePercentage: '5',
    source: { uri: 'https://picsum.photos/200/300' },
    author: { avatar: { uri: 'https://picsum.photos/200/300' } },
    instrument: {
      symbol: 'APPL', name: 'Apple', currentPrice: 5.6, priceChangePercentage: 2.1,
    },
  },
  {
    id: 3,
    symbol: 'T',
    targetPrice: 12.5,
    byDate: new Date().toISOString(),
    priceChangePercentage: 5,
    source: { uri: 'https://picsum.photos/200/300' },
    author: { avatar: { uri: 'https://picsum.photos/200/300' } },
    instrument: {
      symbol: 'APPL', name: 'Apple', currentPrice: 5.6, priceChangePercentage: 2.1,
    },
  },
  {
    id: 4,
    symbol: 'eqw',
    targetPrice: 2.5,
    byDate: new Date().toISOString(),
    priceChangePercentage: 7.2,
    source: { uri: 'https://picsum.photos/200/300' },
    author: { avatar: { uri: 'https://picsum.photos/200/300' } },
    instrument: {
      symbol: 'APPL', name: 'Apple', currentPrice: 5.6, priceChangePercentage: 2.1,
    },
  },
];

export const users = [
  { id: 1, name: 'Raoul', source: { uri: 'https://picsum.photos/200/300' } },
  { id: 2, name: 'Paul', source: { uri: 'https://picsum.photos/200/300' } },
  { id: 3, name: 'Marina', source: { uri: 'https://picsum.photos/200/300' } },
  { id: 4, name: 'Raoul', source: { uri: 'https://picsum.photos/200/300' } },
  { id: 5, name: 'Paul', source: { uri: 'https://picsum.photos/200/300' } },
  { id: 6, name: 'Marina', source: { uri: 'https://picsum.photos/200/300' } },
];

export const companies = [
  {
    id: 2662,
    symbol: 'APPL',
    source: { uri: 'https://picsum.photos/200/300' },
    currentPrice: 1.78,
    closePrice: 1.54,
  },
  {
    id: 15518,
    symbol: 'CMC',
    source: { uri: 'https://picsum.photos/200/300' },
    currentPrice: 0.78,
    closePrice: 1.54,
  },
  {
    id: 15019,
    symbol: 'SMG',
    source: { uri: 'https://picsum.photos/200/300' },
    currentPrice: 0.78,
    closePrice: 1.54,
  },
  {
    id: 2015,
    symbol: 'MVIS',
    source: { uri: 'https://picsum.photos/200/300' },
    currentPrice: 0.78,
    closePrice: 1.54,
  },
  {
    id: 17002,
    symbol: 'ADM',
    source: { uri: 'https://picsum.photos/200/300' },
    currentPrice: 0.78,
    closePrice: 1.54,
  },
  {
    id: 15946,
    symbol: 'GPS',
    source: { uri: 'https://picsum.photos/200/300' },
    currentPrice: 0.78,
    closePrice: 1.54,
  },
];
