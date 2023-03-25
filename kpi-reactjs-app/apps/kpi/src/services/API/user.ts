import * as Rx from 'src/rx';
import * as R from 'remeda';
import { User, SearchResult, PermissionMap } from 'src/types';
import { getAccessToken } from '../Storage';
import i18n from 'i18next';
import {
  _mockResponse,
  _escapeCsv,
  _download,
  _paginate,
  _getData,
  _filterString,
} from './_utils';
import { _getRoles } from './role';
import { permissions } from 'src/const';

const TOKEN_PREFIX = 'token:';

export function _getUsers(): User[] {
  return _getData<User>('data_users', [
    {
      id: 'admin',
      isAdmin: true,
      isActive: true,
      name: {
        en: 'Admin',
        ar: 'Admin',
      },
      email: 'admin@example.com',
      username: 'admin',
      password: 'admin',
      roles: [],
    },
    ...R.range(2, 10).map(
      i =>
        ({
          id: 'user_' + i,
          isAdmin: false,
          isActive: true,
          name: {
            en: 'user' + i,
            ar: 'user' + i,
          },
          email: `user${i}@example.com`,
          username: `user${i}`,
          password: 'password',
          roles: ['all_roles'],
        } as User)
    ),
  ]);
}

function _updateUsers(users: User[]) {
  localStorage.data_users = JSON.stringify(users);
}

export function getAllUsers() {
  return _mockResponse(() => {
    return _getUsers();
  });
}

function _getPermissionMap(user: User | undefined | null): PermissionMap {
  if (!user) {
    return {};
  }
  const roles = _getRoles();
  const roleMap = R.indexBy(roles, x => x.id);
  const userPermissions = user.isAdmin
    ? permissions
    : R.flatMap(user.roles, id => roleMap[id].permissions);
  return R.indexBy(userPermissions, x => x);
}

export function login(username: string, password: string) {
  return _mockResponse(() => {
    const users = _getUsers();
    const user = users.find(
      x => x.username === username && x.password === password
    );
    if (!user) {
      throw new Error('Invalid username or password');
    }
    return {
      user,
      token: `${TOKEN_PREFIX}${username}`,
      permissionMap: _getPermissionMap(user),
    };
  });
}

export function _getLoggedUser() {
  const token = getAccessToken();
  if (!token || !token.startsWith(TOKEN_PREFIX)) {
    return {
      user: null,
      permissionMap: {},
    };
  }
  const username = token.substr(TOKEN_PREFIX.length);
  const users = _getUsers();
  const user = users.find(x => x.username === username) || null;
  return {
    user,
    permissionMap: _getPermissionMap(user),
  };
}
export function getLoggedUser() {
  return _mockResponse(_getLoggedUser);
}

interface SearchUsersCriteria {
  pageNumber: number;
  pageSize: number;
  name?: string;
  email?: string;
  sortBy: string;
  sortDesc: boolean;
}

function _searchUsers(criteria: SearchUsersCriteria) {
  const users = _getUsers();
  const filtered = users.filter(user => {
    return (
      _filterString(user.name, criteria.name) &&
      _filterString(user.email, criteria.email)
    );
  });

  filtered.sort((a, b) => {
    const getDiff = () => {
      switch (criteria.sortBy) {
        case 'email':
          return a.email.localeCompare(b.email);
        default:
          return a.name[i18n.language].localeCompare(b.name[i18n.language]);
      }
    };

    return getDiff() * (criteria.sortDesc ? -1 : 1);
  });
  return filtered;
}

function _checkUserUniq(otherUsers: User[], email: string, username: string) {
  const usernameMap = R.indexBy(otherUsers, x => x.username.toLowerCase());
  const emailMap = R.indexBy(otherUsers, x => x.email.toLowerCase());
  if (usernameMap[username.toLowerCase()]) {
    throw new Error('Username is already taken');
  }
  if (emailMap[email.toLowerCase()]) {
    throw new Error('Email is already taken');
  }
}

export function searchUsers(
  criteria: SearchUsersCriteria
): Rx.Observable<SearchResult<User>> {
  return _mockResponse(() => {
    return _paginate(criteria, _searchUsers);
  });
}

export function getUser(id: string) {
  return _mockResponse(() => {
    const users = _getUsers();
    const user = users.find(x => x.id === id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  });
}

export function exportUsers(criteria: SearchUsersCriteria) {
  const filtered = _searchUsers(criteria);
  const csv: string[][] = [];
  csv.push([i18n.t('Name'), i18n.t('Email')]);
  filtered.forEach(item => {
    csv.push([_escapeCsv(item.name[i18n.language]), _escapeCsv(item.email)]);
  });
  const txt = csv.map(item => item.join(',')).join('\n');
  _download(txt, 'users.csv', 'text/csv');
}

export function createUser(values: Omit<User, 'id'>) {
  return _mockResponse(() => {
    const user: User = {
      ...values,
      id: String(Date.now()),
    };
    const users = _getUsers();
    _checkUserUniq(users, values.email, values.username);
    _updateUsers([...users, user]);
    return user;
  });
}

export function updateUser(id: string, values: User) {
  return _mockResponse(() => {
    const users = _getUsers();
    const otherUsers = users.filter(x => x.id !== id);
    _checkUserUniq(otherUsers, values.email, values.username);
    const newUsers = users.map(item => {
      if (item.id === id) {
        return values;
      }
      return item;
    });
    _updateUsers(newUsers);
    return values;
  });
}

export function deleteUser(id: string) {
  return _mockResponse(() => {
    const users = _getUsers();
    const newUsers = users.filter(item => {
      return item.id !== id;
    });
    _updateUsers(newUsers);
  });
}
