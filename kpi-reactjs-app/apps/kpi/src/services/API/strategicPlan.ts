import * as Rx from 'src/rx';
import { SearchResult, StrategicPlan } from 'src/types';
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
} from './_utils';

export function _getStrategicPlans(): StrategicPlan[] {
  return _getData<StrategicPlan>('data_strategicPlans', [
    {
      id: '1',
      name: { en: 'First', ar: 'First' },
      startDate: 2014,
      endDate: 2017,
      vision: { en: 'vision', ar: 'vision' },
      mission: { en: 'mission', ar: 'mission' },
      values: { en: 'values', ar: 'values' },
      strengths: { en: 'strengths', ar: 'strengths' },
      weaknesses: { en: 'weaknesses', ar: 'weaknesses' },
      opportunities: { en: 'opportunities', ar: 'opportunities' },
      threats: { en: 'threats', ar: 'threats' },
    },
    {
      id: '2',
      name: { en: 'Second', ar: 'Second' },
      startDate: 2018,
      endDate: 2021,
      vision: { en: 'vision', ar: 'vision' },
      mission: { en: 'mission', ar: 'mission' },
      values: { en: 'values', ar: 'values' },
      strengths: { en: 'strengths', ar: 'strengths' },
      weaknesses: { en: 'weaknesses', ar: 'weaknesses' },
      opportunities: { en: 'opportunities', ar: 'opportunities' },
      threats: { en: 'threats', ar: 'threats' },
    },
  ]);
}

function _updateStrategicPlans(strategicPlans: StrategicPlan[]) {
  localStorage.data_strategicPlans = JSON.stringify(strategicPlans);
}

interface SearchStrategicPlansCriteria {
  pageNumber: number;
  pageSize: number;
  name?: string;
  status?: string;
  sortBy: string;
  sortDesc: boolean;
}

function _searchStrategicPlans(criteria: SearchStrategicPlansCriteria) {
  const roles = _getStrategicPlans();
  const filtered = roles.filter(role => {
    return _filterString(role.name, criteria.name);
  });

  filtered.sort((a, b) => {
    const getDiff = () => {
      switch (criteria.sortBy) {
        case 'name':
          return a.name[i18n.language].localeCompare(b.name[i18n.language]);
        case 'startDate':
          return a.startDate - b.startDate;
        case 'endDate':
          return a.endDate - b.endDate;
        default:
          return a.id.localeCompare(b.id);
      }
    };
    return getDiff() * (criteria.sortDesc ? -1 : 1);
  });
  return filtered;
}

export function searchStrategicPlans(
  criteria: SearchStrategicPlansCriteria
): Rx.Observable<SearchResult<StrategicPlan>> {
  return _mockResponse(() => {
    return _paginate(criteria, _searchStrategicPlans);
  });
}

export function getAllStrategicPlans() {
  return _mockResponse(() => {
    return _getStrategicPlans();
  });
}

export function exportStrategicPlans(criteria: SearchStrategicPlansCriteria) {
  const filtered = _searchStrategicPlans(criteria);
  const csv: string[][] = [];
  csv.push([
    i18n.t('ID'),
    i18n.t('Name'),
    i18n.t('Start Date'),
    i18n.t('End Date'),
  ]);
  filtered.forEach(item => {
    csv.push([
      _escapeCsv(item.id),
      _escapeCsv(item.name[i18n.language]),
      _escapeCsv(item.startDate.toString()),
      _escapeCsv(item.endDate.toString()),
    ]);
  });
  const txt = csv.map(item => item.join(',')).join('\n');
  _download(txt, 'strategicPlans.csv', 'text/csv');
}

export function getStrategicPlan(id: string) {
  return _mockResponse(() => {
    const items = _getStrategicPlans();
    const item = items.find(x => x.id === id);
    if (!item) {
      throw new Error('StrategicPlan not found');
    }
    return item;
  });
}

export function createStrategicPlan(values: Omit<StrategicPlan, 'id'>) {
  return _mockResponse(() => {
    const item: StrategicPlan = {
      ...values,
      id: String(Date.now()),
    };
    const items = _getStrategicPlans();
    _updateStrategicPlans([...items, item]);
    return item;
  });
}

export function updateStrategicPlan(id: string, values: StrategicPlan) {
  return _mockResponse(() => {
    const items = _getStrategicPlans();
    const newItems = items.map(item => {
      if (item.id === id) {
        return values;
      }
      return item;
    });
    _updateStrategicPlans(newItems);
    return values;
  });
}

export function deleteStrategicPlan(id: string) {
  return _mockResponse(() => {
    const items = _getStrategicPlans();
    const newItems = items.filter(item => {
      return item.id !== id;
    });
    _updateStrategicPlans(newItems);
  });
}

export function setSelectedStrategicPlan(id: string) {
  return _mockResponse(() => {
    localStorage.data_selectedStrategicPlan = id;
  });
}

export function getSelectedStrategicPlan() {
  return _mockResponse(() => {
    if (!localStorage.data_selectedStrategicPlan) {
      localStorage.data_selectedStrategicPlan = '1';
    }
    return localStorage.data_selectedStrategicPlan;
  });
}
