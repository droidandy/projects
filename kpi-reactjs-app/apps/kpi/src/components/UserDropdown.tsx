import React from 'react';
import { TopBarItem, TopBarText } from './TopBar';
import { UserMenuItem } from './UserMenuItem';
import { MenuDropdown } from './MenuDropdown';
import { SelectButton } from './SelectButton';
import styled, { css } from 'styled-components';
import { Button } from './Button';
import { getGlobalState, GlobalActions } from 'src/features/global/interface';
import { useActions } from 'typeless';
import { Trans } from 'react-i18next';
import { DisplayTransString } from './DisplayTransString';
import { StrategicPlanDropdown } from './StrategicPlanDropdown';

const DropdownWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.6rem 1.5rem;

  ${TopBarItem} {
    width: 100%;

    &:not(:first-child) {
      margin-top: 16px;
    }
  }
`;

const ButtonWrapper = styled.div`
  width: 100%;
  display: block;
  margin-top: 16px;
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

export function UserDropdown() {
  const { logout, changeOrganization } = useActions(GlobalActions);
  const { organizations, organizationId } = getGlobalState.useState();
  const selectedOrganization = (organizations || []).find(
    x => x.id === organizationId
  );

  return (
    <MenuDropdown
      placement="bottom-end"
      dropdown={
        <DropdownWrapper>
          <MenuDropdown
            placement="bottom-end"
            dropdown={
              <DropdownWrapper>
                <ListWrapper>
                  {(organizations || []).map(item => (
                    <ListItem
                      key={item.id}
                      active={item.id === organizationId}
                      onClick={() => changeOrganization(item.id)}
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
              <DisplayTransString value={selectedOrganization!.name} />
            </SelectButton>
          </MenuDropdown>
          <StrategicPlanDropdown />
          <ButtonWrapper>
            <Button styling="brand" bold block onClick={logout}>
              <Trans>Sign Out</Trans>
            </Button>
          </ButtonWrapper>
        </DropdownWrapper>
      }
    >
      <TopBarItem>
        <TopBarText>
          <UserMenuItem />
        </TopBarText>
      </TopBarItem>
    </MenuDropdown>
  );
}
