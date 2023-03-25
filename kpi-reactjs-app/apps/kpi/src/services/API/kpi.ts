import * as Rx from 'src/rx';
import { SearchResult, Kpi } from 'src/types';
import i18n from 'i18next';
import {
  _getData,
  _mockResponse,
  _paginate,
  _escapeCsv,
  _download,
  _filterString,
  _filterArray,
  _filterExact,
  _compareOptionalTransString,
} from './_utils';
import { _getGoals } from './goal';
import { _getOutputs } from './output';
import { _getMissions } from './mission';
import { _getUnitObjectives } from './unitObjective';
import { _getLoggedUser } from './user';

const defaultKpis: Kpi[] = [
  {
    id: 'kpi-a',
    name: { ar: 'KPI A', en: 'KPI A' },
    status: 'active',
    strategicPlanId: '2',
    lastCalculatedTime: '2019-08-09T09:21:14.869Z',
    lastUpdatedTime: '2019-08-09T09:21:14.869Z',
    lastUpdatedById: 'admin',
    info: {
      type: 'board',
      linkedObject: 'unit_objective_20',
      linkedObjectType: 'unitObjective',
      description: {
        ar: 'Lorem Ipsum',
        en: 'Lorem Ipsum',
      },
      concernedUnit: '21',
      contributors: ['admin'],
      focalPointUser: 'admin',
      startDate: 2018,
      endDate: 2022,
    },
    measurement: {
      unit: 'percentage',
      unitDescription:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      frequency: 'quarterly',
      trend: 'increasingBetter',
      hasBaseline: true,
      baselineYear: 2017,
      baselineValue: '75',
      mechanism: 'fixedValue',
      performanceTillDate: 'sum',
    },
    targets: {
      targets: [
        { period: '2018 - Q1', value: 10 },
        { period: '2018 - Q2', value: 10 },
        { period: '2018 - Q3', value: 10 },
        { period: '2018 - Q4', value: 10 },
        { period: '2019 - Q1', value: 10 },
        { period: '2019 - Q2', value: 10 },
        { period: '2019 - Q3', value: 10 },
        { period: '2019 - Q4', value: 10 },
        { period: '2020 - Q1', value: 10 },
        { period: '2020 - Q2', value: 10 },
        { period: '2020 - Q3', value: 10 },
        { period: '2020 - Q4', value: 10 },
      ],
    },
    benchmarks: [],
    attachments: [],
    data: {
      '2018 - Q1': 8,
      '2018 - Q2': 10,
      '2018 - Q3': 12,
      '2018 - Q4': 10,
      '2019 - Q1': 9,
      '2019 - Q2': 10,
      '2019 - Q3': 12,
      '2019 - Q4': 9,
    },
  },
  {
    id: 'kpi-b',
    name: { ar: 'KPI B', en: 'KPI B' },
    status: 'active',
    strategicPlanId: '2',
    lastCalculatedTime: '2019-08-09T09:21:14.869Z',
    lastUpdatedTime: '2019-08-09T09:21:14.869Z',
    lastUpdatedById: 'admin',
    info: {
      type: 'leadership',
      linkedObject: 'unit_objective_20',
      linkedObjectType: 'unitObjective',
      description: {
        ar: 'Lorem Ipsum',
        en: 'Lorem Ipsum',
      },
      concernedUnit: '21',
      contributors: ['admin'],
      focalPointUser: 'admin',
      startDate: 2018,
      endDate: 2022,
    },
    measurement: {
      unit: 'percentage',
      unitDescription:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      frequency: 'quarterly',
      trend: 'decreasingBetter',
      hasBaseline: true,
      baselineYear: 2017,
      baselineValue: '75',
      mechanism: 'fixedValue',
      performanceTillDate: 'sum',
    },
    targets: {
      targets: [
        { period: '2018 - Q1', value: 20 },
        { period: '2018 - Q2', value: 20 },
        { period: '2018 - Q3', value: 15 },
        { period: '2018 - Q4', value: 10 },
        { period: '2019 - Q1', value: 20 },
        { period: '2019 - Q2', value: 15 },
        { period: '2019 - Q3', value: 20 },
        { period: '2019 - Q4', value: 15 },
        { period: '2020 - Q1', value: 20 },
        { period: '2020 - Q2', value: 20 },
        { period: '2020 - Q3', value: 10 },
        { period: '2020 - Q4', value: 15 },
      ],
    },
    benchmarks: [],
    attachments: [],
    data: {
      '2018 - Q1': 8,
      '2018 - Q2': 10,
      '2018 - Q3': 12,
      '2018 - Q4': 10,
      '2019 - Q1': 9,
      '2019 - Q2': 10,
      '2019 - Q3': 12,
      '2019 - Q4': 9,
    },
  },
  {
    id: 'kpi-c',
    name: { ar: 'KPI C', en: 'KPI C' },
    status: 'active',
    strategicPlanId: '2',
    lastCalculatedTime: '2019-08-09T09:21:14.869Z',
    lastUpdatedTime: '2019-08-09T09:21:14.869Z',
    lastUpdatedById: 'admin',
    info: {
      type: 'operational',
      linkedObject: 'unit_objective_20',
      linkedObjectType: 'unitObjective',
      description: {
        ar: 'Lorem Ipsum',
        en: 'Lorem Ipsum',
      },
      concernedUnit: '21',
      contributors: ['admin'],
      focalPointUser: 'admin',
      startDate: 2018,
      endDate: 2022,
    },
    measurement: {
      unit: 'percentage',
      unitDescription:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      frequency: 'annually',
      trend: 'asTarget',
      hasBaseline: true,
      baselineYear: 2017,
      baselineValue: '75',
      mechanism: 'fixedValue',
      performanceTillDate: 'lastValue',
    },
    targets: {
      targets: [
        { period: '2018', value: 50 },
        { period: '2019', value: 15 },
        { period: '2020', value: 15 },
      ],
    },
    benchmarks: [],
    attachments: [],
    data: {
      '2018': 40,
      '2019': 15,
      '2020': 15,
    },
  },
  {
    id: 'kpi-d',
    name: { ar: 'KPI D', en: 'KPI D' },
    status: 'active',
    strategicPlanId: '2',
    lastCalculatedTime: '2019-08-09T09:21:14.869Z',
    lastUpdatedTime: '2019-08-09T09:21:14.869Z',
    lastUpdatedById: 'admin',
    info: {
      type: 'leadership',
      linkedObject: 'unit_objective_20',
      linkedObjectType: 'unitObjective',
      description: {
        ar: 'Lorem Ipsum',
        en: 'Lorem Ipsum',
      },
      concernedUnit: '21',
      contributors: ['admin'],
      focalPointUser: 'admin',
      startDate: 2018,
      endDate: 2022,
    },
    measurement: {
      unit: 'percentage',
      unitDescription:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      frequency: 'quarterly',
      trend: 'bounded',
      hasBaseline: true,
      baselineYear: 2017,
      baselineValue: '75',
      mechanism: 'fixedValue',
      performanceTillDate: 'sum',
    },
    targets: {
      lowerBound: -15,
      upperBound: 15,
      targets: [
        { period: '2018 - Q1', value: 20 },
        { period: '2018 - Q2', value: 20 },
        { period: '2018 - Q3', value: 15 },
        { period: '2018 - Q4', value: 10 },
        { period: '2019 - Q1', value: 20 },
        { period: '2019 - Q2', value: 15 },
        { period: '2019 - Q3', value: 20 },
        { period: '2019 - Q4', value: 15 },
        { period: '2020 - Q1', value: 20 },
        { period: '2020 - Q2', value: 20 },
        { period: '2020 - Q3', value: 10 },
        { period: '2020 - Q4', value: 15 },
      ],
    },
    benchmarks: [],
    attachments: [],
    data: {
      '2018 - Q1': 19,
      '2018 - Q2': 20,
      '2018 - Q3': 15,
      '2018 - Q4': 10,
      '2019 - Q1': 20,
      '2019 - Q2': 15,
      '2019 - Q3': 20,
      '2019 - Q4': 15,
    },
  },
];

export function _getKpis(): Kpi[] {
  const kpis = _getData<Kpi>('data_kpis', defaultKpis);
  return kpis;
}

function _updateKpis(kpis: Kpi[]) {
  localStorage.data_kpis = JSON.stringify(kpis);
}

interface SearchKpisCriteria {
  pageNumber: number;
  pageSize: number;
  name?: string;
  status?: string;
  sortBy: string;
  sortDesc: boolean;
  strategicPlanId: string;
}

function _searchKpis(criteria: SearchKpisCriteria) {
  const kpis = _getKpis();
  const filtered = kpis.filter(kpi => {
    return (
      _filterString(kpi.name, criteria.name) &&
      _filterExact(kpi.status, criteria.status) &&
      _filterExact(kpi.strategicPlanId, criteria.strategicPlanId)
    );
  });

  filtered.sort((a, b) => {
    const getDiff = () => {
      switch (criteria.sortBy) {
        case 'name':
          return a.name[i18n.language].localeCompare(b.name[i18n.language]);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'lastCalculatedTime':
          return (
            new Date(a.lastCalculatedTime).getTime() -
            new Date(b.lastCalculatedTime).getTime()
          );
        default:
          return a.id.localeCompare(b.id);
      }
    };
    return getDiff() * (criteria.sortDesc ? -1 : 1);
  });
  return filtered;
}

export function searchKpis(
  criteria: SearchKpisCriteria
): Rx.Observable<SearchResult<Kpi>> {
  return _mockResponse(() => {
    return _paginate(criteria, _searchKpis);
  });
}

export function getAllKpis(strategicPlanId: string) {
  return _mockResponse(() => {
    return _getKpis().filter(x => x.strategicPlanId === strategicPlanId);
  });
}

export function exportKpis(criteria: SearchKpisCriteria) {
  const filtered = _searchKpis(criteria);
  const csv: string[][] = [];
  csv.push([
    i18n.t('ID'),
    i18n.t('Name'),
    i18n.t('Last Calculated Time'),
    i18n.t('Status'),
  ]);
  filtered.forEach(item => {
    csv.push([
      _escapeCsv(item.id),
      _escapeCsv(item.name[i18n.language]),
      _escapeCsv(new Date(item.lastCalculatedTime).toISOString()),
      _escapeCsv(item.status),
    ]);
  });
  const txt = csv.map(item => item.join(',')).join('\n');
  _download(txt, 'kpis.csv', 'text/csv');
}

export function getKpi(id: string) {
  return _mockResponse(() => {
    const items = _getKpis();
    const item = items.find(x => x.id === id);
    if (!item) {
      throw new Error('Kpi not found');
    }
    return item;
  });
}

export function createKpi(values: Kpi) {
  return _mockResponse(() => {
    const { user } = _getLoggedUser();
    const item: Kpi = {
      ...values,
      lastUpdatedById: user!.id,
      lastUpdatedTime: new Date().toISOString(),
      lastCalculatedTime: new Date().toISOString(),
      id: String(Date.now()),
    };
    const items = _getKpis();
    _updateKpis([...items, item]);
    return item;
  });
}

export function updateKpi(id: string, values: Kpi) {
  return _mockResponse(() => {
    const { user } = _getLoggedUser();
    const items = _getKpis();
    const newItems = items.map(item => {
      if (item.id === id) {
        return {
          ...values,
          lastUpdatedById: user!.id,
          lastUpdatedTime: new Date().toISOString(),
          lastCalculatedTime: new Date().toISOString(),
        };
      }
      return item;
    });
    _updateKpis(newItems);
    return values;
  });
}

export function deleteKpi(id: string) {
  return _mockResponse(() => {
    const items = _getKpis();
    const newItems = items.filter(item => {
      return item.id !== id;
    });
    _updateKpis(newItems);
  });
}
