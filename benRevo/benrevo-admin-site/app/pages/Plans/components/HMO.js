const HMO = {
  planType: 'HMO',
  planName: '',
  selectedCarrier: {},
  selectedNetwork: {},
  rfpQuoteNetworkPlanId: null,
  benefits: [
    {
      sysName: 'INDIVIDUAL_DEDUCTIBLE',
      name: 'Deductible',
      value: '',
      type: 'STRING',
      placeholder: 'E.g., $500x2 or N/A',
    }, {
      sysName: 'INDIVIDUAL_OOP_LIMIT',
      name: 'OOP Limit',
      value: '',
      type: 'STRING',
      placeholder: 'E.g., $1,000x2',
    }, {
      sysName: 'PCP',
      name: 'PCP',
      value: '',
      type: 'DOLLAR',
      placeholder: 'E.g., $20',
    }, {
      sysName: 'SPECIALIST',
      name: 'Specialist',
      value: '',
      type: 'DOLLAR',
      placeholder: 'E.g., $20',
    }, {
      sysName: 'INPATIENT_HOSPITAL',
      name: 'Inpatient Hospital',
      value: '',
      type: 'STRING',
      placeholder: 'E.g., $500',
    }, {
      sysName: 'IP_COPAY_MAX',
      name: 'Inpatient Copay Max',
      value: '',
      type: 'STRING',
      hidden: true,
      placeholder: 'E.g., $1,500',
    }, {
      sysName: 'IP_COPAY_TYPE',
      name: 'Inpatient Copay Type',
      value: '',
      type: 'STRING',
      options: [{ key: 0, value: 'Admit', text: 'Per Admit' }, { key: 1, value: 'Day', text: 'Per Day' }],
    }, {
      sysName: 'IP_DAY_MAX',
      name: 'Inpatient Day Max',
      value: '',
      type: 'STRING',
      dependency: {
        IP_COPAY_TYPE: 'Day',
      },
      temp: true,
      placeholder: 'E.g., 3',
    }, {
      sysName: 'OUTPATIENT_SURGERY',
      name: 'Outpatient Surgery',
      value: '',
      type: 'PERCENT',
      placeholder: 'E.g., $250',
    }, {
      sysName: 'EMERGENCY_ROOM',
      name: 'Emergency Room',
      value: '',
      type: 'STRING',
      placeholder: 'E.g., $100',
    }, {
      sysName: 'URGENT_CARE',
      name: 'Urgent Care',
      value: '',
      type: 'STRING',
      placeholder: 'E.g., $20',
    }, {
      sysName: 'DEDUCTIBLE_TYPE',
      name: 'Deductible Type',
      value: '',
      type: 'STRING',
      options: [{ key: 0, value: 'N/A', text: 'N/A' }, { key: 1, value: 'Embedded', text: 'Embedded' }, { key: 2, value: 'Non-Embedded', text: 'Non-Embedded' }],
    }, {
      sysName: 'COMBINE_MED_RX_DEDUCTIBLE',
      name: 'Combine Med/Rx Deductible',
      value: '',
      type: 'STRING',
      options: [{ key: 0, value: 'N/A', text: 'N/A' }, { key: 1, value: 'Separate', text: 'Separate' }, { key: 2, value: 'Combined', text: 'Combined' }],
    },
  ],
};

export default HMO;
