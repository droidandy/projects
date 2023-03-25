import React, { FC, useMemo } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { Typography, Box, Icon, useBreakpoints } from '@marketplace/ui-kit';
import { ReactComponent as IconDown } from '@marketplace/ui-kit/icons/arrow-down';
import { ReactComponent as IconDownMobile } from 'icons/arrowDownMobile.svg';
import { VehicleSortType } from 'types/VehicleSortTypes';
import { useStyles } from './SortMenu.styles';

type Props = {
  activeItem: VehicleSortType | null;
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
    label: 'По актуальности',
    value: VehicleSortType.CREATED_DESC,
  },
];

export const SortMenu: FC<Props> = ({ activeItem, handleChange, className, ...rest }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { active, iconDown, sortText } = useStyles();
  const { isMobile } = useBreakpoints();
  const iconViewBox = isMobile ? '0 0 16 16' : '0 0 20 20';
  const buttonText = useMemo(() => {
    const item = activeItem && LIST_ITEMS.find((item) => item.value === activeItem);
    return item ? item.label : 'Сортировать';
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
        <Box>
          <Typography variant={isMobile ? 'caption' : 'body1'} className={sortText}>
            {buttonText}
          </Typography>
        </Box>
        <Icon component={isMobile ? IconDownMobile : IconDown} viewBox={iconViewBox} className={iconDown} />
      </Box>
      <Menu id="menu-list-grow" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        {menuItems}
      </Menu>
    </Box>
  );
};
