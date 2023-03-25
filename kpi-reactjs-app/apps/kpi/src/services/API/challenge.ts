import * as Rx from 'src/rx';
import * as R from 'remeda';
import { SearchResult, Challenge, OrganizationStructure } from 'src/types';
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
  _filterBool,
  _compareBool,
} from './_utils';
import { _getGoals } from './goal';
import { _getOutputs } from './output';
import { _getMissions } from './mission';
import { _getUnitObjectives } from './unitObjective';
import { _getOperations } from './operation';
import { _getInitiatives } from './initiative';
import { _getKpis } from './kpi';
import { _getExcellenceStandards } from './excellenceStandard';
import { _getExcellenceRequirements } from './excellenceRequirement';
import { _getOrganizationStructure } from './organizationStructure';

export function _getChallenges(): Challenge[] {
  const challenges = _getData<Challenge>('data_challenges', [
    ...R.range(1, 40).map(
      i =>
        ({
          id: 'challenge_' + i,
          name: { en: 'Challenge ' + i, ar: 'Challenge ' + i + ' - ar' },
          description: { en: 'Challenge ' + i, ar: 'Challenge ' + i + ' - ar' },
          createdTime: new Date().toISOString(),
          status: i % 2 ? 'active' : 'draft',
          period: 2018 + (i % 3) + ' - Q' + ((i % 4) + 1),
          affectedUnitId: i % 4 ? '21' : '1',
          challengedUnitId: i % 2 ? '3' : '4',
          itemId: `operation_${(i % 3) + 1 + (i < 20 ? 0 : 20)}`,
          itemType: 'operation',
          notes: '',
          strategicPlanId: i < 20 ? '1' : '2',
        } as Challenge)
    ),
  ]);
  return challenges;
}

function _updateChallenges(challenges: Challenge[]) {
  localStorage.data_challenges = JSON.stringify(challenges);
}

interface SearchChallengesCriteria {
  pageNumber: number;
  pageSize: number;
  name?: string;
  status?: string;
  sortBy: string;
  sortDesc: boolean;
  strategicPlanId: string;
}

function _searchChallenges(criteria: SearchChallengesCriteria) {
  const challenges = _getChallenges();

  const map = {
    goal: R.indexBy(_getGoals(), x => x.id),
    output: R.indexBy(_getOutputs(), x => x.id),
    mission: R.indexBy(_getMissions(), x => x.id),
    unitObjective: R.indexBy(_getUnitObjectives(), x => x.id),
    operation: R.indexBy(_getOperations(), x => x.id),
    initiative: R.indexBy(_getInitiatives(), x => x.id),
    kpi: R.indexBy(_getKpis(), x => x.id),
    excellenceStandard: R.indexBy(_getExcellenceStandards(), x => x.id),
    excellenceRequirement: R.indexBy(_getExcellenceRequirements(), x => x.id),
  };

  const allUnits: OrganizationStructure[] = [];
  const travel = (item: OrganizationStructure) => {
    allUnits.push(item);
    item.children.forEach(travel);
  };
  _getOrganizationStructure().forEach(travel);
  const unit = R.indexBy(allUnits, x => x.id);

  challenges.forEach(challenge => {
    const item = map[challenge.itemType][challenge.itemId];
    challenge.itemName = item.name;
    const affected = unit[challenge.affectedUnitId];
    const challenged = unit[challenge.challengedUnitId];
    challenge.affectedUnitName = affected && affected.name;
    challenge.challengedUnitName = challenged && challenged.name;
  });

  const filtered = challenges.filter(item => {
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
        case 'period':
          return a.period.localeCompare(b.period);
        case 'itemName':
          return a.itemName![i18n.language].localeCompare(
            b.itemName![i18n.language]
          );
        case 'affectedUnitName':
          return a.affectedUnitName![i18n.language].localeCompare(
            b.affectedUnitName![i18n.language]
          );
        case 'challengedUnitName':
          return a.challengedUnitName![i18n.language].localeCompare(
            b.challengedUnitName![i18n.language]
          );
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

export function searchChallenges(
  criteria: SearchChallengesCriteria
): Rx.Observable<SearchResult<Challenge>> {
  return _mockResponse(() => {
    return _paginate(criteria, _searchChallenges);
  });
}

export function getAllChallenges() {
  return _mockResponse(() => {
    return _getChallenges();
  });
}

export function exportChallenges(criteria: SearchChallengesCriteria) {
  const filtered = _searchChallenges(criteria);
  const csv: string[][] = [];
  csv.push([
    i18n.t('ID'),
    i18n.t('Name'),
    i18n.t('Status'),
    i18n.t('Period'),
    i18n.t('Linked To'),
    i18n.t('Affected Unit'),
    i18n.t('Challenged Unit'),
  ]);
  filtered.forEach(item => {
    csv.push([
      _escapeCsv(item.id),
      _escapeCsv(item.name[i18n.language]),
      _escapeCsv(i18n.t(item.status) as string),
      _escapeCsv(item.period),
      _escapeCsv(item.itemName![i18n.language]),
      _escapeCsv(item.affectedUnitName![i18n.language]),
      _escapeCsv(item.challengedUnitName![i18n.language]),
    ]);
  });
  const txt = csv.map(item => item.join(',')).join('\n');
  _download(txt, 'challenges.csv', 'text/csv');
}

export function getChallenge(id: string) {
  return _mockResponse(() => {
    const items = _getChallenges();
    const item = items.find(x => x.id === id);
    if (!item) {
      throw new Error('Challenge not found');
    }
    return item;
  });
}

export function createChallenge(values: Omit<Challenge, 'id' | 'createdTime'>) {
  return _mockResponse(() => {
    const item: Challenge = {
      ...values,
      createdTime: new Date().toISOString(),
      id: String(Date.now()),
    };
    const items = _getChallenges();
    _updateChallenges([...items, item]);
    return item;
  });
}

export function updateChallenge(id: string, values: Challenge) {
  return _mockResponse(() => {
    const items = _getChallenges();
    const newItems = items.map(item => {
      if (item.id === id) {
        return values;
      }
      return item;
    });
    _updateChallenges(newItems);
    return values;
  });
}

export function deleteChallenge(id: string) {
  return _mockResponse(() => {
    const items = _getChallenges();
    const newItems = items.filter(item => {
      return item.id !== id;
    });
    _updateChallenges(newItems);
  });
}
