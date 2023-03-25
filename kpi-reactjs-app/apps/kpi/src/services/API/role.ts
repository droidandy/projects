import * as Rx from 'src/rx';
import * as R from 'remeda';
import { Role, SearchResult } from 'src/types';
import { permissions } from 'src/const';
import i18n from 'i18next';
import {
  _getData,
  _mockResponse,
  _paginate,
  _escapeCsv,
  _download,
  _filterString,
  _filterArray,
} from './_utils';

export function _getRoles(): Role[] {
  return _getData<Role>('data_roles', [
    {
      id: 'all_roles',
      name: { en: 'All Roles', ar: 'All Roles - ar' },
      permissions,
    },
    ...R.range(1, 40).map(i => ({
      id: 'generated_' + i,
      name: { en: 'Generated ' + i, ar: 'Generated ' + i + ' - ar' },
      permissions: [
        permissions[i % permissions.length],
        permissions[(i + 1) % permissions.length],
        permissions[(i + 2) % permissions.length],
      ],
    })),
  ]);
}

function _updateRoles(roles: Role[]) {
  localStorage.data_roles = JSON.stringify(roles);
}

interface SearchRolesCriteria {
  pageNumber: number;
  pageSize: number;
  name?: string;
  sortBy: string;
  sortDesc: boolean;
  roles?: string[];
}

function _searchRoles(criteria: SearchRolesCriteria) {
  const roles = _getRoles();
  const filtered = roles.filter(role => {
    return (
      _filterString(role.name, criteria.name) &&
      _filterArray(role.permissions, criteria.roles)
    );
  });

  filtered.sort((a, b) => {
    const diff = a.name[i18n.language].localeCompare(b.name[i18n.language]);
    return diff * (criteria.sortDesc ? -1 : 1);
  });
  return filtered;
}

export function getAllRoles() {
  return _mockResponse(() => {
    const roles = _getRoles();
    roles.sort((a, b) => {
      return a.name[i18n.language].localeCompare(b.name[i18n.language]);
    });
    return roles;
  });
}

export function searchRoles(
  criteria: SearchRolesCriteria
): Rx.Observable<SearchResult<Role>> {
  return _mockResponse(() => {
    return _paginate(criteria, _searchRoles);
  });
}

export function exportRoles(criteria: SearchRolesCriteria) {
  const filtered = _searchRoles(criteria);
  const csv: string[][] = [];
  csv.push([i18n.t('Name'), i18n.t('Roles')]);
  filtered.forEach(item => {
    csv.push([
      _escapeCsv(item.name[i18n.language]),
      _escapeCsv(item.permissions.join(',')),
    ]);
  });
  const txt = csv.map(item => item.join(',')).join('\n');
  _download(txt, 'roles.csv', 'text/csv');
}

export function getRole(id: string) {
  return _mockResponse(() => {
    const roles = _getRoles();
    const role = roles.find(x => x.id === id);
    if (!role) {
      throw new Error('Role not found');
    }
    return role;
  });
}

export function createRole(values: Omit<Role, 'id'>) {
  return _mockResponse(() => {
    const role: Role = {
      ...values,
      id: String(Date.now()),
    };
    const roles = _getRoles();
    _updateRoles([...roles, role]);
    return role;
  });
}

export function updateRole(id: string, values: Role) {
  return _mockResponse(() => {
    const roles = _getRoles();
    const newRoles = roles.map(item => {
      if (item.id === id) {
        return values;
      }
      return item;
    });
    _updateRoles(newRoles);
    return values;
  });
}

export function deleteRole(id: string) {
  return _mockResponse(() => {
    const roles = _getRoles();
    const newRoles = roles.filter(item => {
      return item.id !== id;
    });
    _updateRoles(newRoles);
  });
}
