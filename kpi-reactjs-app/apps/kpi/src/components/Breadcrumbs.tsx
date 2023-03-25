import * as React from 'react';
import styled from 'styled-components';
import { rtlPadding } from 'shared/rtl';
import { menuItems } from './MainMenu';
import { getRouterState } from 'typeless-router';
import { Trans } from 'react-i18next';
import { createModule } from 'typeless';
import { useLanguage } from 'src/hooks/useLanguage';
import { TransString } from 'src/types';

export const Breadcrumbs = () => {
  handle();
  const lang = useLanguage();
  const { itemName } = getBreadcrumbsState.useState();
  const { location } = getRouterState.useState();
  const href = location ? location.pathname : '';
  const splitedHref = href.split('/');
  const rootPath = splitedHref[1] ? '/' + splitedHref[1] : '/';
  let rootItem = menuItems.find(el => el.href === rootPath);
  if (!rootItem) {
    rootItem = {
      href: rootPath,
      text: rootPath
        .slice(1)
        .replace(/[-_]/gi, ' ')
        .split(' ')
        .map(elem => {
          return elem.charAt(0).toUpperCase() + elem.slice(1);
        })
        .join(' '),
    };
  }
  const nestedPaths = splitedHref.splice(2);

  const getBreadCrumbs = () => {
    return nestedPaths.map((path, index) => {
      let breadcrumbsPath: string[] = [];
      let breadcrumbsName;

      for (let i = 0; i <= index; i++) {
        breadcrumbsPath = [...breadcrumbsPath, nestedPaths[i]];
      }

      const isPathId = path
        .replace(/[-_?]/gi, ' ')
        .split(' ')
        .some(el => +el);

      if (isPathId) {
        breadcrumbsName = itemName[lang];
      } else {
        breadcrumbsName = path
          .replace(/[-_]/gi, ' ')
          .replace(/([a-z])([A-Z])/g, '$1 $2')
          .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
          .trim()
          .split(' ')
          .map(elem => {
            return elem.charAt(0).toUpperCase() + elem.slice(1);
          })
          .join(' ');
      }

      return {
        href: rootItem!.href + `/${breadcrumbsPath.join('/')}`,
        name: breadcrumbsName,
      };
    });
  };
  const breadCrumbs = getBreadCrumbs();

  return (
    <Wrapper>
      <Title>
        <Trans>{rootItem!.text}</Trans>
      </Title>
      <WrapperBread>
        <Link href={`/`}>
          <i className="flaticon2-shelter"></i>
        </Link>
        <Dot />
        {breadCrumbs.length ? (
          <Link href={rootItem!.href}>
            <Trans>{rootItem!.text}</Trans>
          </Link>
        ) : (
          <span style={{ cursor: 'default' }}>
            <Trans>{rootItem!.text}</Trans>
          </span>
        )}
        {(breadCrumbs || []).map((path, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'row' }}>
            <Dot />
            {path.href === href ? (
              <span style={{ cursor: 'default' }}>
                <Trans>{path.name}</Trans>
              </span>
            ) : (
              <Link href={path.href}>
                <Trans>{path.name}</Trans>
              </Link>
            )}
          </div>
        ))}
      </WrapperBread>
    </Wrapper>
  );
};

export const Wrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  padding: 0.25rem 30px;
  margin-top: 25px;
`;

export const WrapperBread = styled.div`
  display: flex;
  align-items: center;
  list-style-type: none;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
`;

export const Title = styled.div`
  margin: 0;
  ${rtlPadding('0px', '10px')}
  font-size: 1.2rem;
  font-weight: 500;
  color: #434349;
  display: flex;
  align-items: center;
`;

export const Dot = styled.span`
  display: flex;
  justify-content: content;
  align-items: center;
  ${rtlPadding('0px', '5px')}

  &:after {
    display: block;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    content: ' ';
    background: #959cb6;
  }
`;

export const Link = styled.a`
  transition: color 0.3s ease
  ${rtlPadding('0px', '5px')}
  font-size: 1rem;
  font-weight: 500;
  color: #959cb6;
  &:hover {
    color: blue;
  }
`;

const BreadcrumbsSymbol = Symbol('breadcrumbs');

export const [handle, BreadcrumbsActions, getBreadcrumbsState] = createModule(
  BreadcrumbsSymbol
)
  .withActions({
    update: (itemName: TransString) => ({ payload: itemName }),
  })
  .withState<Breadcrumbs>();

export interface Breadcrumbs {
  itemName: TransString;
}

const initialState: Breadcrumbs = {
  itemName: { en: '...', ar: '...' },
};

handle
  .reducer(initialState)
  .on(BreadcrumbsActions.update, (state, itemName) => {
    state.itemName = itemName;
  });
