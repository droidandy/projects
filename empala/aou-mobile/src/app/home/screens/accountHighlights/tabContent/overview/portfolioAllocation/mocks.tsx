import React from 'react';

import { Company, Cash, InvestackMock, InterestMock } from './types';

import CompanyImagePlaceholder48 from '~/assets/icons/lib/companyImagePlaceholder48';

export const companies: Company[] = [
  {
    id: 1,
    image: <CompanyImagePlaceholder48 />,
    name: 'Apple',
    sharesCount: 16,
    sharesValue: '146.5',
    value: '2,345',
    percentage: 2,
    valueChange: '14',
  },
  {
    id: 2,
    image: <CompanyImagePlaceholder48 />,
    name: 'Tesla',
    sharesCount: 11,
    sharesValue: '45',
    value: '1,867',
    percentage: 2,
    valueChange: '114.58',
  }, {
    id: 3,
    image: <CompanyImagePlaceholder48 />,
    name: 'Uber',
    sharesCount: 3,
    sharesValue: '1,666',
    value: '1,321',
    percentage: -4,
    valueChange: '-214.58',
  }, {
    id: 4,
    image: <CompanyImagePlaceholder48 />,
    name: 'Microsoft',
    sharesCount: 3,
    sharesValue: '146,5',
    value: '345',
    percentage: 2,
    valueChange: '14.58',
  }, {
    id: 5,
    image: <CompanyImagePlaceholder48 />,
    name: 'Lift',
    sharesCount: 11,
    sharesValue: '45',
    value: '3,600',
    percentage: 2,
    valueChange: '114,58',
  }, {
    id: 6,
    image: <CompanyImagePlaceholder48 />,
    name: 'Coinbase',
    sharesCount: 1,
    sharesValue: '1,666',
    value: '1,666',
    percentage: -4,
    valueChange: '-214,58',
  },
];

export const cashs: Cash[] = [
  {
    id: 7,
    name: 'Cash',
    value: '3,000',
    image: <CompanyImagePlaceholder48 />,
  },
  {
    id: 8,
    name: 'Cash',
    value: '1,000',
    image: <CompanyImagePlaceholder48 />,
  },
];

export const investacks: InvestackMock[] = [
  {
    id: 1,
    name: 'Retail',
    percentage: 3,
    valueChange: '134.58',
    totalValue: '1,270',
    companiesCount: 4,
    bottomIconsCount: 2,
  }, {
    id: 2,
    name: 'Silicon Valley',
    percentage: 3,
    valueChange: '134.58',
    totalValue: '4,456',
    companiesCount: 6,
    bottomIconsCount: 6,
  }, {
    id: 3,
    name: 'Fortune 50',
    percentage: -3,
    valueChange: '-134.58',
    totalValue: '2,236',
    companiesCount: 50,
    bottomIconsCount: 8,
  }, {
    id: 4,
    name: 'Big Oil',
    percentage: 3,
    valueChange: '134.58',
    totalValue: '6,260',
    companiesCount: 4,
    bottomIconsCount: 2,
  },
];

export const notInvestack: Company[] = [
  {
    id: 5,
    image: <CompanyImagePlaceholder48 />,
    name: 'WeWork',
    sharesCount: 11,
    sharesValue: '45',
    value: '512',
    percentage: 2,
    valueChange: '114.58',
  },
  {
    id: 6,
    image: <CompanyImagePlaceholder48 />,
    name: 'Softbank',
    sharesCount: 6,
    sharesValue: '66',
    value: '1,200',
    percentage: -4,
    valueChange: '-214.58',
  },
];

export const interests: InterestMock[] = [
  {
    id: 1,
    name: 'Technology',
    percentage: 3,
    valueChange: '134.58',
    totalValue: '13,270',
    companiesCount: 4,
    investacksCount: 1,
  }, {
    id: 2,
    name: 'Fashion',
    percentage: 3,
    valueChange: '134.58',
    totalValue: '83,270',
    companiesCount: 12,
    investacksCount: 3,
  }, {
    id: 3,
    name: 'Real Estate',
    percentage: -3,
    valueChange: '-232.48',
    totalValue: '43,236',
    companiesCount: 50,
    investacksCount: 3,
  },
];
