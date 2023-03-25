const templateRestriction = [
  { value: 'Basic Service', text: 'Basic Service' },
  { value: 'Major Service', text: 'Major Service' },
];
const templateOptions = [
  { value: 'Not covered', text: 'Not covered' },
  { value: '25%', text: '25%' },
  { value: '30%', text: '30%' },
  { value: '35%', text: '35%' },
  { value: '40%', text: '40%' },
  { value: '45%', text: '45%' },
  { value: '50%', text: '50%' },
  { value: '55%', text: '55%' },
  { value: '60%', text: '60%' },
  { value: '65%', text: '65%' },
  { value: '75%', text: '75%' },
  { value: '80%', text: '80%' },
  { value: '85%', text: '85%' },
  { value: '90%', text: '90%' },
  { value: '95%', text: '95%' },
  { value: '100%', text: '100%' },
];
const templateDeductable = [
  { value: 'N/A', text: 'N/A' },
  { value: '$0', text: '$0' },
  { value: '$25', text: '$25' },
  { value: '$50', text: '$50' },
  { value: '$75', text: '$75' },
  { value: '$100', text: '$100' },
  { value: '$125', text: '$125' },
  { value: '$175', text: '$175' },
  { value: '$200', text: '$200' },
  { value: '$225', text: '$225' },
  { value: '$250', text: '$250' },
  { value: '$275', text: '$275' },
  { value: '$300', text: '$300' },
  { value: '$325', text: '$325' },
  { value: '$350', text: '$350' },
  { value: '$375', text: '$375' },
  { value: '$400', text: '$400' },
  { value: '$425', text: '$425' },
  { value: '$450', text: '$450' },
  { value: '$475', text: '$475' },
  { value: '$500', text: '$500' },
];
const templateAnnual = [
  { value: '$500', text: '$500' },
  { value: '$750', text: '$750' },
  { value: '$100', text: '$100' },
  { value: '$1250', text: '$1250' },
  { value: '$1500', text: '$1500' },
  { value: '$1750', text: '$1750' },
  { value: '$2000', text: '$2000' },
  { value: '$2250', text: '$2250' },
  { value: '$2500', text: '$2500' },
  { value: '$2750', text: '$2750' },
  { value: '$3000', text: '$3000' },
  { value: '$5000', text: '$5000' },
  { value: '$7500', text: '$7500' },
  { value: '$10000', text: '$10000' },
  { value: 'Unlimited', text: 'Unlimited' },
];
const templateOOPMax = [
  { value: 'N/A - Essential Choice', text: 'N/A - Essential Choice' },
  { value: '$1000', text: '$1000' },
  { value: '$1250', text: '$1250' },
  { value: '$1500', text: '$1500' },
  { value: '$1750', text: '$1750' },
  { value: '$2000', text: '$2000' },
  { value: '$2250', text: '$2250' },
  { value: '$2500', text: '$2500' },
  { value: '$2750', text: '$2750' },
  { value: '$3000', text: '$3000' },
  { value: '$3250', text: '$3250' },
  { value: '$3500', text: '$3500' },
  { value: '$3750', text: '$3750' },
  { value: '$4000', text: '$4000' },
  { value: '$4250', text: '$4250' },
  { value: '$4500', text: '$4500' },
  { value: '$4750', text: '$4750' },
  { value: '$5000', text: '$5000' },
];
const templateOptional = [
  { value: 'Covered', text: 'Covered' },
  { value: 'Not Covered', text: 'Not Covered' },
];

const DPPO = {
  planType: 'DPPO',
  planName: '',
  selectedCarrier: {},
  selectedNetwork: {},
  rfpQuoteNetworkPlanId: null,
  benefits: [
    /*
     * COVERAGE
     */

    {
      name: 'Diagnostic and Preventive',
      sysName: 'CLASS_1_PREVENTIVE',
      typeIn: 'STRING',
      typeOut: 'STRING',
      valueIn: '',
      valueOut: '',
      options: templateOptions,
    }, {
      name: 'Basic Restorative',
      sysName: 'CLASS_2_BASIC',
      typeIn: 'STRING',
      typeOut: 'STRING',
      valueIn: '',
      valueOut: '',
      options: templateOptions,
    }, {
      name: 'Non-Surgical Endodontics',
      sysName: 'NON_SURGICAL_ENDODONTICS',
      typeIn: 'STRING',
      typeOut: 'STRING',
      valueIn: '',
      valueOut: '',
      restriction: '',
      optionsRestriction: templateRestriction,
      options: templateOptions,
    }, {
      name: 'Surgical Endodontics',
      sysName: 'SURGICAL_ENDODONTICS',
      typeIn: 'STRING',
      typeOut: 'STRING',
      valueIn: '',
      valueOut: '',
      restriction: '',
      optionsRestriction: templateRestriction,
      options: templateOptions,
    }, {
      name: 'Non-Surigcal Periodontics',
      sysName: 'NON_SURGICAL_PERIODONTICS',
      typeIn: 'STRING',
      typeOut: 'STRING',
      valueIn: '',
      valueOut: '',
      restriction: '',
      optionsRestriction: templateRestriction,
      options: templateOptions,
    }, {
      name: 'Surgical Periodontics',
      sysName: 'SURGICAL_PERIODONTICS',
      typeIn: 'STRING',
      typeOut: 'STRING',
      valueIn: '',
      valueOut: '',
      restriction: '',
      optionsRestriction: templateRestriction,
      options: templateOptions,
    }, {
      name: 'Simple Oral Surgery',
      sysName: 'SIMPLE_ORAL_SURGERY',
      typeIn: 'STRING',
      typeOut: 'STRING',
      valueIn: '',
      valueOut: '',
      restriction: '',
      optionsRestriction: templateRestriction,
      options: templateOptions,
    }, {
      name: 'Complex Oral Surgery',
      sysName: 'COMPLEX_ORAL_SURGERY',
      typeIn: 'STRING',
      typeOut: 'STRING',
      valueIn: '',
      valueOut: '',
      restriction: '',
      optionsRestriction: templateRestriction,
      options: templateOptions,
    }, {
      name: 'Major Restorative & Prosthodontics',
      sysName: 'CLASS_3_MAJOR',
      typeIn: 'STRING',
      typeOut: 'STRING',
      valueIn: '',
      valueOut: '',
      restriction: '',
      optionsRestriction: templateRestriction,
      options: templateOptions,
    }, {
      name: 'Prosthdontic Repairs & Adjustments',
      sysName: 'PROSTHDONTIC',
      typeIn: 'STRING',
      typeOut: 'STRING',
      valueIn: '',
      valueOut: '',
      restriction: '',
      optionsRestriction: templateRestriction,
      options: templateOptions,
    }, {
      name: 'Orthodontics',
      sysName: 'CLASS_4_ORTHODONTIA',
      typeIn: 'STRING',
      typeOut: 'STRING',
      valueIn: '',
      valueOut: '',
      options: templateOptions,
    },

    /*
     * BASIC & MAJOR SERVICES WAITING PERIODS
     */

    {
      name: 'Basic Services',
      sysName: 'BASIC_WAITING_PERIOD',
      type: 'STRING',
      value: '',
      options: [
        { value: '0 months', text: '0 months' },
        { value: '3 months', text: '3 months' },
        { value: '6 months', text: '6 months' },
        { value: '12 months', text: '12 months' },
        { value: '18 months', text: '18 months' },
        { value: '24 months', text: '24 months' },
      ],
    }, {
      name: 'Major Services',
      sysName: 'MAJOR_WAITING_PERIOD',
      type: 'STRING',
      value: '',
      options: [
        { value: '0 months', text: '0 months' },
        { value: '3 months', text: '3 months' },
        { value: '6 months', text: '6 months' },
        { value: '12 months', text: '12 months' },
        { value: '18 months', text: '18 months' },
        { value: '24 months', text: '24 months' },
      ],
    },

    /*
     * ORTHODONTIC COVERAGE & WAITING PERIODS
     */

    {
      name: 'Orthodontic Coverage',
      sysName: 'ORTHO_ELIGIBILITY',
      type: 'STRING',
      value: '',
      options: [
        { value: 'None', text: 'None' },
        { value: 'Child Only', text: 'Child Only' },
        { value: 'Adult & Child', text: 'Adult & Child' },
      ],
    }, {
      name: 'Lifetime Ortho Maximum',
      sysName: 'ORTHODONTIA_LIFETIME_MAX',
      type: 'STRING',
      value: '',
      options: [
        { value: '$250', text: '$250' },
        { value: '$500', text: '$500' },
        { value: '$750', text: '$750' },
        { value: '$1000', text: '$1000' },
        { value: '$1250', text: '$1250' },
        { value: '$1500', text: '$1500' },
        { value: '$1750', text: '$1750' },
        { value: '$2000', text: '$2000' },
        { value: '$2250', text: '$2250' },
        { value: '$2500', text: '$2500' },
        { value: '$2750', text: '$2750' },
        { value: '$3000', text: '$3000' },
      ],
    }, {
      name: 'Orthodontic Waiting Period',
      sysName: 'ORTHODONTIA_WAITING_PERIOD',
      type: 'STRING',
      value: '',
      options: [
        { value: '0 months', text: '0 months' },
        { value: '3 months', text: '3 months' },
        { value: '6 months', text: '6 months' },
        { value: '12 months', text: '12 months' },
        { value: '18 months', text: '18 months' },
        { value: '24 months', text: '24 months' },
      ],
    },

    /*
     * OFFICE VISIT COPAY
     */

    {
      name: 'Individual Office Visit Copay',
      sysName: 'OFFICE_COPAY',
      type: 'STRING',
      value: '',
      options: [
        { value: '$0', text: '$0' },
        { value: '$5', text: '$5' },
        { value: '$10', text: '$10' },
        { value: '$15', text: '$15' },
        { value: '$20', text: '$20' },
        { value: '$25', text: '$25' },
      ],
    },

    /*
     * Deductibles
     */

    {
      name: 'Individual Deductible',
      sysName: 'DENTAL_INDIVIDUAL',
      typeIn: 'STRING',
      typeOut: 'STRING',
      valueIn: '',
      valueOut: '',
      options: templateDeductable,
    }, {
      name: 'Individual Lifetime Deductible',
      sysName: 'LIFETIME_DEDUCTIBLE',
      typeIn: 'STRING',
      typeOut: 'STRING',
      valueIn: '',
      valueOut: '',
      options: templateDeductable,
    }, {
      name: 'Family Deductible',
      sysName: 'DENTAL_FAMILY',
      type: 'STRING',
      value: '',
      options: [
        { value: '2x individual', text: '2x individual' },
        { value: '3x individual', text: '3x individual' },
        { value: 'No limit', text: 'No limit' },
      ],
    }, {
      name: 'Waived for Diagnostic & Preventive?',
      sysName: 'WAIVED_FOR_PREVENTIVE',
      typeIn: 'STRING',
      typeOut: 'STRING',
      valueIn: '',
      valueOut: '',
      options: [
        { value: 'Yes', text: 'Yes' },
        { value: 'No', text: 'No' },
      ],
    },

    /*
     * Annual Maximums
     */

    {
      name: 'Annual Maximum',
      sysName: 'CALENDAR_YEAR_MAXIMUM',
      typeIn: 'STRING',
      typeOut: 'STRING',
      valueIn: '',
      valueOut: '',
      options: templateAnnual,
    }, {
      name: 'Annual Maximum Carryover',
      sysName: 'CALENDAR_YEAR_MAXIMUM_CARRYOVER',
      type: 'STRING',
      value: '',
      options: [
        { value: 'Yes', text: 'Yes' },
        { value: 'No', text: 'No' },
      ],
    }, {
      name: 'Carry In',
      sysName: 'CARRY_IN',
      type: 'STRING',
      value: '',
      options: [
        { value: 'Yes', text: 'Yes' },
        { value: 'No', text: 'No' },
      ],
    }, {
      name: 'Diagnostic & Preventive Applies',
      sysName: 'PREVENTIVE_APPLIES',
      type: 'STRING',
      value: '',
      options: [
        { value: 'Yes', text: 'Yes' },
        { value: 'No', text: 'No' },
      ],
    },

    /*
     * OUT-OF-POCKET MAX.
     */

    {
      name: 'Individual Out-of-Pocket Max',
      sysName: 'INDIVIDUAL_OOP_LIMIT',
      typeIn: 'STRING',
      typeOut: 'STRING',
      valueIn: '',
      valueOut: '',
      options: templateOOPMax,
    }, {
      name: 'Family Out-of Pocket Max.',
      sysName: 'FAMILY_OOP_LIMIT',
      type: 'STRING',
      value: '',
      options: [
        { value: 'N/A - Essential Choice', text: 'N/A - Essential Choice' },
        { value: '2x individual', text: '2x individual' },
        { value: '3x individual', text: '3x individual' },
        { value: 'No Limit', text: 'No Limit' },
      ],
    },

    /*
     * OUT-OF-NETWORK REIMBURSEMENT
     */

    {
      name: 'Out-of-Network Reimbursement',
      sysName: 'REIMBURSEMENT_SCHEDULE',
      type: 'STRING',
      value: '',
      options: [
        { value: '50%', text: '50%' },
        { value: '55%', text: '55%' },
        { value: '60%', text: '60%' },
        { value: '65%', text: '65%' },
        { value: '70%', text: '70%' },
        { value: '75%', text: '75%' },
        { value: '80%', text: '80%' },
        { value: '85%', text: '85%' },
        { value: '90%', text: '90%' },
        { value: '95%', text: '95%' },
        { value: 'MAC', text: 'MAC' },
      ],
    },

    /*
     * Dependent Age
     */

    {
      name: 'Child Dependent Age',
      sysName: 'CHILD_DEPENDENT_AGE',
      type: 'STRING',
      value: '',
      options: [
        { value: 'To Age 26', text: 'To Age 26' },
        { value: 'To Age 26, optional 29 (NY ONLY)', text: 'To Age 26, optional 29 (NY ONLY)' },
        { value: 'To Age 27', text: 'To Age 27' },
        { value: 'To Age 28', text: 'To Age 28' },
        { value: 'To Age 29', text: 'To Age 29' },
        { value: 'To Age 30', text: 'To Age 30' },
      ],
    }, {
      name: 'Child Orthontic Dependent Age',
      sysName: 'CHILD_ORTHONTIC_DEPENDENT_AGE',
      type: 'STRING',
      value: '',
      options: [
        { value: 'Through Age 18', text: 'Through Age 18' },
        { value: 'Through Age 19', text: 'Through Age 19' },
        { value: 'Through Age 20', text: 'Through Age 20' },
        { value: 'Through Age 21', text: 'Through Age 21' },
        { value: 'Through Age 22', text: 'Through Age 22' },
        { value: 'Through Age 23', text: 'Through Age 23' },
        { value: 'Through Age 24', text: 'Through Age 24' },
        { value: 'Through Age 25', text: 'Through Age 25' },
        { value: 'Through Age 26', text: 'Through Age 26' },
      ],
    },

    /*
     * Optional Benefits
     */

    {
      name: 'Sealants',
      sysName: 'SEALANTS',
      type: 'STRING',
      value: '',
      options: [
        { value: 'Covered as Preventive', text: 'Covered as Preventive' },
        { value: 'Covered as Basic', text: 'Covered as Basic' },
      ],
    }, {
      name: 'Posterior Composites',
      sysName: 'POSTERIOR_COMPOSITES',
      type: 'STRING',
      value: '',
      options: templateOptional,
    }, {
      name: 'Implants',
      sysName: 'IMPLANT_COVERAGE',
      type: 'STRING',
      value: '',
      options: templateOptional,
    }, {
      name: 'Brush Biopsy',
      sysName: 'BRUSH_BIOPSY',
      type: 'STRING',
      value: '',
      options: [
        { value: 'Not Covered', text: 'Not Covered' },
        { value: 'Covered, no limit', text: 'Covered, no limit' },
        { value: 'Covered, 1 per 12 months, all ages', text: 'Covered, 1 per 12 months, all ages' },
      ],
    }, {
      name: 'Cosmetics',
      sysName: 'COSMETICS',
      type: 'STRING',
      value: '',
      options: [
        { value: 'Not Covered', text: 'Not Covered' },
        { value: 'Covered, no limit', text: 'Covered, no limit' },
        { value: 'Covered, 1 per tooth/arch per 12 months', text: 'Covered, 1 per tooth/arch per 12 months' },
      ],
    }, {
      name: 'TMJ',
      sysName: 'TMJ',
      type: 'STRING',
      value: '',
      options: templateOptional,
    },

    /*
     * Benefit Customization
     */

    {
      name: 'Periodic Dental Exams',
      sysName: 'ORAL_EXAMINATION',
      type: 'STRING',
      value: '',
      options: [
        { value: 'No limit', text: 'No limit' },
        { value: '1 per 6 months', text: '1 per 6 months' },
        { value: '2 per 12 months', text: '2 per 12 months' },
        { value: '2 per 24 months', text: '2 per 24 months' },
        { value: '3 per 12 months', text: '3 per 12 months' },
        { value: '3 per 24 months', text: '3 per 24 months' },
        { value: '4 per 12 months', text: '4 per 12 months' },
        { value: '4 per 24 months', text: '4 per 24 months' },
      ],
    }, {
      name: 'Teeth Cleaning',
      sysName: 'ADULT_PROPHY',
      type: 'STRING',
      value: '',
      options: [
        { value: 'No limit', text: 'No limit' },
        { value: '1 per 6 months; w/periodontal maintenance', text: '1 per 6 months; w/periodontal maintenance' },
        { value: '2 per 12 months; w/periodontal maintenance', text: '2 per 12 months; w/periodontal maintenance' },
        { value: '2 per 24 months; w/periodontal maintenance', text: '2 per 24 months; w/periodontal maintenance' },
        { value: '3 per 12 months; w/periodontal maintenance', text: '3 per 12 months; w/periodontal maintenance' },
        { value: '3 per 24 months; w/periodontal maintenance', text: '3 per 24 months; w/periodontal maintenance' },
        { value: '4 per 12 months; w/periodontal maintenance', text: '4 per 12 months; w/periodontal maintenance' },
        { value: '4 per 24 months; w/periodontal maintenance', text: '4 per 24 months; w/periodontal maintenance' },
        { value: '1 per 6 months; wo/periodontal maintenance', text: '1 per 6 months; wo/periodontal maintenance' },
        { value: '2 per 12 months; wo/periodontal maintenance', text: '2 per 12 months; wo/periodontal maintenance' },
        { value: '2 per 24 months; wo/periodontal maintenance', text: '2 per 24 months; wo/periodontal maintenance' },
        { value: '3 per 12 months; wo/periodontal maintenance', text: '3 per 12 months; wo/periodontal maintenance' },
        { value: '3 per 24 months; wo/periodontal maintenance', text: '3 per 24 months; wo/periodontal maintenance' },
        { value: '4 per 12 months; wo/periodontal maintenance', text: '4 per 12 months; wo/periodontal maintenance' },
        { value: '4 per 24 months; wo/periodontal maintenance', text: '4 per 24 months; wo/periodontal maintenance' },
      ],
    }, {
      name: 'Bitewing X-Rays',
      sysName: 'BITEWING_X_RAY',
      type: 'STRING',
      value: '',
      options: [
        { value: 'No limit', text: 'No limit' },
        { value: '1 set per 6 months', text: '1 set per 6 months' },
        { value: '1 set per 12 months', text: '1 set per 12 months' },
        { value: '1 set per 24 months', text: '1 set per 24 months' },
        { value: '1 set per 36 months', text: '1 set per 36 months' },
        { value: '2 set per 12 months', text: '2 set per 12 months' },
        { value: '2 set per 24 months', text: '2 set per 24 months' },
        { value: '2 set per 36 months', text: '2 set per 36 months' },
        { value: '1 set per 12 months < 18; 1 set per 24 months > 18', text: '1 set per 12 months < 18; 1 set per 24 months > 18' },
        { value: '2 set per 12 months < 18; 1 set per 12 months > 18', text: '2 set per 12 months < 18; 1 set per 12 months > 18' },
        { value: '2 set per 12 months < 18; 1 set per 24 months > 18', text: '2 set per 12 months < 18; 1 set per 24 months > 18' },
      ],
    }, {
      name: 'Full Mouth X-Rays',
      sysName: 'FULL_MOUTH_X_RAY',
      type: 'STRING',
      value: '',
      options: [
        { value: 'No limit', text: 'No limit' },
        { value: '1 set 36 months', text: '1 set 36 months' },
        { value: '1 set 60 months', text: '1 set 60 months' },
      ],
    }, {
      name: 'Fluoride',
      sysName: 'FLUORIDE',
      type: 'STRING',
      value: '',
      options: [
        { value: 'No limit', text: 'No limit' },
        { value: '1 per 6 months; through age 14', text: '1 per 6 months; through age 14' },
        { value: '1 per 6 months; through age 15', text: '1 per 6 months; through age 15' },
        { value: '1 per 6 months; through age 16', text: '1 per 6 months; through age 16' },
        { value: '1 per 6 months; through age 17', text: '1 per 6 months; through age 17' },
        { value: '1 per 6 months; through age 18', text: '1 per 6 months; through age 18' },
        { value: '1 per 6 months; through age 19', text: '1 per 6 months; through age 19' },
        { value: '1 per 12 months; through age 14', text: '1 per 12 months; through age 14' },
        { value: '1 per 12 months; through age 15', text: '1 per 12 months; through age 15' },
        { value: '1 per 12 months; through age 16', text: '1 per 12 months; through age 16' },
        { value: '1 per 12 months; through age 17', text: '1 per 12 months; through age 17' },
        { value: '1 per 12 months; through age 18', text: '1 per 12 months; through age 18' },
        { value: '1 per 12 months; through age 19', text: '1 per 12 months; through age 19' },
        { value: '1 per 24 months; through age 14', text: '1 per 24 months; through age 14' },
        { value: '1 per 24 months; through age 15', text: '1 per 24 months; through age 15' },
        { value: '1 per 24 months; through age 16', text: '1 per 24 months; through age 16' },
        { value: '1 per 24 months; through age 17', text: '1 per 24 months; through age 17' },
        { value: '1 per 24 months; through age 18', text: '1 per 24 months; through age 18' },
        { value: '1 per 24 months; through age 19', text: '1 per 24 months; through age 19' },
      ],
    }, {
      name: 'Periodontal Maintenance',
      sysName: 'PERIO_MAINTAINANCE',
      type: 'STRING',
      value: '',
      options: [
        { value: 'No limit', text: 'No limit' },
        { value: '1 per 6 months; w/teeth cleaning', text: '1 per 6 months; w/teeth cleaning' },
        { value: '2 per 12 months; w/teeth cleaning', text: '2 per 12 months; w/teeth cleaning' },
        { value: '2 per 24 months; w/teeth cleaning', text: '2 per 24 months; w/teeth cleaning' },
        { value: '3 per 12 months; w/teeth cleaning', text: '3 per 12 months; w/teeth cleaning' },
        { value: '3 per 24 months; w/teeth cleaning', text: '3 per 24 months; w/teeth cleaning' },
        { value: '4 per 12 months; w/teeth cleaning', text: '4 per 12 months; w/teeth cleaning' },
        { value: '4 per 24 months; w/teeth cleaning', text: '4 per 24 months; w/teeth cleaning' },
        { value: '2 per 12 months; w/o teeth cleaning', text: '2 per 12 months; w/o teeth cleaning' },
        { value: '2 per 24 months; w/o teeth cleaning', text: '2 per 24 months; w/o teeth cleaning' },
        { value: '3 per 12 months; w/o teeth cleaning', text: '3 per 12 months; w/o teeth cleaning' },
        { value: '3 per 24 months; w/o teeth cleaning', text: '3 per 24 months; w/o teeth cleaning' },
        { value: '4 per 12 months; w/o teeth cleaning', text: '4 per 12 months; w/o teeth cleaning' },
        { value: '4 per 24 months; w/o teeth cleaning', text: '4 per 24 months; w/o teeth cleaning' },
      ],
    }, {
      name: 'Crowns, Veneers, Dentures, Bridges',
      sysName: 'CROWNS',
      type: 'STRING',
      value: '',
      options: [
        { value: 'No limit', text: 'No limit' },
        { value: '1 per tooth per 60 months', text: '1 per tooth per 60 months' },
        { value: '1 per tooth per 84 months', text: '1 per tooth per 84 months' },
        { value: '1 per tooth per 120 months', text: '1 per tooth per 120 months' },
      ],
    },
  ],
};

export default DPPO;
