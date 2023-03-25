const PPO = {
  planType: 'PPO',
  planName: '',
  selectedCarrier: {},
  selectedNetwork: {},
  rfpQuoteNetworkPlanId: null,
  benefits: [
    {
      name: 'Deductible',
      sysName: 'INDIVIDUAL_DEDUCTIBLE',
      typeIn: 'STRING',
      typeOut: 'STRING',
      valueIn: '',
      valueOut: '',
      placeholderIn: 'E.g., $500x2',
      placeholderOut: 'E.g., $1,000x2',
    }, {
      name: 'Co-insurance',
      sysName: 'CO_INSURANCE',
      typeIn: 'PERCENT',
      typeOut: 'STRING',
      valueIn: '',
      valueOut: '',
      placeholderIn: 'E.g., 80%',
      placeholderOut: 'E.g., 60%',
    }, {
      name: 'OOP Limit',
      sysName: 'INDIVIDUAL_OOP_LIMIT',
      typeIn: 'STRING',
      typeOut: 'STRING',
      valueIn: '',
      valueOut: '',
      placeholderIn: 'E.g., $2,000x2',
      placeholderOut: 'E.g., $4,000x2',
    }, {
      name: 'PCP',
      sysName: 'PCP',
      typeIn: 'DOLLAR',
      typeOut: 'STRING',
      valueIn: '',
      valueOut: '',
      placeholderIn: 'E.g., $20',
      placeholderOut: 'E.g., 60%',
    }, {
      name: 'Specialist',
      sysName: 'SPECIALIST',
      typeIn: 'DOLLAR',
      typeOut: 'STRING',
      valueIn: '',
      valueOut: '',
      placeholderIn: 'E.g., 40%',
      placeholderOut: 'E.g., 60%',
    }, {
      name: 'Inpatient Hospital',
      sysName: 'INPATIENT_HOSPITAL',
      typeIn: 'DOLLAR',
      typeOut: 'STRING',
      valueIn: '',
      valueOut: '',
      placeholderIn: 'E.g., 80%',
      placeholderOut: 'E.g., 60%',
    }, {
      name: 'IP Per-Occurrence Ded',
      sysName: 'IP_PER_OCCURENCE_DEDUCTIBLE',
      typeIn: 'STRING',
      typeOut: 'STRING',
      valueIn: '',
      valueOut: '',
      placeholderIn: 'E.g., $250 or N/A',
      placeholderOut: 'E.g., $500 or N/A',
    }, {
      name: 'Outpatient Surgery',
      sysName: 'OUTPATIENT_SURGERY',
      typeIn: 'PERCENT',
      typeOut: 'STRING',
      valueIn: '',
      valueOut: '',
      placeholderIn: 'E.g., 80%',
      placeholderOut: 'E.g., 60%',
    }, {
      name: 'Emergency Room',
      sysName: 'EMERGENCY_ROOM',
      typeIn: 'STRING',
      typeOut: 'STRING',
      valueIn: '',
      valueOut: '',
      placeholderIn: 'E.g., $100 + 100%',
      placeholderOut: 'E.g., $100 + 100%',
    }, {
      name: 'Deductible Type',
      sysName: 'DEDUCTIBLE_TYPE',
      typeIn: 'STRING',
      typeOut: 'STRING',
      valueIn: '',
      valueOut: '',
      options: [{ key: 0, value: 'N/A', text: 'N/A' }, { key: 1, value: 'Embedded', text: 'Embedded' }, { key: 2, value: 'Non-Embedded', text: 'Non-Embedded' }],
    }, {
      name: 'Combine Med/Rx Deductible',
      sysName: 'COMBINE_MED_RX_DEDUCTIBLE',
      typeIn: 'STRING',
      typeOut: 'STRING',
      valueIn: '',
      valueOut: '',
      options: [{ key: 0, value: 'N/A', text: 'N/A' }, { key: 1, value: 'Separate', text: 'Separate' }, { key: 2, value: 'Combined', text: 'Combined' }],
    },
  ],
};

export default PPO;
