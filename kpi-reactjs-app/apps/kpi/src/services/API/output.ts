import * as Rx from 'src/rx';
import * as R from 'remeda';
import { SearchResult, Output } from 'src/types';
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

export function _getOutputs(): Output[] {
  const goals = _getGoals();
  const map = R.indexBy(goals, x => x.id);
  const outputs = _getData<Output>('data_outputs', [
    ...R.range(1, 40).map(
      i =>
        ({
          id: 'output_' + i,
          name: { en: 'Output ' + i, ar: 'Output ' + i + ' - ar' },
          description: { en: 'Output ' + i, ar: 'Output ' + i + ' - ar' },
          createdTime: new Date().toISOString(),
          status: i % 2 ? 'active' : 'draft',
          goalId: 'goal_' + i,
          strategicPlanId: i < 20 ? '1' : '2',
        } as Output)
    ),
  ]);
  outputs.forEach(item => {
    const goal = map[item.goalId];
    if (goal) {
      item.goalName = goal.name;
    }
  });
  return outputs;
}

function _updateOutputs(outputs: Output[]) {
  localStorage.data_outputs = JSON.stringify(outputs);
}

interface SearchOutputsCriteria {
  pageNumber: number;
  pageSize: number;
  name?: string;
  status?: string;
  sortBy: string;
  sortDesc: boolean;
  strategicPlanId: string;
}

function _searchOutputs(criteria: SearchOutputsCriteria) {
  const roles = _getOutputs();
  const filtered = roles.filter(role => {
    return (
      _filterString(role.name, criteria.name) &&
      _filterExact(role.strategicPlanId, criteria.strategicPlanId) &&
      _filterExact(role.status, criteria.status)
    );
  });

  filtered.sort((a, b) => {
    const getDiff = () => {
      switch (criteria.sortBy) {
        case 'name':
          return a.name[i18n.language].localeCompare(b.name[i18n.language]);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'goalName':
          return _compareOptionalTransString(a.goalName, b.goalName);
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

export function searchOutputs(
  criteria: SearchOutputsCriteria
): Rx.Observable<SearchResult<Output>> {
  return _mockResponse(() => {
    return _paginate(criteria, _searchOutputs);
  });
}

export function getAllOutputs(strategicPlanId: string) {
  return _mockResponse(() => {
    return _getOutputs().filter(x => x.strategicPlanId === strategicPlanId);
  });
}

export function exportOutputs(criteria: SearchOutputsCriteria) {
  const filtered = _searchOutputs(criteria);
  const csv: string[][] = [];
  csv.push([
    i18n.t('ID'),
    i18n.t('Name'),
    i18n.t('Goal'),
    i18n.t('Created Time'),
    i18n.t('Status'),
  ]);
  filtered.forEach(item => {
    csv.push([
      _escapeCsv(item.id),
      _escapeCsv(item.name[i18n.language]),
      _escapeCsv(item.goalName && item.goalName[i18n.language]),
      _escapeCsv(new Date(item.createdTime).toISOString()),
      _escapeCsv(item.status),
    ]);
  });
  const txt = csv.map(item => item.join(',')).join('\n');
  _download(txt, 'outputs.csv', 'text/csv');
}

export function getOutput(id: string) {
  return _mockResponse(() => {
    const items = _getOutputs();
    const item = items.find(x => x.id === id);
    if (!item) {
      throw new Error('Output not found');
    }
    return item;
  });
}

export function createOutput(
  values: Omit<Output, 'id' | 'createdTime' | 'goalName'>
) {
  return _mockResponse(() => {
    const item: Output = {
      ...values,
      createdTime: new Date().toISOString(),
      id: String(Date.now()),
    };
    const items = _getOutputs();
    _updateOutputs([...items, item]);
    return item;
  });
}

export function updateOutput(id: string, values: Output) {
  return _mockResponse(() => {
    const items = _getOutputs();
    const newItems = items.map(item => {
      if (item.id === id) {
        return values;
      }
      return item;
    });
    _updateOutputs(newItems);
    return values;
  });
}

export function deleteOutput(id: string) {
  return _mockResponse(() => {
    const items = _getOutputs();
    const newItems = items.filter(item => {
      return item.id !== id;
    });
    _updateOutputs(newItems);
  });
}
