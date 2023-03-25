import * as React from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Link } from './Link';
import { MenuDropdown } from './MenuDropdown';
import { getGlobalState } from 'src/features/global/interface';
import { DisplayTransString } from './DisplayTransString';
import { getRouterState } from 'typeless-router';
import { DropdownWrapper } from './DropdownWrapper';

interface MainMenuProps {
  className?: string;
}

const Items = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-self: flex-end;
  align-items: center;
  height: 70px;
`;

interface ItemProps {
  active?: boolean;
}

const Item = styled.li<ItemProps>`
  padding: 0px 0.15rem;

  a {
    color: white;
    border-radius: 4px;
    padding: 0.75rem 1.45rem;
    transition: all 0.3s ease;
  }
  ${props =>
    props.active
      ? css`
          a {
            background-color: #ffffff;
            color: #244159;
          }
        `
      : css`
          &:hover a {
            background-color: #232337;
          }
        `}
`;

const _MainMenu = (props: MainMenuProps) => {
  const { className } = props;
  const { t } = useTranslation();
  const { dashboards } = getGlobalState.useState();
  const { location } = getRouterState.useState();
  return (
    <div className={className}>
      <Items>
        <Item active={location?.pathname.startsWith('/dashboard/')}>
          <MenuDropdown
            placement="bottom-end"
            dropdown={
              <DropdownWrapper>
                {dashboards.map(item => (
                  <Link key={item.id} href={`/dashboard/${item.id}`}>
                    <div />
                    <DisplayTransString value={item.name} />
                  </Link>
                ))}
              </DropdownWrapper>
            }
          >
            <a href="javascript:">{t('Dashboards')}</a>
          </MenuDropdown>
        </Item>
        <Item active={location?.pathname === '/my-space'}>
          <Link href="/my-space">{t('My Space')}</Link>
        </Item>
      </Items>
    </div>
  );
};

export const MainMenu = styled(_MainMenu)`
  display: block;
  margin-right: 50px;
`;
