import * as Rx from 'src/rx';
import { OrganizationStructure } from 'src/types';
import { _getData, _mockResponse } from './_utils';

export function _getOrganizationStructure(): OrganizationStructure[] {
  return _getData<OrganizationStructure>('data_organization_structure', [
    {
      id: '1',
      name: {
        en: 'Example Element',
        ar: 'Example Element - ar',
      },
      children: [],
    },
    {
      id: '21',
      name: {
        en: 'Example Element with children',
        ar: 'Example Element with children - ar',
      },
      children: [
        {
          id: '3',
          name: {
            en: 'Sub 1',
            ar: 'Sub 1 - ar',
          },
          children: [],
        },
        {
          id: '4',
          name: {
            en: 'Sub 2',
            ar: 'Sub 2 - ar',
          },
          children: [],
        },
      ],
    },
  ]);
}

function _updateOrganizationStructure(items: OrganizationStructure[]) {
  localStorage.data_organization_structure = JSON.stringify(items);
}

export function getOrganizationStructure() {
  return _mockResponse(_getOrganizationStructure);
}

export function getFlattenOrganizationStructure() {
  return getOrganizationStructure().pipe(
    Rx.map(items => {
      const ret: OrganizationStructure[] = [];
      const travel = (item: OrganizationStructure) => {
        ret.push(item);
        item.children.forEach(travel);
      };
      items.forEach(travel);
      return ret;
    })
  );
}

export function updateOrganizationStructure(items: OrganizationStructure[]) {
  return _mockResponse(() => {
    _updateOrganizationStructure(items);
  });
}

export function getOrganizationStructureById(id: string) {
  return getFlattenOrganizationStructure().pipe(
    Rx.map(items => {
      const item = items.find(x => x.id === id);
      if (!item) {
        throw new Error('Organization structure not found');
      }
      return item;
    })
  );
}
