import React, { FC, memo, useMemo } from 'react';
import cx from 'classnames';
import { ContainerWrapper } from '@marketplace/ui-kit';
import Logo from 'components/Logo';
import { Link } from 'components/Link';
import { MenuVariants, useMenuLinks } from 'hooks/useMenuLinks';
import { useStyles } from './NavigationLinks.styles';

type EntryNavigationClasses = Partial<ReturnType<typeof useStyles>>;

interface Props {
  links: MenuVariants[];
  shallow?: boolean;
  onLogoutClick?: () => void;
  classes?: EntryNavigationClasses;
}

interface NavigationItemProps {
  href?: string;
  shallow?: boolean;
  className?: string;
  children?: React.ReactNode;
}

interface NavigationItemAllProps extends Omit<NavigationItemProps, 'shallow' | 'className'> {
  id: string;
  active?: boolean;
}

interface NavigationItemsListProps {
  links: MenuVariants[];
  children: React.FC<NavigationItemAllProps>;
}

const NavigationItem: FC<NavigationItemProps> = ({ href, shallow, className, children }) => {
  return (
    <Link href={href} className={className} shallow={shallow}>
      {children}
    </Link>
  );
};

const NavigationItemsList: FC<NavigationItemsListProps> = ({ links, children }) => {
  const linksMap = useMenuLinks({});
  const linksData = useMemo<NavigationItemAllProps[]>(
    () =>
      links.map((linkId) => {
        const { text, active, href } = linksMap[linkId];
        return { children: text, active, href, id: linkId };
      }),
    [linksMap],
  );

  return (
    <>
      {linksData.map((data) => {
        return children(data);
      })}
    </>
  );
};

export const NavigationLinks: FC<Props> = memo(({ links, onLogoutClick, shallow, classes }) => {
  const { root, logo, linksList, navigationList, controlsList, menuItem, menuItemActive } = useStyles({ classes });

  return (
    <ContainerWrapper bgcolor="secondary.light" className={root}>
      <div className={logo}>
        <Logo color="white" />
      </div>
      <div className={cx(linksList, navigationList)}>
        <NavigationItemsList links={links}>
          {({ id, href, active, children }) => (
            <NavigationItem
              key={id}
              href={href}
              className={cx(menuItem, { [menuItemActive]: active })}
              shallow={shallow}
            >
              {children}
            </NavigationItem>
          )}
        </NavigationItemsList>
      </div>
      <div className={cx(linksList, controlsList)}>
        {onLogoutClick && (
          <span className={menuItem} onClick={onLogoutClick}>
            Выйти
          </span>
        )}
      </div>
    </ContainerWrapper>
  );
});
