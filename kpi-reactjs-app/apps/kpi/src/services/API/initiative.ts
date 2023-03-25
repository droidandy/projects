import * as Rx from 'src/rx';
import * as R from 'remeda';
import { SearchResult, Initiative } from 'src/types';
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
export function _getInitiatives(): Initiative[] {
  const goals = _getGoals();
  const map = R.indexBy(goals, x => x.id);
  const initiatives = _getData<Initiative>('data_initiatives', [
    ...R.range(1, 40).map(
      i =>
        ({
          id: 'initiative_' + i,
          name: { en: 'Initiative ' + i, ar: 'Initiative ' + i + ' - ar' },
          description: {
            en: 'Initiative ' + i,
            ar: 'Initiative ' + i + ' - ar',
          },
          createdTime: new Date().toISOString(),
          status: i % 2 ? 'active' : 'draft',
          responsiblePersonId: `user_${(i % 8) + 2}`,
          goalIds: [
            `goal_${(i % 3) + 1 + (i < 20 ? 0 : 20)}`,
            `goal_${(i % 3) + 2 + (i < 20 ? 0 : 20)}`,
          ],
          startDate: new Date(2018, i, 1).toISOString(),
          endDate: new Date(2021, i, 1).toISOString(),
          performanceTillDate: 50 + i,
          trackImplementation: i % 3 === 0,
          budget: 100,
          notes: '',
          strategicPlanId: i < 20 ? '1' : '2',
          unitObjectiveId: i < 20 ? 'unit_objective_1' : 'unit_objective_20',
        } as Initiative)
    ),
  ]);
  initiatives.forEach(item => {
    item.goals = item.goalIds.map(id => map[id]).filter(x => x);
  });
  return initiatives;
}

function _updateInitiatives(initiatives: Initiative[]) {
  localStorage.data_initiatives = JSON.stringify(initiatives);
}

interface SearchInitiativesCriteria {
  pageNumber: number;
  pageSize: number;
  name?: string;
  status?: string;
  sortBy: string;
  sortDesc: boolean;
  strategicPlanId: string;
}

function _searchInitiatives(criteria: SearchInitiativesCriteria) {
  const roles = _getInitiatives();
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

export function searchInitiatives(
  criteria: SearchInitiativesCriteria
): Rx.Observable<SearchResult<Initiative>> {
  return _mockResponse(() => {
    return _paginate(criteria, _searchInitiatives);
  });
}

export function getAllInitiatives(strategicPlanId: string) {
  return _mockResponse(() => {
    return _getInitiatives().filter(x => x.strategicPlanId === strategicPlanId);
  });
}

export function exportInitiatives(criteria: SearchInitiativesCriteria) {
  const filtered = _searchInitiatives(criteria);
  const csv: string[][] = [];
  csv.push([
    i18n.t('ID'),
    i18n.t('Name'),
    i18n.t('Goals'),
    i18n.t('Performance Till Date'),
    i18n.t('Created Time'),
    i18n.t('Status'),
  ]);
  filtered.forEach(item => {
    csv.push([
      _escapeCsv(item.id),
      _escapeCsv(item.name[i18n.language]),
      _escapeCsv((item.goals || []).map(x => x.name[i18n.language]).join(',')),
      _escapeCsv(item.performanceTillDate + '%'),
      _escapeCsv(new Date(item.createdTime).toISOString()),
      _escapeCsv(item.status),
    ]);
  });
  const txt = csv.map(item => item.join(',')).join('\n');
  _download(txt, 'initiatives.csv', 'text/csv');
}

export function getInitiative(id: string) {
  return _mockResponse(() => {
    const items = _getInitiatives();
    const item = items.find(x => x.id === id);
    if (!item) {
      throw new Error('Initiative not found');
    }
    return item;
  });
}

export function createInitiative(
  values: Omit<Initiative, 'id' | 'createdTime'>
) {
  return _mockResponse(() => {
    const item: Initiative = {
      ...values,
      createdTime: new Date().toISOString(),
      id: String(Date.now()),
    };
    const items = _getInitiatives();
    _updateInitiatives([...items, item]);
    return item;
  });
}

export function updateInitiative(id: string, values: Initiative) {
  return _mockResponse(() => {
    const items = _getInitiatives();
    const newItems = items.map(item => {
      if (item.id === id) {
        return values;
      }
      return item;
    });
    _updateInitiatives(newItems);
    return values;
  });
}

export function deleteInitiative(id: string) {
  return _mockResponse(() => {
    const items = _getInitiatives();
    const newItems = items.filter(item => {
      return item.id !== id;
    });
    _updateInitiatives(newItems);
  });
}
