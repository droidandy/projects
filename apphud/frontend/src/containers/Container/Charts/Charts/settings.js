import countryList from "../../../../countries.json";

function getCountryList() {
  const res = {};
  for(let i=0; i<countryList.length; i++) {
    const item = countryList[i];
    res[item.Code] = item.Name;
  }
  return res;
}

export const isConversions = [
  'trial_conversions',
  'regular_conversions',
  'paid_intro_conversions',
  'promo_conversions',
  'non_renewing_conversions'
];

export const conversionsOptions = [
  {
    value: '% of total',
    label: '% of total',
  },
  {
    value: '% of previous',
    label: '% of previous',
  },
  {
    value: 'user count',
    label: 'User count',
  },
];

export const resolutions = [
  {
    value: 86400,
    label: 'Day',
  },
  {
    value: 86400 * 7,
    label: 'Week',
  },
  {
    value: 86400 * 30,
    label: 'Month',
  },
];

export const countries = getCountryList();
