import React from 'react';
import { MenuDropdown } from './MenuDropdown';
import { TopBarIcon } from './TopBar';
import { UsIcon } from 'src/icons/UsIcon';
import styled, { css } from 'styled-components';
import { UAEIcon } from 'src/icons/UAEIcon';
import { useActions } from 'typeless';
import { GlobalActions, getGlobalState } from 'src/features/global/interface';

const ListWrapper = styled.ul`
  padding: 15px 0;
  margin: 0;
`;

const hoverStyle = css`
  background-color: #f7f8fa;
  a {
    color: #5867dd;
  }
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
  svg {
    border-radius: 4px;
    width: 18px;
    height: 18px;
  }
  span {
    padding: 0 10px;
    font-weight: 400;
  }
  &:hover {
    ${hoverStyle}
  }
  ${props => props.active && hoverStyle}
`;

const langs = [
  {
    code: 'en',
    text: 'English',
    icon: <UsIcon />,
  },
  {
    code: 'ar',
    text: 'عربى',
    icon: <UAEIcon />,
  },
];

export function LangDropdown() {
  const { changeLanguage } = useActions(GlobalActions);
  const { language } = getGlobalState.useState();
  const selected = langs.find(x => x.code === language);
  return (
    <MenuDropdown
      placement="bottom-end"
      dropdown={
        <ListWrapper>
          {langs.map(item => (
            <ListItem
              key={item.code}
              active={item.code === language}
              onClick={() => changeLanguage(item.code)}
            >
              <a href="javascript:">
                <i>{item.icon}</i>
                <span>{item.text}</span>
              </a>
            </ListItem>
          ))}
        </ListWrapper>
      }
    >
      <TopBarIcon>{selected!.icon}</TopBarIcon>
    </MenuDropdown>
  );
}
