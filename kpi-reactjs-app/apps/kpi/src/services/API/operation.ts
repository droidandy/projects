import * as Rx from 'src/rx';
import * as R from 'remeda';
import { SearchResult, Operation } from 'src/types';
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

export function _getOperations(): Operation[] {
  const goals = _getGoals();
  const map = R.indexBy(goals, x => x.id);
  const operations = _getData<Operation>('data_operations', [
    ...R.range(1, 40).map(
      i =>
        ({
          id: 'operation_' + i,
          name: { en: 'Operation ' + i, ar: 'Operation ' + i + ' - ar' },
          description: { en: 'Operation ' + i, ar: 'Operation ' + i + ' - ar' },
          createdTime: new Date().toISOString(),
          status: i % 2 ? 'active' : 'draft',
          targetUnitId: '1',
          responsiblePersonId: `user_${(i % 8) + 2}`,
          goalIds: [
            `goal_${(i % 3) + 1 + (i < 20 ? 0 : 20)}`,
            `goal_${(i % 3) + 2 + (i < 20 ? 0 : 20)}`,
          ],
          notes: '',
          strategicPlanId: i < 20 ? '1' : '2',
          unitObjectiveId: i < 20 ? 'unit_objective_1' : 'unit_objective_20',
        } as Operation)
    ),
  ]);
  operations.forEach(item => {
    item.goals = item.goalIds.map(id => map[id]).filter(x => x);
  });
  return operations;
}

function _updateOperations(operations: Operation[]) {
  localStorage.data_operations = JSON.stringify(operations);
}

interface SearchOperationsCriteria {
  pageNumber: number;
  pageSize: number;
  name?: string;
  status?: string;
  sortBy: string;
  sortDesc: boolean;
  strategicPlanId: string;
}

function _searchOperations(criteria: SearchOperationsCriteria) {
  const roles = _getOperations();
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

export function searchOperations(
  criteria: SearchOperationsCriteria
): Rx.Observable<SearchResult<Operation>> {
  return _mockResponse(() => {
    return _paginate(criteria, _searchOperations);
  });
}

export function getAllOperations(strategicPlanId: string) {
  return _mockResponse(() => {
    return _getOperations().filter(x => x.strategicPlanId === strategicPlanId);
  });
}

export function exportOperations(criteria: SearchOperationsCriteria) {
  const filtered = _searchOperations(criteria);
  const csv: string[][] = [];
  csv.push([
    i18n.t('ID'),
    i18n.t('Name'),
    i18n.t('Goals'),
    i18n.t('Created Time'),
    i18n.t('Status'),
  ]);
  filtered.forEach(item => {
    csv.push([
      _escapeCsv(item.id),
      _escapeCsv(item.name[i18n.language]),
      _escapeCsv((item.goals || []).map(x => x.name[i18n.language]).join(',')),
      _escapeCsv(new Date(item.createdTime).toISOString()),
      _escapeCsv(item.status),
    ]);
  });
  const txt = csv.map(item => item.join(',')).join('\n');
  _download(txt, 'operations.csv', 'text/csv');
}

export function getOperation(id: string) {
  return _mockResponse(() => {
    const items = _getOperations();
    const item = items.find(x => x.id === id);
    if (!item) {
      throw new Error('Operation not found');
    }
    return item;
  });
}

export function createOperation(values: Omit<Operation, 'id' | 'createdTime'>) {
  return _mockResponse(() => {
    const item: Operation = {
      ...values,
      createdTime: new Date().toISOString(),
      id: String(Date.now()),
    };
    const items = _getOperations();
    _updateOperations([...items, item]);
    return item;
  });
}

export function updateOperation(id: string, values: Operation) {
  return _mockResponse(() => {
    const items = _getOperations();
    const newItems = items.map(item => {
      if (item.id === id) {
        return values;
      }
      return item;
    });
    _updateOperations(newItems);
    return values;
  });
}

export function deleteOperation(id: string) {
  return _mockResponse(() => {
    const items = _getOperations();
    const newItems = items.filter(item => {
      return item.id !== id;
    });
    _updateOperations(newItems);
  });
}
