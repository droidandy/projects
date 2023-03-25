import { fromJS, Map, List } from 'immutable';

const products = fromJS({
  medical: true,
  dental: true,
  vision: true,
  life: false,
  std: false,
  ltd: false,
});

const virginCoverage = fromJS({
  medical: true,
  dental: true,
  vision: true,
  life: false,
  std: false,
  ltd: false,
});

function newClient(isNew, brokerId) {
  return Map({
    address: '',
    addressComplementary: '',
    brokerId: brokerId || null,
    clientMembers: List([]),
    businessType: '',
    city: '',
    clientName: '',
    clientState: '',
    contactAddress: '',
    contactCity: '',
    contactEmail: '',
    contactFax: '',
    contactName: '',
    contactPhone: '',
    contactState: '',
    contactTitle: '',
    contactZip: '',
    dateQuestionnaireCompleted: '',
    domesticPartner: '',
    dueDate: '',
    effectiveDate: '',
    employeeCount: '',
    employeeTotal: '',
    fedTaxId: '',
    imageUrl: '',
    lastVisited: '',
    membersCount: '',
    minimumHours: '',
    orgType: '',
    outToBidReason: '',
    participatingEmployees: '',
    policyNumber: '',
    retireesCount: '',
    cobraCount: '',
    averageAge: '',
    sicCode: '',
    predominantCounty: '',
    state: '',
    website: '',
    zip: '',
    attributes: [],
    products,
    virginCoverage,
    declinedOutside: false,
    submittedRfpSeparately: false,
    isNew,
  });
}

const clientsReducerState = fromJS({
  products,
  loading: true,
  importLoading: false,
  clientSaveInProgress: false,
  clientSaveFailed: false,
  rfpRouteFailed: false,
  presentationRouteFailed: false,
  onboardingRouteFailed: false,
  timelineRouteFailed: false,
  clientOverride: Map({}),
  clients: [],
  current: newClient(),
  currentChanged: false,
  domesticPartnerCoverages: [
    { text: 'Broad', value: 'Broad' },
    { text: 'Narrow', value: 'Narrow' },
  ],
  sort: {
    prop: 'id',
    order: 'ascending',
  },
});


export default clientsReducerState;
