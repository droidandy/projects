import React from 'react';
import * as R from 'remeda';
import styled from 'styled-components';
import { useActions } from 'typeless';
import { GlobalActions, getGlobalState } from 'src/features/global/interface';

import { rtlMargin } from 'shared/rtl';
import { OrganizationUnit } from 'src/types-next';
import { SelectButton } from './SelectButton';
import { MenuDropdown } from './MenuDropdown';
import { Tree, TreeItem } from './Tree';
import { DisplayTransString } from './DisplayTransString';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  min-width: 180px;
  z-index: 10;
  ${rtlMargin('auto', '0')}
`;

const WIDTH = 320;

const DropdownWrapper = styled.div`
  padding: 10px 15px;
  width: ${WIDTH}px;
`;

const ListWrapper = styled.ul`
  padding: 15px 0;
  margin: 0;
`;

interface OrganizationUnitWithChildren extends OrganizationUnit {
  children: OrganizationUnitWithChildren[];
}

export function UnitDropdown() {
  const { changeUnit } = useActions(GlobalActions);
  const { organizationUnits, currentUnitId } = getGlobalState.useState();

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

  const value = organizationUnits
    ? organizationUnits.find(x => x.id === currentUnitId)
    : null;

  const emptySelect = {
    ar: '[ar] Not selected',
    en: 'Not selected',
  };
  const emptyOrganizationUnits = {
    ar: '[ar] There is no Organization Units',
    en: 'There is no Organization Units',
  };

  if (organizationUnits!.length) {
    return (
      <Wrapper>
        <MenuDropdown
          placement="bottom-end"
          dropdown={
            <DropdownWrapper>
              <Tree
                selected={currentUnitId}
                onChange={x => changeUnit(x.id as number)}
                items={treeItems}
              />
            </DropdownWrapper>
          }
        >
          <SelectButton>
            <DisplayTransString
              value={value ? value.name : organizationUnits![0].name}
            />
          </SelectButton>
        </MenuDropdown>
      </Wrapper>
    );
  } else {
    return (
      <Wrapper>
        <MenuDropdown
          placement="bottom-end"
          dropdown={
            <DropdownWrapper>
              <ListWrapper>
                <div
                  style={{
                    color: '#6c7293',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <DisplayTransString value={emptyOrganizationUnits} />
                </div>
              </ListWrapper>
            </DropdownWrapper>
          }
        >
          <SelectButton>
            <DisplayTransString value={emptySelect} />
          </SelectButton>
        </MenuDropdown>
      </Wrapper>
    );
  }
}
