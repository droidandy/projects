const selectOptions = () => {
  const conditionExclusion = [
    { value: 'None', text: 'None' },
    { value: '3/6', text: '3/6' },
    { value: '3/12', text: '3/12' },
    { value: '12/12', text: '12/12' },
    { value: 'Other', text: 'Other' },
  ];
  const occupationDefinition = [
    { value: '12 Months', text: '12 Months' },
    { value: '24 Months', text: '24 Months' },
    { value: 'SSNRA', text: 'SSNRA' },
    { value: 'Other', text: 'Other' },
  ];
  const abuseLimitation = [
    { value: 'None', text: 'None' },
    { value: '12 Months', text: '12 Months' },
    { value: '24 Months', text: '24 Months' },
    { value: 'Other', text: 'Other' },
  ];
  return {
    conditionExclusion,
    occupationDefinition,
    abuseLimitation,
  };
};

export {
  selectOptions,
};
