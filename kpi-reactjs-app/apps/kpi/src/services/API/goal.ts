import * as Rx from 'src/rx';
import * as R from 'remeda';
import { SearchResult, Goal } from 'src/types';
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

export function _getGoals(): Goal[] {
  return _getData<Goal>('data_goals', [
    ...R.range(1, 40).map(
      i =>
        ({
          id: 'goal_' + i,
          name: { en: 'Goal ' + i, ar: 'Goal ' + i + ' - ar' },
          description: { en: 'Goal ' + i, ar: 'Goal ' + i + ' - ar' },
          createdTime: new Date().toISOString(),
          status: i % 2 ? 'active' : 'draft',
          strategicPlanId: i < 20 ? '1' : '2',
        } as Goal)
    ),
  ]);
}

function _updateGoals(goals: Goal[]) {
  localStorage.data_goals = JSON.stringify(goals);
}

interface SearchGoalsCriteria {
  pageNumber: number;
  pageSize: number;
  name?: string;
  status?: string;
  strategicPlanId: string;
  sortBy: string;
  sortDesc: boolean;
}

function _searchGoals(criteria: SearchGoalsCriteria) {
  const items = _getGoals();
  const filtered = items.filter(item => {
    return (
      _filterString(item.name, criteria.name) &&
      _filterExact(item.status, criteria.status) &&
      _filterExact(item.strategicPlanId, criteria.strategicPlanId)
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

export function searchGoals(
  criteria: SearchGoalsCriteria
): Rx.Observable<SearchResult<Goal>> {
  return _mockResponse(() => {
    return _paginate(criteria, _searchGoals);
  });
}

export function getAllGoals(strategicPlanId: string) {
  return _mockResponse(() => {
    return _getGoals().filter(x => x.strategicPlanId === strategicPlanId);
  });
}

export function exportGoals(criteria: SearchGoalsCriteria) {
  const filtered = _searchGoals(criteria);
  const csv: string[][] = [];
  csv.push([
    i18n.t('ID'),
    i18n.t('Name'),
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
  _download(txt, 'goals.csv', 'text/csv');
}

export function getGoal(id: string) {
  return _mockResponse(() => {
    const items = _getGoals();
    const item = items.find(x => x.id === id);
    if (!item) {
      throw new Error('Goal not found');
    }
    return item;
  });
}

export function createGoal(values: Omit<Goal, 'id' | 'createdTime'>) {
  return _mockResponse(() => {
    const item: Goal = {
      ...values,
      createdTime: new Date().toISOString(),
      id: String(Date.now()),
    };
    const items = _getGoals();
    _updateGoals([...items, item]);
    return item;
  });
}

export function updateGoal(id: string, values: Goal) {
  return _mockResponse(() => {
    const items = _getGoals();
    const newItems = items.map(item => {
      if (item.id === id) {
        return values;
      }
      return item;
    });
    _updateGoals(newItems);
    return values;
  });
}

export function deleteGoal(id: string) {
  return _mockResponse(() => {
    const items = _getGoals();
    const newItems = items.filter(item => {
      return item.id !== id;
    });
    _updateGoals(newItems);
  });
}
