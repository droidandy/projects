import React from 'react';
import * as R from 'remeda';
import styled from 'styled-components';
import { useActions } from 'typeless';
import { getGlobalState } from 'src/features/global/interface';
import { rtlMargin } from 'shared/rtl';
import { OrganizationUnit } from 'src/types-next';
import { SelectButton } from './SelectButton';
import { MenuDropdown } from './MenuDropdown';
import { Tree, TreeItem } from './Tree';
import { DisplayTransString } from './DisplayTransString';
import {
  OrgUsersActions,
  getOrgUsersState,
} from '../features/orgUsers/interface';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  min-width: 180px;
  z-index: 10;
  ${rtlMargin('15px', '0')}
`;

const WIDTH = 320;

const DropdownWrapper = styled.div`
  padding: 10px 15px;
  width: ${WIDTH}px;
`;

const defaultOptionValue = { name: { ar: '[ar] All', en: 'All' } };

const defaultOption: TreeItem = {
  id: 'all',
  label: <DisplayTransString value={defaultOptionValue.name} />,
  children: [],
};

interface OrganizationUnitWithChildren extends OrganizationUnit {
  children: OrganizationUnitWithChildren[];
}

export function OrgUsersDropDown() {
  const { updateFilter, applyFilter, clearFilter } = useActions(
    OrgUsersActions
  );
  const { filter } = getOrgUsersState.useState();
  const { organizationUnits } = getGlobalState.useState();

  const treeItems = React.useMemo(() => {
    if (!organizationUnits) {
      return [];
    }

    const withChildren: OrganizationUnitWithChildren[] = organizationUnits.map(
      item => ({
        ...item,
        children: [],
      })
    );

    const map = R.indexBy(withChildren, x => x.id);

    withChildren.forEach(item => {
      if (item.parentId) {
        const parent = map[item.parentId];
        if (!parent) {
          return;
        }
        parent.children.push(map[item.id]);
      }
    });

    const mapItem = (item: OrganizationUnitWithChildren): TreeItem => {
      return {
        id: item.id,
        label: <DisplayTransString value={item.name} />,
        children: item.children.map(mapItem),
      };
    };
    return withChildren.filter(x => !x.parentId).map(mapItem);
  }, [organizationUnits]);

  const value =
    filter.unitId && organizationUnits
      ? organizationUnits.find(x => x.id === filter.unitId)
      : defaultOptionValue;

  return (
    <Wrapper>
      <MenuDropdown
        placement="bottom-start"
        dropdown={
          <DropdownWrapper>
            <Tree
              selected={filter.unitId ? filter.unitId : 'all'}
              onChange={x => {
                x.id === 'all'
                  ? clearFilter()
                  : updateFilter('unitId', x.id) && applyFilter();
              }}
              items={[defaultOption, ...treeItems]}
            />
          </DropdownWrapper>
        }
      >
        <SelectButton>
          <DisplayTransString
            value={value ? value.name : defaultOptionValue.name}
          />
        </SelectButton>
      </MenuDropdown>
    </Wrapper>
  );
}
