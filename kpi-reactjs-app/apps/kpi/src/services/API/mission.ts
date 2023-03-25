import * as Rx from 'src/rx';
import * as R from 'remeda';
import { SearchResult, Mission } from 'src/types';
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

export function _getMissions(): Mission[] {
  const outputs = _getOutputs();
  const map = R.indexBy(outputs, x => x.id);
  const missions = _getData<Mission>('data_missions', [
    ...R.range(1, 40).map(
      i =>
        ({
          id: 'mission_' + i,
          name: { en: 'Mission ' + i, ar: 'Mission ' + i + ' - ar' },
          description: { en: 'Mission ' + i, ar: 'Mission ' + i + ' - ar' },
          createdTime: new Date().toISOString(),
          status: i % 2 ? 'active' : 'draft',
          outputId: 'output_' + i,
          strategicPlanId: i < 20 ? '1' : '2',
        } as Mission)
    ),
  ]);
  missions.forEach(item => {
    const output = map[item.outputId];
    if (output) {
      item.outputName = output.name;
    }
  });
  return missions;
}

function _updateMissions(missions: Mission[]) {
  localStorage.data_missions = JSON.stringify(missions);
}

interface SearchMissionsCriteria {
  pageNumber: number;
  pageSize: number;
  name?: string;
  status?: string;
  sortBy: string;
  sortDesc: boolean;
  strategicPlanId: string;
}

function _searchMissions(criteria: SearchMissionsCriteria) {
  const items = _getMissions();
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
        case 'outputName':
          return _compareOptionalTransString(a.outputName, b.outputName);
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

export function searchMissions(
  criteria: SearchMissionsCriteria
): Rx.Observable<SearchResult<Mission>> {
  return _mockResponse(() => {
    return _paginate(criteria, _searchMissions);
  });
}

export function getAllMissions(strategicPlanId: string) {
  return _mockResponse(() => {
    return _getMissions().filter(x => x.strategicPlanId === strategicPlanId);
  });
}

export function exportMissions(criteria: SearchMissionsCriteria) {
  const filtered = _searchMissions(criteria);
  const csv: string[][] = [];
  csv.push([
    i18n.t('ID'),
    i18n.t('Name'),
    i18n.t('Output'),
    i18n.t('Created Time'),
    i18n.t('Status'),
  ]);
  filtered.forEach(item => {
    csv.push([
      _escapeCsv(item.id),
      _escapeCsv(item.name[i18n.language]),
      _escapeCsv(item.outputName && item.outputName[i18n.language]),
      _escapeCsv(new Date(item.createdTime).toISOString()),
      _escapeCsv(item.status),
    ]);
  });
  const txt = csv.map(item => item.join(',')).join('\n');
  _download(txt, 'missions.csv', 'text/csv');
}

export function getMission(id: string) {
  return _mockResponse(() => {
    const items = _getMissions();
    const item = items.find(x => x.id === id);
    if (!item) {
      throw new Error('Mission not found');
    }
    return item;
  });
}

export function createMission(
  values: Omit<Mission, 'id' | 'createdTime' | 'outputName'>
) {
  return _mockResponse(() => {
    const item: Mission = {
      ...values,
      createdTime: new Date().toISOString(),
      id: String(Date.now()),
    };
    const items = _getMissions();
    _updateMissions([...items, item]);
    return item;
  });
}

export function updateMission(id: string, values: Mission) {
  return _mockResponse(() => {
    const items = _getMissions();
    const newItems = items.map(item => {
      if (item.id === id) {
        return values;
      }
      return item;
    });
    _updateMissions(newItems);
    return values;
  });
}

export function deleteMission(id: string) {
  return _mockResponse(() => {
    const items = _getMissions();
    const newItems = items.filter(item => {
      return item.id !== id;
    });
    _updateMissions(newItems);
  });
}
