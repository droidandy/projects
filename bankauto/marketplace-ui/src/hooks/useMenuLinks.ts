import React, { FunctionComponent, useMemo } from 'react';
import { useRouter } from 'next/router';
import { LinkProps } from 'components/Link';
import { MenuItems } from 'constants/menuItems';

export type MenuLinkItem = LinkProps & {
  text: string;
  active?: boolean;
  divided?: boolean;
  icon?: FunctionComponent<React.SVGProps<SVGSVGElement>>;
  parentId: MenuVariants;
  subLink?: boolean;
};

export type MenuVariants = keyof typeof MenuItems;

export type MenuLinkItems = Record<MenuVariants, MenuLinkItem>;

export const useMenuLinks = (injected: Partial<MenuLinkItems>): MenuLinkItems => {
  const router = useRouter();

  return useMemo<MenuLinkItems>(() => {
    const MenuItemsNew = { ...MenuItems, ...injected } as MenuLinkItems;
    const keys = Object.keys(MenuItemsNew) as MenuVariants[];

    const activeLinksId = keys.filter((linkId) => {
      if (MenuItemsNew[linkId].href === '/' && router.asPath === '/') {
        return true;
      }
      return (
        MenuItemsNew[linkId].href !== '/' &&
        router.asPath !== '/' &&
        router.asPath.startsWith(MenuItemsNew[linkId].href ?? '')
      );
    });

    const activeLinksIdParents = activeLinksId.reduce(
      (acc, val) => (MenuItemsNew[val].parentId ? [...acc, MenuItemsNew[val].parentId] : acc),
      [] as MenuVariants[],
    );

    const activeLinks = [...activeLinksId, ...activeLinksIdParents];

    return keys.reduce((res, linkId) => {
      return {
        ...res,
        [linkId]: {
          ...MenuItemsNew[linkId],
          active: MenuItemsNew[linkId].active || activeLinks.includes(linkId) || undefined,
        },
      };
    }, {} as MenuLinkItems);
  }, [router.asPath, injected]);
};
