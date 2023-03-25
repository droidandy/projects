export const creditRateStatuses = {
  'na': {
    type: 'na',
    label: 'N/A'
  },
  'unable_to_check': {
    type: 'blue',
    label: 'Unable To Check'
  },
  'ok': {
    type: 'green',
    label: 'OK'
  },
  'bad_credit': {
    type: 'amber',
    label: 'Bad Credit'
  },
  'bankruptcy': {
    type: 'red',
    label: 'Bankruptcy'
  },
  'liquidation': {
    type: 'red',
    label: 'Liquidation'
  },
  'ccj': {
    type: 'red',
    label: 'CCJ'
  }
};

export const predefinedDdis = ['standard', 'key', 'mega'];
export const ddis = [...predefinedDdis, 'custom'];
export const ddiLabels = {
  standard: 'Standard',
  key:      'Key',
  mega:     'Mega',
  custom:   'Custom'
};
