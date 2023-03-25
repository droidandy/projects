import React, { FC, useMemo } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Typography, Box, Icon } from '@marketplace/ui-kit';
import { VehicleSortType } from 'types/VehicleSortTypes';
import { ReactComponent as IconDown } from '@marketplace/ui-kit/icons/arrow-down';
import { useStyles } from './SortMenu.styles';

type Props = {
  activeItem: VehicleSortType;
  className?: string;
  handleChange: (sortType: VehicleSortType) => void;
  [key: string]: any;
};

const LIST_ITEMS = [
  {
    label: 'Сначала дешевле',
    value: VehicleSortType.PRICE_ASC,
  },
  {
    label: 'Сначала дороже',
    value: VehicleSortType.PRICE_DESC,
  },
  {
    label: 'Сначала новее',
    value: VehicleSortType.PRODUCTION_YEAR_DESC,
  },
  {
    label: 'Сначала старше',
    value: VehicleSortType.PRODUCTION_YEAR_ASC,
  },
];

export const SortMenu: FC<Props> = ({ activeItem, handleChange, className, ...rest }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { active } = useStyles();

  const buttonText = useMemo(() => {
    const item = LIST_ITEMS.find((item) => item.value === activeItem);
    return item ? item.label : 'Сначала дешевле';
  }, [activeItem]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handelClickItem = (sortType: VehicleSortType) => () => {
    handleChange(sortType);
    handleClose();
  };

  const menuItems = useMemo(
    () =>
      LIST_ITEMS.map(({ label, value }) => (
        <MenuItem className={activeItem === value ? active : ''} onClick={handelClickItem(value)}>
          <Typography variant="body1">{label}</Typography>
        </MenuItem>
      )),
    [activeItem],
  );

  return (
    <Box className={className} {...rest}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        onClick={handleClick}
        style={{ cursor: 'pointer' }}
      >
        <Box minWidth="9.3rem">
          <Typography variant="body1">{buttonText}</Typography>
        </Box>
        <Icon
          component={IconDown}
          viewBox="0 0 20 20"
          className={'icon'}
          style={{ width: '1.25rem', height: '1.25rem' }}
        />
      </Box>
      <Menu id="menu-list-grow" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        {menuItems}
      </Menu>
    </Box>
  );
};
