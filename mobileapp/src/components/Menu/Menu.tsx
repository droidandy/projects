import * as React from 'react';

import { MenuItem, MenuItemProps } from './MenuItem/MenuItem';

interface Data {
  [key: string]: MenuItemProps;
}
export interface MenuProps {
  data: Data;
}
const MenuBase: React.FC<MenuProps> = (props: MenuProps) => (
  <>
    {Object.values<MenuItemProps>(props.data).map((item, index) => (
      <MenuItem key={index} path={item?.path} title={item?.title} />
    ))}
  </>
);

export const Menu = React.memo<MenuProps>(MenuBase);
