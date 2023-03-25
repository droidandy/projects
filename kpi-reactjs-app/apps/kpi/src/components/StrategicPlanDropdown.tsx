import React from 'react';
import styled, { css } from 'styled-components';
import { useActions } from 'typeless';
import { GlobalActions, getGlobalState } from 'src/features/global/interface';
import { StrategicPlan } from 'src/types-next';
import { MenuDropdown } from './MenuDropdown';
import { SelectButton } from './SelectButton';
import { DisplayTransString } from './DisplayTransString';

const DropdownWrapper = styled.div`
  width: 100%;
  min-width: 180px;
  display: flex;
  z-index: 10;
  flex-direction: column;
  align-items: center;
  padding: 1.6rem 1.5rem;
`;

const hoverStyle = css`
  background-color: #f7f8fa;
  a {
    color: #5867dd;
  }
`;

const ListWrapper = styled.ul`
  padding: 15px 0;
  margin: 0;
`;

const ListItem = styled.li<{ active?: boolean }>`
  list-style: none;
  min-width: 180px;
  font-size: 13px;
  a {
    transition: all 0.3s;
    display: flex;
    flex-grow: 1;
    align-items: center;
    padding: 7px 22px;
    cursor: pointer;
    text-decoration: none;
    color: #6c7293;
  }
  &:hover {
    ${hoverStyle}
  }
  ${props => props.active && hoverStyle}
`;

export function StrategicPlanDropdown() {
  const { changeStrategicPlan } = useActions(GlobalActions);
  const {
    strategicPlans,
    currentPlanId,
    organizationId,
  } = getGlobalState.useState();

  const filteredStrategicPlans = strategicPlans!.filter(
    (plan: StrategicPlan) => plan.organizationId === organizationId
  );
  const selectedstrategicPlan = (filteredStrategicPlans || []).find(
    x => x.id === currentPlanId
  );

  const emptySelect = {
    ar: '[ar] Not selected',
    en: 'Not selected',
  };
  const emptyStrategicPlans = {
    ar: '[ar] There is no Strategic Plans',
    en: 'There is no Strategic Plans',
  };

  if (filteredStrategicPlans.length) {
    return (
      <MenuDropdown
        placement="bottom-end"
        dropdown={
          <DropdownWrapper>
            <ListWrapper>
              {filteredStrategicPlans.map(item => (
                <ListItem
                  key={item.id}
                  active={item.id === currentPlanId}
                  onClick={() => changeStrategicPlan(item.id)}
                >
                  <a href="javascript:">
                    <DisplayTransString value={item.name} />
                  </a>
                </ListItem>
              ))}
            </ListWrapper>
          </DropdownWrapper>
        }
      >
        <SelectButton>
          <DisplayTransString
            value={
              selectedstrategicPlan
                ? selectedstrategicPlan.name
                : filteredStrategicPlans[0].name
            }
          />
        </SelectButton>
      </MenuDropdown>
    );
  } else {
    return (
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
                <DisplayTransString value={emptyStrategicPlans} />
              </div>
            </ListWrapper>
          </DropdownWrapper>
        }
      >
        <SelectButton>
          <DisplayTransString value={emptySelect} />
        </SelectButton>
      </MenuDropdown>
    );
  }
}
