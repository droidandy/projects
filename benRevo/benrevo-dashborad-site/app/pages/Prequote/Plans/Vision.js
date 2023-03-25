const Vision = {
  planType: 'VISION',
  planName: '',
  selectedCarrier: {},
  selectedNetwork: {},
  rfpQuoteNetworkPlanId: null,
  benefits: [
    {
      sysName: 'EXAMS_FREQUENCY',
      name: 'Exams Frequency',
      value: '',
      type: 'STRING',
      placeholder: 'E.g., 12',
    },
    {
      sysName: 'LENSES_FREQUENCY',
      name: 'Lenses Frequency',
      value: '',
      type: 'STRING',
      placeholder: 'E.g., 12',
    },
    {
      sysName: 'FRAMES_FREQUENCY',
      name: 'Frames Frequency',
      value: '',
      type: 'STRING',
      placeholder: 'E.g., 24',
    },
    {
      sysName: 'CONTACTS_FREQUENCY',
      name: 'Contacts Frequency',
      value: '',
      type: 'STRING',
      placeholder: 'E.g., 12',
    },
    {
      sysName: 'EXAM_COPAY',
      name: 'Exam Copay',
      value: '',
      type: 'STRING',
      placeholder: 'E.g., $10',
    },
    {
      sysName: 'MATERIALS_COPAY',
      name: 'Materials Copay',
      value: '',
      type: 'STRING',
      placeholder: 'E.g., $25',
    },
    {
      sysName: 'CONTACTS_ALLOWANCE',
      name: 'Contacts Allowance',
      value: '',
      type: 'STRING',
      placeholder: 'E.g., $130',
    },
    {
      sysName: 'FRAME_ALLOWANCE',
      name: 'Frame Allowance',
      value: '',
      type: 'STRING',
      placeholder: 'E.g., $130',
    },
  ],
};

export default Vision;
