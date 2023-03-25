import * as Rx from 'src/rx';
import { Location, SearchResult } from 'src/types';
import i18n from 'i18next';
import {
  _filterString,
  _filterBool,
  _getData,
  _mockResponse,
  _paginate,
  _download,
  _escapeCsv,
} from './_utils';

function _getLocations(): Location[] {
  return _getData<Location>('data_locations', [
    {
      id: 'google-1',
      name: {
        en: 'Google',
        ar: 'Google',
      },
      address: {
        en: '1600 Amphitheatre Pkwy',
        ar: '1600 Amphitheatre Pkwy',
      },
      poBox: 'po box',
      city: 'Mountain View',
      country: 'US',
      isHeadquarter: true,
      long: -122.084286,
      lat: 37.422024,
    },
    {
      id: 'google-2',
      name: {
        en: 'Google',
        ar: 'Google',
      },
      address: {
        en: '2300 Traverwood Dr',
        ar: '2300 Traverwood Dr',
      },
      poBox: 'po box2',
      city: 'Ann Arbor',
      country: 'US',
      isHeadquarter: false,
      long: -83.714196,
      lat: 42.306385,
    },
  ]);
}

function _updateLocations(locations: Location[]) {
  localStorage.data_locations = JSON.stringify(locations);
}

interface SearchLocationsCriteria {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDesc: boolean;
  name?: string;
  address?: string;
  poBox?: string;
  city?: string;
  country?: string;
  isHeadquarter?: boolean;
}

function _searchLocations(criteria: SearchLocationsCriteria) {
  const locations = _getLocations();
  const filtered = locations.filter(location => {
    return (
      _filterString(location.name, criteria.name) &&
      _filterString(location.address, criteria.address) &&
      _filterString(location.poBox, criteria.poBox) &&
      _filterString(location.city, criteria.city) &&
      _filterString(location.country, criteria.country) &&
      _filterBool(location.isHeadquarter, criteria.isHeadquarter)
    );
  });

  filtered.sort((a, b) => {
    const getDiff = () => {
      switch (criteria.sortBy) {
        case 'address':
          return a.address[i18n.language].localeCompare(
            b.address[i18n.language]
          );
        case 'country':
        case 'city':
        case 'poBox':
          return a[criteria.sortBy].localeCompare(b[criteria.sortBy]);
        case 'isHeadquarter':
          return Number(a.isHeadquarter) - Number(b.isHeadquarter);
        default:
          return a.name[i18n.language].localeCompare(b.name[i18n.language]);
      }
    };
    return getDiff() * (criteria.sortDesc ? -1 : 1);
  });
  return filtered;
}

export function searchLocations(
  criteria: SearchLocationsCriteria
): Rx.Observable<SearchResult<Location>> {
  return _mockResponse(() => {
    return _paginate(criteria, _searchLocations);
  });
}

export function exportLocations(criteria: SearchLocationsCriteria) {
  const filtered = _searchLocations(criteria);
  const csv: string[][] = [];
  csv.push([
    i18n.t('Name'),
    i18n.t('Address'),
    i18n.t('P.O Box'),
    i18n.t('City'),
    i18n.t('Country'),
    i18n.t('Is Headquarter'),
  ]);
  filtered.forEach(item => {
    csv.push([
      _escapeCsv(item.name[i18n.language]),
      _escapeCsv(item.address[i18n.language]),
      _escapeCsv(item.poBox),
      _escapeCsv(item.city),
      _escapeCsv(item.country),
      _escapeCsv(i18n.t(item.isHeadquarter ? 'Yes' : 'No') as string),
    ]);
  });
  const txt = csv.map(item => item.join(',')).join('\n');
  _download(txt, 'locations.csv', 'text/csv');
}

export function getLocation(id: string) {
  return _mockResponse(() => {
    const locations = _getLocations();
    const location = locations.find(x => x.id === id);
    if (!location) {
      throw new Error('Location not found');
    }
    return location;
  });
}

export function createLocation(values: Omit<Location, 'id'>) {
  return _mockResponse(() => {
    const location: Location = {
      ...values,
      id: String(Date.now()),
    };
    const locations = _getLocations();
    _updateLocations([...locations, location]);
    return location;
  });
}
export function updateLocation(id: string, values: Location) {
  return _mockResponse(() => {
    const roles = _getLocations();
    const newLocations = roles.map(item => {
      if (item.id === id) {
        return values;
      }
      return item;
    });
    _updateLocations(newLocations);
    return values;
  });
}

export function deleteLocation(id: string) {
  return _mockResponse(() => {
    const roles = _getLocations();
    const newLocations = roles.filter(item => {
      return item.id !== id;
    });
    _updateLocations(newLocations);
  });
}
