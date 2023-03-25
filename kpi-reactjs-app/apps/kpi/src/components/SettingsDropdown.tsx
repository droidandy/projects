import React from 'react';
import { MenuDropdown } from './MenuDropdown';
import styled, { css } from 'styled-components';
import { TopBarItem, TopBarText } from './TopBar';
import { useTranslation } from 'react-i18next';
import { getGlobalState, GlobalActions } from 'src/features/global/interface';
import { useActions } from 'typeless';
import { DisplayTransString } from './DisplayTransString';

const ListHeader = styled.div`
  padding-left: 10px;
  color: #6c7293;
  font-weight: bold;
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

export function SettingsDropdown() {
  const { t } = useTranslation();
  const { colorThemes, currentThemeId } = getGlobalState.useState();
  const { changeColorTheme } = useActions(GlobalActions);
  return (
    <MenuDropdown
      placement="bottom-end"
      dropdown={
        <ListWrapper>
          <ListHeader>{t('THEME COLORS')}</ListHeader>
          {colorThemes.map(item => (
            <ListItem
              key={item.id}
              active={item.id === currentThemeId}
              onClick={() => changeColorTheme(item.id)}
            >
              <a href="javascript:">
                <DisplayTransString value={item.name} />
              </a>
            </ListItem>
          ))}
        </ListWrapper>
      }
    >
      <TopBarItem>
        <TopBarText style={{ width: 44 }}>
          <i className="flaticon-settings-1" />
        </TopBarText>
      </TopBarItem>
    </MenuDropdown>
  );
}
