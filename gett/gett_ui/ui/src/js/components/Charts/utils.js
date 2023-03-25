import { startCase } from 'lodash';

export const NAME_MAPPING = {
  completed: 'Completed',
  cancelled: 'Cancelled',
  rejected: 'Rejected',
  blackTaxi: 'Black Taxi',
  blackTaxiXl: 'Black Taxi XL',
  exec: 'Exec',
  mpv: 'MPV',
  standard: 'Standard',
  businessPaymentCard: 'Business Credit',
  personalPaymentCard: 'Personal Credit',
  companyPaymentCard: 'Company Credit',
  cash: 'Cash',
  account: 'Account',
  spend: 'Spend',
  phone: 'Phone',
  web: 'Web',
  asap: 'ASAP',
  future: 'Future',
  affiliate: 'Affiliate',
  enterprise: 'Enterprise',
  current: 'Current',
  previous: 'Previous',
  allCities: 'All Cities',
  allCompanies: 'All Companies'
};

export const CHART_FILLS = [
  '#50d166',
  '#1875f0',
  '#9ed2fe',
  '#ffa366',
  '#a366ff',
  '#ff3385'
];

export const nameMapping = name => NAME_MAPPING[name] || startCase(name);

export const chartFills = index => CHART_FILLS[index % CHART_FILLS.length];

export const tickOptions = {
  fill: '#b3b3b3',
  fontSize: '12px',
  fontWeight: 'bold'
};
