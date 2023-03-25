import * as Rx from 'src/rx';
import * as R from 'remeda';
import { SearchResult, ExcellenceStandard } from 'src/types';
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

export function _getExcellenceStandards(): ExcellenceStandard[] {
  const excellenceStandards = _getData<ExcellenceStandard>(
    'data_excellenceStandards',
    [
      ...R.range(1, 40).map(
        i =>
          ({
            id: 'excellence_standard_' + i,
            name: {
              en: 'Excellence Standard ' + i,
              ar: 'Excellence Standard ' + i + ' - ar',
            },
            createdTime: new Date().toISOString(),
            status: i % 2 ? 'active' : 'draft',
            missionId: 'mission_' + i,
            strategicPlanId: i < 20 ? '1' : '2',
          } as ExcellenceStandard)
      ),
    ]
  );
  return excellenceStandards;
}

function _updateExcellenceStandards(ExcellenceStandards: ExcellenceStandard[]) {
  localStorage.data_excellenceStandards = JSON.stringify(ExcellenceStandards);
}

interface SearchExcellenceStandardsCriteria {
  pageNumber: number;
  pageSize: number;
  name?: string;
  status?: string;
  sortBy: string;
  sortDesc: boolean;
  strategicPlanId: string;
}

function _searchExcellenceStandards(
  criteria: SearchExcellenceStandardsCriteria
) {
  const roles = _getExcellenceStandards();
  const filtered = roles.filter(role => {
    return (
      _filterString(role.name, criteria.name) &&
      _filterExact(role.status, criteria.status) &&
      _filterExact(role.strategicPlanId, criteria.strategicPlanId)
    );
  });

  filtered.sort((a, b) => {
    const getDiff = () => {
      switch (criteria.sortBy) {
        case 'name':
          return a.name[i18n.language].localeCompare(b.name[i18n.language]);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'createdTime':
          return (
            new Date(a.createdTime).getTime() -
            new Date(b.createdTime).getTime()
          );
        default:
          return a.id.localeCompare(b.id);
      }
    };
    return getDiff() * (criteria.sortDesc ? -1 : 1);
  });
  return filtered;
}

export function searchExcellenceStandards(
  criteria: SearchExcellenceStandardsCriteria
): Rx.Observable<SearchResult<ExcellenceStandard>> {
  return _mockResponse(() => {
    return _paginate(criteria, _searchExcellenceStandards);
  });
}

export function getAllExcellenceStandards(strategicPlanId: string) {
  return _mockResponse(() => {
    return _getExcellenceStandards().filter(
      x => x.strategicPlanId === strategicPlanId
    );
  });
}

export function exportExcellenceStandards(
  criteria: SearchExcellenceStandardsCriteria
) {
  const filtered = _searchExcellenceStandards(criteria);
  const csv: string[][] = [];
  csv.push([
    i18n.t('ID'),
    i18n.t('Name'),
    i18n.t('Mission'),
    i18n.t('Created Time'),
    i18n.t('Status'),
  ]);
  filtered.forEach(item => {
    csv.push([
      _escapeCsv(item.id),
      _escapeCsv(item.name[i18n.language]),
      _escapeCsv(new Date(item.createdTime).toISOString()),
      _escapeCsv(item.status),
    ]);
  });
  const txt = csv.map(item => item.join(',')).join('\n');
  _download(txt, 'excellenceStandards.csv', 'text/csv');
}

export function getExcellenceStandard(id: string) {
  return _mockResponse(() => {
    const items = _getExcellenceStandards();
    const item = items.find(x => x.id === id);
    if (!item) {
      throw new Error('Excellence Standard not found');
    }
    return item;
  });
}

export function createExcellenceStandard(
  values: Omit<ExcellenceStandard, 'id' | 'createdTime'>
) {
  return _mockResponse(() => {
    const item: ExcellenceStandard = {
      ...values,
      createdTime: new Date().toISOString(),
      id: String(Date.now()),
    };
    const items = _getExcellenceStandards();
    _updateExcellenceStandards([...items, item]);
    return item;
  });
}

export function updateExcellenceStandard(
  id: string,
  values: ExcellenceStandard
) {
  return _mockResponse(() => {
    const items = _getExcellenceStandards();
    const newItems = items.map(item => {
      if (item.id === id) {
        return values;
      }
      return item;
    });
    _updateExcellenceStandards(newItems);
    return values;
  });
}

export function deleteExcellenceStandard(id: string) {
  return _mockResponse(() => {
    const items = _getExcellenceStandards();
    const newItems = items.filter(item => {
      return item.id !== id;
    });
    _updateExcellenceStandards(newItems);
  });
}
